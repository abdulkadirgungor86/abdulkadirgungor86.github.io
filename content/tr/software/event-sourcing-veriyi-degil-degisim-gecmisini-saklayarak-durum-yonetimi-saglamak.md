---
title: "Event Sourcing: Veriyi Değil, Değişim Geçmişini Saklayarak Durum Yönetimi Sağlamak"
date: 2026-03-19
type: "software"
draft: false
math: true
description: "Verinin son halini saklamak yerine, sistemde gerçekleşen her türlü değişimi değişmez bir olay akışı olarak kaydederek tam izlenebilirlik ve esnek durum yönetimi sağlayan mimari desendir."
featured_image: "/images/software/event-sourcing-veriyi-degil-degisim-gecmisini-saklayarak-durum-yonetimi-saglamak.png"
tags: ["yazilim", "software", "event-sourcing", "cqrs", "mikroservisler", "event-store", "veri-butunlugu", "durum-yonetimi"]
---

Geleneksel veri tabanı tasarımlarında "State-Oriented" (Durum Odaklı) yaklaşım hakimdir. Bu yaklaşımda, bir nesnenin o anki en güncel hali veri tabanında saklanır ve her güncelleme işleminde (UPDATE) eski veri kalıcı olarak silinir veya üzerine yazılır. Ancak karmaşık dağıtık sistemlerde ve denetlenebilirliğin (auditability) kritik olduğu finansal/lojistik yapılarında bu model, verinin "neden" ve "nasıl" bu hale geldiğine dair semantik bilgiyi kaybeder. **Event Sourcing (Olay Kaynaklama)**, bu sorunu çözmek için verinin nihai durumunu değil, o durumu oluşturan tüm değişim olaylarını (events) değişmez (immutable) bir sırada saklamayı esas alan bir mimari desendir.

{{< figure src="/images/software/event-sourcing-veriyi-degil-degisim-gecmisini-saklayarak-durum-yonetimi-saglamak.png" alt="Event Sourcing: Veriyi Değil, Değişim Geçmişini Saklayarak Durum Yönetimi Sağlamak" width="1200" caption="Şekil 1: Event Sourcing: Veriyi Değil, Değişim Geçmişini Saklayarak Durum Yönetimi Sağlamak." >}}

---

### 1. Event Sourcing Kavramsal Çerçevesi

Event Sourcing'de sistemin "Source of Truth" (Doğruluk Kaynağı) bir **Event Store**'dur. Bir nesnenin (Aggregate) güncel durumu, yaratılış anından itibaren gerçekleşen tüm olayların sırasıyla yeniden oynatılması (Replay) sonucu elde edilir.

*   **Event (Olay):** Geçmişte gerçekleşmiş, değiştirilemez bir gerçektir. İsimlendirmeler geçmiş zaman kipiyle yapılır (*OrderCreated*, *PaymentReceived*).
*   **Append-Only Store:** Olaylar asla silinmez veya güncellenmez; sadece listenin sonuna eklenir.
*   **Point-in-Time Recovery:** Herhangi bir zaman damgasına (timestamp) gidilerek sistemin o andaki tam durumu simüle edilebilir.

### 2. Mimari Bileşenler ve İşleyiş Mekanizması

Sistemi sadece bir veri saklama yöntemi olarak değil, bir akış olarak ele almak gerekir. Bu akışta temel aktörler şunlardır:

#### Command (Komut)
Kullanıcının veya bir dış sistemin bir işlem yapma niyetidir (*CreateOrder*). Komutlar reddedilebilir; iş kurallarına göre valide edilir.

#### Aggregate (Bütüncül Yapı)
İş kurallarının uygulandığı ve durumun korunduğu bölgedir. Komutu alır, mevcut durumuna bakar ve eğer işlem geçerliyse bir veya birden fazla **Event** üretir.

#### Event Store
Olayların atomik bir şekilde ve sıralı olarak kaydedildiği fiziksel depolama alanıdır. Geleneksel RDBMS (PostgreSQL) kullanılabileceği gibi, EventStoreDB gibi özelleşmiş araçlar da tercih edilebilir.

### 3. Teknik Uygulama: C# ve MediatR ile Bir Örnek

Aşağıda, bir banka hesabı üzerinden Event Sourcing mantığının kod seviyesindeki yansıması yer almaktadır.

```csharp
// Temel Olay Tanımı (Immutable)
public record AccountCreated(Guid Id, string Owner, decimal InitialBalance);
public record MoneyDeposited(Guid Id, decimal Amount);
public record MoneyWithdrawn(Guid Id, decimal Amount);

// Aggregate Kökü
public class BankAccount
{
    public Guid Id { get; private set; }
    public decimal Balance { get; private set; }
    public List<object> Changes { get; } = new();

    // Durumu yeniden oluşturmak için kullanılan metod (Replay)
    public void Apply(object @event)
    {
        switch (@event)
        {
            case AccountCreated e:
                Id = e.Id;
                Balance = e.InitialBalance;
                break;
            case MoneyDeposited e:
                Balance += e.Amount;
                break;
            case MoneyWithdrawn e:
                Balance -= e.Amount;
                break;
        }
    }

    // İş kuralı validasyonu ve olay üretimi
    public void Withdraw(decimal amount)
    {
        if (amount > Balance)
            throw new InvalidOperationException("Yetersiz bakiye.");

        var @event = new MoneyWithdrawn(Id, amount);
        Apply(@event);
        Changes.Add(@event);
    }
}
```

