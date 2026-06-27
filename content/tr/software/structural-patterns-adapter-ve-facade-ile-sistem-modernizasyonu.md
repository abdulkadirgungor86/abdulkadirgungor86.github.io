---
title: "Structural Patterns: Adapter ve Facade ile Sistem Modernizasyonu"
date: 2026-04-12
type: "software"
draft: false
math: true
description: "Yazılım modernizasyonu sürecinde eski (legacy) sistemlerin yeni mimarilere entegrasyonu için Adapter ve Facade tasarım kalıplarının teknik analizi, yapısal farkları ve kod örnekleriyle uygulama stratejileridir."
featured_image: "/images/software/structural-patterns-adapter-ve-facade-ile-sistem-modernizasyonu.png"
tags: ["yazilim", "software", "yazilim-performansi", "design-patterns", "adapter-pattern", "facade-pattern", "legacy-code", "refactoring"]
---

Yazılım mimarilerinde teknik borç (technical debt) biriktiren eski sistemlerin (legacy systems), güncel teknolojilerle entegre edilmesi ve modüler hale getirilmesi, sürdürülebilirlik açısından kritik bir gerekliliktir. Sistem modernizasyonu sürecinde karşılaşılan en büyük engellerden biri, mevcut kod tabanının yeni arayüzlerle (interface) uyumsuzluğu ve sistem bileşenleri arasındaki aşırı sıkı bağdır (tight coupling). 

Gang of Four (GoF) tarafından tanımlanan **Adapter** ve **Facade** yapısal tasarım kalıpları, bu tür mimari tıkanıklıkları aşmak için kullanılan temel araçlardır. Bu makalede, her iki kalıbın derinlemesine teknik analizi, modernizasyon projelerindeki rolleri ve uygulama stratejileri ele alınacaktır.

{{< figure src="/images/software/structural-patterns-adapter-ve-facade-ile-sistem-modernizasyonu.png" alt="Structural Patterns: Adapter ve Facade ile Sistem Modernizasyonu" width="1200" caption="Şekil 1: Structural Patterns: Adapter ve Facade ile Sistem Modernizasyonu." >}}

---

## 1. Adapter Pattern: Uyumsuz Arayüzlerin Köprülenmesi

Adapter pattern, bir sınıfın arayüzünü, istemcinin (client) beklediği başka bir arayüze dönüştürür. Modernizasyon projelerinde genellikle dış kütüphanelerin güncellenmesi veya eski bir sınıfın yeni sisteme dahil edilmesi gerektiğinde "sarılama" (wrapping) yöntemiyle kullanılır.

### 1.1. Teknik Yapı ve Çalışma Prensibi

Adapter kalıbı iki farklı şekilde uygulanabilir: **Class Adapter** (Kalıtım yoluyla) ve **Object Adapter** (Kompozisyon yoluyla). Modern yazılım prensipleri (Composition over Inheritance), Object Adapter kullanımını daha esnek olduğu için teşvik eder.

*   **Target:** İstemcinin kullandığı domain-specific arayüzdür.
*   **Adaptee:** Mevcut olan ancak arayüzü uyumsuz olan eski sınıftır.
*   **Adapter:** Target arayüzünü implemente eden ve içinde Adaptee referansı barındıran sınıftır.

### 1.2. Uygulama Senaryosu: Legacy Ödeme Sisteminin Entegrasyonu

Eski bir bankacılık modülünün (`LegacyPaymentSystem`), modern bir `IPaymentProcessor` arayüzüne uyarlanması gerektiğini varsayalım. Eski sistemde ödemeler XML tabanlı ve farklı parametre sırasıyla yapılmaktadır.

```csharp
// Target Interface (Yeni Sistem)
public interface IPaymentProcessor
{
    void ProcessPayment(decimal amount, string currency);
}

// Adaptee (Eski Sistem - Değiştirilemez)
public class LegacyPaymentSystem
{
    public void ExecuteTransaction(string xmlData)
    {
        Console.WriteLine($"Legacy System Processing: {xmlData}");
    }
}

// Adapter (Köprüleyici Sınıf)
public class PaymentAdapter : IPaymentProcessor
{
    private readonly LegacyPaymentSystem _legacySystem;

    public PaymentAdapter(LegacyPaymentSystem legacySystem)
    {
        _legacySystem = legacySystem;
    }

    public void ProcessPayment(decimal amount, string currency)
    {
        // Modern veriyi eski sistemin beklediği formata (XML) dönüştürme logic'i
        string xmlPayload = $"<payment><amt>{amount}</amt><cur>{currency}</cur></payment>";
        
        // Delegasyon
        _legacySystem.ExecuteTransaction(xmlPayload);
    }
}
```

