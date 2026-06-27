---
title: "Repository ve Unit of Work: Veri Erişimini Soyutlayarak Test Edilebilir Mimari Oluşturmak"
date: 2026-04-10
type: "software"
draft: false
math: true
description: "Repository ve Unit of Work desenlerinin veri erişim katmanındaki izolasyon, transaction yönetimi ve test edilebilir mimari üzerindeki kritik rollerini teknik detaylar ve kod örnekleriyle inceleyen kapsamlı bir çalışmadır."
featured_image: "/images/software/repository-ve-unit-of-work-veri-erisimini-soyutlayarak-test-edilebilir-mimari-olusturmak.png"
tags: ["yazilim", "software", "yazilim-performansi", "repository-pattern", "unit-of-work", "dotnetcore", "clean-code", "test-driven-development"]
---

Modern yazılım geliştirme süreçlerinde, uygulamanın iş mantığı (Business Logic) ile veri erişim katmanı (Data Access Layer) arasındaki bağın gevşek tutulması (Loose Coupling), sistemin sürdürülebilirliği açısından hayati önem taşır. Repository ve Unit of Work desenleri, bu ayrımı sağlamak ve veritabanı işlemlerini merkezi bir yapıdan yönetmek için kullanılan en güçlü tasarım kalıplarıdır.

{{< figure src="/images/software/repository-ve-unit-of-work-veri-erisimini-soyutlayarak-test-edilebilir-mimari-olusturmak.png" alt="Repository ve Unit of Work: Veri Erişimini Soyutlayarak Test Edilebilir Mimari Oluşturmak" width="1200" caption="Şekil 1: Repository ve Unit of Work: Veri Erişimini Soyutlayarak Test Edilebilir Mimari Oluşturmak." >}}

---

### 1. Repository Tasarım Deseni: Veri Erişiminin Soyutlanması

Repository deseni, veri kaynağı (SQL Server, MongoDB, bir XML dosyası veya bir Web API) ile uygulama arasında bir ara katman görevi görür. Temel amacı, veri erişim mantığını iş mantığından tamamen izole etmektir.

#### Neden Repository Kullanılmalı?
*   **Kod Tekrarının Önlenmesi:** Aynı sorguların uygulamanın farklı yerlerinde tekrar yazılmasını engeller.
*   **Test Edilebilirlik:** İş mantığı test edilirken, gerçek bir veritabanı yerine "Mock" nesneler kullanılmasına olanak tanır.
*   **Veri Kaynağı Bağımsızlığı:** Veritabanı teknolojisi değiştiğinde (örneğin SQL'den NoSQL'e geçiş), iş mantığı kodlarına dokunmadan sadece Repository katmanında değişiklik yapılmasına imkan verir.

#### Generic Repository Yapısı
Her entity için ayrı ayrı `Insert`, `Update`, `Delete` metodları yazmak yerine, genel bir `IGenericRepository<T>` arayüzü (interface) oluşturmak daha efektif bir yaklaşımdır.

```csharp
public interface IGenericRepository<T> where T : class
{
    IEnumerable<T> GetAll();
    T GetById(object id);
    void Insert(T obj);
    void Update(T obj);
    void Delete(object id);
    IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
}
```

---

### 2. Unit of Work Tasarım Deseni: Atomik İşlem Yönetimi

Repository deseni veri erişimini soyutlasa da, birden fazla Repository'nin kullanıldığı bir senaryoda her birinin kendi veritabanı bağlantısını (DbContext) yönetmesi, "Transaction" bütünlüğünü bozar. Unit of Work (UoW), bu sorunu çözmek için tüm Repository'lerin aynı veri bağlamını kullanmasını sağlar ve tüm değişiklikleri tek bir `Save` işlemiyle veritabanına yansıtır.

#### Unit of Work'ün Avantajları
*   **Transaction Yönetimi:** Birden fazla tabloda yapılan işlemlerin tek bir transaction altında toplanmasını sağlar. Eğer bir adımda hata alınırsa, tüm işlemler geri alınabilir (Rollback).
*   **Performans:** Değişiklikler bellekte izlenir ve tek seferde veritabanına gönderilir, bu da veritabanı trafiğini azaltır.
*   **Merkezi Kayıt Noktası:** Uygulama içindeki tüm veri değişim operasyonlarının tek bir noktadan yönetilmesini sağlar.

---

### 3. Teknik Uygulama: Entity Framework Core ile Entegrasyon

Aşağıdaki örnekte, bir e-ticaret sistemindeki `Product` ve `Category` nesneleri üzerinden Repository ve Unit of Work mimarisinin nasıl kurulacağını inceleyelim.

#### IUnitOfWork Arayüzü ve Implementasyonu
UoW arayüzü, kullanılacak tüm Repository'leri ve `Complete` (veya `Save`) metodunu içermelidir.

