---
title: "Inversion of Control (IoC) Containers: Bağımlılık Enjeksiyonu (DI) Yaşam Döngüsü Yönetimi"
date: 2026-03-27
type: "software"
draft: false
math: true
description: "Inversion of Control (IoC) konteynerlerinin mimari işleyişini, bağımlılık enjeksiyonu türlerini ve nesne yaşam döngüsü yönetiminin (Transient, Scoped, Singleton) yazılımın sürdürülebilirliği üzerindeki kritik etkilerini teknik bir derinlikle ele alan çalışmadır."
featured_image: "/images/software/inversion-of-control-(ioc)-containers-bagimlilik-enjeksiyonu-(di)-yasam-dongusu-yonetimi.png"
tags: ["yazilim", "software", "yazilim-performansi", "dependency-injection", "ioc-container", "oop", "clean-code", "backend-development"]
---

Yazılım mimarilerinde nesne oluşturma ve bu nesnelerin birbirleriyle olan ilişkilerini yönetme süreci, projenin ölçeklenebilirliği ve sürdürülebilirliği açısından kritik bir öneme sahiptir. Modern yazılım geliştirme pratiklerinde, sınıfların kendi bağımlılıklarını kendilerinin oluşturması (tight coupling), kodun test edilebilirliğini zorlaştırır ve esnekliğini azaltır. Bu sorunu aşmak için kullanılan **Inversion of Control (IoC)** prensibi ve bu prensibin en yaygın uygulama biçimi olan **Dependency Injection (DI)**, nesne yönetimini merkezi bir yapıya devreder.

{{< figure src="/images/software/inversion-of-control-(ioc)-containers-bagimlilik-enjeksiyonu-(di)-yasam-dongusu-yonetimi.png" alt="Inversion of Control (IoC) Containers: Bağımlılık Enjeksiyonu (DI) Yaşam Döngüsü Yönetimi" width="1200" caption="Şekil 1: Inversion of Control (IoC) Containers: Bağımlılık Enjeksiyonu (DI) Yaşam Döngüsü Yönetimi." >}}

---

## 1. IoC ve DI Kavramsal Çerçeve

### Inversion of Control (Kontrolün Tersine Çevrilmesi)
Geleneksel programlamada, uygulama akışı ve nesne oluşturma kontrolü geliştiricinin yazdığı kodun elindedir. IoC, bu kontrolün programın kendisinden bir çerçeveye (framework) veya bir konteynere aktarılmasıdır. "Beni arama, ben seni ararım" (Hollywood Principle) felsefesiyle çalışır.

### Dependency Injection (Bağımlılık Enjeksiyonu)
DI, bir nesnenin ihtiyaç duyduğu diğer nesneleri (bağımlılıkları) kendi içinde oluşturmak yerine, bu bağımlılıkların dışarıdan "enjekte" edilmesidir. Bu işlem genellikle üç yolla yapılır:
1.  **Constructor Injection:** Bağımlılıkların sınıfın yapıcı metodu üzerinden verilmesi.
2.  **Property (Setter) Injection:** Bağımlılıkların public özellikler üzerinden atanması.
3.  **Method Injection:** Bağımlılığın sadece belirli bir metodun çalışması sırasında parametre olarak geçilmesi.

---

## 2. IoC Konteynerlerin Rolü ve Mekanizması

IoC konteynerleri, uygulamadaki tüm bileşenlerin (servislerin) kayıt edildiği ve ihtiyaç duyulduğunda bu bileşenlerin otomatik olarak çözümlendiği (resolve) gelişmiş kütüphanelerdir. Konteyner şu işlemleri yönetir:
*   **Registration (Kayıt):** Hangi arayüzün (interface) hangi somut sınıfa (concrete class) karşılık geleceğinin tanımlanması.
*   **Resolution (Çözümleme):** Bir nesne talep edildiğinde, onun tüm bağımlılık ağacının taranarak nesnenin oluşturulması.
*   **Lifetime Management (Yaşam Döngüsü Yönetimi):** Oluşturulan nesnenin ne kadar süre hayatta kalacağının belirlenmesi.

