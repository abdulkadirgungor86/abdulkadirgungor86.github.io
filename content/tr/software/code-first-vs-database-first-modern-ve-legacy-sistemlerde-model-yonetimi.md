---
title: "Code First vs. Database First: Modern ve Legacy Sistemlerde Model Yönetimi"
date: 2026-03-06
type: "software"
draft: false
math: true
description: "Code First ve Database First yaklaşımlarının teknik mimarilerini, modern mikroservislerden legacy sistemlere uzanan bir yelpazede, kod örnekleri ve performans analizleriyle inceleyen kapsamlı bir çalışmadır."
featured_image: "/images/software/code-first-vs-database-first-modern-ve-legacy-sistemlerde-model-yonetimi.png"
tags: ["yazilim", "software", "orm", "ef-core", "efcore", "database-first", "dotnet", "clean-code", "code-first"]
---

Yazılım mimarisinde veri erişim katmanının (Data Access Layer) tasarımı, projenin sürdürülebilirliği, ölçeklenebilirliği ve ekip içi iş akışları üzerinde belirleyici bir rol oynar. Özellikle Nesne-İlişkisel Eşleme (ORM - Object-Relational Mapping) araçlarının evrimiyle birlikte, model yönetimi iki ana paradigmanın etrafında şekillenmiştir: **Code First** ve **Database First**. Bu makale, her iki yaklaşımı teknik derinlikte inceleyerek, modern mikroservis mimarilerinden legacy monolitik sistemlere kadar geniş bir spektrumda uygulama stratejilerini ele almaktadır.

{{< figure src="/images/software/code-first-vs-database-first-modern-ve-legacy-sistemlerde-model-yonetimi.png" alt="Code First vs. Database First: Modern ve Legacy Sistemlerde Model Yönetimi" width="1200" caption="Şekil 1: Code First vs. Database First: Modern ve Legacy Sistemlerde Model Yönetimi." >}}

---


### 1. Code First Yaklaşımı: Domain-Driven Design (DDD) ve Mimari Esneklik

Code First, uygulama geliştirme sürecinde veritabanı şemasının değil, iş mantığını temsil eden sınıf yapılarının (POCO - Plain Old CLR Objects) önceliklendirildiği yaklaşımdır. Bu modelde, veritabanı şeması kod içerisindeki sınıflardan ve konfigürasyonlardan (Fluent API veya Data Annotations) türetilir.

#### Teknik Mekanizmalar ve Migrations
Code First modelinin kalbinde **Migration** mekanizması yatar. Migration, sınıflarda yapılan değişiklikleri (yeni bir property eklenmesi, veri tipinin değişmesi vb.) izleyerek, bu değişiklikleri veritabanı şemasına yansıtan SQL script'lerine dönüştürür.

*   **Avantajı:** Veritabanı yönetim sisteminden (RDBMS) bağımsızlık sağlar. Aynı kod yapısı üzerinden SQL Server, PostgreSQL veya MySQL üzerinde şema oluşturulabilir.
*   **Versiyon Kontrolü:** Veritabanı şemasındaki her değişim bir C# veya Java sınıfı olarak kaydedildiği için Git gibi versiyon kontrol sistemlerinde izlenebilir.

#### Örnek Uygulama: Entity Framework Core (C#)
Aşağıda, bir e-ticaret sistemindeki `Product` ve `Category` ilişkisinin Code First ile tanımlanması görülmektedir:

```csharp
// Domain Model (POCO)
public class Product {
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public virtual Category Category { get; set; }
}

public class Category {
    public int Id { get; set; }
    public string Title { get; set; }
    public ICollection<Product> Products { get; set; }
}

// DbContext ve Fluent API Konfigürasyonu
public class AppDbContext : DbContext {
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<Product>()
            .Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId);
    }
}
```

---

### 2. Database First Yaklaşımı: Veri Merkezli Tasarım ve Legacy Sistemler

Database First, mevcut bir veritabanı şemasını temel alarak uygulama sınıflarının otomatik olarak oluşturulması (Scaffolding) prensibine dayanır. Genellikle veritabanı yöneticilerinin (DBA) yetkisinin yüksek olduğu kurumsal yapılarda ve yıllardır kullanılan "legacy" veritabanlarının üzerine inşa edilen projelerde tercih edilir.

#### Reverse Engineering Süreci
Bu yaklaşımda ORM aracı, veritabanı metadata bilgilerini okur ve tabloları sınıflara, sütunları property'lere, kısıtlamaları (Foreign Key, Unique) ise kod içerisindeki ilişkilere dönüştürür.

*   **Veri Bütünlüğü:** Veritabanı seviyesinde tanımlanmış olan kompleks triggerlar, stored procedure'lar ve view'lar doğrudan kullanılabilir.
*   **Hız:** Mevcut, devasa bir şema varsa, sınıfları tek tek elle yazmak yerine dakikalar içinde model katmanı oluşturulabilir.

