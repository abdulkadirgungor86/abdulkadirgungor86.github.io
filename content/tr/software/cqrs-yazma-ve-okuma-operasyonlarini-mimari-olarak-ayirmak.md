---
title: "CQRS: Yazma ve Okuma Operasyonlarını Mimari Olarak Ayırmak"
date: 2026-03-09
type: "software"
draft: false
math: true
description: "CQRS mimarisi, yazılım sistemlerinde veri yazma ve okuma sorumluluklarını birbirinden ayırarak yüksek ölçeklenebilirlik, performans ve esneklik sağlayan gelişmiş bir tasarım desenidir."
featured_image: "/images/software/cqrs-yazma-ve-okuma-operasyonlarini-mimari-olarak-ayirmak.png"
tags: ["yazilim", "software", "cqrs", "microservices", "event-sourcing", "domain-driven-design", "ddd", "mediatr", "performans-yonetimi"]
---

Modern yazılım mimarilerinde ölçeklenebilirlik ve performans gereksinimleri arttıkça, geleneksel veri erişim modelleri (CRUD) yetersiz kalmaya başlamıştır. **CQRS (Command Query Responsibility Segregation)**, bir sistemdeki veri güncelleme (Command) ve veri okuma (Query) işlemlerini birbirinden tamamen ayırarak bu darboğazları aşmayı hedefler. Greg Young tarafından popüler hale getirilen bu desen, temelini Bertrand Meyer’in **CQS (Command-Query Separation)** prensibinden alır.

{{< figure src="/images/software/cqrs-yazma-ve-okuma-operasyonlarini-mimari-olarak-ayirmak.png" alt="CQRS: Yazma ve Okuma Operasyonlarını Mimari Olarak Ayırmak" width="1200" caption="Şekil 1: CQRS: Yazma ve Okuma Operasyonlarını Mimari Olarak Ayırmak." >}}

---

### 1. CQRS Kavramsal Çerçeve ve Temel Teori

Geleneksel mimarilerde genellikle hem okuma hem de yazma işlemleri için aynı veri modeli kullanılır. Ancak bir sistem büyüdükçe, okuma talepleri karmaşık raporlama ve filtreleme gerektirirken; yazma talepleri iş kuralları (business logic) ve tutarlılık (consistency) üzerine yoğunlaşır.

*   **Commands (Komutlar):** Verinin durumunu değiştiren operasyonlardır. Geriye veri döndürmezler (başarı/hata durumu hariç). Odak noktası "Task-Based" operasyonlardır. (Örn: `ChangeUserAddress`)
*   **Queries (Sorgular):** Verinin durumunu değiştirmeyen, sadece mevcut durumu döndüren operasyonlardır. Yan etkisi (side effect) yoktur. (Örn: `GetUserDetails`)

---

### 2. Mimari Bileşenler ve Akış

CQRS uygulanan bir sistemde operasyonel akış genellikle iki farklı kanal üzerinden yürütülür:

#### A. Command Tarafı (Write Model)
Bu katman, sistemin domain mantığını korumakla yükümlüdür. Veri bütünlüğünü (Integrity) ve iş kurallarını doğrular. Genellikle **Domain Driven Design (DDD)** pratikleriyle birlikte kullanılır. `Aggregates`, `Value Objects` ve `Entities` bu katmanın merkezindedir.

#### B. Query Tarafı (Read Model)
Bu katman, kullanıcı arayüzünün veya istemcinin ihtiyaç duyduğu veri formatına optimize edilmiştir. Karmaşık JOIN işlemlerinden kaçınmak için veriler genellikle "De-normalized" (normalizasyonu bozulmuş) şekilde tutulur.



---

### 3. Veri Senkronizasyonu ve Eventual Consistency

Okuma ve yazma modelleri birbirinden ayrıldığında, aralarındaki veri senkronizasyonu kritik bir konu haline gelir. Yazma tarafında gerçekleşen bir değişiklik, **Domain Events** aracılığıyla okuma tarafına yansıtılır.

1.  Komut çalışır ve veritabanı güncellenir.
2.  Bir `OrderCreated` eventi fırlatılır.
3.  Bir `Event Handler` bu eventi yakalar ve okuma modelini (Read DB) günceller.

Bu süreçte **Eventual Consistency (Nihai Tutarlılık)** prensibi geçerlidir. Yani veri, yazma anından kısa bir süre sonra okuma tarafında güncel hale gelir.

---

### 4. Teknik Uygulama: C# ve MediatR Örneği

Modern .NET ekosisteminde CQRS'i implemente etmenin en yaygın yolu **MediatR** kütüphanesini kullanmaktır. MediatR, `In-process messaging` kullanarak bağımlılıkları minimize eder.

#### Komut ve Handler Tanımı
```csharp
// Command
public record CreateProductCommand(string Name, decimal Price) : IRequest<Guid>;

// Command Handler
public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly ApplicationDbContext _context;
    public CreateProductHandler(ApplicationDbContext context) => _context = context;

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product { Id = Guid.NewGuid(), Name = request.Name, Price = request.Price };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product.Id;
    }
}
```

