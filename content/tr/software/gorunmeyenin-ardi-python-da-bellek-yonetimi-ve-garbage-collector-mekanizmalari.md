---
title: "Görünmeyenin Ardı: Python'da Bellek Yönetimi ve Garbage Collector Mekanizmaları"
date: 2026-03-22
type: "software"
draft: false
math: true
description: "Python'un CPython mimarisinde yer alan referans sayımı, nesilsel çöp toplama (GC) döngüleri ve bellek havuzu hiyerarşisinin derinlemesine teknik incelemesini sunan bir yazıdır."
featured_image: "/images/software/gorunmeyenin-ardi-python-da-bellek-yonetimi-ve-garbage-collector-mekanizmalari.png"
tags: ["yazilim", "software", "python", "bellek-yonetimi", "garbage-collection", "cpython", "bellek-sizintisi", "veri-yapilari"]
---

Python, geliştiriciye sunduğu yüksek seviyeli soyutlama sayesinde bellek yönetimi gibi karmaşık süreçleri arka planda sessizce yürütür. Ancak performans kritik uygulamalarda, "Memory Leak" (bellek sızıntısı) sorunlarını çözmek veya kaynak tüketimini optimize etmek için bu sessiz mimarinin nasıl çalıştığını anlamak hayati önem taşır. Python'da bellek yönetimi; **Reference Counting** (Referans Sayımı), **Generational Garbage Collection** (Nesilsel Çöp Toplayıcı) ve **Memory Pools** (Bellek Havuzları) gibi katmanlı bir yapıdan oluşur.

{{< figure src="/images/software/gorunmeyenin-ardi-python-da-bellek-yonetimi-ve-garbage-collector-mekanizmalari.png" alt="Görünmeyenin Ardı: Python'da Bellek Yönetimi ve Garbage Collector Mekanizmaları" width="1200" caption="Şekil 1: Görünmeyenin Ardı: Python'da Bellek Yönetimi ve Garbage Collector Mekanizmaları" >}}

---

### 1. CPython Bellek Hiyerarşisi ve Katmanlı Yapı

Python’un standart implementasyonu olan CPython, belleği yönetmek için özelleşmiş bir hiyerarşi kullanır. Bu yapı, işletim sisteminden (OS) gelen ham belleğin verimli bir şekilde nesnelere paylaştırılmasını sağlar.

*   **Layer 0:** Ham bellekten sorumlu olan İşletim Sistemi.
*   **Layer 1:** C’nin standart `malloc` fonksiyonu gibi bellek tahsis edicileri.
*   **Layer 2 (The Object Allocator):** CPython'un kendi "Object Allocator" mekanizması. Burada 512 bayttan küçük nesneler için özelleşmiş bir yönetim uygulanır.
*   **Layer 3 (Object-specific Allocators):** Belirli veri türleri (örneğin `int`, `dict`, `list`) için optimize edilmiş tahsis ediciler.

Python, küçük nesnelerin sürekli olarak OS'den talep edilmesinin yaratacağı maliyeti (system call overhead) azaltmak için **Arenas**, **Pools** ve **Blocks** yapısını kullanır. Bir Arena genellikle 256 KB boyutundadır ve içinde 4 KB’lık Pool'lar barındırır. Bu hiyerarşi, bellek parçalanmasını (fragmentation) minimize eder.

---

### 2. Temel Mekanizma: Referans Sayımı (Reference Counting)

Python'da bir nesnenin ömrünü belirleyen ana unsur referans sayısıdır. Her nesne, kendisine kaç farklı değişkenin veya yapının işaret ettiğini tutan bir sayaç (`ob_refcnt`) barındırır.

**Nasıl Çalışır?**
1. Bir nesne oluşturulduğunda veya bir değişkene atandığında sayacı artar.
2. Nesneye olan bir referans silindiğinde (`del`) veya referans kapsam dışına (out of scope) çıktığında sayaç azalır.
3. Sayaç sıfıra ulaştığında, nesnenin kullandığı bellek derhal serbest bırakılır.

```python
import sys

# Nesne oluşturma
a = [1, 2, 3]
print(sys.getrefcount(a))  # Çıktı: 2 (Biri 'a', diğeri fonksiyona giren kopya)

b = a
print(sys.getrefcount(a))  # Çıktı: 3

del b
print(sys.getrefcount(a))  # Çıktı: 2
```

**Referans Sayımının Avantajı:** Gerçek zamanlıdır. Nesne artık ihtiyaç duyulmadığı an bellekten silinir.
**Dezavantajı:** "Reference Cycles" (Döngüsel Referanslar) durumunda yetersiz kalır.

---

### 3. Döngüsel Referanslar ve Garbage Collector (GC)

İki veya daha fazla nesne birbirine referans veriyorsa, bu nesnelerin referans sayıları asla sıfıra düşmez. Bu durum, bellek sızıntısına yol açar. Python bu sorunu çözmek için **Garbage Collector (GC)** modülünü kullanır.

```python
class Node:
    def __init__(self):
        self.cycle = None

x = Node()
y = Node()
x.cycle = y
y.cycle = x

del x
del y
# Nesneler birbirini tuttuğu için bellekten silinmezler!
```



GC, periyodik olarak çalışarak bu döngüleri tespit eder ve referans sayılarını simüle ederek hangilerinin "erişilemez" (unreachable) olduğunu belirler.

