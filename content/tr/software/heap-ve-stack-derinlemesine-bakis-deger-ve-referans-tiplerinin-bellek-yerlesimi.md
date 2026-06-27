---
title: "Heap ve Stack Derinlemesine Bakış: Değer ve Referans Tiplerinin Bellek Yerleşimi"
date: 2026-03-23
type: "software"
draft: false
math: true
description: "Yazılım mimarilerinde performans optimizasyonunun temeli olan Stack ve Heap bellek bölgelerinin çalışma mekanizmalarını, değer ve referans tiplerinin hafıza yerleşimini ve Garbage Collector süreçlerini teknik derinlikte inceleyen bir çalışmadır."
featured_image: "/images/software/heap-ve-stack-derinlemesine-bakis-deger-ve-referans-tiplerinin-bellek-yerlesimi.png"
tags: ["yazilim", "software", "stack-ve-heap", "bellek-yerlesimi", "garbage-collector", "referans-tipleri", "performans-optimizasyonu", "hafiza-yonetimi"]
---

Modern yazılım mimarilerinde performans optimizasyonu ve bellek yönetimi, kodun çalışma zamanı (runtime) davranışını belirleyen en kritik unsurlardır. Yüksek seviyeli diller (C#, Java, Python) belleği otomatik olarak yönetse de, arka planda gerçekleşen **Stack** ve **Heap** ayrımını kavramak, bellek sızıntılarını (memory leaks) önlemek ve işlemci kaynaklarını verimli kullanmak için zaruridir.

{{< figure src="/images/software/heap-ve-stack-derinlemesine-bakis-deger-ve-referans-tiplerinin-bellek-yerlesimi.png" alt="Heap ve Stack Derinlemesine Bakış: Değer ve Referans Tiplerinin Bellek Yerleşimi" width="1200" caption="Şekil 1: Heap ve Stack Derinlemesine Bakış: Değer ve Referans Tiplerinin Bellek Yerleşimi" >}}

---

## 1. Bellek Mimarisi: Stack ve Heap Kavramsal Ayrımı

Yürütülebilir bir program belleğe yüklendiğinde, işletim sistemi süreç (process) için belirli bir bellek alanı tahsis eder. Bu alan temel olarak iki mantıksal yapıya bölünür.

### Stack (Yığın) Yapısı
Stack, **LIFO (Last In, First Out - Son Giren İlk Çıkar)** prensibiyle çalışan, statik bellek tahsisinin yapıldığı bölgedir. 
*   **Hız:** CPU'nun stack pointer (yığın işaretçisi) aracılığıyla doğrudan erişimi sayesinde son derece hızlıdır.
*   **Yönetim:** Derleyici (compiler) tarafından otomatik olarak yönetilir. Fonksiyon çağrıldığında yer açılır, fonksiyon bittiğinde bu yer anında geri alınır.
*   **Kapsam:** Yerel değişkenler ve fonksiyon parametreleri burada tutulur.

### Heap (Öbek) Yapısı
Heap, programın çalışma zamanında (runtime) ihtiyaç duyduğu dinamik bellek alanıdır.
*   **Esneklik:** Boyutu çalışma anında değişebilir. Nesneler (objects) burada saklanır.
*   **Yönetim:** Manuel dillerde (C/C++) `malloc`/`free` veya `new`/`delete` ile; yönetilen dillerde (C#/Java) **Garbage Collector (Çöp Toplayıcı)** ile temizlenir.
*   **Erişim:** Stack’e göre daha yavaştır çünkü işaretçiler (pointers) üzerinden dolaylı erişim sağlar.

---

## 2. Değer ve Referans Tiplerinin Bellek Yerleşimi

Bellek yönetimi dilden dile küçük farklılıklar gösterse de, temel prensip **Değer Tipleri (Value Types)** ve **Referans Tipleri (Reference Types)** ayrımı üzerine kuruludur.

### Değer Tipleri (Value Types)
Doğrudan verinin kendisini içeren tiplerdir. `int`, `float`, `bool`, `char` ve C# gibi dillerdeki `struct` yapıları bu kategoriye girer.
*   Bir değer tipi tanımlandığında, belleğin Stack bölgesinde yer kaplar.
*   Bir değişken diğerine atandığında, verinin tam bir kopyası oluşturulur. Bu işleme **Deep Copy** denir.

### Referans Tipleri (Reference Types)
Verinin kendisini değil, verinin Heap üzerindeki adresini (bellek adresini) saklayan tiplerdir. `class`, `interface`, `delegate` ve diziler bu gruba dahildir.
*   Referansın kendisi (adresi tutan değişken) Stack üzerinde, asıl veri (nesne) ise Heap üzerindedir.
*   Atama işlemi yapıldığında sadece adres kopyalanır; her iki değişken de aynı Heap bölgesini işaret eder.

---

## 3. Kod Üzerinden Analiz: C++ ve C# Örnekleri

Bellek yerleşimini daha iyi anlamak için düşük ve yüksek seviyeli diller arasındaki yaklaşımları inceleyelim.

### C++ Örneği (Manuel Yönetim)
C++'ta bir nesneyi hem stack'te hem de heap'te oluşturma özgürlüğüne sahipsiniz:

```cpp
#include <iostream>

class SensorData {
public:
    int id;
    double value;
};

void MemoryAnalysis() {
    // Stack Tahsisi
    SensorData s1; 
    s1.id = 1; // s1 ve içeriği tamamen Stack'tedir.

    // Heap Tahsisi
    SensorData* s2 = new SensorData(); 
    s2->id = 2; // 's2' işaretçisi Stack'te, nesne Heap'tedir.

    delete s2; // Manuel temizlik şart!
}
```

### C# Örneği (Yönetilen Bellek)
Modern dillerde bu ayrım daha keskindir:

```csharp
public class RobotModel { // Referans Tipi
    public int Power;
}

public struct Position { // Değer Tipi
    public int X;
    public int Y;
}

public void Process() {
    Position p1 = new Position { X = 10, Y = 20 }; // Stack'te
    RobotModel r1 = new RobotModel { Power = 100 }; // r1 Stack'te (adres), nesne Heap'te
    
    Position p2 = p1; // Veri kopyalandı (bağımsız)
    p2.X = 50; // p1.X hala 10 kalır.

    RobotModel r2 = r1; // Adres kopyalandı (aynı nesne)
    r2.Power = 0; // r1.Power da 0 olur!
}
```

---

## 4. Bellek Parçalanması ve Garbage Collection (GC)

Heap kullanımının en büyük dezavantajı **Fragmentation (Parçalanma)** sorunudur. Bellek sürekli tahsis edilip serbest bırakıldığında, arada kullanılmayan küçük boşluklar oluşur.



### Garbage Collector Nasıl Çalışır?
C# (CLR) ve Java (JVM) gibi ortamlarda GC, Heap'i tarayarak artık hiçbir Stack değişkeni tarafından referans verilmeyen nesneleri tespit eder. 
*   **Mark and Sweep:** Önce "canlı" nesneler işaretlenir, sonra geri kalanlar silinir.
*   **Compaction:** Silme işleminden sonra bellek blokları yan yana dizilerek boşluklar kapatılır (Heap Compaction).

---

## 5. İleri Düzey Kavramlar: Boxing, Unboxing ve Escape Analysis

Yazılım performansını baltalayan gizli maliyetlerin başında boxing işlemleri gelir.

### Boxing ve Unboxing
Bir değer tipinin (value type) bir referans tipine (object) dönüştürülmesi işlemine **Boxing** denir. Bu işlem, Stack'teki verinin Heap'e taşınmasına neden olur ki bu maliyetli bir operasyondur.

```csharp
int i = 123;
object o = i; // Boxing: Heap'te yeni bir alan açılır.
int j = (int)o; // Unboxing: Heap'teki veri Stack'e geri alınır.
```

### Escape Analysis (Kaçış Analizi)
Modern derleyiciler (özellikle Java JIT derleyicisi), bir nesnenin fonksiyon dışına "kaçıp kaçmadığını" kontrol eder. Eğer bir nesne sadece yerel kapsamda kullanılıyorsa, Heap yerine Stack'te oluşturularak GC yükü azaltılır.

---

## 6. Güvenli ve Performanslı Bellek Yönetimi İçin Notlar

1.  **Büyük Struct Yapılarından Kaçının:** Değer tipleri her atamada kopyalandığı için, 16 byte'tan büyük yapıları `struct` yerine `class` olarak tanımlamak CPU döngülerini korur.
2.  **String Kullanımına Dikkat:** Stringler referans tipidir ancak "immutable" (değiştirilemez) oldukları için her değişiklikte Heap üzerinde yeni bir nesne oluştururlar. Yoğun metin işlemleri için `StringBuilder` tercih edilmelidir.
3.  **LOH (Large Object Heap):** .NET gibi platformlarda çok büyük nesneler (genellikle 85KB üstü) özel bir heap alanına alınır. Bu alan GC tarafından sıkıştırılmaz, bu yüzden LOH'ta nesne biriktirmek bellek yetersizliği hatalarına (OutOfMemoryException) yol açabilir.
4.  **Iisposable Arayüzü:** Unmanaged (yönetilmeyen) kaynaklar (dosya akışları, veritabanı bağlantıları) kullanıldığında, GC'nin keyfini beklemek yerine `using` blokları ile bellek hemen serbest bırakılmalıdır.

## 7. Sonuç

Stack ve Heap arasındaki denge, bir yazılımın hem hızını hem de kararlılığını belirler. Değer tiplerinin deterministik doğası ile referans tiplerinin esnekliğini doğru harmanlamak, sadece kod yazmayı değil, donanım kaynaklarını bir mühendis hassasiyetiyle yönetmeyi sağlar. Düşük gecikmeli (low-latency) sistemlerde hedef her zaman Stack kullanımını maksimize etmek ve gereksiz Heap tahsislerinden (allocation) kaçınmaktır.

---

### Teknik Terimler Sözlüğü ve Kütüphane Referansları

*   **LIFO:** Last-In-First-Out veri yapısı mantığı.
*   **Pointer (İşaretçi):** Bellek adresini tutan değişken türü.
*   **CLR/JVM:** Bellek yönetimini otomatize eden çalışma zamanı ortamları.
*   **Memory Profiler:** Bellek kullanımını analiz etmek için kullanılan araçlar (DotMemory, Visual Studio Diagnostic Tools, Valgrind).
*   **RAII (Resource Acquisition Is Initialization):** C++'ta nesne ömrü ile kaynak yönetimini birleştiren tasarım deseni.