#### Sorgu ve Handler Tanımı
```csharp
// Query
public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;

// Query Handler (Dapper kullanarak daha hızlı okuma sağlanabilir)
public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IDbConnection _dbConnection;
    public GetProductByIdHandler(IDbConnection dbConnection) => _dbConnection = dbConnection;

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var sql = "SELECT Id, Name, Price FROM Products WHERE Id = @Id";
        return await _dbConnection.QueryFirstOrDefaultAsync<ProductDto>(sql, new { Id = request.Id });
    }
}
```

---

### 5. CQRS'in Gelişmiş Senaryolarla Zenginleştirilmesi

#### Event Sourcing Entegrasyonu
CQRS genellikle **Event Sourcing** ile karıştırılır ancak bunlar birbirini tamamlayan farklı desenlerdir. Event Sourcing'de verinin son hali değil, o hale gelene kadar geçen tüm olaylar (events) saklanır. CQRS, bu olay yığınından anlamlı "Read Model"lar oluşturmak için en iyi araçtır.

#### Farklı Veritabanı Teknolojileri
Yazma tarafında ilişkisel bir veritabanı (PostgreSQL, SQL Server) kullanarak ACID özelliklerinden faydalanırken; okuma tarafında yüksek performanslı bir NoSQL (Elasticsearch, Redis, MongoDB) kullanmak CQRS mimarisinin gücünü maksimize eder.

---

### 6. Kullanılması Gereken Kütüphaneler ve Araçlar

CQRS implementasyonunu kolaylaştıran popüler araçlar şunlardır:

*   **MediatR (.NET):** Komut ve sorguların ayrıştırılması için endüstri standardıdır.
*   **MassTransit / Rebus (.NET):** Servisler arası asenkron iletişim ve event dağıtımı için kullanılır.
*   **Axon Framework (Java/Spring):** CQRS ve Event Sourcing için uçtan uca çözüm sunar.
*   **Broadway (PHP):** PHP tarafında event-sourced sistemler kurmak için tercih edilir.
*   **Dapper:** Okuma tarafında performanslı SQL sorguları çalıştırmak için hafif bir ORM çözümüdür.

---

### 7. Mimari Karar Verme: Ne Zaman CQRS Kullanılmalı?

CQRS, her proje için uygun bir "silver bullet" değildir. Uygulanması sistem karmaşıklığını (Cognitive Load) artırır.

**Kullanılması Gereken Durumlar:**
*   Okuma ve yazma sayıları arasında devasa farklar varsa (Örn: Sosyal medya platformları).
*   Aynı veri üzerinde karmaşık iş kuralları ve paralel operasyonlar yürütülüyorsa.
*   Okuma performansının milisaniyeler seviyesinde olması kritikse.
*   Microservices mimarisine geçiş planlanıyorsa.

**Kaçınılması Gereken Durumlar:**
*   Basit CRUD işlemlerinden oluşan uygulamalar.
*   Veri tutarlılığının anlık (Strong Consistency) olması zorunlu olan finansal modüller (eğer asenkron yapı yönetilemiyorsa).

---

### 8. Teknik Notlar ve Best Practices

> **Not 1: Task-Based UI:** CQRS kullanırken kullanıcı arayüzü "UpdateUser" gibi genel bir yapı yerine "RelocateUser" veya "PromoteUser" gibi spesifik iş görevlerine odaklanmalıdır.
>
> **Not 2: Validation:** Komut tarafında validation işlemleri iki aşamalı olmalıdır. Syntax validation (FluentValidation gibi) handler öncesinde `Pipeline Behavior` ile, domain validation ise handler içerisinde yapılmalıdır.
>
> **Not 3: Projection:** Okuma modellerini güncelleyen yapılara "Projector" denir. Projeksiyonların idempotent olması, olası hata durumlarında sistemin tekrar tutarlı hale gelmesini sağlar.

---

### 9. Sonuç ve Değerlendirme

CQRS, yazılımın evrimsel sürecinde esneklik sağlar. Yazma modelini karmaşık sorgulardan kurtararak temiz bir domain geliştirilmesine olanak tanırken, okuma modelini sadece görünüme odaklayarak performansı optimize eder. Ancak getirdiği ek maliyet (multiple database, event handling, messaging) göz önünde bulundurularak, sistemin darboğaz olan bölümlerinde lokal olarak uygulanması en sağlıklı yaklaşımdır.

Ölçeklenebilir bir sistem tasarlarken CQRS; sadece bir desen değil, sistemin büyüme kapasitesini belirleyen bir strateji olarak ele alınmalıdır. Mimariyi bu yönde kurgulamak, gelecekteki yük artışlarını ve değişen iş gereksinimlerini minimum refactoring ile yönetebilmenin anahtarıdır.