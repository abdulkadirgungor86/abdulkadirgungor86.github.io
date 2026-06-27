---
title: "EF Core’da Change Tracking ve Performans: State Yönetimi ve \"AsNoTracking\" Senaryoları"
date: 2026-03-18
type: "software"
draft: false
math: true
description: "Entity Framework Core üzerinde Change Tracking mekanizmasının derinlemesine analizi, bellek yönetimi stratejileri ve yüksek performanslı veri erişimi için AsNoTracking kullanım senaryolarını teknik bir perspektifle ele alan kapsamlı bir yazıdır."
featured_image: "/images/software/ef-core-da-change-tracking-ve-performans-state-yonetimi-ve-asnotracking-senaryolari.png"
tags: ["yazilim", "software", "ef-core", "efcore", "dotnetcore", "dotnet-core", "orm", "veritabani-optimizasyonu", "performans-yonetimi", "yazilim-mimarisi"]
---

Entity Framework Core (EF Core), veri tabanı işlemlerini nesne yönelimli bir yaklaşımla yönetirken arka planda oldukça karmaşık bir mekanizma işletir. Bu mekanizmanın kalbi **Change Tracker** birimidir. Bir kurumsal yazılımın ölçeklenebilirliği ve yanıt süresi, bu birimin ne kadar verimli kullanıldığına doğrudan bağlıdır.

{{< figure src="/images/software/ef-core-da-change-tracking-ve-performans-state-yonetimi-ve-asnotracking-senaryolari.png" alt="EF Core’da Change Tracking ve Performans: State Yönetimi ve AsNoTracking Senaryoları" width="1200" caption="Şekil 1: EF Core’da Change Tracking ve Performans: State Yönetimi ve AsNoTracking Senaryoları." >}}

---

## 1. EF Core Change Tracking Mekanizmasının Mimarisi

EF Core, `DbContext` üzerinden sorgulanan her bir varlığı (entity) izlemeye alır. Bu süreç, nesnenin veri tabanından belleğe yüklendiği an başlar. Bellekteki nesne üzerinde yapılan her türlü özellik (property) değişikliği, EF Core tarafından bir **Snapshot** (anlık görüntü) karşılaştırması veya **Notification** (bildirim) mekanizması ile takip edilir.

### Entity State (Varlık Durumları)
Bir nesnenin yaşam döngüsü boyunca sahip olabileceği beş temel durum vardır:

*   **Detached:** Nesne DbContext tarafından izlenmiyor.
*   **Unchanged:** Nesne veri tabanından çekildi ve üzerinde hiçbir değişiklik yapılmadı.
*   **Added:** Nesne henüz veri tabanında yok, `SaveChanges()` dendiğinde `INSERT` komutu üretilecek.
*   **Modified:** İzlenen nesne üzerinde değişiklik yapıldı, `UPDATE` komutu üretilecek.
*   **Deleted:** Nesne silinmek üzere işaretlendi, `DELETE` komutu üretilecek.

---

## 2. Snapshot vs. Change Tracking Proxies

EF Core, varsayılan olarak **Snapshot Change Tracking** yöntemini kullanır. Bir varlık sorgulandığında, EF Core onun bir kopyasını (snapshot) oluşturur. `SaveChanges()` metodu çağrıldığında, mevcut nesne değerleri ile bu kopya karşılaştırılır (**DetectChanges** süreci).

Eğer çok fazla nesne (binlerce satır) izleniyorsa, bu karşılaştırma işlemi CPU ve bellek üzerinde ciddi bir yük oluşturur. Daha gelişmiş bir yöntem olan **Change Tracking Proxies**, nesne üzerindeki özellikler değiştikçe doğrudan DbContext'e haber verir, ancak bu yöntem varlık sınıflarının `virtual` property'lere sahip olmasını ve ek konfigürasyon gerektirir.

---

## 3. Performansın Kilidi: AsNoTracking Senaryoları

Sorgulama işlemlerinde eğer veriler üzerinde bir değişiklik (Update/Delete) yapılmayacaksa, Change Tracker mekanizmasını çalıştırmak gereksiz bir maliyettir. İşte burada `AsNoTracking()` devreye girer.

### Neden AsNoTracking Kullanmalıyız?
1.  **Bellek Tasarrufu:** EF Core, nesnelerin snapshot kopyalarını tutmaz.
2.  **Hız:** `DetectChanges()` döngüsü atlanır, CPU kullanımı düşer.
3.  **Büyük Veri Setleri:** Raporlama veya listeleme gibi salt okunur (read-only) işlemlerde sistemin darboğaz oluşmasını engeller.

```csharp
// Standart İzleme (Tracking)
var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == 1); 

// İzleme Kapalı (No-Tracking) - Daha Performanslı
var readonlyProduct = await _context.Products
    .AsNoTracking()
    .FirstOrDefaultAsync(p => p.Id == 1);
```

---

## 4. İleri Seviye Optimizasyon: AsNoTrackingWithIdentityResolution

EF Core 5.0 ile gelen `AsNoTrackingWithIdentityResolution`, standart `AsNoTracking`'in bir adım ötesine geçer. Normalde `AsNoTracking` kullanıldığında, aynı ID'ye sahip nesneler her seferinde yeni bir instance olarak oluşturulur. Bu, ilişkili verilerde (Join operasyonları) veri tutarsızlığına ve fazla bellek kullanımına yol açabilir.