---

## 3. Yaşam Döngüsü (Lifetime) Yönetimi: Teknik Detaylar

Bir servis IoC konteynerine kaydedilirken, bu servisin ne zaman oluşturulacağı ve ne zaman imha edileceği tanımlanmalıdır. Yanlış seçilen bir yaşam döngüsü, bellek sızıntılarına (memory leaks) veya "captured dependency" gibi ciddi mimari hatalara yol açabilir.

### 3.1. Transient (Geçici)
Her talep edildiğinde yeni bir nesne örneği oluşturulur. Durum (state) tutmayan ve hafif (lightweight) servisler için idealdir.
*   **Kullanım Alanı:** Veri doğrulama sınıfları, yardımcı (helper) metodlar.
*   **Performans:** Sık nesne oluşturma maliyeti vardır ancak bellek yönetimi daha güvenlidir çünkü nesne işi bitince GC (Garbage Collector) tarafından temizlenir.

### 3.2. Scoped (Kapsamlı)
Bir "scope" (genellikle bir HTTP isteği) boyunca tek bir nesne örneği oluşturulur. İstek tamamlandığında nesne imha edilir.
*   **Kullanım Alanı:** Veritabanı bağlamları (Entity Framework DbContext), kullanıcı oturum bilgileri.
*   **Önemli Not:** Asenkron işlemlerde veya arka plan görevlerinde (Background Tasks) scope yönetimine dikkat edilmelidir.

### 3.3. Singleton (Tekil)
Uygulama başladığında bir kez oluşturulur ve uygulama kapanana kadar aynı nesne örneği kullanılır.
*   **Kullanım Alanı:** Cache yönetimi, konfigürasyon ayarları, loglama servisleri.
*   **Risk:** Thread-safety (iş parçacığı güvenliği) sorunlarına yol açabilir. Çoklu thread erişimlerinde lock mekanizmaları kullanılmalıdır.

---

## 4. Uygulamalı Kod Örnekleri (.NET Core ve C#)

Aşağıdaki örnekte, farklı yaşam döngülerine sahip servislerin nasıl davrandığını inceleyelim.

### Interface Tanımları
```csharp
public interface IOperation { Guid OperationId { get; } }
public interface ITransientOperation : IOperation { }
public interface IScopedOperation : IOperation { }
public interface ISingletonOperation : IOperation { }

public class Operation : ITransientOperation, IScopedOperation, ISingletonOperation
{
    public Guid OperationId { get; } = Guid.NewGuid();
}
```

### Konteyner Kaydı (Program.cs)
```csharp
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Kayıt İşlemleri
builder.Services.AddTransient<ITransientOperation, Operation>();
builder.Services.AddScoped<IScopedOperation, Operation>();
builder.Services.AddSingleton<ISingletonOperation, Operation>();

var app = builder.Build();
```

### Servislerin Tüketimi
Bir Controller içinde bu servisleri çağırdığımızda, her HTTP isteğinde `Transient` id'nin değiştiğini, `Scoped` id'nin istek boyunca sabit kaldığını, `Singleton` id'nin ise uygulama yeniden başlatılana kadar hiç değişmediğini gözlemleriz.

---

## 5. İleri Düzey IoC Kütüphaneleri ve Özellikleri

Modern yazılım dünyasında popüler olan bazı IoC konteynerleri şunlardır:

*   **Autofac:** .NET dünyasında en çok tercih edilen üçüncü taraf kütüphanedir. `Module` bazlı kayıt, `Property Injection` ve `Intercept` (AOP) desteği ile öne çıkar.
*   **Ninject:** Okunabilirliği yüksek (fluent interface) ancak performans olarak biraz daha ağırdır.
*   **Castle Windsor:** Olgun ve kurumsal projelerde yaygın kullanılan, oldukça esnek bir yapıya sahip konteynerdir.
*   **StructureMap:** .NET'in en eski DI kütüphanelerinden biridir (artık yerini Lamar'a bırakmıştır).

