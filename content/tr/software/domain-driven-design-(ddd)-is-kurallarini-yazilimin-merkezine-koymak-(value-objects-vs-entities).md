---
title: "Domain-Driven Design (DDD): İş Kurallarını Yazılımın Merkezine Koymak (Value Objects vs. Entities)"
date: 2026-03-17
type: "software"
draft: false
math: true
description: "Domain-Driven Design (DDD), karmaşık yazılım projelerinde teknik detaylar yerine iş mantığını ve alan uzmanlarının dilini merkeze alarak sürdürülebilir, esnek ve nesne yönelimli bir mimari inşa etme metodolojisidir."
featured_image: "/images/software/domain-driven-design-(ddd)-is-kurallarini-yazilimin-merkezine-koymak-(value-objects-vs-entities).png"
tags: ["yazilim", "software", "yazilim-performansi", "domain-driven-design", "ddd", "entity", "clean-code", "mikroservisler"]
---

Yazılım dünyasında karmaşıklığı yönetmek, sadece doğru algoritmaları seçmekle değil, iş mantığını (domain logic) kodun kalbine nasıl yerleştirdiğinizle ilgilidir. Eric Evans tarafından literatüre kazandırılan **Domain-Driven Design (DDD)**, yazılımın teknik gereksinimlerden ziyade iş modeline odaklanması gerektiğini savunur. Bu yaklaşımın temel taşlarından ikisi olan **Entities** ve **Value Objects** arasındaki ayrımı anlamak, sürdürülebilir bir sistem mimarisi inşa etmenin anahtarıdır.

{{< figure src="/images/software/domain-driven-design-(ddd)-is-kurallarini-yazilimin-merkezine-koymak-(value-objects-vs-entities).png" alt="Domain-Driven Design (DDD): İş Kurallarını Yazılımın Merkezine Koymak (Value Objects vs. Entities)" width="1200" caption="Şekil 1: Domain-Driven Design (DDD): İş Kurallarını Yazılımın Merkezine Koymak (Value Objects vs. Entities)." >}}

---

## Domain-Driven Design Mimarisinde Stratejik Tasarım

DDD, büyük sistemleri yönetilebilir parçalara ayırmak için **Bounded Context** (Sınırlandırılmış Bağlam) kavramını kullanır. Ancak bu stratejik seviyenin altında, nesne modellerinin davranışlarını belirleyen taktiksel desenler yer alır. Yazılımın iş kurallarını merkezine koymak, "Anemic Domain Model" (Soluk Etki Alanı Modeli) tuzağından kaçınarak, zengin ve davranış odaklı bir model oluşturmayı gerektirir.

### 1. Entities (Varlıklar): Kimlik Odaklı Nesneler

Bir nesnenin sistem içindeki varlığı, sahip olduğu özniteliklerden ziyade sahip olduğu **benzersiz kimlik (Identity)** ile tanımlanıyorsa, bu nesne bir **Entity**’dir.

*   **Süreklilik:** Bir Entity, öznitelikleri (ad, adres, durum vb.) değişse bile zaman içinde aynı kimliği korur.
*   **Eşitlik:** İki Entity nesnesinin eşitliği, içerdikleri veriye değil, ID (Identity) değerlerine bakılarak kontrol edilir.
*   **Mutable (Değişebilir) Yapı:** Entity'ler genellikle durum değiştiricilere (setters veya domain events) sahiptir.

#### Teknik Uygulama Örneği (C# / .NET)

Aşağıdaki örnekte bir `Customer` nesnesi, ismi değişse bile veritabanındaki `Id` değeri ile tanımlanan bir Entity'dir.

```csharp
public abstract class Entity
{
    public Guid Id { get; protected set; }

    protected Entity(Guid id)
    {
        Id = id;
    }

    public override bool Equals(object obj)
    {
        if (obj is not Entity other) return false;
        return Id == other.Id;
    }

    public override int GetHashCode() => Id.GetHashCode();
}

public class Customer : Entity
{
    public string Name { get; private set; }
    public string Email { get; private set; }

    public Customer(Guid id, string name, string email) : base(id)
    {
        UpdateName(name);
        Email = email;
    }

    public void UpdateName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new ArgumentException("İsim boş olamaz.");
        Name = newName;
    }
}
```

### 2. Value Objects (Değer Nesneleri): Tanımlayıcı Nesneler

Bir nesne, sadece sahip olduğu değerlerin birleşimiyle anlam kazanıyorsa ve kendi başına bir kimliğe ihtiyaç duymuyorsa, bu bir **Value Object**'tir.

*   **Immutable (Değişmezlik):** Bir Value Object oluşturulduktan sonra değiştirilemez. Değişiklik gerekiyorsa, yeni bir nesne oluşturulur.
*   **Value Equality:** İki Value Object, içerdikleri tüm alanlar birbirine eşitse aynı kabul edilir.
*   **Yan Etkisiz Fonksiyonlar:** Metotları sadece hesaplama yapar, nesnenin durumunu değiştirmez.

#### Teknik Uygulama Örneği (Java / Spring Context)