```csharp
public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    ICategoryRepository Categories { get; }
    int Complete();
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    public IProductRepository Products { get; private set; }
    public ICategoryRepository Categories { get; private set; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Products = new ProductRepository(_context);
        Categories = new CategoryRepository(_context);
    }

    public int Complete()
    {
        return _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
```

---

### 4. Test Edilebilir Mimari (Testability)

Bu mimarinin en büyük kazanımı **Unit Testing** süreçlerindedir. İş mantığını test ederken veritabanına gerçekten bağlanmak hem testi yavaşlatır hem de test verilerinin yönetilmesini zorlaştırır. `IUnitOfWork` ve `IRepository` arayüzleri sayesinde **Moq** gibi kütüphaneler kullanarak bu katmanları taklit edebiliriz.



#### Mock Örneği
```csharp
[Fact]
public void CreateProduct_Should_Call_Repository_Once()
{
    // Arrange
    var mockUow = new Mock<IUnitOfWork>();
    var productService = new ProductService(mockUow.Object);
    var product = new Product { Name = "Laptop", Price = 1500 };

    // Act
    productService.AddProduct(product);

    // Assert
    mockUow.Verify(x => x.Products.Insert(It.IsAny<Product>()), Times.Once);
    mockUow.Verify(x => x.Complete(), Times.Once);
}
```

---

### 5. Yazılım Kaynakları, Kütüphaneler ve Araçlar

Bu mimariyi hayata geçirirken yaygın olarak kullanılan kütüphaneler şunlardır:

*   **Entity Framework Core (EF Core):** En popüler ORM (Object-Relational Mapper) aracıdır. `DbContext` zaten dahili olarak bir Unit of Work ve `DbSet` ise bir Repository gibi davranır; ancak ek soyutlama katmanı kurumsal projelerde hala tercih edilir.
*   **Dapper:** Performans odaklı, "Micro-ORM" kütüphanesidir. Manuel SQL sorguları yazılan senaryolarda Repository deseni ile mükemmel uyum sağlar.
*   **AutoMapper:** Veritabanı modellerini (Entity) ile kullanıcıya sunulacak modelleri (DTO - Data Transfer Object) birbirine dönüştürmek için kullanılır.
*   **Moq / NSubstitute:** Birim testlerde arayüzleri taklit etmek (mocking) için vazgeçilmezdir.
*   **FluentValidation:** Repository'ye veri girmeden önce nesne bütünlüğünü kontrol etmek için kullanılan güçlü bir doğrulama kütüphanesidir.

---

### 6. İleri Seviye Notlar ve Dikkat Edilmesi Gerekenler

> **Not 1: Leaky Abstractions (Sızdıran Soyutlamalar)**
> Repository katmanından dışarıya `IQueryable` dönmek, veri erişim mantığının (sorgu oluşturma sürecinin) iş katmanına sızmasına neden olur. Bunun yerine `IEnumerable` veya `IReadOnlyList` dönmek, soyutlamayı korumak adına daha sağlıklıdır.

> **Not 2: Async Programlama**
> Modern uygulamalarda veritabanı işlemleri "I/O Bound" işlemlerdir. Bu nedenle Repository metodlarının `Task<T>` dönecek şekilde asenkron (`async/await`) tasarlanması, uygulamanın ölçeklenebilirliğini (scalability) artırır.

> **Not 3: Repository vs DbContext**
> Bazı otoriteler, EF Core kullanan projelerde Repository katmanının gereksiz bir karmaşıklık (Over-Engineering) olduğunu savunur. Ancak projenin büyüklüğü, test stratejisi ve domain karmaşıklığı bu kararda belirleyicidir. Domain-Driven Design (DDD) yaklaşımlarında Repository kullanımı bir standarttır.

---

### Sonuç

Repository ve Unit of Work desenleri, karmaşık veri işlemlerini disiplin altına alan, kodun okunabilirliğini artıran ve bakımı kolaylaştıran yapılardır. Bu mimariyi doğru kurguladığınızda, uygulamanızın alt katmanındaki değişiklikler (veritabanı motoru değişimi vb.) üst katmanları etkilemez. Ayrıca asenkron yapı ve generic implementasyonlar ile birleştiğinde, yüksek performanslı ve kurumsal standartlarda bir yazılım altyapısı elde edilmiş olur.

Uygulamanızda bu desenleri kullanırken "YAGNI" (You Ain't Gonna Need It) prensibini de göz önünde bulundurmalı; basit bir CRUD uygulaması için bu kadar derin bir soyutlamanın projenize gerçekten değer katıp katmayacağını analiz etmelisiniz. Orta ve büyük ölçekli projelerde ise bu desenler, mimarinin iskeletini oluşturur.