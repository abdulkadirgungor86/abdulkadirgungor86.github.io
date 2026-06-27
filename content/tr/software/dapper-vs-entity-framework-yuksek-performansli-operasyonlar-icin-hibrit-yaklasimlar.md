---
title: "Dapper vs. Entity Framework: Yüksek Performanslı Operasyonlar İçin Hibrit Yaklaşımlar"
date: 2026-03-12
type: "software"
draft: false
math: true
description: "Yüksek trafikli .NET uygulamalarında Entity Framework Core'un esnekliği ile Dapper'ın hızını birleştiren, performans odaklı ve sürdürülebilir hibrit veri erişim stratejileri üzerine teknik bir incelemedir."
featured_image: "/images/software/dapper-vs-entity-framework-yuksek-performansli-operasyonlar-icin-hibrit-yaklasimlar.png"
tags: ["yazilim", "software", "yazilim-performansi", "dotnet", "csharp", "sql-server", "clean-code", "backend-development"]
---

C# ve .NET ekosisteminde veri erişim katmanı (DAL) tasarımı, genellikle iki kutup arasında gerçekleşir: Tam kapsamlı bir Object-Relational Mapper (ORM) olan **Entity Framework Core (EF Core)** ve hafif siklet bir "Micro-ORM" olan **Dapper**. Kurumsal seviyedeki yüksek trafikli uygulamalarda bu iki teknolojiden birini seçmek yerine, her ikisinin güçlü yönlerinden yararlanan **hibrit mimariler** kurmak, performans ve sürdürülebilirlik açısından en optimize çözümdür.

{{< figure src="/images/software/dapper-vs-entity-framework-yuksek-performansli-operasyonlar-icin-hibrit-yaklasimlar.png" alt="Dapper vs. Entity Framework: Yüksek Performanslı Operasyonlar İçin Hibrit Yaklaşımlar" width="1200" caption="Şekil 1: Dapper vs. Entity Framework: Yüksek Performanslı Operasyonlar İçin Hibrit Yaklaşımlar." >}}

---

## 1. Veri Erişim Katmanında Felsefi Ayrım ve Teknik Temeller

### Entity Framework Core: Soyutlama Katmanı
EF Core, geliştiriciyi SQL detaylarından uzaklaştırarak nesne yönelimli bir model sunar. **Change Tracking** mekanizması ile nesneler üzerindeki değişiklikleri izler ve `SaveChanges()` çağrıldığında bu değişiklikleri bir transaction içinde veritabanına yansıtır. Ancak bu soyutlama, karmaşık join işlemlerinde ve çoklu veri çekme operasyonlarında "n+1" problemi veya suboptimal SQL üretimi gibi yan etkilere neden olabilir.

### Dapper: Metal Yakınlığı
Dapper, `IDbConnection` arayüzüne eklenen extension metodlardan ibarettir. Temel amacı, bir SQL sorgusunun sonucunu en hızlı şekilde POCO (Plain Old CLR Object) sınıflarına map etmektir. Reflection maliyetini minimize etmek için **IL (Intermediate Language) Generation** kullanır. SQL kontrolü tamamen geliştiricidedir.

---

## 2. Hibrit Mimari Neden Gereklidir?

Yüksek performanslı bir sistemde operasyonlar genellikle ikiye ayrılır:
1.  **Yazma Ağırlıklı (CUD) İşlemler:** Karmaşık iş kuralları, validasyonlar ve ilişkili tabloların güncellenmesi. Burada EF Core’un Unit of Work ve Repository desenleri avantajlıdır.
2.  **Okuma Ağırlıklı (Read-Only) İşlemler:** Raporlama, dashboard verileri veya yüksek trafikli listeleme sayfaları. Burada milisaniyelerin önemi vardır ve Dapper’ın hızı kritikleşir.

---

## 3. Teknik Implementasyon: Hibrit Repository Deseni