### Autofac ile Gelişmiş Kayıt Örneği
Autofac, standart .NET DI konteynerinden farklı olarak "Auto-activation" veya "Circular Dependency" çözümü gibi özellikler sunar.

```csharp
public class MyModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<MyService>()
               .As<IMyService>()
               .InstancePerLifetimeScope(); // Scoped benzeri
               
        builder.RegisterType<Logger>()
               .As<ILogger>()
               .SingleInstance(); // Singleton
    }
}
```

---

## 6. Kritik Uyarılar ve Tasarım Desenleri

### Captured Dependency (Hapsolmuş Bağımlılık)
En sık yapılan hatalardan biridir. Daha uzun ömürlü bir nesneye (Singleton), daha kısa ömürlü bir nesnenin (Scoped veya Transient) enjekte edilmesidir.
*   **Sonuç:** Scoped nesne, Singleton içinde "hapsolduğu" için imha edilemez ve uygulama boyunca yanlış state ile yaşamaya devam eder. Bu durum veritabanı bağlantı hatalarına (zombi bağlantılar) neden olur.

### Service Locator Anti-Pattern
`IServiceProvider`'ı doğrudan kodun içine enjekte edip nesneleri oradan manuel olarak çözmek (`GetService<T>`) bir anti-pattern'dir. Bu durum, sınıfın bağımlılıklarını gizler ve birim test yazmayı imkansız hale getirir. Her zaman Constructor Injection tercih edilmelidir.

---

## 7. IoC Konteynırlarında Performans ve Optimizasyon

IoC konteynerleri çalışma zamanında (runtime) yansıma (reflection) kullanarak nesne üretir. Büyük projelerde binlerce sınıfın çözümlenmesi performans kaybına neden olabilir. Bunu optimize etmek için:
1.  **Compiled Expressions:** Modern konteynerler (örneğin DryIoc veya Lamar), hızlı nesne üretimi için ifade ağaçlarını (expression trees) derler.
2.  **Lazy Initialization:** Bağımlılığın sadece ihtiyaç duyulduğu anda oluşturulması için `Lazy<T>` kullanımı teşvik edilmelidir.
3.  **AOT (Ahead-of-Time) Compilation:** Özellikle mobil ve bulut tabanlı uygulamalarda, çalışma zamanı yansıması yerine derleme zamanı kod üretimi sağlayan kütüphaneler (örneğin MediatR ile entegre yapılar) kullanılabilir.

---

### Teknik Notlar:
*   **Disposable Nesneler:** Konteyner, oluşturduğu nesne `IDisposable` arayüzünü uyguluyorsa, yaşam döngüsü sonunda `Dispose()` metodunu otomatik olarak çağırır. Singleton nesnelerin dispose edilmesi ancak uygulama kapanırken gerçekleşir.
*   **Validation:** Uygulama ayağa kalkarken `ValidateScopes` özelliği aktif edilerek, yaşam döngüsü uyuşmazlıkları (Captured Dependency) henüz çalışma aşamasında tespit edilebilir.

---

## 8. Sonuç

IoC konteynerleri ve Bağımlılık Enjeksiyonu, modern yazılım mimarisinin yapı taşlarıdır. Bağımlılıkların doğru yönetilmesi, kodun birim testlere (Unit Testing) uygun hale gelmesini sağlar ve sınıflar arası sıkı bağımlılığı ortadan kaldırır. Ancak `Transient`, `Scoped` ve `Singleton` gibi yaşam döngüsü türlerinin yanlış kullanımı, tespit edilmesi zor performans sorunlarına ve hatalara yol açabilir. Yazılım mimarları, projeye uygun kütüphaneyi seçerken sadece popülariteye değil, kütüphanenin sunduğu yaşam döngüsü yönetim yeteneklerine ve performans çıktılarına odaklanmalıdır.
