---
title: "Single Responsibility ve Mikro Modüller: Sınıfları Parçalara Ayırmanın Mühendislik Maliyeti"
date: 2026-04-11
type: "software"
draft: false
math: true
description: "Yazılım mimarisinde Single Responsibility Principle (SRP) ve mikro modül kullanımının getirdiği sürdürülebilirlik avantajları ile sistem karmaşıklığı ve performans maliyetleri arasındaki kritik mühendislik dengesini inceleyen bir yazıdır."
featured_image: "/images/software/single-responsibility-ve-mikro-moduller-siniflari-parcalara-ayirmanin-muhendislik-maliyeti.png"
tags: ["yazilim", "software", "single-responsibility", "bagimlilik-yonetimi", "solid-prensipleri", "sistem-tasarimi", "kod-optimizasyonu"]
---

Yazılım mimarisinde sürdürülebilirlik ve ölçeklenebilirlik arasındaki denge, genellikle bileşenlerin ne kadar küçük parçalara ayrılması gerektiği sorusu etrafında döner. **Single Responsibility Principle (SRP)**, bir modülün veya sınıfın değişim için yalnızca tek bir nedeni olması gerektiğini savunurken, bu ilkenin uç noktası olan **Mikro Modüller**, kodu atomik seviyeye indirger. Ancak her mühendislik kararı gibi, sınıfları mikroskobik parçalara ayırmanın da soyutlama karmaşıklığı ve çalışma zamanı (runtime) maliyeti gibi bedelleri vardır.

{{< figure src="/images/software/single-responsibility-ve-mikro-moduller-siniflari-parcalara-ayirmanin-muhendislik-maliyeti.png" alt="Single Responsibility ve Mikro Modüller: Sınıfları Parçalara Ayırmanın Mühendislik Maliyeti" width="1200" caption="Şekil 1: Single Responsibility ve Mikro Modüller: Sınıfları Parçalara Ayırmanın Mühendislik Maliyeti." >}}

---

## 1. Single Responsibility Principle (SRP) ve Granülarite Analizi

SRP, nesne yönelimli tasarımın (SOLID) ilk halkasıdır. Bir sınıfın sadece bir işi yapması, test edilebilirliği ve kodun yeniden kullanılabilirliğini artırır. Ancak "tek bir sorumluluk" tanımı subjektiftir. Mühendislik perspektifinden bu, **Cohesion (Bağlılık)** ve **Coupling (Bağımlılık)** dengesidir.

### Teknik Gereklilik: Yüksek Bağlılık (High Cohesion)
Bir sınıf içindeki metotların ve veri yapılarının birbirleriyle ne kadar sıkı ilişkili olduğu, o sınıfın sağlığını belirler. Eğer bir sınıf hem veritabanına kayıt yapıyor, hem de loglama mekanizmasını yönetiyorsa, loglama kütüphanesindeki bir güncelleme veritabanı katmanını risk altına sokar.

```python
# Kötü Uygulama: Tanrı Sınıf (God Object)
class UserProcessor:
    def save_user(self, user_data):
        # DB Bağlantısı ve Kayıt
        pass
    
    def format_log(self, message):
        # Log formatlama
        pass

# İyi Uygulama: SRP Uyumlu Dağıtım
class UserRepository:
    def save(self, user):
        # Sadece Veri Erişimi (Data Access)
        pass

class LoggerService:
    def info(self, message):
        # Sadece Loglama
        pass
```

---

## 2. Mikro Modül Mimarisi: Node.js ve Go Örneklemi

Mikro modüller, bir fonksiyonun veya sınıfın tek bir mantıksal işlemi (örneğin sadece `is-string` kontrolü veya `pad-left` işlemi) gerçekleştirdiği yapılardır. Bu yaklaşım, özellikle **Node.js (NPM)** ekosisteminde "tiny-modules" felsefesiyle hayat bulmuştur.

