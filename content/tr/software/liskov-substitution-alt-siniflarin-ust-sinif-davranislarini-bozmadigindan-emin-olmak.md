---
title: "Liskov Substitution: Alt Sınıfların Üst Sınıf Davranışlarını Bozmadığından Emin Olmak"
date: 2026-03-30
type: "software"
draft: false
math: true
description: "Liskov Substitution Principle (LSP) üzerine odaklanan, alt sınıfların üst sınıf sözleşmelerini bozmadan nasıl yapılandırılması gerektiğini teknik derinlik, kod örnekleri ve mimari çözümlerle açıklayan analizdir."
featured_image: "/images/software/liskov-substitution-alt-siniflarin-ust-sinif-davranislarini-bozmadigindan-emin-olmak.png"
tags: ["yazilim", "software", "oop", "nesne-yonelimli-programlama", "solid-prensipleri", "kod-kalitesi", "lsp"]
---

Yazılım mimarisinde sürdürülebilirlik ve esneklik, kodun sadece çalışmasıyla değil, aynı zamanda bileşenlerin birbirleriyle olan uyumuyla ölçülür. Robert C. Martin tarafından popüler hale getirilen SOLID prensiplerinin üçüncü halkası olan **Liskov Substitution Principle (LSP)**, nesne yönelimli programlamada (OOP) kalıtım hiyerarşisinin matematiksel ve mantıksal tutarlılığını garanti altına alan en kritik kurallardan biridir.

{{< figure src="/images/software/liskov-substitution-alt-siniflarin-ust-sinif-davranislarini-bozmadigindan-emin-olmak.png" alt="Liskov Substitution: Alt Sınıfların Üst Sınıf Davranışlarını Bozmadığından Emin Olmak" width="1200" caption="Şekil 1: Liskov Substitution: Alt Sınıfların Üst Sınıf Davranışlarını Bozmadığından Emin Olmak" >}}

---

## 1. Liskov Substitution Principle (LSP) Nedir?

1987 yılında Barbara Liskov tarafından ortaya konan bu prensip, şu matematiksel tanıma dayanır:

> "$S$, $T$’nin bir alt türüyse; $T$ tipindeki nesneler, programın beklenen özelliklerini (doğruluk, görev tamamlama vb.) değiştirmeden $S$ tipindeki nesnelerle yer değiştirebilmelidir."

Teknik bir ifadeyle; bir üst sınıfın örneği yerine onun herhangi bir alt sınıfının örneği kullanıldığında, sistemin davranışı bozulmamalı, beklenmedik hatalar (exception) fırlatılmamalı ve mantıksal tutarlılık korunmalıdır.

---

## 2. Tip Güvenliği ve Davranışsal Uyumluluk

LSP, sadece imza uyumluluğu (metot isimleri ve parametre tipleri) ile ilgili değildir. Asıl odak noktası **davranışsal uyumluluktur**. Bir alt sınıf, üst sınıfın metodunu override ettiğinde, o metodun oluşturduğu "gizli sözleşmeyi" bozmamalıdır.

### Kontrat İhlalleri: Preconditions ve Postconditions

Bir metodun çalışma prensibi iki ana kavrama dayanır:
*   **Preconditions (Ön Koşullar):** Metot çalışmadan önce sağlanması gereken şartlar. Alt sınıflar bu şartları **güçlendiremez**.
*   **Postconditions (Son Koşullar):** Metot bittikten sonra garanti edilen sonuçlar. Alt sınıflar bu garantileri **zayıflatamaz**.

---

## 3. Klasik Bir Hata: Kare - Dikdörtgen Problemi

LSP'nin en bilinen ihlal örneği, geometrik bir hiyerarşide karşımıza çıkar. Matematiksel olarak her kare bir dikdörtgendir; ancak yazılım dünyasında bu kalıtım ilişkisi LSP'yi ihlal eder.

### Yanlış Tasarım (Python Örneği)

```python
class Rectangle:
    def __init__(self, width, height):
        self._width = width
        self._height = height

    def set_width(self, width):
        self._width = width

    def set_height(self, height):
        self._height = height

    def get_area(self):
        return self._width * self._height

class Square(Rectangle):
    def set_width(self, width):
        self._width = width
        self._height = width  # Kare olduğu için yüksekliği de değiştiriyoruz

    def set_height(self, height):
        self._height = height
        self._width = height
```

**Neden İhlal Edildi?**
Eğer bir istemci (client) kodu `Rectangle` nesnesi bekliyorsa ve genişliği değiştirdiğinde yüksekliğin sabit kalacağını varsayıyorsa, ona bir `Square` nesnesi gönderdiğinizde bu varsayım çöker. Alt sınıf, üst sınıfın davranışını değiştirmiştir.

---

## 4. Teknik Çözüm Stratejileri

LSP ihlallerini gidermek için "Kalıtım yerine Kompozisyon" (Composition over Inheritance) prensibi veya arayüzlerin (Interface) daha spesifik ayrıştırılması (Interface Segregation) kullanılır.

### Doğru Tasarım: Soyutlama (C# Örneği)

```csharp
public abstract class Shape
{
    public abstract double GetArea();
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double GetArea() => Width * Height;
}

public class Square : Shape
{
    public double Side { get; set; }

    public override double GetArea() => Side * Side;
}
```