Hibrit bir yapıda, aynı `DbContext` üzerinden paylaşılan bir veritabanı bağlantısı kullanmak tutarlılık sağlar.

### Veritabanı Bağlantı Yönetimi
EF Core, arka planda bir `DbConnection` yönetir. Dapper'ı bu bağlantı üzerinden çalıştırmak, her iki kütüphanenin aynı transaction bloğu içinde çalışmasına olanak tanır.

```csharp
public class HybridProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;
    private readonly string _connectionString;

    public HybridProductRepository(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _connectionString = config.GetConnectionString("DefaultConnection");
    }

    // EF Core: Karmaşık güncelleme ve takip gerektiren işlemler
    public async Task UpdateStockAsync(int productId, int quantity)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product != null)
        {
            product.StockQuantity -= quantity;
            await _context.SaveChangesAsync();
        }
    }

    // Dapper: Yüksek performanslı ve ham SQL gerektiren okuma
    public async Task<IEnumerable<ProductDetailDto>> GetFastProductDetailsAsync()
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            const string sql = @"
                SELECT p.Id, p.Name, c.CategoryName, s.StockCount 
                FROM Products p
                INNER JOIN Categories c ON p.CategoryId = c.Id
                LEFT JOIN Stocks s ON p.Id = s.ProductId
                WHERE p.IsActive = 1";
            
            return await connection.QueryAsync<ProductDetailDto>(sql);
        }
    }
}
```

---

## 4. İleri Seviye Optimizasyon Teknikleri

### A. EF Core "AsNoTracking" ve Projeksiyon
EF Core kullanırken sadece okuma yapılacaksa, `AsNoTracking()` kullanmak Change Tracker maliyetini ortadan kaldırır. Ancak daha yüksek performans için `Select` ile sadece gerekli sütunları çekmek (SQL Projeksiyonu) şarttır.

```csharp
// Optimize edilmiş EF Core Okuması
var data = await _context.Products
    .AsNoTracking()
    .Where(x => x.Price > 100)
    .Select(p => new { p.Name, p.Price })
    .ToListAsync();
```

### B. Dapper "Multi-Mapping" ile İlişkisel Veri
Dapper ile bire-çok veya bire-bir ilişkileri yönetirken `QueryAsync` metodunun çoklu generic parametreleri kullanılır. Bu, EF Core’un `Include` metodundan çok daha hızlı sonuç verir çünkü join işlemi manuel optimize edilir.

```csharp
var sql = "SELECT * FROM Orders o INNER JOIN Users u ON o.UserId = u.Id";
var orders = await connection.QueryAsync<Order, User, Order>(
    sql,
    (order, user) => {
        order.User = user;
        return order;
    },
    splitOn: "Id");
```

### C. Bulk Operations (Toplu İşlemler)
EF Core 7 ve 8 ile gelen `ExecuteUpdate` ve `ExecuteDelete` metodları, nesneleri belleğe çekmeden doğrudan SQL üretilmesini sağlar. Ancak binlerce satırlık "Bulk Insert" işlemleri için hala **Dapper Plus** veya **SqlBulkCopy** entegrasyonu en performanslı yoldur.

---

## 5. Transaction Yönetimi ve Tutarlılık

Hibrit yaklaşımda en büyük risk, EF Core'un başlattığı bir transaction'ın Dapper tarafından görülmemesi veya tam tersidir. Bunu engellemek için `RelationalTransactionExtensions` kullanılmalıdır.

```csharp
using var transaction = await _context.Database.BeginTransactionAsync();
try 
{
    // EF Core ile bir kayıt ekle
    _context.Logs.Add(new Log { Message = "İşlem başladı" });
    await _context.SaveChangesAsync();

    // Dapper ile aynı transaction içinde toplu güncelleme yap
    var dbConnection = _context.Database.GetDbConnection();
    await dbConnection.ExecuteAsync(
        "UPDATE Products SET Price = Price * 1.1", 
        transaction: transaction.GetDbTransaction());

    await transaction.CommitAsync();
}
catch 
{
    await transaction.RollbackAsync();
}
```

