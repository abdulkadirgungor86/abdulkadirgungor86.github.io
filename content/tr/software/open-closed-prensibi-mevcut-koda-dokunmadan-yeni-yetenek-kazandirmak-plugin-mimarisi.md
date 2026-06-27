---
title: "Open-Closed Prensibi: Mevcut Koda Dokunmadan Yeni Yetenek Kazandırmak (Plugin Mimarisi)"
date: 2026-04-07
type: "software"
draft: false
math: true
description: "Açık-Kapalı Prensibi (OCP): Yazılım mimarisinde mevcut kodu modifiye etmeden, soyutlama ve arayüzler aracılığıyla sisteme dinamik yetenekler kazandırma sanatıdır."
featured_image: "/images/software/open-closed-prensibi-mevcut-koda-dokunmadan-yeni-yetenek-kazandirmak-(plugin-mimarisi).png"
tags: ["yazilim", "software", "oop", "nesne-yonelimli-programlama", "solid-prensipleri", "open-closed-principle", "dependency-injection"]
---

Yazılım mühendisliğinde sürdürülebilir bir mimari inşa etmenin temel taşlarından biri olan **Open-Closed Principle (OCP)**, yani Açık-Kapalı Prensibi, sistemin genişlemeye açık (open for extension) ancak değişime kapalı (closed for modification) olması gerektiğini savunur. Robert C. Martin tarafından popüler hale getirilen bu kavram, kod tabanında yapılacak her yeni özelliğin, halihazırda çalışan ve test edilmiş kod bloklarını riske atmadan sisteme entegre edilmesini hedefler. 

{{< figure src="/images/software/open-closed-prensibi-mevcut-koda-dokunmadan-yeni-yetenek-kazandirmak-(plugin-mimarisi).png" alt="Open-Closed Prensibi: Mevcut Koda Dokunmadan Yeni Yetenek Kazandırmak (Plugin Mimarisi)" width="1200" caption="Şekil 1: Open-Closed Prensibi: Mevcut Koda Dokunmadan Yeni Yetenek Kazandırmak (Plugin Mimarisi)." >}}

---

## 1. Open-Closed Principle: Kavramsal ve Teknik Temeller

OCP, bir yazılım biriminin (sınıf, modül, fonksiyon vb.) davranışının, kaynak kodunu değiştirmeden değiştirilebilmesi anlamına gelir. Bu, genellikle **soyutlama (abstraction)** ve **polimorfizm (polymorphism)** kullanılarak başarılır. 

### Statik vs. Dinamik Genişleme
*   **Statik Genişleme:** Kodun derleme zamanında (compile-time) yeni sınıflar eklenerek genişletilmesidir.
*   **Dinamik Genişleme (Plugin Mimarisi):** Uygulamanın çalışma zamanında (runtime), dışarıdan yüklenen modüllerle (DLL, .so, .jar) yetenek kazanmasıdır.



---

## 2. Soyutlama Katmanları ve Arayüz (Interface) Tasarımı

OCP’nin kalbinde "program to an interface, not an implementation" prensibi yatar. Eğer bir sınıf, somut bir sınıfa (concrete class) doğrudan bağımlıysa, yeni bir davranış eklemek için o sınıfı değiştirmek zorunda kalırsınız. Bu durum OCP'yi ihlal eder.

### Abstraction Teknikleri
Teknik olarak iki ana yaklaşım mevcuttur:
1.  **Interface-Based (Arayüz Tabanlı):** Tamamen kontrata dayalıdır. Metot imzaları belirlenir.
2.  **Abstract Class (Soyut Sınıf Tabanlı):** Ortak davranışların (template method) paylaşıldığı, ancak özelleşmiş kısımların alt sınıflara bırakıldığı yapıdır.

---

## 3. Plugin Mimarisi: Modüler Genişlemenin Zirvesi

Plugin mimarisi, OCP’nin en ileri düzey uygulamasıdır. Ana uygulama (Host), eklentilerin (Plugin) ne iş yapacağını bilmez; sadece hangi arayüzü takip ettiklerini bilir.

