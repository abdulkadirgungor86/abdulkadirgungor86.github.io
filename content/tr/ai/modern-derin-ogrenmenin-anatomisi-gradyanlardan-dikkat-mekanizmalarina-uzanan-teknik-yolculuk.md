---
title: "Modern Derin Öğrenmenin Anatomisi: Gradyanlardan Dikkat Mekanizmalarına Uzanan Teknik Yolculuk"
date: 2026-04-23
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 9-] Derin öğrenmenin temelini oluşturan backpropagation, CNN ve attention mekanizmalarının matematiksel arka planını, optimizasyon algoritmalarını ve modern mimari yapılarını teknik bir yazıdır."
featured_image: "/images/ai/modern-derin-ogrenmenin-anatomisi-gradyanlardan-dikkat-mekanizmalarina-uzanan-teknik-yolculuk.png"
tags: ["ai", "veri-analizi-okulu","vao", "python", "back-propagation", "cnn", "transformer", "attention-mechanism", "pytorch", "makine-ogrenmesi"]
---

Yapay zekâ dünyasında son on yılda yaşanan devrim, aslında matematiksel optimizasyonun, lineer cebirin ve donanım kabiliyetlerinin mükemmel bir senkronizasyonla bir araya gelmesinin sonucudur. Derin öğrenme, sadece çok katmanlı sinir ağlarından ibaret değildir; o, veriyi temsil etme biçimimizi kökten değiştiren bir mühendislik sanatıdır. 

{{< figure src="/images/ai/modern-derin-ogrenmenin-anatomisi-gradyanlardan-dikkat-mekanizmalarina-uzanan-teknik-yolculuk.png" alt="Modern Derin Öğrenmenin Anatomisi: Gradyanlardan Dikkat Mekanizmalarına Uzanan Teknik Yolculuk" width="1200" caption="Şekil 1: Modern Derin Öğrenmenin Anatomisi: Gradyanlardan Dikkat Mekanizmalarına Uzanan Teknik Yolculuk" >}}

---

## 1. Lineer Sınıflandırmadan Çok Katmanlı Yapılara Geçiş

Her şey, girdi vektörlerini ağırlık matrisleriyle çarparak bir skor elde ettiğimiz basit bir lineer denklemle başlar. Matematiksel olarak ifade edersek, bir girdi vektörü $x$ için skor $f(x, W) = Wx + b$ şeklinde hesaplanır. Burada $W$ ağırlık matrisini, $b$ ise sapma (bias) terimini temsil eder.

Ancak gerçek dünyadaki veriler nadiren lineer olarak ayrılabilir. XOR problemi gibi en temel mantıksal işlemlerde bile lineer modeller yetersiz kalır. Bu noktada devreye **Aktivasyon Fonksiyonları** girer. Aktivasyon fonksiyonları, ağa "non-linearity" (doğrusallık dışı özellik) katarak evrensel yaklaşım teorisinin (Universal Approximation Theorem) gerçekleşmesini sağlar.

### Temel Aktivasyon Fonksiyonları ve Kod Karşılıkları

* **ReLU (Rectified Linear Unit):** Hesaplama maliyeti en düşük ve en yaygın fonksiyondur. Negatif değerleri sıfırlar, pozitifleri olduğu gibi bırakır.
* **Sigmoid:** Çıktıyı $[0, 1]$ arasına sıkıştırır, ancak derin ağlarda "vanishing gradient" (gradyan yok olması) problemine yol açabilir.
* **Leaky ReLU:** ReLU'nun negatif bölgedeki "ölü nöron" sorununu çözmek için küçük bir eğim ($0.01x$) ekler.

```python
import numpy as np

def relu(x):
    return np.maximum(0, x)

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def leaky_relu(x, alpha=0.01):
    return np.where(x > 0, x, x * alpha)

```

---

## 2. Derin Öğrenmenin Motoru: Backpropagation ve Otomatik Diferansiyel

