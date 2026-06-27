---
title: "Garbage Collection Algoritmaları: Nesne Yaşam Döngüsü ve \"Memory Leak\" Analizi"
date: 2026-03-20
type: "software"
draft: false
math: true
description: "Bellek yönetiminin kalbi olan Garbage Collection algoritmalarının işleyiş prensipleri, nesne yaşam döngüsü aşamaları ve yazılım sistemlerinde kritik performans kayıplarına yol açan bellek sızıntılarının teknik analiz yöntemleridir."
featured_image: "/images/software/garbage-collection-algoritmalari-nesne-yasam-dongusu-ve-memory-leak-analizi.png"
tags: ["yazilim", "software", "bellek-yonetimi", "garbage-collection", "memory-leak", "nesne-yasam-dongusu", "veri-yapilari", "performans-optimizasyonu"]
---

Bellek yönetimi, modern yazılım mimarilerinde sistem performansını ve uygulama kararlılığını doğrudan etkileyen en kritik katmanlardan biridir. Garbage Collection (GC - Çöp Toplayıcı), programcının manuel bellek yönetiminden (malloc/free veya new/delete) kaynaklanabilecek hataları minimize etmek amacıyla geliştirilmiş, dinamik bellek tahsisi yapılmış nesnelerin yaşam döngüsünü takip eden bir mekanizmadır.

{{< figure src="/images/software/garbage-collection-algoritmalari-nesne-yasam-dongusu-ve-memory-leak-analizi.png" alt="Garbage Collection Algoritmaları: Nesne Yaşam Döngüsü ve \"Memory Leak\" Analizi" width="1200" caption="Şekil 1: Garbage Collection Algoritmaları: Nesne Yaşam Döngüsü ve \"Memory Leak\" Analizi" >}}

---

## 1. Bellek Tahsisi ve Nesne Yaşam Döngüsü

