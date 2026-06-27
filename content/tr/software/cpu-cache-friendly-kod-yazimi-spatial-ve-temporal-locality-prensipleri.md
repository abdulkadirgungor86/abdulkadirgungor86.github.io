---
title: "CPU Cache Friendly Kod Yazımı: Spatial ve Temporal Locality Prensipleri"
date: 2026-03-08
type: "software"
draft: false
math: true
description: "Bu makale, modern işlemci mimarilerinde performans darboğazlarını aşmak için kritik olan spatial ve temporal locality prensiplerini, bellek hiyerarşisini ve önbellek dostu veri yapısı optimizasyonlarını teknik derinlikle ele almaktadır."
featured_image: "/images/software/cpu-cache-friendly-kod-yazimi-spatial-ve-temporal-locality-prensipleri.png"
tags: ["yazilim", "software", "yazilim-performansi", "software-performance", "cpu-cache", "low-level-programming", "cache-friendly", "veri-hiyerarsisi", "sistem-programlama"]
---

Yazılım performans optimizasyonunda en kritik darboğaz genellikle hesaplama gücü değil, verinin işlemciye ulaştırılma hızıdır. Modern CPU'lar mikrosaniye bazında devasa işlem kapasitelerine sahipken, ana bellekten (RAM) veri çekme işlemi bu hıza kıyasla oldukça yavaştır. Bu noktada "Cache Friendly" (önbellek dostu) kod yazımı, bir yazılımın teorik hız limitlerine ulaşıp ulaşamayacağını belirleyen temel unsurdur.

{{< figure src="/images/software/cpu-cache-friendly-kod-yazimi-spatial-ve-temporal-locality-prensipleri.png" alt="CPU Cache Friendly Kod Yazımı: Spatial ve Temporal Locality Prensipleri" width="1200" caption="Şekil 1: CPU Cache Friendly Kod Yazımı: Spatial ve Temporal Locality Prensipleri." >}}

---

## 1. Bellek Hiyerarşisi ve Latency Kavramı

İşlemci mimarilerinde veriye erişim süreleri katmanlı bir yapıdadır. L1 önbelleği işlemciye en yakın ve en hızlı olanıdır; onu L2 ve L3 takip eder. RAM ise bu hiyerarşinin en sonunda, "yüksek gecikmeli" (high latency) bölgede yer alır.

*   **L1 Cache:** Yaklaşık 3-4 çevrim (cycle) erişim süresi.
*   **L2 Cache:** Yaklaşık 10-12 çevrim erişim süresi.
*   **L3 Cache:** Yaklaşık 30-40 çevrim erişim süresi.
*   **Main Memory (RAM):** 200+ çevrim erişim süresi.

Bir CPU, ihtiyaç duyduğu veriyi önbellekte bulamazsa (Cache Miss), yüzlerce işlem döngüsü boyunca boşta bekler. Bu durum "Stall" olarak adlandırılır. Cache-friendly kodlamanın amacı, bu beklemeleri minimize etmektir.

---

## 2. Locality (Yerellik) Prensipleri

Bellek yönetiminde performansı optimize eden iki ana yerellik prensibi vardır:

### A. Temporal Locality (Zamansal Yerellik)
Bir veri noktasına erişildiyse, yakın bir gelecekte aynı veriye tekrar erişilme ihtimali yüksektir. Döngüler içindeki değişkenler veya sık kullanılan fonksiyon parametreleri bu sınıfa girer. Önbellek algoritmaları, en son kullanılan veriyi (LRU - Least Recently Used) hızlı erişim katmanında tutmaya çalışır.

### B. Spatial Locality (Mekansal Yerellik)
Bir veri noktasına erişildiyse, bellekte onun hemen bitişiğinde bulunan verilere de kısa süre içinde erişilme ihtimali yüksektir. CPU, veriyi tek bir byte olarak değil, genellikle 64 byte'lık bloklar halinde (Cache Line) çeker. Eğer verileriniz bellekte ardışıksa, bir sonraki veriye eriştiğinizde o veri zaten önbelleğe alınmış olur.