### Mühendislik Maliyeti: Bağımlılık Cehennemi (Dependency Hell)
Mikro modüllere ayırmanın en büyük teknik maliyeti, bağımlılık ağacının (dependency graph) devasa boyutlara ulaşmasıdır. 10 satırlık bir işlev için harici bir kütüphane kullanmak, projenin güvenlik yüzey alanını (attack surface) genişletir.

*   **Verimlilik Kaybı:** Her küçük modül, dosya sistemi üzerinde ek bir okuma (I/O) yükü ve paket yöneticisi üzerinde sürüm kontrol yükü demektir.
*   **Transitive Dependencies:** Bir mikro modülün başka 10 mikro modüle bağımlı olması, projenin kontrol edilemez bir ağ yapısına dönüşmesine neden olur.

---

## 3. Sınıfları Parçalamanın Bellek ve Performans Yükü

Yazılım seviyesindeki her soyutlama, donanım seviyesinde bir karşılığa sahiptir. Sınıfları daha küçük parçalara bölmek, nesne oluşturma (instantiation) sıklığını artırır.

### Heap Bellek ve Garbage Collection (GC)
Bir sistemi 1000 adet mikro sınıfa böldüğünüzde, her istek (request) sırasında yüzlerce yeni nesne oluşturulur. Bu durum, Java (JVM) veya C# (.NET) gibi dillerde **Garbage Collector** üzerindeki baskıyı artırır.
*   **Object Overhead:** Her nesnenin bir başlığı (header), işaretçisi (pointer) ve metadata alanı vardır. Mikro modüller, faydalı yükten (payload) daha fazla metadata taşınmasına neden olabilir.
*   **Context Switching:** İşlemci seviyesinde, çok parçalı kod blokları arasında geçiş yapmak önbellek (L1/L2 cache) kaçırmalarına (cache miss) sebebiyet verebilir.

---

## 4. Mikro Servislerden Mikro Modüllere: Kod Dağılım Stratejileri

Mikro modül yapısı genellikle mikro servis mimarisi ile karıştırılır. Mikro servisler ağ üzerinden haberleşirken, mikro modüller aynı bellek alanında (in-process) çalışır.

### Interface-Segregation ve Decoupling
Büyük sınıfları parçalarken kullanılan en etkili teknik **Interface Segregation** prensibidir. İstemci, kullanmadığı metotlara bağımlı olmaya zorlanmamalıdır. Ancak bu, her metot için yeni bir sınıf açmak anlamına gelmez.



---

## 5. Teknik Uygulama: C++ ve Rust Üzerinde Bellek Yönetimi

Düşük seviyeli dillerde mikro modüllerin maliyeti daha belirgindir. C++'ta her küçük sınıf (`class`), sanal tablo (vtable) işaretçileri nedeniyle bellek boyutunu artırabilir.

```cpp
// Mikro modül yaklaşımında vtable maliyeti
class IValidator {
public:
    virtual bool validate() = 0;
};

class EmailValidator : public IValidator {
    // 8 byte vptr + veri
    bool validate() override { return true; }
};
```

Rust dilinde ise **Traits** kullanımı, derleme zamanında (compile-time) bu maliyeti minimize edebilir. Ancak derleme süreleri (compile times), modül sayısı arttıkça logaritmik olarak yükselir.

---

## 6. Kod Karmaşıklığı Ölçütleri: Cyclomatic Complexity vs. Cognitive Load

Bir sınıfı parçalara ayırmanın temel amacı **Bilişsel Yükü (Cognitive Load)** azaltmaktır. Ancak dosya sayısı arttıkça, bir geliştiricinin sistemin tamamını zihninde canlandırması zorlaşır.

*   **Cyclomatic Complexity:** Metot içindeki karar noktalarını ölçer. Mikro modüller bunu düşürür.
*   **Architectural Complexity:** Modüller arası etkileşimi ölçer. Mikro modüller bunu ekstrem seviyelere çıkarır.

**Not:** Yazılım mühendisliğinde "Yeterince Küçük", bir geliştiricinin ekranı kaydırmadan kodun ne yaptığını anlayabildiği noktadır. Bu genellikle 200-300 satır civarındadır.