### 1.3. Modernizasyondaki Kritik Rolü

Adapter, sistemin geri kalanını etkilemeden (Open/Closed Principle) eski bileşenlerin "tak-çalıştır" (plug-and-play) mantığıyla yeni mimariye eklenmesini sağlar. Özellikle mikroservis dönüşümlerinde, eski monolitik servislerin API'larını yeni servis kontratlarına uydurmak için idealdir.

---

## 2. Facade Pattern: Karmaşıklığın Gizlenmesi ve Basit Arayüz

Sistemler büyüdükçe alt sistemler (sub-systems) arasındaki etkileşim kaotik bir hal alır. Facade pattern, bu alt sistemler kümesine yüksek seviyeli, basitleştirilmiş bir arayüz sunar.

### 2.1. Mimari Katmanlama

Facade, bir kütüphanenin, framework'ün veya karmaşık bir sınıflar grubunun dışarıya bakan tek penceresidir. İstemci, arka plandaki onlarca nesnenin yaşam döngüsünü veya metod çağrı sırasını bilmek zorunda kalmaz.

### 2.2. Uygulama Senaryosu: Akıllı Ev Otomasyonu

Bir akıllı ev sisteminde ışıklar, klima, güvenlik kameraları ve ses sistemleri gibi birbirinden bağımsız çalışan onlarca alt sistem olduğunu düşünelim. Kullanıcı "Evden Çıkış" modunu aktif ettiğinde hepsinin koordineli çalışması gerekir.

```python
# Alt Sistem 1: Aydınlatma
class LightingSystem:
    def turn_off_all(self):
        print("Işıklar kapatıldı.")

# Alt Sistem 2: Güvenlik
class SecuritySystem:
    def arm_alarm(self):
        print("Alarm aktif edildi.")

# Alt Sistem 3: İklimlendirme
class HVACSystem:
    def eco_mode(self):
        print("Klima ekonomik moda alındı.")

# Facade: Karmaşıklığı yöneten sınıf
class HomeAutomationFacade:
    def __init__(self):
        self.lighting = LightingSystem()
        self.security = SecuritySystem()
        self.hvac = HVACSystem()

    def leave_home(self):
        print("--- Evden Ayrılış Senaryosu Başlatılıyor ---")
        self.lighting.turn_off_all()
        self.hvac.eco_mode()
        self.security.arm_alarm()
        print("--- Sistem Güvenli ---")

# Client (İstemci) kod
smart_home = HomeAutomationFacade()
smart_home.leave_home()
```

### 2.3. Sistem Modernizasyonunda Facade Kullanımı

Eski (legacy) sistemler genellikle "Spaghetti Code" yapısına sahiptir. Modern bir arayüz tasarlanırken, eski sistemin tüm karmaşıklığını doğrudan yeni koda sızdırmak (leaking) yerine, bir Facade katmanı oluşturulur. Bu katman, yeni kodun temiz kalmasını sağlar ve eski sistemle arasındaki bağımlılığı (dependency) minimize eder.

---

## 3. Adapter ve Facade: Karşılaştırmalı Teknik Analiz

Her iki desen de "Wrapper" (Sarmalayıcı) kategorisine girse de, kullanım amaçları ve sundukları çözümler farklıdır.

| Özellik | Adapter | Facade |
| :--- | :--- | :--- |
| **Temel Amaç** | Uyumsuz bir arayüzü, beklenen bir arayüze dönüştürmek. | Karmaşık bir alt sistemi basitleştirilmiş bir arayüzle sunmak. |
| **Arayüz Değişimi** | Mevcut arayüzü değiştirir/uyarlar. | Mevcut arayüzleri kapsayan yeni bir arayüz oluşturur. |
| **İlişki Sayısı** | Genellikle tek bir nesneyi sarar. | Çok sayıda alt sistem nesnesini koordine eder. |
| **Kullanım Zamanı** | İki farklı modül birbiriyle konuşamadığında. | Sistemin kullanımı çok zor ve karmaşık olduğunda. |