Bir modelin "öğrenmesi", aslında tahmin hatasını (Loss) minimize eden ağırlık parametrelerini bulmasıdır. Bu süreç, zincirleme türev kuralına (Chain Rule) dayanan **Backpropagation** ile yönetilir.

İleri yayılımda (Forward Pass) veriler katmanlar boyunca akar ve bir kayıp değeri hesaplanır. Geri yayılımda ise bu kaybın her bir ağırlığa göre kısmi türevi alınır. Bu türev, o parametrenin hataya ne kadar katkıda bulunduğunu gösteren bir "vektör alanı" oluşturur.

$$ \frac{\partial Loss}{\partial w} = \frac{\partial Loss}{\partial y} \cdot \frac{\partial y}{\partial z} \cdot \frac{\partial z}{\partial w} $$

Modern kütüphaneler (PyTorch, TensorFlow), bu türev hesaplamalarını **Computational Graph** (Hesaplama Çizgesi) üzerinden otomatik olarak gerçekleştirir.

---

## 3. Optimizasyon Stratejileri: Daha Hızlı ve Kararlı Öğrenme

Gradyan inişi (Gradient Descent) temel bir yöntem olsa da, devasa veri setlerinde yerel minimumlara takılma veya aşırı yavaş ilerleme gibi sorunlar yaşatır. Bu nedenle çeşitli optimizasyon algoritmaları geliştirilmiştir.

### Başlıca Optimizasyon Teknikleri

1. **SGD (Stochastic Gradient Descent):** Her adımda tüm veri yerine küçük bir parça (batch) kullanır. Gürültülüdür ancak hız kazandırır.
2. **Momentum:** Fizikteki ivme kavramını kullanarak gradyanın önceki yönünü hatırlar. Bu, "sallantıları" azaltır ve düz alanlarda hızlanır.
3. **Adam (Adaptive Moment Estimation):** Hem momentumu hem de gradyanın karesinin hareketli ortalamasını (RMSProp) kullanır. Günümüzde standart kabul edilir.

```python
# PyTorch üzerinde Adam Optimizasyon örneği
import torch.optim as optim

model = MyNeuralNetwork()
optimizer = optim.Adam(model.parameters(), lr=0.001, betas=(0.9, 0.999))

# Eğitim döngüsü içinde
optimizer.zero_grad()   # Gradyanları sıfırla
loss = criterion(output, target)
loss.backward()         # Geri yayılım
optimizer.step()        # Parametreleri güncelle

```

---

## 4. Görsel Verinin Mimarı: Konvolüsyonel Sinir Ağları (CNN)

CNN'ler, görüntüdeki mekansal hiyerarşiyi korumak üzere tasarlanmıştır. Geleneksel tam bağlantılı katmanların (Fully Connected) aksine, CNN'ler **filtreler** (kernel) kullanarak yerel özellikleri öğrenir.

* **Convolution (Evrişim):** Bir filtrenin görüntü üzerinde kaydırılarak özellik haritaları (feature maps) oluşturmasıdır.
* **Pooling (Havuzlama):** Verinin boyutunu azaltır (genelde Max Pooling kullanılır) ve modelin küçük kaymalara karşı dayanıklı olmasını sağlar.

CNN'ler ilk katmanlarda kenar ve köşe gibi basit geometrik şekilleri, derinleştikçe ise nesne parçalarını ve karmaşık yapıları öğrenir.

---

## 5. Modern Yapay Zekanın Zirvesi: Attention ve Transformer

Doğal dil işleme (NLP) ve artık görüntü işleme (Vision Transformers) alanını domine eden yapı **Attention** mekanizmasıdır. RNN'lerin (Recurrent Neural Networks) aksine, Attention mekanizması tüm girdiyi aynı anda görür ve hangi parçanın diğeriyle ne kadar ilişkili olduğunu matematiksel olarak hesaplar.

### QKV (Query, Key, Value) Mantığı

