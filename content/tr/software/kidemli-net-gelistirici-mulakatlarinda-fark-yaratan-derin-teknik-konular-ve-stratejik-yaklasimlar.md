---
title: "Kıdemli .NET Geliştirici Mülakatlarında Fark Yaratan Derin Teknik Konular ve Stratejik Yaklaşımlar"
date: 2026-03-06
type: "software"
draft: false
math: true
description: "Kıdemli .NET geliştirici mülakatlarında fark yaratan bellek yönetimi, asenkron programlama, EF Core optimizasyonları ve mikroservis mimarileri gibi derin teknik konuları kod örnekleriyle inceleyen kapsamlı bir yazıdır."
featured_image: "/images/software/kidemli-net-gelistirici-mulakatlarinda-fark-yaratan-derin-teknik-konular-ve-stratejik-yaklasimlar.png"
tags: ["yazilim", "software", "dotnet", "csharp", "yazilim-mulakatlari", "garbage-collector", "efcore", "ef-core", "dependency-injection","performans-optimizasyonu"]
---

Modern kurumsal mimarilerde .NET platformu, sunduğu yüksek performans, kararlılık ve geniş kütüphane desteği nedeniyle kritik bir konumdadır. Bir .NET geliştirici mülakatı, basit sözdizimi (syntax) bilgisinin çok ötesine geçerek adayların bellek yönetiminden asenkron programlamanın derinliklerine, gelişmiş ORM optimizasyonlarından mikromimarilerdeki tasarım desenlerine kadar geniş bir yelpazedeki yetkinliğini ölçmeyi hedefler.

{{< figure src="/images/software/kidemli-net-gelistirici-mulakatlarinda-fark-yaratan-derin-teknik-konular-ve-stratejik-yaklasimlar.png" alt="Kıdemli .NET Geliştirici Mülakatlarında Fark Yaratan Derin Teknik Konular ve Stratejik Yaklaşımlar" width="1200" caption="Şekil 1: Kıdemli .NET Geliştirici Mülakatlarında Fark Yaratan Derin Teknik Konular ve Stratejik Yaklaşımlar" >}}

---

## Bellek Yönetimi ve Garbage Collector Mekanizmasının Derinlikleri

.NET platformunda performans optimizasyonu denildiğinde akla ilk gelen bileşen Garbage Collector (GC) mekanizmasıdır. Mülakatlarda sadece "GC nedir ve nasıl çalışır?" sorusu sorulmaz; bunun yerine nesnelerin yaşam döngüleri, büyük nesne yığını (Large Object Heap - LOH) ve bellek sızıntılarının (Memory Leak) nasıl tespit edileceği üzerine odaklanılır.

### Jenerasyon (Kuşak) Yönetimi ve Ephemeral Segmentler

GC, yönetilen yığını (Managed Heap) performans optimizasyonu için üç ana jenerasyona ayırır:

* **Gen 0:** Kısa ömürlü nesnelerin (yerel değişkenler, döngü içi nesneler) ilk tahsis edildiği alandır. Bütçe dolduğunda en sık temizlik burada yapılır.
* **Gen 1:** Gen 0 temizliğinden sağ çıkan nesnelerin taşındığı, Gen 0 ile Gen 2 arasında bir nevi tampon bölge görevi gören jenerasyondur.
* **Gen 2:** Uzun ömürlü nesnelerin (Singleton servisler, uygulama ömrü boyunca yaşayan veriler) ve LOH (Large Object Heap) alanının yer aldığı bölümdür. Gen 2 temizliği (Full GC) tüm uygulamayı durdurabileceği (Stop-the-World) için oldukça maliyetlidir.

### Yönetilmeyen Kaynaklar ve IDisposable Deseni

Veritabanı bağlantıları, dosya akışları (streams) veya network soketleri gibi işletim sistemi seviyesindeki kaynaklar yönetilmeyen (unmanaged) kaynaklardır. GC bu kaynakların boyutunu ve ne zaman serbest bırakılması gerektiğini bilemez. Bu noktada `IDisposable` arayüzü ve `Dispose` deseni devreye girer.

Aşağıdaki kod bloğunda, hem yönetilen hem de yönetilmeyen kaynakların güvenli bir şekilde serbest bırakılmasını sağlayan standart **Dispose Pattern** uygulanmıştır:

```csharp
using System;
using System.IO;
using System.Runtime.InteropServices;

public class ResourceController : IDisposable
{
    private bool _disposed = false;
    private FileStream _managedResource; // Yönetilen kaynak
    private IntPtr _unmanagedResource;   // Yönetilmeyen kaynak

    public ResourceController(string filePath)
    {
        _managedResource = new FileStream(filePath, FileMode.OpenOrCreate);
        _unmanagedResource = Marshal.AllocHGlobal(1024); // Bellekten alan tahsis et
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this); // Finalizer çağrısını engelle, performansı koru
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;

        if (disposing)
        {
            // Yönetilen kaynakları temizle
            if (_managedResource != null)
            {
                _managedResource.Dispose();
                _managedResource = null;
            }
        }

        // Yönetilmeyen kaynakları temizle
        if (_unmanagedResource != IntPtr.Zero)
        {
            Marshal.FreeHGlobal(_unmanagedResource);
            _unmanagedResource = IntPtr.Zero;
        }

        _disposed = true;
    }

    ~ResourceController()
    {
        Dispose(false);
    }
}

```

> **Kritik Not:** `GC.SuppressFinalize(this)` metodu, nesne `Dispose` edildiğinde çöp toplayıcıya bu nesne için `Finalizer` (~ destructor) metodunu çalıştırmasına gerek kalmadığını bildirir. Bu, nesnenin doğrudan bellekten silinmesini sağlayarak Gen 2'ye kalmasını ve ekstra bir GC döngüsüne girmesini engeller.

---

## Asenkron Programlama Tasarımı ve İş Parçacığı (Thread) Havuzu Optimizasyonu

Modern .NET uygulamalarında I/O-bound (Giriş/Çıkış odaklı) işlemlerin asenkron yönetilmesi, uygulamanın ölçeklenebilirliği açısından hayati önem taşır. `async` ve `await` anahtar kelimelerinin arka planındaki çalışma mantığı, mülakatların vazgeçilmez konularındandır.

### State Machine (Durum Makinesi) ve Karşılaşılan Tuzaklar

Derleyici, `async` olarak işaretlenmiş bir metodu arka planda bir yapıya (`struct State Machine`) dönüştürür. Metot içinde `await` görüldüğü anda, o anki yürütme bağlamı (Execution Context) kaydedilir ve thread, Thread Pool'a geri iade edilir. İşlem tamamlandığında, müsait olan herhangi bir thread üzerinden kalınan yerden devam edilir.

Mülakatlarda sıkça sorulan bir senaryo, asenkron metotların senkron çağrılması durumunda ortaya çıkan kilitlenmelerdir (Deadlock).

```csharp
// HATALI KULLANIM - Deadlock Riskine Yol Açan Yaklaşım
public IActionResult GetCustomerData()
{
    // .Result veya .Wait() kullanımı thread'i bloke eder.
    var data = FetchDataFromApiAsync().Result; 
    return Ok(data);
}

// DOĞRU KULLANIM - Non-blocking (Bloke Etmeyen) Yaklaşım
public async Task<IActionResult> GetCustomerDataAsync()
{
    // Thread bloke edilmez, I/O işlemi bitene kadar havuza döner.
    var data = await FetchDataFromApiAsync(); 
    return Ok(data);
}

private async Task<string> FetchDataFromApiAsync()
{
    using (var client = new HttpClient())
    {
        return await client.GetStringAsync("https://api.example.com/data");
    }
}

```

### ConfigureAwait(false) Kullanım Senaryoları

UI uygulamalarında (WPF, WinForms) asenkron işlem bittikten sonra arayüze erişebilmek için orijinal senkronizasyon bağlamına (`SynchronizationContext`) geri dönülmesi gerekir. Ancak web API veya backend servislerinde böyle bir arayüz bağlamı yoktur.

`ConfigureAwait(false)` ifadesi, asenkron işlem bittikten sonra kodun aynı thread bağlamında devam etme zorunluluğunu ortadan kaldırır. Bu da bağlam geçiş (context switch) maliyetini düşürür ve performansı artırır. Kütüphane (Library) geliştirilirken mutlaka tercih edilmelidir.

---

## Entity Framework Core Gelişmiş Optimizasyon Teknikleri

Veritabanı erişim katmanlarında sıklıkla tercih edilen EF Core, doğru yapılandırılmadığında ciddi performans darboğazlarına (bottleneck) neden olabilir. Teknik mülakatlarda adayın ORM araçlarının iç mekanizmalarına ne kadar hakim olduğu ölçülür.

### N+1 Sorgu Problemi ve Çözümü

N+1 problemi, ilişkili tabloların sorgulanması esnasında ana tablo için 1, ana tablodaki her bir satırın alt detayları için ise N adet ekstra sorgunun veritabanına gönderilmesi durumudur. `Include` (Eager Loading) veya `Select` (Projection) yapıları kullanılmadığında tetiklenir.