---

### 4. Nesilsel Çöp Toplama (Generational Collection) Kavramı

GC'nin her seferinde tüm nesneleri taraması performans açısından çok maliyetlidir. Python, "genç nesnelerin ölme ihtimali daha yüksektir" hipotezine (Weak Generational Hypothesis) dayanarak nesneleri üç kuşağa ayırır:

1.  **Generation 0 (Gen 0):** Yeni oluşturulan tüm nesneler buraya dahil edilir. En sık tarama bu kuşakta yapılır.
2.  **Generation 1 (Gen 1):** Gen 0 taramasından kurtulan (hayatta kalan) nesneler buraya aktarılır.
3.  **Generation 2 (Gen 2):** En uzun ömürlü nesnelerin bulunduğu kuşaktır. Nadiren taranır.

Her kuşağın bir **eşik değeri (threshold)** vardır. Gen 0'daki nesne sayısı eşiği aştığında, GC tetiklenir.



---

### 5. `gc` Modülü ile Manuel Müdahale ve İnce Ayar

Geliştiriciler, Python’un otomatik bellek yönetimini `gc` kütüphanesi üzerinden optimize edebilirler.

*   `gc.collect()`: Çöp toplayıcıyı manuel olarak tetikler.
*   `gc.set_threshold(threshold0, threshold1, threshold2)`: Kuşakların tarama sıklığını ayarlar.
*   `gc.disable()`: Otomatik toplamayı kapatır (Çok yüksek performanslı, döngü barındırmayan kodlarda kullanılır).

**Teknik Not:** Özellikle büyük veri setleriyle çalışırken veya binlerce küçük nesne oluşturulup silindiğinde, GC eşiklerini artırmak performansı iyileştirebilir.

---

### 6. Bellek Yönetiminde "Slots" Kullanımı: `__slots__`

Python'da sınıflar varsayılan olarak bir sözlük (`__dict__`) kullanır. Sözlükler esnektir ancak bellek tüketimi yüksektir. Milyonlarca nesne oluşturulacaksa `__slots__` yapısı kullanılmalıdır.

```python
class EfficientPoint:
    __slots__ = ['x', 'y']  # Sözlük yerine sabit boyutlu dizi kullanılır
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

`__slots__` kullanıldığında, her nesne için bir sözlük oluşturulmaz, bu da nesne başına bellek kullanımını ciddi oranda düşürür.

---

### 7. Mutable ve Immutable Nesne Ayrımı

Bellek yönetiminde nesnelerin türü de kritik önem taşır:
*   **Immutable (Değiştirilemez):** `int`, `str`, `tuple`. Python, küçük tam sayılar (-5 ile 256 arası) gibi sık kullanılan nesneleri bellekten silmez, "interning" yöntemiyle bunları tekrar kullanır.
*   **Mutable (Değiştirilebilir):** `list`, `dict`, `set`. Bu nesneler her seferinde yeni bellek alanı talep eder.

---

### 8. Bellek Analizi İçin Araçlar ve Kütüphaneler

Kodunuzun bellek ayak izini ölçmek için aşağıdaki kütüphaneler endüstri standardıdır:

1.  **`tracemalloc`:** Python ile birlikte gelir. Bellek tahsisatlarının nerede yapıldığını satır satır gösterir.
2.  **`objgraph`:** Nesneler arasındaki referans grafiklerini görselleştirir. Döngüsel referansları bulmak için idealdir.
3.  **`memory_profiler`:** Fonksiyon bazlı bellek kullanımını zaman serisi olarak raporlar.

```python
import tracemalloc

tracemalloc.start()

# İzlenecek kod bloğu
# ...

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')

for stat in top_stats[:10]:
    print(stat)
```

---

### 9. Önemli Notlar ve En İyi Pratikler

*   **Global Değişkenlerden Kaçının:** Global değişkenler program sonlanana kadar referans sayıları sıfırlanmadığı için bellekte kalırlar. Verileri fonksiyonel kapsamda tutun.
*   **`with` Bloklarını Kullanın:** Dosya veya network soketleri gibi kaynaklar `with` bloğu ile kapatıldığında, onlara bağlı nesnelerin referansları daha hızlı temizlenir.
*   **Büyük Verilerde `Generator` Tercih Edin:** Bir listenin tamamını belleğe yüklemek yerine `yield` anahtar kelimesini kullanarak veriyi akış (stream) halinde işleyin.
*   **Circular Reference Riskine Dikkat:** Özellikle callback fonksiyonları ve karmaşık sınıf ilişkilerinde `weakref` (zayıf referans) kütüphanesini kullanarak referans sayısını artırmadan nesnelere erişebilirsiniz.

### Sonuç

Python'un bellek yönetimi, esneklik ve performans arasındaki dengeyi korumak üzere tasarlanmıştır. Referans sayımı hızlı ve etkilidir, ancak döngüsel referanslar gibi uç durumlar için nesilsel GC mekanizması devreye girer. Geliştirici olarak bu katmanları bilmek, sadece daha hızlı kod yazmanızı sağlamaz, aynı zamanda sistem kaynaklarını verimli kullanan, ölçeklenebilir mimariler kurmanıza olanak tanır. Python'da bellek yönetimi "görünmez" olsa da, etkisi her zaman hissedilir.