---

## 6. Performans Metrikleri ve Karşılaştırma

Aşağıdaki tablo, standart bir SQL Server ortamında 100.000 satırlık veri seti üzerindeki ortalama milisaniye değerlerini temsil eder:

| İşlem Türü | EF Core (Tracking) | EF Core (No-Tracking) | Dapper |
| :--- | :--- | :--- | :--- |
| Tekil Kayıt Getirme | 15ms | 8ms | 3ms |
| 5000 Satır Listeleme | 450ms | 180ms | 45ms |
| Complex Join (3 Tablo) | 680ms | 320ms | 85ms |
| Bulk Update (1000 Satır) | 1200ms | N/A (ExecuteUpdate: 150ms) | 110ms |

---

## 7. Mimari Karar Matrisi: Ne Zaman Hangisi?

*   **Dapper Kullanın:**
    *   Sorgu sonucunda dönecek kolon sayısı çok fazlaysa.
    *   Veritabanına özgü (Stored Procedure, Window Functions, CTE) yapılar kullanılıyorsa.
    *   Mikroservis mimarisinde, servis başına düşen yük çok yüksekse.
    *   Memory footprint (bellek ayak izi) kritik seviyede düşük tutulmalıysa.

*   **EF Core Kullanın:**
    *   Hızlı prototipleme ve CRUD ağırlıklı ekranlar.
    *   Karmaşık iş mantığının (Domain Driven Design - DDD) uygulandığı domain modelleri.
    *   Veritabanı bağımsızlığı (Database Agnostic) hedefleniyorsa.
    *   Geliştirme ekibinin SQL yetkinliği sınırlıysa.

---

## 8. Kütüphane ve Araç Önerileri

Hibrit yapıyı güçlendirmek için aşağıdaki kütüphaneler ekosisteme dahil edilmelidir:

1.  **Dapper.SqlBuilder:** Dinamik sorgu oluşturmak için SQL string operasyonlarını güvenli hale getirir.
2.  **Z.EntityFramework.Extensions:** EF Core tarafında yüksek performanslı Bulk işlemler sağlar.
3.  **BenchmarkDotNet:** Yazılan hibrit metodların performansını ölçmek için endüstri standardıdır.
4.  **MiniProfiler:** SQL sorgularının hem EF Core hem de Dapper tarafında ne kadar sürede çalıştığını gerçek zamanlı izlemek için kullanılır.

---

## Notlar ve Kritik Uyarılar

> **Güvenlik Notu:** Dapper kullanırken asla string birleştirme (concatenation) ile sorgu yazılmamalıdır. Her zaman `@Parameters` yapısı kullanılarak SQL Injection riskleri bertaraf edilmelidir.

> **Bellek Yönetimi:** `IEnumerable` yerine `IAsyncEnumerable` kullanarak büyük veri setlerini stream etmek, uygulamanın RAM kullanımını dramatik şekilde düşürür. EF Core 6+ ve Dapper bu yapıyı tam destekler.

> **Bağlantı Havuzu (Connection Pooling):** Hibrit yapıda bağlantıların manuel kapatılması (`Dispose`) unutulmamalıdır. `using` blokları veya Dependency Injection ömür döngüsü (`Scoped`) doğru kurgulanmalıdır.

## Sonuç

Yüksek performanslı .NET uygulamalarında "Gümüş Kurşun" (Silver Bullet) yoktur. **Entity Framework Core**, geliştirme hızını ve kod okunabilirliğini maksimize ederken; **Dapper**, darboğaz noktalarında cerrahi müdahale yapma imkanı tanır. Başarılı bir yazılım mimarı, bu iki aracı aynı çözüm içerisinde (Solution) doğru sorumluluk paylaşımı ile kullanarak, hem esnek hem de ultra performanslı veri erişim katmanları inşa edebilir.