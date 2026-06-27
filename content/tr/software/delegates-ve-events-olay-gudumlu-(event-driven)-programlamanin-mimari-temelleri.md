---
title: "Delegates ve Events: Olay Güdümlü (Event-Driven) Programlamanın Mimari Temelleri"
date: 2026-03-13
type: "software"
draft: false
math: true
description: "C# ve .NET ekosisteminde nesneler arası gevşek bağlılığı sağlayan delegate ve event mekanizmalarının, olay güdümlü programlama perspektifiyle derinlemesine teknik analizi ve mimari uygulamalarıdır."
featured_image: "/images/software/delegates-ve-events-olay-gudumlu-(event-driven)-programlamanin-mimari-temelleri.png"
tags: ["yazilim", "software", "yazilim-performansi", "event-driven-programming", "asenkron-programlama", "multicast-delegate", "oop", "yazilim-tasarimi"]
---

Modern yazılım mimarilerinde sistem bileşenlerinin birbirleriyle olan bağımlılıklarını minimize etmek (loose coupling) ve esnek bir iletişim mekanizması kurmak, sürdürülebilir kodun anahtarıdır. C# ve .NET ekosisteminde bu esnekliği sağlayan temel yapılar **Delegates** ve **Events** mekanizmalarıdır. Bu yapılar, özellikle asenkron programlama, kullanıcı arayüzü (UI) etkileşimleri ve mikroservis haberleşmeleri gibi alanlarda olay güdümlü (event-driven) yaklaşımın çekirdeğini oluşturur.

{{< figure src="/images/software/delegates-ve-events-olay-gudumlu-(event-driven)-programlamanin-mimari-temelleri.png" alt="Delegates ve Events: Olay Güdümlü (Event-Driven) Programlamanın Mimari Temelleri" width="1200" caption="Şekil 1: Delegates ve Events: Olay Güdümlü (Event-Driven) Programlamanın Mimari Temelleri." >}}

---

## 1. Delegate (Temsilci) Kavramı ve Bellek Yönetimi

Delegate, en basit tanımıyla bir metodun imzasını (return type ve parametre listesi) referans olarak tutabilen, tip güvenli (type-safe) bir nesnedir. C++ dünyasındaki "function pointers" yapısına benzese de, .NET çalışma zamanında (CLR) nesne yönelimli ve güvenli bir yapı sunar.

### Teknik Derinlik: Multicast Delegate
Bir delegate sadece tek bir metodu değil, aynı imza yapısına sahip birden fazla metodu işaret edebilir. Buna **Multicast Delegation** denir. `+` ve `-` operatörleri ile metodlar bir invocation list (çağrı listesi) içerisine eklenir veya çıkarılır.

```csharp
public delegate void StockHandler(decimal price);

// Kullanım örneği
StockHandler handler = AnalysisService.LogPrice;
handler += NotificationService.SendSms; // Multicast ekleme
```

**Kritik Not:** Multicast delegateler çağrıldığında, metodlar eklenme sırasına göre senkron olarak yürütülür. Eğer metodlardan biri exception fırlatırsa, listedeki sonraki metodlar çalıştırılmaz. Bu durumu yönetmek için `GetInvocationList()` metodu kullanılarak manuel bir döngü kurulmalıdır.

---

## 2. Generic Delegates: Func, Action ve Predicate

Modern .NET geliştirmelerinde özel delegate tanımlamak yerine yerleşik (built-in) generic yapılar tercih edilir. Bu, kodun okunabilirliğini artırır ve kütüphane bağımlılıklarını standartlaştırır.

*   **Action<T>:** Geriye değer döndürmeyen (`void`) metodlar için kullanılır. 16 parametreye kadar destek sunar.
*   **Func<T, TResult>:** Mutlaka bir değer döndüren metodlar için kullanılır. Son generic parametre her zaman dönüş tipini temsil eder.
*   **Predicate<T>:** Bir değeri alıp geriye sadece `bool` döndüren, genellikle filtreleme (LINQ) işlemlerinde kullanılan özel bir yapıdır.



---

## 3. Event Mekanizması ve Encapsulation

Events (Olaylar), delegatelerin üzerine inşa edilmiş bir koruma katmanıdır. Bir delegate doğrudan dışarıya açıldığında, herhangi bir sınıf bu delegate'i sıfırlayabilir (`delegate = null`) veya yetkisiz tetikleyebilir. **Event** anahtar kelimesi, bu yapıyı sadece `subscribe` (+=) ve `unsubscribe` (-=) işlemlerine kısıtlar.

### Publish-Subscribe (Yayıncı-Abone) Modeli
Olay güdümlü programlamada iki temel aktör vardır:
1.  **Publisher (Yayıncı):** Olayın ne zaman gerçekleşeceğine karar veren ve bunu duyuran sınıftır.
2.  **Subscriber (Abone):** Olay gerçekleştiğinde ne yapılacağını belirleyen (event handler) sınıftır.