Bu tasarımda `Square`, `Rectangle`’ın davranışlarını miras almaz; her ikisi de ortak bir `Shape` sözleşmesine uyar. Böylece bir metot `Shape` beklediğinde, her iki sınıf da kendi mantığına göre doğru alan hesabını döndürür ve üst sınıfın beklenen davranışı bozulmaz.

---

## 5. Yazılım Kütüphanelerinde LSP Uygulamaları

Modern yazılım kütüphaneleri ve framework’ler LSP üzerine inşa edilmiştir. Örneğin:

*   **Java Collections Framework:** `ArrayList` ve `LinkedList` sınıfları `List` arayüzünü implemente eder. Bir metot `List` tipinde parametre aldığında, arkadaki gerçek implementasyonun hangisi olduğundan bağımsız olarak `add()`, `remove()` veya `get()` metotlarının standart davranışı sergilemesini bekler.
*   **Entity Framework Core (C#):** `DbSet<T>` üzerinde yapılan sorgulamalarda, LINQ sağlayıcıları `IQueryable` arayüzüne sadık kalır. Özel bir provider yazıldığında, temel sorgu mantığının bozulması tüm veri erişim katmanını felç eder.

---

## 6. LSP İhlal Belirtileri (Code Smells)

Kodunuzda şu durumları görüyorsanız LSP'yi ihlal ediyor olabilirsiniz:

1.  **Boş Override Metotlar:** Bir alt sınıf, üst sınıftan gelen bir metodu implemente edemiyor ve içini boş bırakıyorsa.
2.  **NotImplementedException:** "Bu metot bu alt sınıf için geçerli değil" diyerek hata fırlatılıyorsa.
3.  **Tip Kontrolleri (Type Checking):** İstemci kodunda `if (obj is Square)` gibi kontroller yapılıyorsa, bu durum polimorfizmin başarısız olduğunu ve alt sınıfın kendisini üst sınıf gibi hissettiremediğini gösterir.

---

## 7. Derinlemesine Teknik Analiz: Covariance ve Contravariance

LSP, generics ve dönüş tipleri üzerinde de sıkı kurallar koyar.

*   **Covariance (Eşyönlülük):** Alt sınıf, üst sınıfın döndürdüğü tipin daha spesifik bir halini döndürebilir.
*   **Contravariance (Tersyönlülük):** Alt sınıf, üst sınıfın kabul ettiği parametre tipinden daha genel bir tipi kabul edebilir.

Bu kurallar, çalışma zamanında (runtime) tip güvenliğinin korunmasını sağlar. C++ gibi dillerde bu durum "Virtual Table" (vtable) mekanizması üzerinden yönetilirken, Java ve C# gibi dillerde sanal metot tabloları ve runtime kontrol mekanizmaları devreye girer.

---

## 8. İleri Seviye Örnek: Dosya Sistemi ve Yetkilendirme

Bir dosya yönetim sistemi tasarladığımızı düşünelim.

```python
from abc import ABC, abstractmethod

class File(ABC):
    @abstractmethod
    def write(self, data):
        pass

class ReadWriteFile(File):
    def write(self, data):
        print(f"Writing data: {data}")

class ReadOnlyFile(File):
    def write(self, data):
        # LSP İHLALİ: Üst sınıf yazma işlemi vaat ederken, bu sınıf hata fırlatıyor.
        raise Exception("Cannot write to a read-only file")
```

**Çözüm:** Yazma yeteneği olan dosyaları ayrı bir arayüze (Interface) taşımak. Böylece `ReadOnlyFile` sadece okuma sözleşmesini imzalar.

---

## 9. LSP ve Birim Testleri (Unit Testing)

LSP'nin doğruluğunu test etmek için en etkili yöntem **"Base Class Tests"** desenidir. Üst sınıf için yazdığınız tüm test senaryoları, istisnasız tüm alt sınıflar için de başarılı (green) olmalıdır. Eğer bir alt sınıf, üst sınıfın testlerini geçemiyorsa, o alt sınıf üst sınıfın yerini tutamıyor demektir.

---

## 10. Sonuç ve Mimari Öneri

Liskov Substitution Principle, nesneler arasındaki "is-a" (biridir) ilişkisini sorgular. Eğer "Her Kare bir Dikdörtgendir" cümlesi yazılımda mantıksal hatalara yol açıyorsa, bu ilişki "is-a" değil, belki de sadece "behaves-like" (gibi davranır) ilişkisidir.

**Teknik Notlar:**
*   Kalıtım hiyerarşisini derinleştirmek yerine kompozisyonu tercih edin.
*   Soyutlamalarınızı (Interface/Abstract Class) mümkün olduğunca dar (granüler) tutun.
*   Alt sınıflarda metot override ederken, üst sınıfın dokümante edilmiş veya edilmemiş (side effects) tüm davranışlarını koruyun.

LSP'ye uyum sağlamak, sistemdeki bağımlılıkları azaltır ve polimorfizmin gerçek gücünden yararlanmanızı sağlar. Bu prensibe sadık kalınan sistemlerde, yeni özellikler eklemek mevcut kodu bozma riski taşımadan gerçekleştirilebilir.