Para birimi ve miktarını temsil eden `Money` nesnesi klasik bir Value Object örneğidir.

```java
public final class Money {
    private final BigDecimal amount;
    private final String currency;

    public Money(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Miktar negatif olamaz.");
        }
        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Farklı para birimleri toplanamaz.");
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Money money = (Money) o;
        return amount.equals(money.amount) && currency.equals(money.currency);
    }
}
```

---

## Karşılaştırmalı Analiz: Ne Zaman Hangisi?

Yazılım tasarımında sık yapılan hatalardan biri, her şeyi Entity olarak tanımlamaktır. Bu durum, veritabanı yükünü artırır ve kodun test edilebilirliğini zorlaştırır.

| Özellik | Entity | Value Object |
| :--- | :--- | :--- |
| **Kimlik (Identity)** | Benzersiz bir ID'si vardır. | ID'si yoktur, değerleri ile tanımlanır. |
| **Yaşam Döngüsü** | Zamanla değişebilir, sistemde izlenir. | Geçicidir, hesaplama için kullanılır. |
| **Eşitlik Mantığı** | `Id == other.Id` | `PropertyA == other.PropertyA && ...` |
| **Side-Effects** | State değişimi olabilir. | Her zaman immutable olmalıdır. |



---

## İleri Seviye Teknikler ve Kalıplar

### Aggregate Root Kavramı
Entity'ler ve Value Object'ler genellikle bir grup oluşturur. Bu grubun dış dünya ile iletişimini sağlayan "giriş kapısı" **Aggregate Root**'tur. Bir sipariş sistemi düşünün; `Order` bir Aggregate Root iken, içindeki `OrderItem` nesneleri sadece bu root üzerinden yönetilir.

### Encapsulation ve Domain Validation
İş kurallarını merkeze koymak, validasyon mantığını nesnenin içine gömmek demektir. Bir `Address` Value Object'i oluşturulurken, posta kodunun formatı constructor içinde kontrol edilmelidir. Bu, "Always Valid" (Her Zaman Geçerli) nesne prensibidir.

### Persistence (Kalıcılık) Stratejileri
ORM (Object-Relational Mapping) araçları (Entity Framework, Hibernate) kullanılırken Value Object'ler genellikle "Owned Types" veya "Embeddables" olarak işaretlenir. Bu, veritabanında ayrı bir tablo yerine bağlı oldukları Entity tablosunda kolonlar olarak tutulmalarını sağlar.

---

## Kütüphane ve Araç Destekleri

DDD prensiplerini uygularken aşağıdaki kütüphaneler boilerplate kodları azaltmaya yardımcı olur:

1.  **MediatR (.NET):** Domain Event'lerin asenkron veya senkron bir şekilde dağıtılması için "Mediator" desenini uygular.
2.  **FluentValidation:** Karmaşık iş kurallarını nesne dışından ama yine domain katmanında doğrulamak için kullanılır.
3.  **Vavr (Java):** Java'da değişmez (immutable) veri yapıları ve fonksiyonel programlama öğeleri sağlar, Value Object yazımını kolaylaştırır.
4.  **AutoMapper / MapStruct:** Domain modelleri ile DTO'lar (Data Transfer Objects) arasındaki dönüşümü sağlar, ancak domain mantığının sızmamasına dikkat edilmelidir.

---

## Mimari Notlar ve En İyi Uygulamalar

> **Not 1: Kimlik Ataması**
> Entity kimlikleri (UUID/Guid) uygulama seviyesinde üretilmelidir. Veritabanının `Identity` veya `Sequence` mekanizmalarına güvenmek, Domain katmanını altyapıya bağımlı hale getirir.

> **Not 2: Primitive Obsession’dan Kaçınma**
> Bir müşterinin telefon numarasını `string` olarak tutmak yerine `PhoneNumber` adlı bir Value Object içinde tutun. Bu sayede numara formatı doğrulama mantığını tek bir yerde toplarsınız.

> **Not 3: Davranış, Veriden Önce Gelir**
> Nesnelerinize sadece veri tutucular (getter/setter) olarak bakmayın. `UpdateStatus()`, `ApplyDiscount()`, `Cancel()` gibi iş dilini (Ubiquitous Language) yansıtan metotlar ekleyin.

## Sonuç: Neden DDD?

Domain-Driven Design, özellikle karmaşık iş mantığına sahip kurumsal projelerde kodun "teknik borç" (technical debt) altında ezilmesini engeller. Entity ve Value Object ayrımı, veritabanı şemasından bağımsız, saf iş mantığına odaklanan bir mimariyi mümkün kılar. Tasarımda bu iki kavramı doğru konumlandırmak, yazılımın evrilebilirliğini (evolvability) ve bakım kolaylığını doğrudan artıracaktır. 

Bir sistemin kalitesi, kodun ne kadar "akıllı" olduğunda değil, iş kurallarını ne kadar "doğal" ve "güvenli" ifade ettiğinde gizlidir. DDD, bize bu güvenliği ve ifade gücünü sağlar.