### Mimari Bileşenler:
*   **Core Logic (Çekirdek):** Uygulamanın ana motorudur. Değişmez.
*   **Plugin Contract (Kontrat):** Eklentilerin uyması gereken ortak arayüz kütüphanesidir.
*   **Plugin Loader (Yükleyici):** Belirli bir klasördeki kütüphaneleri tarayıp çalışma zamanında belleğe alan modüldür.

---

## 4. Teknik Uygulama: C# ve .NET Üzerinden Plugin Örneği

Aşağıdaki senaryoda, bir metin işleme motoru tasarlayalım. Bu motor, mevcut koduna dokunulmadan yeni formatlarda (JSON, XML, Markdown) çıktı verebilmelidir.

### Adım 1: Kontrat Tasarımı (Değişime Kapalı Bölüm)
Bu kütüphane hem ana uygulama hem de eklentiler tarafından referans alınır.

```csharp
public interface IOutputFormatter
{
    string Format(string data);
    string Extension { get; }
}
```

### Adım 2: Ana Uygulama (Genişlemeye Açık Motor)
Bu yapı, sisteme yeni bir formatter eklendiğinde modifiye edilmez.

```csharp
public class DocumentProcessor
{
    private readonly IEnumerable<IOutputFormatter> _formatters;

    public DocumentProcessor(IEnumerable<IOutputFormatter> formatters)
    {
        _formatters = formatters;
    }

    public void Export(string content, string formatType)
    {
        var formatter = _formatters.FirstOrDefault(f => f.Extension == formatType);
        if (formatter == null) throw new NotSupportedException("Format desteklenmiyor.");
        
        Console.WriteLine(formatter.Format(content));
    }
}
```

### Adım 3: Plugin Geliştirme (Yeni Yetenek)
Uygulamanın kaynak koduna sahip olmayan bir geliştirici, sadece arayüzü kullanarak yeni bir yetenek ekleyebilir.

```csharp
public class JsonFormatter : IOutputFormatter
{
    public string Extension => "json";
    public string Format(string data) => $"{{\"content\": \"{data}\"}}";
}
```

---

## 5. Dependency Injection (DI) ve Inversion of Control (IoC)

OCP'yi efektif uygulamak için bağımlılıkların dışarıdan yönetilmesi gerekir. Modern frameworklerde (Spring Boot, .NET Core, NestJS) DI konteynerleri kullanılır.

*   **Service Registration:** Uygulama ayağa kalkarken tüm somut sınıflar arayüzleri üzerinden kayıt edilir.
*   **Reflection:** Plugin mimarilerinde `Reflection` kütüphaneleri kullanılarak belirli bir klasör altındaki tüm `.dll` dosyaları taranır ve `IOutputFormatter` arayüzünü implemente eden sınıflar otomatik olarak inject edilir.

---

## 6. Tasarım Desenleri ile OCP İlişkisi

OCP'yi hayata geçiren birçok tasarım deseni (Design Patterns) mevcuttur:

1.  **Strategy Pattern:** Farklı algoritmaları birbirinin yerine geçebilir hale getirir. Runtime'da davranış değişikliği sağlar.
2.  **Decorator Pattern:** Mevcut nesnenin yapısını bozmadan ona yeni sorumluluklar yükler.
3.  **Observer Pattern:** Sisteme yeni dinleyiciler (listeners) eklenmesini sağlayarak ana nesneyi değiştirmeden tepkileri genişletir.
4.  **Template Method Pattern:** Algoritma iskeletini korur, basamakların implementasyonunu alt sınıflara bırakır.



---

## 7. Python ile Dinamik Plugin Yönetimi

Dinamik dillerde OCP, `importlib` gibi kütüphanelerle çok daha esnek uygulanabilir. Aşağıdaki örnekte, bir "Eklenti Yöneticisi"nin klasör tarayarak nasıl çalıştığı gösterilmiştir.