---

## 4. Gelişmiş Event Tasarımı: EventArgs ve Standartlar

.NET standartlarına göre bir event tanımlanırken `EventHandler` veya `EventHandler<TEventArgs>` kullanılması önerilir. Bu, kodun diğer .NET kütüphaneleriyle uyumlu çalışmasını sağlar.

```csharp
public class InventoryEventArgs : EventArgs
{
    public string ProductId { get; set; }
    public int NewStockLevel { get; set; }
}

public class WarehouseManager
{
    // Standart event tanımı
    public event EventHandler<InventoryEventArgs> StockThresholdReached;

    protected virtual void OnStockThresholdReached(InventoryEventArgs e)
    {
        // Thread-safe invocation
        StockThresholdReached?.Invoke(this, e);
    }

    public void ProcessOrder(string id, int quantity)
    {
        // Stok kontrol mantığı...
        OnStockThresholdReached(new InventoryEventArgs { ProductId = id, NewStockLevel = 5 });
    }
}
```

**Teknik Analiz:** `?.Invoke` kullanımı, event'e hiç abone olunmadığı durumlarda oluşabilecek `NullReferenceException` riskini ortadan kaldırır. `protected virtual` metod kullanımı ise türetilmiş sınıfların (inheritance) bu event tetiklenme mantığını ezmesine (override) olanak tanır.

---

## 5. Bellek Sızıntıları (Memory Leaks) ve Unsubscribe Gerekliliği

Delegateler, hedeflenen nesnenin referansını tutar. Eğer bir abone (subscriber), yayıncıdan (publisher) daha kısa ömürlüyse ve abonelikten ayrılmıyorsa (`-=`), Garbage Collector yayıncı hayatta olduğu sürece aboneyi bellekten silemez.

**Çözüm Yolları:**
*   `IDisposable` pattern kullanarak `Dispose` metodunda abonelikleri sonlandırmak.
*   **Weak Event Pattern:** Zayıf referanslar kullanarak nesne ömrünü etkilemeden haberleşme sağlamak.

---

## 6. Asenkron Olay İşleme ve Task Dönüşleri

Klasik event yapıları `void` döner. Ancak günümüzün yoğun I/O gerektiren işlemlerinde asenkron metodları event handler olarak kullanmak zorlayıcı olabilir. `async void` kullanımı hata yönetimi (exception handling) açısından risklidir. Bu durumda `Func<Task>` tabanlı özel asenkron event mekanizmaları kurgulanmalıdır.



---

## 7. Yazılım Kaynakları ve Modern Kütüphaneler

Olay güdümlü mimariyi daha ileri seviyeye taşımak için kullanılan bazı kütüphaneler ve yaklaşımlar şunlardır:

*   **MediatR:** Uygulama içi (in-process) mesajlaşma ve "Domain Events" yönetimi için endüstri standardıdır. `Request/Response` ve `Notification` (Pub-Sub) modellerini destekler.
*   **Reactive Extensions (Rx.NET):** Olayları veri akışları (streams) gibi ele almanızı sağlar. Delegatelerin ötesinde, zaman tabanlı filtreleme, birleştirme ve dönüştürme işlemleri sunar.
*   **Prism EventAggregator:** Özellikle büyük ölçekli masaüstü (WPF/Avalonia) uygulamalarında bileşenler arası loosely coupled iletişim için kullanılır.

---

## 8. Mimari Özet: Ne Zaman Hangisi?

| Özellik | Delegate | Event |
| :--- | :--- | :--- |
| **Kullanım Amacı** | Metod callback ve strateji tasarımı. | Durum değişikliklerini bildirme. |
| **Erişim** | Sınıf dışından tetiklenebilir. | Sadece tanımlandığı sınıf içinden tetiklenebilir. |
| **Geri Dönüş Değeri** | Değer döndürebilir. | Genellikle `void` döner. |
| **Esneklik** | Bir değişkene atanabilir, parametre geçilebilir. | Sadece kayıt (registration) için kullanılır. |

### Sonuç

Delegates ve Events, yazılımda modülerliği artıran, kodun "hard-coded" bağımlılıklardan kurtulmasını sağlayan hayati araçlardır. Bir delegate yapısı strateji desenini (Strategy Pattern) uygulamanıza olanak tanırken, event yapısı gözlemci desenini (Observer Pattern) CLR seviyesinde standardize eder. Profesyonel bir mimaride, bu araçların doğru kullanımı bellek verimliliği, test edilebilirlik ve genişletilebilirlik açısından kritik öneme sahiptir. 

**Not:** Yazılım geliştirme süreçlerinde, özellikle asenkron operasyonların yoğun olduğu sistemlerde, event-based asenkron pattern (EAP) yerine artık daha çok Task-based asenkron pattern (TAP) tercih edilse de, alt katmanda olay yönetimi hala delegatelerin gücüne dayanmaktadır.