---

## 3. Cache Line Kavramı ve Hizalama (Alignment)

Veriler RAM'den önbelleğe transfer edilirken "Cache Line" adı verilen sabit boyutlu paketler kullanılır. Modern x86 ve ARM mimarilerinde bu genellikle **64 byte**'tır.

**Önemli Not:** Eğer bir veri yapısı (struct) 64 byte'lık bir sınırın üzerine biniyorsa, işlemci bu veriyi okumak için iki ayrı cache line yüklemek zorunda kalır. Bu durum "Cache Line Split" olarak bilinir ve performansı düşürür. Veri yapılarının `alignas` veya `__attribute__((aligned(64)))` gibi komutlarla hizalanması bu yüzden kritiktir.

---

## 4. Matris Operasyonlarında Veri Erişimi: Pratik Bir Analiz

Cache-friendly kodlamanın en klasik örneği iki boyutlu dizilerin (matrislerin) taranmasıdır. C++ gibi "Row-Major" (satır öncelikli) dillerde, bellek satır satır dizilir.

### Cache-Unfriendly Yaklaşım (Column-Major)
```cpp
// Verimsiz: Sütun bazlı tarama
for (int j = 0; j < 1000; j++) {
    for (int i = 0; i < 1000; i++) {
        sum += matrix[i][j]; // Her adımda bellekte büyük atlamalar yapılır
    }
}
```
Yukarıdaki kodda, her iç döngü adımında bir sonraki satıra geçilir. Aradaki mesafe bir cache line'dan büyükse, her erişim bir "Cache Miss" ile sonuçlanır.

### Cache-Friendly Yaklaşım (Row-Major)
```cpp
// Verimli: Satır bazlı tarama
for (int i = 0; i < 1000; i++) {
    for (int j = 0; j < 1000; j++) {
        sum += matrix[i][j]; // Ardışık bellek erişimi, yüksek Spatial Locality
    }
}
```
Burada işlemci, ilk elemanı çekerken yanındaki 63 byte'ı da (toplam 16 adet 4-byte integer) önbelleğe alır. Sonraki 15 erişim bedavaya gelir.

---

## 5. Data-Oriented Design (DOD) ve SoA vs AoS

Nesne yönelimli programlama (OOP), veriyi nesne içinde gruplar (Array of Structures - AoS). Ancak performans odaklı sistemlerde verinin işlem gereksinimine göre ayrıştırılması (Structure of Arrays - SoA) tercih edilir.

### AoS (Array of Structures)
```cpp
struct Particle {
    float x, y, z;
    int id;
    char name[32];
};
Particle particles[1000];
```
Eğer sadece `x, y, z` koordinatlarını kullanarak bir hesaplama yapacaksanız, `name` ve `id` alanları da cache line'a dolacaktır. Bu, önbelleğin %80'inin gereksiz veriyle işgal edilmesi demektir.

### SoA (Structure of Arrays)
```cpp
struct Particles {
    float x[1000];
    float y[1000];
    float z[1000];
};
```
SoA yapısında işlemci sadece ihtiyaç duyulan koordinat dizilerini yükler. Bu yapı aynı zamanda **SIMD (Single Instruction Multiple Data)** komut setlerinin (AVX, SSE) kullanımı için de idealdir.

---

## 6. Linked List vs Array (Veri Yapısı Seçimi)

`std::list` (Linked List) mantıksal olarak sıralı olsa da, düğümleri (nodes) belleğin farklı yerlerine dağılmış durumdadır (Heap fragmentation). Pointer takibi (Pointer Chasing), her adımda yeni bir bellek adresi çözülmesini gerektirir ve prefetcher (ön yükleyici) mekanizmasını bozar.