Attention süreci üç temel vektör üzerinden yürütülür:

* **Query (Sorgu):** Mevcut kelimenin neyi aradığı.
* **Key (Anahtar):** Diğer kelimelerin neler sunduğu.
* **Value (Değer):** Gerçek bilgi içeriği.

Dikkat skoru, Query ve Key vektörlerinin iç çarpımı (dot product) alınarak hesaplanır ve Softmax fonksiyonuyla normalize edilir:

$$ \text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V $$

### Multi-Head Attention ve Paralellik

Transformer mimarisi, bu süreci paralel olarak birçok kez (Multi-Head) gerçekleştirir. Bu sayede model, aynı cümle içindeki hem dilbilgisel ilişkileri hem de anlamsal bağlamları farklı "kafalarda" aynı anda öğrenebilir.

```python
# Temel bir Self-Attention mekanizması (PyTorch tarzı pseudocode)
import torch.nn.functional as F

def self_attention(query, key, value):
    d_k = query.size(-1)
    # Skorları hesapla
    scores = torch.matmul(query, key.transpose(-2, -1)) / np.sqrt(d_k)
    # Olasılık dağılımına çevir
    weights = F.softmax(scores, dim=-1)
    # Değerlerle çarp
    return torch.matmul(weights, value)

```

---

## 6. Eğitimde Stabilizasyon ve Regülarizasyon

Derin ağlar derinleştikçe eğitim zorlaşır. Bunu aşmak için kullanılan iki kritik teknik vardır:

1. **Batch Normalization:** Her katmanın girdisini normalize ederek gradyanların daha sağlıklı akmasını sağlar.
2. **Dropout:** Eğitim sırasında nöronların bir kısmını rastgele kapatarak modelin ezberlemesini (overfitting) engeller.

> **Teknik Not:** Büyük dil modellerinde (LLM) kullanılan **Layer Normalization**, batch boyutundan bağımsız çalıştığı için sıralı verilerde Batch Norm'a göre daha başarılı sonuçlar verir.

---

## 7. Donanım ve Ölçeklenebilirlik: GPU ve TPU Faktörü

Derin öğrenme algoritmaları, doğası gereği matris çarpımları üzerine kuruludur. Bir CPU, karmaşık mantıksal işlemleri sırayla yapmakta usta olsa da, binlerce küçük matris çarpımını aynı anda yapmak için tasarlanmamıştır. **GPU (Graphics Processing Unit)** ve Google tarafından geliştirilen **TPU (Tensor Processing Unit)**, binlerce çekirdeğiyle bu paralel işlemleri milisaniyeler içinde tamamlayarak derin öğrenmenin bugünkü hızına ulaşmasını sağlamıştır.

CUDA (NVIDIA) ve ROCm (AMD) gibi kütüphaneler, yazılımcıların doğrudan grafik işlemci üzerinde tensör operasyonları yapmasına olanak tanır.

---

## Sonuç: Geleceğin Katmanları

Derin öğrenme; matematiksel zarafet, algoritmik verimlilik ve devasa işlem gücünün birleştiği bir noktadır. Backpropagation ile başlayan hata düzeltme yolculuğu, bugün milyarlarca parametreli Transformer modelleriyle insan seviyesinde metin ve görüntü üretimine evrilmiştir. Mühendislik perspektifinden bakıldığında, en karmaşık yapay zeka sistemi bile aslında doğru ayarlanmış ağırlıklar, optimize edilmiş gradyanlar ve dikkatli seçilmiş aktivasyon fonksiyonlarının bir bütünüdür.

Önümüzdeki dönemde, bu modellerin sadece "daha büyük" olması değil, aynı zamanda "daha verimli" (inference optimization) ve "daha açıklanabilir" (explainable AI) olması üzerine odaklanılacaktır. Derin öğrenmenin kalbi, verinin içindeki gizli desenleri keşfetmeye devam eden bu dinamik algoritmalarda atmaya devam ediyor.