#### Teknik Kütüphaneler ve Araçlar
*   **Java/Hibernate:** `hbm2java` araçları ile şemadan POJO üretimi.
*   **EF Core Power Tools:** Görsel arayüz ile şemayı kod yapısına dönüştürme.
*   **Dapper:** Genellikle Database First senaryolarında, şema üzerinde tam kontrol sağlamak ve performans kaybını minimize etmek için tercih edilen bir Micro-ORM'dir.

---

### 3. Modern Mikroservislerde Model Yönetimi

Modern sistemlerde "Database per Service" prensibi gereği her mikroservis kendi veritabanına sahiptir. Bu bağlamda Code First, mikroservis ekosistemleri için standart haline gelmiştir.

#### Neden Mikroservislerde Code First?
1.  **Hızlı Prototipleme:** Veritabanı tasarımı için harici bir SQL editörüne ihtiyaç duyulmadan iş mantığı geliştirilebilir.
2.  **Containerization (Docker):** Uygulama container ayağa kalkarken `context.Database.Migrate()` komutu ile hedef veritabanını otomatik olarak son versiyona güncelleyebilir.
3.  **Clean Architecture Uyumu:** Domain katmanının dış dünyadan (veritabanından) bağımsız kalmasını sağlar.



---

### 4. Legacy Sistemlerde Modernizasyon Stratejileri

Mevcut bir Database First projesini Code First'e taşımak veya modernize etmek riskli bir süreçtir. Bu aşamada uygulanan teknikler şunlardır:

*   **Mapping to Existing Database:** Code First kullanılmasına rağmen, şemayı oluşturmak yerine mevcut şemaya uyum sağlayacak `HasTableName` ve `HasColumnName` konfigürasyonları yazılır.
*   **Shadow Properties:** Veritabanında olan ancak domain modellerinde görünmesi istenmeyen (CreatedAt, UpdatedBy gibi audit bilgileri) alanların yönetimi.

---

### 5. Performans ve Optimizasyon Karşılaştırması

Teknik açıdan bakıldığında, her iki yöntem de çalışma zamanında (runtime) benzer performans sergiler; çünkü ORM her iki durumda da SQL sorguları üretir. Ancak geliştirme zamanı (design-time) ve operasyonel maliyet farkları belirgindir.

| Kriter | Code First | Database First |
| :--- | :--- | :--- |
| **Kontrol Odağı** | Yazılım Geliştirici (Code-centric) | Veritabanı Yöneticisi (Data-centric) |
| **Migration Yönetimi** | Otomatik / Versiyonlanabilir | Manuel SQL Scriptleri |
| **Karmaşık İlişkiler** | Fluent API ile esnek yönetim | SQL Şemasında kısıtlılıklar |
| **Stored Procedure** | Kullanımı zor (Mapping gerektirir) | Doğrudan entegrasyon |
| **Deployment** | Continuous Integration (CI) dostu | Manuel şema senkronizasyonu gerektirebilir |

---

### 6. Kritik Notlar ve Teknik Tavsiyeler

> **Not 1: Veri Kaybı Riski:** Code First Migrations kullanırken, `DropColumn` gibi operasyonlar veri kaybına neden olabilir. Üretim ortamında (Production) migration'lar her zaman `Idempotent SQL` script'lerine dönüştürülüp incelendikten sonra uygulanmalıdır.

> **Not 2: Index Yönetimi:** Code First'te default olarak oluşturulan index yapıları her zaman optimize değildir. Sorgu performansını artırmak için Fluent API üzerinden `HasIndex` tanımlamaları ve `Include` (Eager Loading) stratejileri dikkatli seçilmelidir.

> **Not 3: DbContext Ayırma:** Çok büyük sistemlerde tek bir devasa `DbContext` yerine, modüler yapıda (Bounded Context) parçalanmış küçük context'ler kullanmak, model yönetimini kolaylaştırır ve uygulama başlangıç süresini (cold start) iyileştirir.

### 7. Sonuç: Hangi Yaklaşım Seçilmeli?

Karar verme süreci, projenin mevcut durumuna ve ekibin yetkinliklerine bağlıdır:

1.  **Code First Seçilmeli:** Eğer projeye sıfırdan başlanıyorsa (Greenfield), DDD prensipleri benimsenmişse, mikroservis mimarisi kuruluyorsa ve ekip veritabanı şemasını kod üzerinden yönetmek istiyorsa.
2.  **Database First Seçilmeli:** Eğer mevcut, karmaşık ve yoğun veri içeren bir veritabanı varsa (Brownfield), farklı uygulamalar aynı veritabanını paylaşıyorsa veya veritabanı tasarımı tamamen DBA ekibinin kontrolündeyse.

Modern yazılım geliştirme pratikleri, test edilebilirlik ve otomasyon kabiliyetleri nedeniyle **Code First** tarafına doğru evrilse de; Database First, veri tutarlılığının ve legacy sistemlerin ağır bastığı kurumsal dünyada vazgeçilmez bir teknik olarak varlığını sürdürmektedir. Geliştiricinin her iki yaklaşımdaki mapping tekniklerini ve şema senkronizasyon araçlarını derinlemesine bilmesi, sistemin uzun vadeli sağlığı açısından kritiktir.