`AsNoTrackingWithIdentityResolution` ise hem izleme yapmaz hem de aynı ID'ye sahip nesnelerin bellekte tek bir örneğinin olmasını sağlar.

```csharp
// İlişkili tabloların olduğu karmaşık sorgularda tercih edilir
var blogs = await _context.Blogs
    .Include(b => b.Posts)
    .AsNoTrackingWithIdentityResolution()
    .ToListAsync();
```

---

## 5. Global Query Tracking Davranışını Değiştirme

Uygulama genelinde çoğu sorgu salt okunursa, her seferinde `.AsNoTracking()` yazmak yerine bu davranışı `DbContext` seviyesinde global olarak tanımlayabilirsiniz.

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder
        .UseSqlServer("YourConnectionString")
        .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
}
```
*Not: Bu ayar yapıldığında, güncelleme yapmanız gereken sorgularda `.AsTracking()` metodunu açıkça çağırmanız gerekir.*

---

## 6. Veri Güncellemede Tracked Varlıkların Yönetimi

Bir nesne "Detached" durumundaysa (örneğin bir API'den JSON olarak geldiyse), onu güncellemek için tekrar izleme altına almak gerekir. Bu noktada `Update`, `Attach` veya `Entry().State` yöntemleri kullanılır.

### Update vs Attach
*   **Update:** Nesnenin tüm property'lerini `Modified` olarak işaretler. Bu da tüm sütunların `UPDATE` sorgusuna dahil edilmesine neden olur.
*   **Attach:** Nesneyi `Unchanged` olarak izlemeye başlar. Sadece değiştirilen property'ler `Modified` olarak işaretlenirse, sadece o sütunlar güncellenir.

```csharp
var user = new User { Id = 5, Name = "Modernize Edilmiş İsim" };

// Tüm kolonları günceller
_context.Users.Update(user);

// Daha optimize: Sadece değişen alanı günceller
_context.Users.Attach(user);
_context.Entry(user).Property(x => x.Name).IsModified = true;

await _context.SaveChangesAsync();
```

---

## 7. Change Tracker Üzerinde Manuel Kontrol ve Hata Ayıklama

Yüksek yüklü işlemlerde, Change Tracker'ın içinde o an ne olduğunu bilmek debug süreci için hayatidir. `ChangeTracker.Entries()` koleksiyonu, bellekteki tüm nesnelerin durumunu görmenizi sağlar.

```csharp
public void DisplayTrackerStates()
{
    foreach (var entry in _context.ChangeTracker.Entries())
    {
        Console.WriteLine($"Entity: {entry.Entity.GetType().Name}, State: {entry.State}");
    }
}
```

Özellikle toplu (bulk) işlemlerde, belirli aralıklarla `_context.ChangeTracker.Clear()` metodunu çağırmak, bellek şişmelerinin önüne geçer. EF Core 6 ve 7 ile gelen **Bulk Update/Delete** özellikleri ise bu süreci tamamen SQL tarafına yıkarak Change Tracker'ı devre dışı bırakır ve maksimum performansa ulaşır.

---

## 8. Performans Karşılaştırması ve Best Practice Önerileri

Aşağıdaki tablo, farklı senaryolarda hangi yöntemin seçilmesi gerektiğini teknik açıdan özetlemektedir:

| Senaryo | Önerilen Yöntem | Teknik Neden |
| :--- | :--- | :--- |
| Tekil Kayıt Güncelleme | `Tracking (Default)` | Kolay yönetim ve atomik işlem. |
| Dashboard / Liste Görüntüleme | `AsNoTracking` | Bellek kopyası oluşturmaz, CPU tasarrufu sağlar. |
| İlişkili Veri Sorgulama (Include) | `AsNoTrackingWithIdentityResolution` | Tekrarlayan nesneleri minimize eder. |
| 10.000+ Kayıt Güncelleme | `Bulk Update (ExecuteUpdate)` | Change Tracker maliyetini sıfıra indirir. |
| API üzerinden gelen DTO'yu kaydetme | `Attach` + `State Management` | Gereksiz `UPDATE` sorgularını önler. |

---

## 9. Sonuç ve Mimari Değerlendirme

EF Core Change Tracking, geliştiriciye büyük bir konfor sunsa da kontrolsüz kullanımı bir performans felaketine dönüşebilir. Modern .NET mimarilerinde **CQRS (Command Query Responsibility Segregation)** prensibiyle uyumlu olarak; "Read" (Query) modellerinde `AsNoTracking` kullanımı standart haline getirilmelidir. 

Kod seviyesinde yapılan bu küçük dokunuşlar, veri tabanı sunucusu üzerindeki yükü %30 ile %70 arasında azaltabilir. Unutulmamalıdır ki en hızlı kod, en az işi yapan koddur; EF Core özelinde ise bu, gereksiz yere izlenmeyen nesneler anlamına gelir.

---
### Teknik Notlar:
*   **Context Pooling:** DbContext nesnelerinin yeniden kullanılması (pooling), Change Tracker'ın her seferinde sıfırlanma maliyetini düşürür.
*   **Shadow Properties:** Change Tracker, varlık sınıfında tanımlanmayan ancak veri tabanında olan (örneğin `LastModifiedDate`) alanları da takip edebilir.
*   **Compiled Queries:** Çok sık kullanılan `AsNoTracking` sorgularını compile ederek EF Core'un sorgu çözümleme süresini optimize edebilirsiniz.