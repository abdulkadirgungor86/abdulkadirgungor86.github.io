---
title: "Interface Segregation: \"Yağlı\" Arayüzleri Parçalayarak İstemci Bağımlılıklarını Azaltmak"
date: 2026-03-25
type: "software"
draft: false
math: true
description: "Yazılım bileşenleri arasındaki sıkı bağımlılıkları ortadan kaldırmak için büyük ve hantal arayüzlerin, istemcilerin yalnızca ihtiyaç duyduğu metotları içeren spesifik ve yönetilebilir parçalara bölünmesini sağlayan temel bir tasarım prensibidir."
featured_image: "/images/software/interface-segregation-yagli-arayuzleri-parcalayarak-istemci-bagimliliklarini-azaltmak.png"
tags: ["yazilim", "software", "oop", "bagimlilik-yonetimi", "solid-prensipleri", "refactoring", "clean-code", "arayuz-ayrimi"]
---

Yazılım mimarisinde sürdürülebilirlik ve esneklik, bileşenlerin birbirine olan bağımlılıklarının (coupling) ne kadar hassas yönetildiğiyle doğrudan ilişkilidir. Robert C. Martin tarafından tanımlanan SOLID prensiplerinin dördüncü halkası olan **Interface Segregation Principle (ISP)**, yani Arayüz Ayrımı Prensibi, sistemdeki "şişman" (fat/bloated) arayüzlerin yarattığı teknik borcu temizlemek için kullanılan en kritik araçlardan biridir.

ISP'nin temel mottosu şudur: **"Hiçbir istemci, kullanmadığı metotlara bağımlı olmaya zorlanmamalıdır."**

{{< figure src="/images/software/interface-segregation-yagli-arayuzleri-parcalayarak-istemci-bagimliliklarini-azaltmak.png" alt="Interface Segregation: \"Yağlı\" Arayüzleri Parçalayarak İstemci Bağımlılıklarını Azaltmak" width="1200" caption="Şekil 1: Interface Segregation: \"Yağlı\" Arayüzleri Parçalayarak İstemci Bağımlılıklarını Azaltmak" >}}

---
### 1. "Yağlı" Arayüz (Fat Interface) Problemi

Bir arayüz, birden fazla sorumluluğu tek bir çatı altında topladığında "yağlı" hale gelir. Bu durum, o arayüzü implemente eden sınıfların, iş mantıklarıyla hiçbir ilgisi olmayan metotları gövdesiz (empty) bırakmasına veya `NotImplementedException` fırlatmasına neden olur.

**Neden Tehlikelidir?**
*   **Gereksiz Yeniden Derleme:** Arayüzde yapılan küçük bir değişiklik, o metodu hiç kullanmayan onlarca sınıfın ve onlara bağlı modüllerin yeniden derlenmesine (re-compilation) yol açar.
*   **Kırılganlık:** İstemci, aslında ihtiyaç duymadığı bir bağımlılık yüzünden sistemdeki yan etkilerden etkilenir.
*   **Kod Kirliliği:** Sınıf içerisinde yer alan boş metotlar, kodun okunabilirliğini düşürür ve birim test süreçlerini karmaşıklaştırır.

---

### 2. Teknik Analiz: Monolitik Yapıdan Granüler Yapıya Geçiş

ISP'yi anlamak için klasik bir akıllı yazıcı senaryosunu ele alalım. Elimizde faks çekebilen, tarama yapabilen ve çıktı alabilen devasa bir `IMachine` arayüzü olduğunu varsayalım.

#### Hatalı Tasarım (Violation of ISP)

```csharp
public interface IMachine
{
    void Print(Document d);
    void Scan(Document d);
    void Fax(Document d);
}

// Standart bir yazıcı faks çekemez ama bu metodu implemente etmek zorundadır.
public class BasicPrinter : IMachine
{
    public void Print(Document d) { /* Yazdırma mantığı */ }
    public void Scan(Document d) { /* Tarama mantığı */ }
    
    public void Fax(Document d) 
    {
        throw new NotImplementedException("Bu cihaz faks desteklemiyor!");
    }
}
```

Bu tasarımda `BasicPrinter`, faks yeteneği olmamasına rağmen `Fax` metoduna bağımlı hale getirilmiştir. Bu, Liskov Substitution Principle (LSP) ihlaline de kapı aralar; çünkü `IMachine` bekleyen bir istemciye `BasicPrinter` verdiğinizde program çalışma zamanında patlayabilir.

---

### 3. ISP Uygulaması: Role-Based Interfaces (Rol Tabanlı Arayüzler)

Çözüm, devasa arayüzü atomik (parçalanamaz) yeteneklere bölmektir. Bu yaklaşıma **Interface Factoring** denir.

#### Doğru Tasarım (Refactored)

```csharp
public interface IPrinter { void Print(Document d); }
public interface IScanner { void Scan(Document d); }
public interface IFaxer { void Fax(Document d); }

// Sadece gereken yetenekleri implemente ediyoruz
public class Photocopier : IPrinter, IScanner
{
    public void Print(Document d) { /* ... */ }
    public void Scan(Document d) { /* ... */ }
}

public class MultiFunctionDevice : IPrinter, IScanner, IFaxer
{
    public void Print(Document d) { /* ... */ }
    public void Scan(Document d) { /* ... */ }
    public void Fax(Document d) { /* ... */ }
}
```



---

### 4. Yazılım Kaynakları ve Kütüphane Mimarilerinde ISP