---

## 4. Modern Yazılım Kütüphanelerinde Uygulamalar

### 4.1. Java'da Adapter Örnekleri
Java Standart Kütüphanesi (JDK) içinde `java.util.Arrays#asList()` metodu bir Adapter örneğidir. Dizi (array) yapısını `List` arayüzüne adapte eder. Ayrıca `InputStreamReader`, bir `InputStream` nesnesini `Reader` arayüzüne uyarlar.

### 4.2. Spring Framework ve Facade
Spring framework içindeki `RestTemplate` veya `WebClient`, karmaşık HTTP protokol işlemlerini (bağlantı yönetimi, serialization, error handling) basitleştiren birer Facade olarak görülebilir. Kullanıcı sadece URL ve metod belirterek veri alışverişi yapar.

---

## 5. Sistem Modernizasyonu İçin İleri Düzey Stratejiler

Modernizasyon sürecinde bu iki desenin kombinasyonu sıklıkla uygulanır. "Strangler Fig" deseni uygulanırken, eski sistemin parçaları yavaş yavaş yeni servislere taşınır.

### 5.1. Anti-Corruption Layer (ACL) Oluşturma
Domain-Driven Design (DDD) yaklaşımında, farklı domainler arasındaki iletişimi korumak için ACL kullanılır. ACL, teknik olarak bir Facade ve birden fazla Adapter'ın birleşimidir. Bu katman, yeni sistemin "temiz" domain modelinin, eski sistemin "kirli" veri modelleri tarafından bozulmasını engeller.

### 5.2. Dependency Injection (DI) Entegrasyonu
Modernize edilen sistemlerde Adapter ve Facade sınıfları DI konteynırlarına kaydedilmelidir. Bu sayede birim test (unit test) süreçlerinde gerçek eski sistem bileşenleri yerine "Mock" nesneler kullanılabilir.

```csharp
// Startup.cs veya Program.cs
services.AddScoped<IPaymentProcessor, PaymentAdapter>();
services.AddSingleton<LegacyPaymentSystem>();
```

---

## 6. Performans ve Ölçeklenebilirlik Notları

Her wrapper (sarmalayıcı) katmanı, teorik olarak bir miktar overhead (ek maliyet) getirir. Ancak modernizasyon projelerinde bu maliyet, kodun okunabilirliği ve sürdürülebilirliği yanında ihmal edilebilir düzeydedir.

*   **Memory Overhead:** Adapter ve Facade sınıfları genellikle "stateless" (durumsuz) olarak tasarlanmalıdır. Bu, bellek yönetimini kolaylaştırır.
*   **Method Dispatch:** Sanal metod çağrıları (vtable lookup) modern CPU'larda ve JIT derleyicilerde optimize edildiği için performans kaybı minimumdur.
*   **Error Handling:** Facade katmanı, alt sistemlerden gelen farklı hata türlerini merkezi bir hata formatına dönüştürmek için en uygun yerdir.

> **Önemli Not:** Facade sınıfı bir "God Object" (her şeyi yapan dev sınıf) haline gelmemelidir. Eğer Facade çok büyürse, mantıksal olarak daha küçük Facade parçalarına bölünmelidir.

---

## 7. Sonuç

Adapter ve Facade desenleri, yazılım arkeolojisi olarak adlandırılabilecek legacy sistem modernizasyonu projelerinde mimarın en güçlü savunma mekanizmalarıdır. Adapter, teknik uyumsuzlukları çözerek iletişimi mümkün kılarken; Facade, yapısal karmaşıklığı yönetilebilir bir düzeye indirger.

Doğru uygulanan bu patternler, sistemlerin yaşam döngüsünü uzatır, yeni özelliklerin eklenme hızını (velocity) artırır ve ekipler arasındaki bağımlılıkları minimize ederek çevik dönüşümü (agile transformation) destekler. Teknik borcun yönetilmesi, sadece kodun silinmesi değil, bu tür yapısal kalıplarla sistemin evrilmesini sağlamaktır.