---

## 7. Modern Kütüphaneler ve Framework Yaklaşımları

Modern frameworkler, mikro modülleri yönetmek için çeşitli desenler (patterns) kullanır:

1.  **Dependency Injection (DI):** Spring Boot (Java) veya NestJS (Node.js/TS) gibi yapılar, mikro modüllerin oluşturulmasını ve birbirine bağlanmasını otomatikleştirir. Bu, yönetilebilirlik maliyetini düşürür ancak `Reflective Access` nedeniyle runtime performansını etkileyebilir.
2.  **Tree Shaking:** Webpack veya Rollup gibi araçlar, kullanılmayan mikro modülleri production paketinden temizler. Bu, frontend tarafında "mikro modül maliyeti"ni derleme aşamasında çözer.
3.  **Aspect-Oriented Programming (AOP):** Sorumlulukları sınıflara dağıtmak yerine (loglama, güvenlik gibi), bu sorumlulukları "cross-cutting concerns" olarak tanımlayıp koda enjekte eder.

---

## 8. Optimizasyon ve "The Rule of Three"

Bir kodu ne zaman mikro modüllere ayırmalıyız? **Üç Kuralı (The Rule of Three)** burada devreye girer:
*   Bir kod parçası ilk kez yazıldığında sınıfa dahil kalabilir.
*   İkinci kez benzer bir mantık gerektiğinde kopyalanabilir.
*   Üçüncü kez ihtiyaç duyulduğunda, o parça mutlaka bağımsız bir modül veya sınıf haline getirilmelidir.

### Teknik Analiz Tablosu

| Kriter | Monolitik Sınıf | SRP Uyumlu Sınıf | Mikro Modül |
| :--- | :--- | :--- | :--- |
| **Bakım Kolaylığı** | Çok Zor | Yüksek | Orta (Bağımlılık Yükü) |
| **Test Edilebilirlik** | İmkansız | Mükemmel | Aşırı Karmaşık (Mocking) |
| **Derleme Hızı** | Hızlı | Normal | Yavaş |
| **Runtime Performans** | En Yüksek | Yüksek | Düşük (Indirection) |

---

## 9. Sonuç: Mühendislik Kararı Olarak Dağıtık Yapı

Sınıfları parçalara ayırmak sadece bir temiz kod (clean code) pratiği değil, bir **kaynak yönetimi** kararıdır. Eğer bir sistem yüksek düzeyde eşzamanlılık (concurrency) gerektiriyorsa, mikro modüllerin oluşturduğu nesne trafiği bir darboğaz (bottleneck) yaratabilir. Öte yandan, sürekli değişen iş kurallarının olduğu bir kurumsal yazılımda, mikro modüller esneklik sağlar.

Gerçek dünya mühendisliğinde amaç, kodun "en küçük" olması değil, "en dengeli" olmasıdır. **Over-engineering** (aşırı mühendislik), bazen spagetti koddan daha tehlikelidir; çünkü spagetti kodu temizlemek, aşırı soyutlanmış bir mimariyi basitleştirmekten daha kolaydır.

### Önemli Teknik Notlar:
*   **Orchestration vs. Choreography:** Mikro modüller arttıkça, bu modüllerin yönetimini (orchestration) sağlayan sınıfların yükü artar.
*   **DRY (Don't Repeat Yourself) Tuzağı:** Bazen iki farklı sorumluluğun benzer kod içermesi, onların aynı modüle ait olduğu anlamına gelmez. Yanlış soyutlama, kod tekrarlarından daha maliyetlidir.
*   **Module Boundary:** Modül sınırları, veri akışının en az olduğu noktalardan çizilmelidir.

Bu derinlemesine analiz, mikro modül kullanımının bir moda değil, projenin özgün kısıtlamalarına göre verilmesi gereken teknik bir ödünleşim (trade-off) olduğunu göstermektedir. Kodun anatomisini parçalara ayırırken, sistemi bir arada tutan bağ dokularını (bağımlılıkları) güçlendirmek esastır.