Modern kütüphaneler incelendiğinde, ISP'nin ne kadar titizlikle uygulandığı görülebilir. Özellikle sistem seviyesindeki dillerde ve popüler framework'lerde bu yapı standarttır.

#### .NET ve Java Koleksiyon Mimarisi
.NET içerisindeki `IEnumerable`, `ICollection`, `IList` hiyerarşisi mükemmel bir ISP örneğidir. 
*   Sadece veri üzerinde dönmek (iterate) isteyen bir metot `IEnumerable` alır.
*   Veri ekleme/çıkarma yeteneği gerekiyorsa `ICollection` kullanılır.
*   İndeks tabanlı erişim gerekiyorsa `IList` tercih edilir.
Eğer tek bir `IFullCollection` arayüzü olsaydı, sadece okunabilir (read-only) bir liste bile `Add()` veya `Remove()` metotlarını taşımak zorunda kalırdı.

#### C++ Header Dosyaları ve V-Table Yönetimi
C++ dünyasında ISP, v-table (virtual table) boyutlarını kontrol altında tutmak için kritiktir. Çok fazla sanal metoda sahip bir sınıf, bellek ayak izini artırır. Arayüzleri parçalamak, sadece ihtiyaç duyulan fonksiyon pointer'larının yüklenmesini sağlar.

---

### 5. Adaptör Deseni (Adapter Pattern) İle Entegrasyon

Bazen üçüncü taraf kütüphanelerden gelen "yağlı" sınıfları değiştiremezsiniz. Bu durumda ISP'yi korumak için **Adapter** veya **Facade** desenleri devreye girer. Kendi sisteminiz için küçük, spesifik arayüzler tanımlarsınız ve bu arayüzleri dış dünyadaki devasa sınıflara bağlayan adaptörler yazarsınız. Böylece iş mantığınız (domain logic), dış kütüphanenin kirli tasarımından korunmuş olur.

---

### 6. ISP'nin Algoritmik ve Performans Etkileri

Yazılımın derleme zamanı (compile-time) hızı, doğrudan bağımlılık ağacıyla (dependency graph) ilişkilidir. 
*   **Header Pollution:** C++ ve benzeri dillerde, devasa bir arayüzün değişmesi tüm projeyi yeniden derletebilir. ISP, bu bağımlılığı izole ederek geliştirme hızını (development velocity) artırır.
*   **Interface Polluting:** Bir sınıfın çok fazla arayüz metodunu barındırması, IDE'lerin IntelliSense/Auto-complete özelliklerini de kirletir. Geliştirici, nesneyi kullanırken alakasız onlarca seçenek arasından doğru olanı seçmeye zorlanır.

---

### 7. İleri Seviye Notlar ve Uygulama Stratejileri

#### A. Arayüz Patlaması (Interface Explosion) Riski
ISP'yi uç noktada uygulamak, sistemde yüzlerce küçük arayüz oluşmasına neden olabilir. Bu dengeyi korumak için **Interface Composition** (Arayüz Kompozisyonu) kullanılmalıdır.

```csharp
public interface IMultiFunctionMachine : IPrinter, IScanner { }
```

#### B. Mevcut Projelerde Refactoring Adımları
1.  **Metot Kullanım Analizi:** Bir arayüzün metotlarının istemciler tarafından hangi yoğunlukta kullanıldığını tespit edin.
2.  **Kümeleme (Clustering):** Mantıksal olarak birbirine bağlı olan metotları gruplayın.
3.  **Hiyerarşik Geçiş:** Eski "yağlı" arayüzü, yeni küçük arayüzlerden türeterek geriye dönük uyumluluğu (backward compatibility) bozmadan geçiş yapın.

#### C. Microservices ve API Tasarımı
ISP sadece kod seviyesinde değil, API seviyesinde de geçerlidir. Bir mikroservisin sunduğu devasa bir "God API" yerine, farklı istemci türleri için (Mobil, Web, Admin) özelleşmiş **BFF (Backend for Frontend)** katmanları oluşturmak, bir nevi mimari seviyede Interface Segregation uygulamasıdır.

---

### 8. Sonuç: Temiz Kod İçin İnce Ayar

Interface Segregation Principle, yazılımı sadece daha modüler hale getirmez; aynı zamanda sistemin evrimleşme yeteneğini garanti altına alır. Yağlı arayüzleri parçalamak, başlangıçta daha fazla efor gerektirse de, uzun vadede projenin test edilebilirliğini ve genişletilebilirliğini (extensibility) maksimize eder.

**Önemli Not:** ISP, sadece "metotları ayırmak" değildir; aynı zamanda sistemin dokusunu, her bileşenin sadece kendi işini bildiği bir uzmanlık ağına dönüştürmektir. Bağımlılıklarınızı atomik seviyeye indirdiğinizde, kodunuzun kırılganlığı azalır ve değişimlere karşı direnci artar.

**Teknik Gereksinimler İçin Özet Liste:**
*   Arayüzler, istemci (client) odaklı tasarlanmalıdır, sağlayıcı (provider) odaklı değil.
*   Çok amaçlı arayüzler yerine, tek bir amaca hizmet eden (Single Responsibility ile uyumlu) arayüzler tercih edilmelidir.
*   Kalıtım (Inheritance) yerine Kompozisyon (Composition) ve çoklu arayüz uygulaması (Multiple Interface Implementation) kullanılmalıdır.