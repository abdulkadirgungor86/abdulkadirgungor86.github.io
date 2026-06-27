---
title: "JIT (Just-In-Time) Kompilasyon Süreci: Kodun Makine Dilinde Optimize Edilmesi"
date: 2026-03-28
type: "software"
draft: false
math: true
description: "Modern çalışma zamanı mimarilerinde performans optimizasyonunun kalbi olan JIT derleme sürecinin, \"Hot Spot\" analizi ve düşük seviyeli makine kodu dönüşüm mekanizmalarını derinlemesine inceleyen teknik bir yazıdır."
featured_image: "/images/software/jit-(just-in-time)-kompilasyon-sureci-kodun-makine-dilinde-optimize-edilmesi.png"
tags: ["yazilim", "software", "yazilim-performansi", "jit-derleme", "low-level-programming", "v8-engine", "makine-dili", "bytecode"]
---

Yazılım dünyasında performansın zirvesini temsil eden **JIT (Just-In-Time) Kompilasyon**, yorumlanan (interpreted) dillerin esnekliği ile derlenen (compiled) dillerin hızını birleştiren hibrit bir mekanizmadır. Modern çalışma zamanı (runtime) ortamlarında, özellikle **JVM (Java Virtual Machine)**, **.NET CLR (Common Language Runtime)** ve **V8 Engine** gibi yapılarda JIT derleyiciler, kodun execution (yürütme) safhasında makine diline dönüştürülmesini ve işlemci mimarisine göre optimize edilmesini sağlar.

{{< figure src="/images/software/jit-(just-in-time)-kompilasyon-sureci-kodun-makine-dilinde-optimize-edilmesi.png" alt="JIT (Just-In-Time) Kompilasyon Süreci: Kodun Makine Dilinde Optimize Edilmesi" width="1200" caption="Şekil 1: JIT (Just-In-Time) Kompilasyon Süreci: Kodun Makine Dilinde Optimize Edilmesi." >}}

---

## 1. JIT Kompilasyonun Teorik Temelleri ve İşleyiş Mantığı

Geleneksel derleyiciler (AOT - Ahead-of-Time), kaynak kodu hedef mimari için bir kez derler ve ortaya çıkan binary (ikili) dosya doğrudan çalıştırılır. Ancak JIT mimarisinde süreç daha dinamiktir. Kod, önce platform bağımsız bir ara dile (Intermediate Representation - IR) çevrilir.

### Çevrim Aşamaları:
1.  **Source Code:** Programcının yazdığı yüksek seviyeli kod.
2.  **Bytecode / CIL:** Derleyicinin (javac, msc vb.) ürettiği taşınabilir ara form.
3.  **JIT Compilation:** Çalışma zamanında, sıcak (hot) kod bloklarının tespiti ve makine koduna çevrimi.
4.  **Native Code:** İşlemcinin doğrudan yürütebileceği $0$ ve $1$ dizileri.



---

## 2. Profiling ve "Hot Spot" Analizi

JIT derleyiciler her satırı derlemez. Bu, başlangıç süresini (startup time) gereksiz yere uzatır. Bunun yerine **Adaptive Optimization** tekniği kullanılır. Çalışma zamanında bir "profiler", hangi fonksiyonların en çok çağrıldığını veya hangi döngülerin (loops) en çok CPU zamanı tükettiğini izler. Bu bölgelere **"Hot Spots"** denir.

*   **Interpretation:** Kod ilk aşamada yavaşça yorumlanır.
*   **Tiered Compilation:** İlk olarak hızlı ama az optimize edilmiş bir derleme (C1 compiler) yapılır. Eğer kod "sıcak" kalmaya devam ederse, daha agresif optimizasyonların yapıldığı ikinci aşamaya (C2 compiler) geçilir.

---

## 3. İleri Düzey Optimizasyon Teknikleri

JIT derleyicilerin AOT derleyicilere göre en büyük avantajı, **çalışma zamanı verilerine** sahip olmasıdır. Bu verilerle şu teknikler uygulanır:

### 3.1. Inlining (Satır İçi Genişletme)
Küçük ve sık çağrılan fonksiyonların gövdesi, çağrıldıkları noktaya doğrudan kopyalanır. Bu sayede fonksiyon çağrısı (call stack) maliyeti ve dallanma (branching) gecikmeleri ortadan kalkar.

### 3.2. Dead Code Elimination
Hiçbir zaman çalışmayacak olan kod blokları veya sonucu kullanılmayan hesaplamalar tespit edilerek makine kodundan çıkarılır.

### 3.3. Loop Unrolling (Döngü Açma)
Döngü içindeki iterasyonlar, dallanma tahmincilerini (branch predictors) yormamak için ardışık komutlar haline getirilir.

### 3.4. Escape Analysis
Eğer bir nesne (object) sadece bir metodun içinde yaşıyorsa ve dışarı sızmıyorsa (leak), JIT bu nesneyi "Heap" yerine "Stack" üzerinde oluşturabilir veya tamamen registerlara (yazmaçlara) dağıtabilir. Bu, **Garbage Collector (GC)** yükünü dramatik şekilde azaltır.

---

## 4. Uygulamalı Kod Analizi ve Bytecode Dönüşümü