Bir nesnenin yaşam döngüsü, çalışma zamanında (Runtime) bellek üzerinde yer ayrılmasıyla başlar. Modern dillerde (Java, C#, Go, Python) bu süreç genellikle **Heap** (yığın) alanında gerçekleşir.

*   **Allocation (Tahsis):** Nesne için gerekli byte miktarı hesaplanır ve bellekte uygun bir adres aralığı rezerve edilir.
*   **Reachability (Erişilebilirlik):** Bir nesnenin "canlı" sayılması için kök (Root) referanslarından (Stack değişkenleri, statik değişkenler, CPU register'ları) başlayan bir referans zinciri ile ulaşılabilir olması gerekir.
*   **Finalization:** Bellekten silinmeden önce nesnenin kaynaklarını serbest bırakması (dosya kapatma, socket sonlandırma vb.) aşamasıdır.
*   **Deallocation:** Nesnenin kapladığı alanın boşaltılarak yeni tahsisler için hazır hale getirilmesi.

## 2. Temel Garbage Collection Algoritmaları

Çöp toplama süreçleri, performansı optimize etmek ve "Stop-the-World" (STW) duraksamalarını azaltmak için farklı stratejiler izler.

### 2.1. Reference Counting (Referans Sayma)
Her nesne, kendisine kaç farklı noktadan atıfta bulunulduğunu tutan bir sayaç barındırır. Sayaç sıfıra indiğinde nesne anında silinir.
*   **Avantaj:** Bellek anında serbest kalır, büyük duraksamalar yaşanmaz.
*   **Dezavantaj:** Döngüsel referansları (Circular Dependency) çözemez. İki nesne birbirini gösteriyorsa, programda karşılıkları kalmasa bile sayaçları asla sıfırlanmaz.

### 2.2. Mark-and-Sweep (İşaretle ve Süpür)
Bu algoritma iki aşamadan oluşur:
1.  **Mark:** GC köklerinden başlanarak tüm ulaşılabilir nesneler "canlı" olarak işaretlenir.
2.  **Sweep:** İşaretlenmemiş tüm nesneler bellekten temizlenir.



### 2.3. Copying (Kopyalama) Algoritması
Bellek iki eşit parçaya bölünür (Semi-space). Bir taraf dolduğunda, sadece canlı nesneler diğer tarafa ardışık olarak kopyalanır. Eski alan tamamen boşaltılır.
*   **Kritik Not:** Bu yöntem bellek parçalanmasını (fragmentation) engeller ancak kullanılabilir bellek alanını yarıya indirir.

### 2.4. Generational Garbage Collection (Kuşaksal Hipotezi)
Yazılım dünyasındaki "çoğu nesne genç ölür" (Infant Mortality) prensibine dayanır. Bellek kuşaklara ayrılır:
*   **Young Generation (Eden Space):** Yeni oluşturulan nesneler buraya gider. Sık ama hızlı temizlik yapılır (Minor GC).
*   **Old Generation (Tenured):** Belirli bir süre hayatta kalan nesneler buraya taşınır. Daha nadir ama kapsamlı temizlik yapılır (Major/Full GC).

## 3. Bellek Sızıntısı (Memory Leak) Analizi

Yönetilen bir bellek yapısında (Managed Memory) sızıntı, teknik olarak ulaşılabilir olan ancak programın mantığı gereği artık ihtiyaç duyulmayan nesnelerin bellekte kalmaya devam etmesidir.

### 3.1. Sızıntı Kaynakları
*   **Unused Static Fields:** Statik koleksiyonlara eklenen nesneler, sınıf yükleyici (Class Loader) aktif olduğu sürece temizlenmez.
*   **Unclosed Resources:** Kapatılmayan Database connection'ları veya Stream yapıları.
*   **Inner Class Referansları:** Bir dış sınıfın iç sınıfı, farkında olmadan dış sınıfa gizli bir referans tutabilir.
*   **Listener ve Callback Kayıtları:** Event listener'lar kayıt edildikten sonra `unregister` edilmezse sızıntıya yol açar.

### 3.2. Teknik Analiz ve Profiling
Bellek sızıntılarını tespit etmek için **Heap Dump** analizi yapılmalıdır. Nesne histogramları üzerinden hangi sınıfın kaç adet instance'ının bellekte kaldığı ve bunların hangi referans zinciri (Path to GC Roots) ile hayatta tutulduğu incelenir.

## 4. Programlama Dili Bazlı Uygulamalar ve Kütüphaneler

### 4.1. C++ ve Smart Pointers (RAII)
C++'ta manuel yönetimi otomatize etmek için `std::unique_ptr` ve `std::shared_ptr` kullanılır.

```cpp
#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Kaynak olusturuldu\n"; }
    ~Resource() { std::cout << "Kaynak yok edildi\n"; }
};

void scopeTest() {
    // Reference Counting prensibiyle calisan shared_ptr
    std::shared_ptr<Resource> ptr1 = std::make_shared<Resource>();
    {
        std::shared_ptr<Resource> ptr2 = ptr1; // Referans sayisi 2 oldu
        std::cout << "Referans sayisi: " << ptr1.use_count() << "\n";
    } // ptr2 kapsam disi, referans sayisi 1
    std::cout << "Referans sayisi: " << ptr1.use_count() << "\n";
} // ptr1 kapsam disi, referans sayisi 0 ve destructor cagrilir
```

### 4.2. Java ve JVM Garbage Collectors
JVM, ihtiyaca göre seçilebilen farklı GC implementasyonları sunar:
*   **G1 (Garbage First):** Belleği bölgelere (regions) ayırarak en çok çöp barındıran bölgeye öncelik verir.
*   **ZGC:** Çok düşük gecikme (low latency) hedefleyen, TB seviyesindeki bellekleri milisaniyeler içinde tarayabilen modern bir toplayıcıdır.

### 4.3. Python ve `gc` Modülü
Python temel olarak Reference Counting kullanır ancak döngüsel referansları çözmek için arkada bir `cyclic garbage collector` çalıştırır.

```python
import gc

class Node:
    def __init__(self, name):
        self.name = name
        self.next = None

def create_cycle():
    n1 = Node("A")
    n2 = Node("B")
    n1.next = n2
    n2.next = n1  # Dongusel referans (Memory Leak adayi)

create_cycle()
# Normalde n1 ve n2 kapsam disi ama birbirlerini tuttuklari icin temizlenmezler
gc.collect() # Manuel tetikleme ile dongusel referanslar temizlenir
```

## 5. Performans Optimizasyon Stratejileri

Sistem mimarisinde GC yükünü azaltmak için şu teknik yaklaşımlar benimsenmelidir:

1.  **Object Pooling:** Sık oluşturulup yok edilen nesneler (örneğin mermi nesneleri veya veritabanı bağlantıları) için yeniden kullanılabilir bir havuz oluşturmak.
2.  **Immutable Objects:** Değişmez nesneler, nesne yazma bariyerlerini (write barriers) optimize eder ve kuşaksal geçişlerde GC'ye yardımcı olur.
3.  **Large Object Heap (LOH) Yönetimi:** Çok büyük nesneler bellek parçalanmasına yol açtığı için bunların ömrü ve tahsis sıklığı kontrol altında tutulmalıdır.
4.  **Tuning:** JVM parametreleri (örneğin `-XX:+UseG1GC`, `-Xms`, `-Xmx`) ile uygulamanın karakteristik yapısına uygun bellek sınırları belirlenmelidir.

## 6. Sonuç ve Teknik Değerlendirme

Garbage Collection, yazılımcıyı düşük seviyeli bellek hatalarından korusa da, sistem kaynaklarının verimli kullanımı için algoritmanın çalışma mantığının bilinmesi şarttır. "Stop-the-World" sürelerinin minimize edilmesi, doğru veri yapılarının seçimi ve yaşam döngüsü analizi; yüksek trafikli ve kritik görev sistemlerinin performans sürdürülebilirliği için vazgeçilmezdir. Özellikle gerçek zamanlı sistemlerde GC duraksamalarının deterministik olması, uygulamanın hizmet kalitesini (SLA) belirleyen ana unsurdur.

---
**Teknik Notlar:**
*   *Fragmentation:* Belleğin küçük parçalara bölünerek büyük bir nesne için bitişik alan bulunamaması durumu.
*   *Root Set:* Yerel değişkenler, aktif thread'ler ve statik alanlar gibi doğrudan erişilebilir referanslar kümesi.
*   *Safe Points:* Uygulamanın GC işleminin başlayabilmesi için duraklatılabildiği güvenli noktalar.