```csharp
// N+1 Problemine Yol Açan Hatalı Sorgu Örneği
var blogs = _context.Blogs.ToList(); // 1 Sorgu
foreach (var blog in blogs)
{
    // Her döngüde veritabanına tekrar gidilir (N Sorgu)
    var posts = blog.Posts.Where(p => p.IsPublished).ToList(); 
}

// Performanslı ve Optimize Edilmiş Çözüm (Projection)
var optimizedBlogs = await _context.Blogs
    .Select(b => new 
    {
        BlogName = b.Name,
        PublishedPosts = b.Posts.Where(p => p.IsPublished).ToList()
    })
    .AsNoTracking() // Takip mekanizmasını kapatarak bellekten tasarruf sağlar
    .ToListAsync(); // Tek bir sorguda tüm veri ilişkili şekilde çekilir

```

### AsNoTracking ve Compiled Queries

EF Core, çektiği her nesneyi veritabanı güncellemelerinde kullanmak üzere bellekte takip eder (Change Tracker). Sadece listeleme ve raporlama yapılan senaryolarda `AsNoTracking()` metodunun çağrılması, bellek tüketimini ciddi oranda azaltır ve sorgu hızını optimize eder.

Çok sık çalışan ve parametrik olan karmaşık sorgularda ise sorgunun derleme (parsing/compilation) maliyetini sıfıra indirmek için `EF.CompileAsyncQuery` yapısı kullanılabilir.

---

## Bağımlılıkların Yönetimi ve Kapsam Stratejileri (Dependency Injection)

.NET Core ve sonraki sürümlerle birlikte framework'ün merkezine yerleştirilen yerleşik Dependency Injection (DI) konteynerinin yönetimi, nesne ömürlerinin doğru kurgulanması açısından kritik öneme sahiptir.

### Service Lifetimes (Servis Yaşam Döngüleri)

* **Transient:** Servis her talep edildiğinde yeni bir örnek (instance) oluşturulur. Hafif ve durum bilgisi (state) barındırmayan işlemler için idealdir.
* **Scoped:** Her HTTP isteğinde (request) bir kez oluşturulur. İstek tamamlanana kadar aynı nesne örneği kullanılır. Veritabanı bağlamları (`DbContext`) varsayılan olarak Scoped kaydedilir.
* **Singleton:** Uygulama ilk ayağa kalktığında bir kez oluşturulur ve uygulama kapanana kadar tüm istekler tarafından aynı nesne kullanılır. Bellek içi önbellekleme (In-Memory Caching) servisleri buna örnektir.

### Captive Dependency (Esir Bağımlılık) Problemi

Mülakatlarda fark yaratan en önemli mimari detaylardan biri "Captive Dependency" kavramıdır. Kısa ömürlü bir servisin (örneğin Scoped bir `DbContext`), uzun ömürlü bir servisin (örneğin Singleton bir sınıfın) içine enjekte edilmesi durumunda ortaya çıkar.

Singleton nesne uygulama ömrü boyunca yaşayacağı için, içindeki Scoped nesneyi de bırakmaz ve onu adeta "esir" alır. Bu durum, veritabanı bağlantılarının kapanmamasına ve eşzamanlılık (concurrency) hatalarına yol açar.

```csharp
// TEHLİKELİ MİMARİ TASARIM
public class CacheManager // Singleton olarak tescil edilmiş olsun
{
    private readonly ApplicationDbContext _context; // Scoped bağımlılık

    public CacheManager(ApplicationDbContext context)
    {
        _context = context; // Kapsam hatası: Scoped nesne Singleton içinde yaşıyor!
    }
}

// GÜVENLİ VE DOĞRU TASARIM
public class SafeCacheManager
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SafeCacheManager(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public void DoWork()
    {
        // İhtiyaç anında geçici bir scope oluşturulup iş bitince imha edilir
        using (var scope = _scopeFactory.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            // Veritabanı işlemleri burada gerçekleştirilir
        }
    }
}

```

---

## Veri Yapıları, Koleksiyonlar ve Bellek Optimizasyon Teknolojileri

İleri düzey .NET mülakatlarında adayların veri yapısı seçimlerindeki algoritmik yaklaşımları incelenir. Büyük veri setleri işlenirken yapılan yanlış koleksiyon tercihleri, işlemci (CPU) ve bellek (RAM) maliyetlerini dramatik şekilde artırır.

### IEnumerable, IQueryable ve IList Arasındaki Farklar