Bir Java metodunun JIT tarafından nasıl ele alındığını inceleyelim:

```java
public class MathEngine {
    public int multiply(int a, int b) {
        return a * b;
    }

    public void processData(int[] data) {
        for (int i = 0; i < data.length; i++) {
            // Hot Spot: Sık çağrılan toplama işlemi
            int result = multiply(data[i], 2);
            data[i] = result;
        }
    }
}
```

Yukarıdaki kodun bytecode karşılığı (Intermediate Representation) yaklaşık olarak şöyledir:

```bytecode
0: aload_0
1: getfield      #2  // data array
4: arraylength
5: istore_2
6: iconst_0
7: istore_3
8: iload_3
9: iload_2
10: if_icmpge     28
...
15: invokevirtual #3  // multiply metodunu çağır
...
```

JIT, `invokevirtual` komutunu gördüğünde ve bu döngünün binlerce kez çalıştığını fark ettiğinde, `multiply` metodunu **inline** eder. Sonuç olarak işlemciye gönderilen makine kodu şu mantığa bürünür:
`data[i] = data[i] << 1;` (Çarpma yerine bit kaydırma optimizasyonu).

---

## 5. Modern JIT Motorları ve Kütüphaneler

### V8 Engine (JavaScript & WebAssembly)
V8, "Hidden Classes" ve "Inline Caching" kullanarak dinamik tiplemeli JavaScript'i makine hızına yaklaştırır. **Ignition** interpreter ve **TurboFan** optimizer katmanları ile çalışır.

### GraalVM
Java dünyasında devrim yaratan Graal, JIT derleyicinin kendisini Java ile yazar. **Truffle Framework** sayesinde Ruby, Python ve R gibi dilleri de JVM üzerinde yüksek performansla çalıştırabilir.

### LLVM (Low Level Virtual Machine)
Kendi JIT motorunu (LLVM ORC) sunar. Özellikle veri bilimi kütüphanelerinde (örneğin **Numba**), Python kodunu LLVM IR üzerinden makine koduna derlemek için kullanılır.

---

## 6. JIT vs. AOT: Kritik Karşılaştırma

| Özellik | JIT (Just-In-Time) | AOT (Ahead-of-Time) |
| :--- | :--- | :--- |
| **Derleme Zamanı** | Çalışma anı (Runtime) | Dağıtım öncesi (Build time) |
| **Bellek Kullanımı** | Daha yüksek (Derleyici RAM'de durur) | Daha düşük |
| **Optimizasyon** | Dinamik (PGO - Profile Guided) | Statik |
| **Platform Bağımsızlığı** | Yüksek (Bytecode taşınabilir) | Düşük (Binary hedef odaklıdır) |

---

## 7. Donanım Seviyesinde Etki: Register Allocation

JIT derleyiciler, makine kodu üretirken hedef işlemcinin (x86_64, ARM64, RISC-V) kaç adet register'a sahip olduğunu bilir. Değişkenleri belleğe (RAM) yazmak yerine bu register'lara yerleştirerek **L1 Cache** hızında işlem yapılmasını sağlar.

Özellikle **SIMD (Single Instruction, Multiple Data)** komut setlerini (AVX-512 gibi) kullanarak, bir döngü içindeki birden fazla veriyi tek bir CPU çevriminde işleyebilir (Vectorization).

---

## 8. Teknik Notlar ve Uygulama Stratejileri

> **Not 1: Warm-up Period (Isınma Süresi):**
> JIT kullanan sistemlerde uygulama ilk açıldığında yavaştır. Bunun sebebi kodun henüz yorumlanıyor olmasıdır. Yüksek trafikli sistemlerde "Warm-up" scriptleri ile JIT'in önemli metotları derlemesi sağlanmalıdır.

> **Not 2: Deoptimization (Geri Optimizasyon):**
> Eğer JIT, bir değişkenin her zaman `Integer` olacağını varsayıp kodu derlerse ama çalışma anında oraya bir `String` gelirse, JIT "Bailout" yapar. Derlenmiş kodu iptal eder, yoruma geri döner ve yeniden derleme başlatır. Bu durum performans kaybına yol açar (Polymorphic inline cache misses).

---

## 9. Sonuç ve Gelecek Projeksiyonu

JIT teknolojisi, günümüzde sadece dillerin hızlanmasını sağlamıyor, aynı zamanda bulut bilişim maliyetlerini de düşürüyor. Daha az CPU döngüsü ile daha çok iş yapabilen optimize edilmiş kodlar, sunucu tarafındaki enerji tüketimini minimize ediyor. Gelecekte, makine öğrenmesi destekli JIT derleyicilerin (ML-driven compilers), kodun akışını önceden tahmin ederek henüz "hot spot" oluşmadan optimizasyon yapması beklenmektedir.

Özellikle **WebAssembly (WASM)** tarafındaki gelişmeler, tarayıcı içinde JIT performansını native seviyelere çekerek masaüstü uygulamaları ile web uygulamaları arasındaki çizgiyi tamamen ortadan kaldırmaktadır. Yazılım mimarlarının, kullandıkları platformun JIT davranışlarını (Inlining limitleri, heap stratejileri vb.) anlaması, yüksek ölçekli sistemlerin tasarımı için bir zorunluluktur.