### 4. Snapshotting (Anlık Görüntüleme) Performans Optimizasyonu

Binlerce hatta milyonlarca olayı olan bir Aggregate için her seferinde sıfırdan "replay" yapmak ciddi bir performans maliyeti oluşturur. Bu sorunu aşmak için **Snapshotting** mekanizması kullanılır.

Belirli aralıklarla (örneğin her 100 olayda bir) Aggregate'in o anki durumu bir "snapshot" olarak kaydedilir. Sistem durumu yüklemek istediğinde:
1. En son alınan snapshot'ı bulur ve yükler.
2. Snapshot'tan sonra gerçekleşen olayları Event Store'dan çeker.
3. Sadece bu yeni olayları snapshot üzerine uygular.

### 5. CQRS (Command Query Responsibility Segregation) İlişkisi

Event Sourcing genellikle CQRS ile birlikte kullanılır. Event Store "yazma" (Command) tarafını oluştururken, bu olayların işlenerek (Projection) optimize edilmiş tablo veya NoSQL dokümanlarına dönüştürülmesi "okuma" (Query) tarafını oluşturur.

*   **Projections:** Bir "OrderCreated" olayı geldiğinde, bu olay bir arka plan servisince yakalanır ve ElasticSearch veya bir SQL tablosuna raporlama için yazılır. Bu, okuma performansını maksimize eder.

### 6. Dezavantajlar ve Karmaşıklık Yönetimi

Event Sourcing gümüş kurşun değildir; beraberinde getirdiği ciddi zorluklar vardır:

*   **Event Versioning:** Uygulama geliştikçe olay şemaları değişebilir. Eski olayları yeni koda uyarlamak için "Upcasting" teknikleri gereklidir.
*   **Eventual Consistency:** Okuma modelleri (Projections) asenkron güncellendiği için kullanıcı veriyi güncelledikten hemen sonra eski veriyi görebilir.
*   **External Systems:** Bir olay gerçekleştiğinde dış dünyaya (örn. SMS gönderme) yan etki bırakılıyorsa, "replay" esnasında bu yan etkilerin tekrar tetiklenmemesi için idempotent yapılar kurulmalıdır.

### 7. Popüler Kütüphaneler ve Araçlar

Bu mimariyi sıfırdan inşa etmek yerine olgunlaşmış kütüphaneleri kullanmak risk yönetimi açısından kritiktir:

*   **EventStoreDB:** Event sourcing için optimize edilmiş, yerleşik stream desteği sunan bir veritabanı.
*   **Marten (.NET):** PostgreSQL'i bir Document Store ve Event Store olarak kullanmanıza olanak tanıyan güçlü bir kütüphane.
*   **Axon Framework (Java):** Java ekosisteminde CQRS ve Event Sourcing için endüstri standardı haline gelmiş bir framework.
*   **Lagom (Scala/Java):** Mikroservis odaklı, asenkron yapıda event sourcing desteği sunan bir framework.
*   **Eventuate:** Dağıtık veri yönetimi ve olay tabanlı servisler için platform.

### 8. Veri Tutarlılığı ve Concurrency Control

Event Sourcing'de eşzamanlılık kontrolü genellikle **Optimistic Concurrency** ile yönetilir. Her Aggregate'in bir versiyon numarası vardır. Bir olay kaydedilirken, gönderilen beklenen versiyon numarası Event Store'daki güncel numara ile eşleşmiyorsa işlem reddedilir (WrongExpectedVersionException). Bu, aynı anda iki farklı kullanıcının bakiyeyi güncellemeye çalışması durumunda veri bütünlüğünü korur.

### 9. Debugging ve Analiz Avantajları

Sistemde bir hata (bug) oluştuğunda, geleneksel sistemlerde "bu veri neden yanlış?" sorusuna cevap bulmak için log dosyalarına bakılır. Event Sourcing'de ise hatalı duruma yol açan olay dizisi tam olarak elimizdedir. Geliştirici, üretim ortamındaki (production) olay dizisini alıp lokal ortamında "replay" ederek hatanın tam olarak hangi olayda ve hangi iş kuralında tetiklendiğini %100 doğrulukla tespit edebilir.

---

**Teknik Not:** Event Sourcing uygularken "Eventual Consistency" (Nihai Tutarlılık) iş birimleri tarafından iyi anlaşılmalıdır. Eğer sisteminizde anlık tutarlılık (Strong Consistency) tüm okuma modellerinde zorunluysa, Event Sourcing'in getirdiği asenkron yapı size ek yük getirecektir. Ancak denetim izi, geçmişe dönük analiz ve yüksek yazma performansı önceliğiniz ise, bu mimari modern yazılım mühendisliğinin en güçlü araçlarından biridir.

**Sistem Tasarımı İçin Kritik İpucu:** Olayları tasarlarken "Teknik" değil "Domain" odaklı olun. `UserTableUpdated` yerine `UserEmailChanged` ifadesi, iş mantığını ve sistem evrimini daha iyi temsil eder.