Buna karşın `std::vector` (Array) veriyi blok halinde tutar. Cache-friendly kod yazmak istiyorsanız, dinamik arama ve ekleme maliyeti olsa bile `std::vector` kullanımı her zaman daha hızlı sonuç verecektir.

---

## 7. False Sharing (Sahte Paylaşım) Fenomeni

Çok çekirdekli (Multi-core) sistemlerde, farklı çekirdeklerin aynı cache line üzerinde bulunan farklı değişkenleri değiştirmeye çalışması performans felaketine yol açar.

*   **Senaryo:** Çekirdek A, `struct.var1`'i; Çekirdek B, `struct.var2`'yi güncelliyor.
*   **Sorun:** Her iki değişken de aynı 64 byte'lık cache line içindeyse, bir çekirdek veriyi güncellediğinde diğer çekirdekteki cache line "geçersiz" (invalid) sayılır. Bellek tutarlılığı (Cache Coherency) protokolleri yüzünden veri sürekli RAM'den tekrar okunur.

**Çözüm:** Kritik değişkenler arasına `padding` ekleyerek veya hizalama kullanarak onları farklı cache line'lara taşımak.

---

## 8. Yazılım Kütüphaneleri ve Araçlar

Performans analizi ve cache-friendly kodlama için aşağıdaki araçlar endüstri standardıdır:

1.  **Valgrind (Cachegrind):** Programın cache kullanım simülasyonunu yapar ve Miss oranlarını raporlar.
2.  **Intel VTune Profiler:** İşlemci donanım sayaçlarını kullanarak darboğazları mikro mimari düzeyinde tespit eder.
3.  **Perf (Linux):** CPU donanım olaylarını (cache-misses, instructions per cycle) izlemek için kullanılır.
4.  **Google Benchmark:** Kod parçacıklarının CPU zamanı ve bellek performansını ölçmek için kullanılan bir kütüphanedir.

---

## 9. İleri Düzey Teknikler: Cache Blocking (Tiling)

Büyük veri setlerinde, verinin tamamı L3 cache'e sığmıyorsa "Tiling" tekniği uygulanır. Veri kümesi, önbelleğe sığacak küçük bloklara (tile) bölünür ve her blok üzerinde işlemler tamamlanmadan diğerine geçilmez. Bu, Temporal Locality'yi maksimize eder.

```cpp
// Matris çarpımı için Blocking örneği (Basitleştirilmiş)
for (int bi = 0; bi < N; bi += BLOCK_SIZE) {
    for (int bj = 0; bj < N; bj += BLOCK_SIZE) {
        for (int bk = 0; bk < N; bk += BLOCK_SIZE) {
            // İç döngüler blok içinde işlem yapar
            for (int i = bi; i < bi + BLOCK_SIZE; i++) {
                for (int j = bj; j < bj + BLOCK_SIZE; j++) {
                    for (int k = bk; k < bk + BLOCK_SIZE; k++) {
                        C[i][j] += A[i][k] * B[k][j];
                    }
                }
            }
        }
    }
}
```

---

## 10. Sonuç ve Öneriler

Modern donanımlarda performans, sadece algoritma karmaşıklığı ($O(n)$) ile değil, donanımın veriye ne kadar hızlı erişebildiği ile ölçülür. Cache-friendly kod yazımı için:

*   Verilerinizi bellekte ardışık (contiguous) tutun.
*   Pointer kullanımını minimize edin, değer tipinde (value types) dizileri tercih edin.
*   Sık kullanılan verileri küçük yapılar halinde gruplayın (SoA yaklaşımı).
*   Çok çekirdekli sistemlerde False Sharing'e karşı dikkatli olun.
*   Kritik döngüleri veri hizalamasına (Data Alignment) göre optimize edin.

Unutulmamalıdır ki, en hızlı kod, işlemcinin veri beklemek zorunda kalmadığı koddur. Yazılım mimarisini en baştan bellek hiyerarşisini düşünerek tasarlamak, projenin ilerleyen aşamalarında elde edilecek performans kazanımlarının temelidir.