* **IEnumerable:** Bellekteki (In-Memory) koleksiyonlar üzerinde işlem yapar. Ertelenmiş çalışma (Deferred Execution) mantığına sahiptir. Filtreleme işlemleri uygulama katmanında gerçekleşir.
* **IQueryable:** Veritabanı, XML veya uzak bir veri kaynağına yönelik sorgu ifadeleri (Expression Tree) oluşturur. Filtreleme `LINQ` sorgusu halinde SQL'e dönüştürülür ve doğrudan uzak sunucuda çalıştırılarak sadece sonuç seti belleğe getirilir.
* **IList:** Koleksiyonun elemanlarına indeks yoluyla erişim, ekleme ve silme imkanı tanır. Sorgu anında çalıştırılmıştır ve veriler belleğe yüklenmiştir.

### Span ve Memory ile Sıfır Tahsisli (Zero-Allocation) Programlama

Yüksek trafikli sistemlerde string parçalama veya dizi manipülasyonu gibi işlemler sürekli yeni bellek alanları tahsis edilmesine (allocation) neden olur. Bu da GC üzerindeki baskıyı artırır. .NET Core 2.1 ile hayatımıza giren `Span<T>` ve `Memory<T>`, yönetilen yığın (heap) yerine stack belleği kullanarak veya mevcut belleğin bir alt kümesine işaret ederek (pointer mantığıyla) kopyalama yapmadan çalışmayı sağlar.

```csharp
public void ProcessLogLine(string logLine)
{
    // Klasik yöntem: Sürekli yeni string nesneleri türetir ve heap'i kirletir
    // string datePart = logLine.Substring(0, 10);

    // Performanslı Yöntem: Bellekte yeni bir alan açmadan sadece ilgili bölgeye odaklanır
    ReadOnlySpan<char> logSpan = logLine.AsSpan();
    ReadOnlySpan<char> dateSpan = logSpan.Slice(0, 10);
    
    // dateSpan üzerinde ekstra bellek maliyeti oluşturmadan parse işlemi yapılabilir
}

```

> **Not:** `Span<T>` bir `ref struct` olduğu için sadece yığında (Stack) var olabilir. Bu nedenle asenkron metotlarda (`await` sınırlarının ötesinde) veya sınıf alanlarında (Field) kullanılamaz. Bu tür senaryolarda heap bellekte de yaşayabilen `Memory<T>` yapısı tercih edilmelidir.

---

## Kurumsal Mimari Tasarımları, Dayanıklılık ve Dağıtık Sistem Deseni

Kıdemli mühendislerden beklenen en büyük yetkinlik, sadece kod yazmak değil, sistemin hata anlarında nasıl davranacağını (Resilience) ve mikroservisler arası iletişimi kurgulayabilmektir.

### Resilience (Dayanıklılık) Politikaları ve Polly Entegrasyonu

Dağıtık mimarilerde network kesintileri veya bir servisin geçici olarak yanıt verememesi durumlarında sistemin tamamen çökmesini engellemek adına **Polly** kütüphanesi sıklıkla kullanılır. Mülakatlarda özellikle **Retry** (Yeniden Dene) ve **Circuit Breaker** (Devre Kesici) desenlerinin uygulanışı sorgulanır.

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Polly;
using Polly.CircuitBreaker;

public class ResilientHttpClient
{
    private readonly HttpClient _httpClient;
    private static AsyncCircuitBreakerPolicy<HttpResponseMessage> _circuitBreakerPolicy;

    public ResilientHttpClient(HttpClient httpClient)
    {
        _httpClient = httpClient;

        // Ardışık 3 hata alındığında devreyi 30 saniyeliğine aç (istekleri doğrudan engelle)
        _circuitBreakerPolicy ??= Policy
            .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
            .Or<Exception>()
            .CircuitBreakerAsync(3, TimeSpan.FromSeconds(30));
    }

    public async Task<HttpResponseMessage> SendRequestWithResilience(string url)
    {
        return await _circuitBreakerPolicy.ExecuteAsync(async () =>
        {
            return await _httpClient.GetAsync(url);
        });
    }
}

```

### CQRS (Command Query Responsibility Segregation) ve MediatR Kütüphanesi

Yazma (Command) ve okuma (Query) işlemlerinin mimari olarak birbirinden ayrılması esasına dayanan CQRS deseni, kurumsal projelerin ölçeklenebilirliğini artırır. .NET ekosisteminde bu desen genellikle **MediatR** kütüphanesi kullanılarak **In-Process Messaging / Mediator Pattern** ile hayata geçirilir. Böylece controller sınıfları ile iş mantığı sınıfları arasındaki sıkı bağlar (tight coupling) çözülmüş olur.

Teknik mülakat süreçlerinde bu kavramların teorik olarak bilinmesinin yanı sıra, hangi senaryoda hangi teknolojinin neden seçildiğini rasyonel gerekçelerle açıklayabilmek, adayı her zaman bir adım öne çıkaracaktır.