```python
import importlib
import os

class PluginManager:
    def __init__(self, plugin_folder):
        self.plugin_folder = plugin_folder
        self.plugins = []

    def load_plugins(self):
        for filename in os.listdir(self.plugin_folder):
            if filename.endswith(".py"):
                module_name = filename[:-3]
                module = importlib.import_module(f"plugins.{module_name}")
                if hasattr(module, "Plugin"):
                    self.plugins.append(module.Plugin())

    def execute_all(self):
        for plugin in self.plugins:
            plugin.run()
```

---

## 8. Kütüphane ve Framework Desteği

Modern ekosistemlerde OCP'yi destekleyen güçlü araçlar bulunur:

*   **C# (.NET):** `Managed Extensibility Framework (MEF)` ve `DependencyInjection` kütüphaneleri.
*   **Java (Spring):** `@Component` taramaları ve `Spring Boot Starters` yapısı.
*   **JavaScript/TypeScript:** Webpack eklentileri, InversifyJS veya NestJS modül sistemi.
*   **C++:** Dinamik kütüphane yükleme (`dlopen` / `LoadLibrary`) ve vtable üzerinden polimorfik çağrılar.

---

## 9. OCP ve Modern Yazılım Pratikleri

### Mikroservisler ve OCP
Mikroservis mimarisinde OCP, servisler arası iletişimde (Event-Driven Architecture) kendini gösterir. Yeni bir servis eklendiğinde, mevcut servislerin kodunu değiştirmek yerine, yeni servis mevcut mesaj kuyruğuna (RabbitMQ, Kafka) abone olur. Bu, sistem seviyesinde bir Open-Closed uygulamasıdır.

### Test Edilebilirlik (Testability)
OCP'ye uygun yazılan kod, birim testler (Unit Tests) için mükemmeldir. Davranışlar arayüzler arkasında olduğu için, test sırasında gerçek implementasyon yerine "Mock" nesneler kolayca yerleştirilebilir. Bu, "Fragile Code" (Kırılgan Kod) sendromunu engeller.

---

## 10. Önemli Notlar ve Uygulama Zorlukları

> **Not 1:** Her şeyi soyutlamaya çalışmak "Over-engineering" (Aşırı Mühendislik) riskini doğurur. Sadece genişlemesi muhtemel olan alanlarda OCP uygulanmalıdır.
>
> **Not 2:** OCP uygulamak, başlangıçta daha fazla kod yazmanıza (Interface tanımları, DI konfigürasyonları vb.) neden olur ancak bakım maliyetini uzun vadede %70 oranında düşürür.
>
> **Not 3:** "Liskov Substitution Principle" (LSP) ile OCP kardeştir. Bir alt sınıf, üst sınıfın yerine geçemiyorsa OCP'yi doğru uygulamış sayılmazsınız.

### Teknik Kontrol Listesi
-  Sınıfın içinde `if-else` veya `switch-case` blokları sürekli büyüyor mu? (Cevap evet ise OCP ihlal ediliyordur).
-  Yeni bir özellik için mevcut sınıfların birim testlerini güncellemek zorunda kalıyor musunuz?
-  Bağımlılıklar somut sınıflara mı yoksa arayüzlere mi yapılmış?

---

## 11. Sonuç

Open-Closed Prensibi, yazılımın "evrimleşebilir" olmasını sağlar. Plugin mimarisi ile bu prensibi taçlandırmak, yazılımın sadece bir ürün değil, yaşayan bir platform haline gelmesine olanak tanır. Kodun dokunulmazlığını (immutability) koruyarak yeteneklerini artırmak, profesyonel seviyede bir mühendislik disiplininin en net göstergesidir. Sistem tasarlarken "Yarın bu modüle yeni bir kural gelirse neleri değiştirmem gerekir?" sorusu, OCP'nin rehberliğinde "Hiçbir şeyi, sadece yeni bir sınıf eklemem yeterli" cevabına dönüşmelidir.