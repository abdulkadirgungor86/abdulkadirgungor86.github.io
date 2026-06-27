---
title: "Yapay Sinir Ağları: Biyolojik İlhamdan Matematiksel Mimariye Yolculuk"
date: 2026-04-26
type: "ai"
draft: false
math: true
description: "Yapay sinir ağlarının biyolojik temellerini, ileri matematiksel mimarisini, backpropagation algoritmalarını ve derin öğrenme optimizasyon tekniklerini Python kod örnekleriyle detaylandıran teknik bir yazıdır."
featured_image: "/images/ai/yapay-sinir-aglari-biyolojik-ilhamdan-matematiksel-mimariye-yolculuk.png"
tags: ["ai","yapay-sinir-aglari", "derin-ogrenme", "python", "yapay-zeka-teknolojileri","nlp", "veri-bilimi", "makine-ogrenmesi"]
---

Yapay Sinir Ağları (Artificial Neural Networks - ANN), modern yapay zekanın kalbinde yer alan ve insan beyninin nörofizyolojik yapısını taklit ederek karmaşık veri setlerinden örüntü çıkarma yeteneğine sahip olan hesaplamalı modellerdir. Geleneksel algoritmalar belirli kural setlerine dayalıyken, sinir ağları veriyi deneyimleyerek öğrenir.

{{< figure src="/images/ai/yapay-sinir-aglari-biyolojik-ilhamdan-matematiksel-mimariye-yolculuk.png" alt="Yapay Sinir Ağları: Biyolojik İlhamdan Matematiksel Mimariye Yolculuk" width="1200" caption="Şekil 1: Yapay Sinir Ağları: Biyolojik İlhamdan Matematiksel Mimariye Yolculuk." >}}

---

## 1. Yapay Sinir Ağlarının Mimari Bileşenleri

Bir yapay sinir ağı, birbirine bağlı katmanlar ve bu katmanlar içindeki düğümlerden (nöronlar) oluşur. Bu yapı, bilginin akışını ve dönüşümünü yöneten bir "yönlü çizge" (directed graph) olarak düşünülebilir.

### Katman Yapıları

* **Girdi Katmanı (Input Layer):** Verinin ağa giriş yaptığı noktadır. Buradaki nöron sayısı, veri setindeki öznitelik (feature) sayısına eşittir.
* **Gizli Katmanlar (Hidden Layers):** Ağın asıl "öğrenme" işlemini gerçekleştirdiği, girdi verisi üzerindeki lineer olmayan dönüşümlerin yapıldığı katmanlardır. Katman sayısı arttıkça ağ "derinleşir" (Deep Learning).
* **Çıktı Katmanı (Output Layer):** Ağın nihai tahminini ürettiği katmandır. Regresyon problemlerinde genellikle tek bir nöron, sınıflandırma problemlerinde ise sınıf sayısı kadar nöron bulunur.

---

## 2. Tek Bir Nöronun Matematiği

Bir yapay nöron, kendisine gelen sinyalleri ağırlıklandırır ve bir toplama işlemine tabi tutar. Bu işlem şu formülle ifade edilir:

$$z = \sum_{i=1}^{n} (w_i \cdot x_i) + b$$

Burada;

* $x_i$: Girdi sinyali,
* $w_i$: Ağırlık (Weight - sinyalin önem derecesi),
* $b$: Sapma (Bias - modelin esnekliğini artıran sabit değer),
* $z$: Net girdi toplamıdır.

### Aktivasyon Fonksiyonları: Non-Lineerliğin Gücü

Eğer aktivasyon fonksiyonları olmasaydı, bir sinir ağı kaç katmanlı olursa olsun sadece lineer bir regresyon modeli olarak kalırdı. Aktivasyon fonksiyonları, ağa karmaşık yapıları öğrenme yeteneği kazandırır.

1. **Sigmoid:** Çıktıyı $[0, 1]$ arasına sıkıştırır. Gradyan yok olması (vanishing gradient) problemi nedeniyle modern derin ağlarda nadiren tercih edilir.

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$


2. **ReLU (Rectified Linear Unit):** Modern ağların standartıdır. Negatif değerleri sıfırlar, pozitifleri olduğu gibi iletir. Hesaplama maliyeti düşüktür.

$$f(z) = \max(0, z)$$


3. **Softmax:** Çok sınıflı sınıflandırma problemlerinde çıktı katmanında kullanılır. Çıktıların toplamını 1'e eşitleyerek olasılıksal bir dağılım sunar.

---

## 3. Eğitim Süreci: Forward ve Backpropagation

Bir sinir ağının eğitilmesi, hata fonksiyonunu (Loss Function) minimize edecek ağırlık ($w$) ve sapma ($b$) değerlerinin bulunması sürecidir.

### İleri Yayılım (Forward Propagation)

Veri girdi katmanından girer, ağırlıklarla çarpılır, aktivasyon fonksiyonlarından geçer ve çıktı katmanına ulaşır. Burada bir tahmin ($\hat{y}$) üretilir.

### Hata Hesaplama (Loss Calculation)

Tahmin edilen değer ile gerçek değer arasındaki fark hesaplanır. Popüler fonksiyonlar:

* **MSE (Mean Squared Error):** Regresyon için.
* **Cross-Entropy Loss:** Sınıflandırma için.

### Geri Yayılım (Backpropagation) ve Gradyan İnişi (Gradient Descent)

Hata, zincir kuralı (chain rule) kullanılarak ağın sonundan başına doğru dağıtılır. Her bir ağırlığın hataya ne kadar katkıda bulunduğu (türev/gradyan) hesaplanır.

Ağırlık güncelleme formülü:


$$w_{new} = w_{old} - \eta \cdot \frac{\partial L}{\partial w}$$


Burada $\eta$ (learning rate), öğrenme hızını temsil eder.

---

## 4. Python ile Teknik Uygulama: MNIST Rakam Sınıflandırma

Aşağıdaki kod bloğu, `TensorFlow/Keras` kütüphanesi kullanarak 60.000 el yazısı rakamdan oluşan MNIST veri setini eğiten derin bir sinir ağı mimarisini temsil eder.

```python
import tensorflow as tf
from tensorflow.keras import layers, models

def build_deep_model():
    # Model mimarisinin tanımlanması
    model = models.Sequential([
        # 28x28 piksellik resmi düzleştirme (784 giriş)
        layers.Flatten(input_shape=(28, 28)),
        
        # İlk gizli katman: 128 nöron, ReLU aktivasyonu
        layers.Dense(128, activation='relu'),
        # Aşırı öğrenmeyi engellemek için Dropout (Rastgele nöron kapatma)
        layers.Dropout(0.2),
        
        # İkinci gizli katman: 64 nöron
        layers.Dense(64, activation='relu'),
        
        # Çıktı katmanı: 10 rakam (0-9) için Softmax
        layers.Dense(10, activation='softmax')
    ])

    # Modelin derlenmesi (Optimizer ve Loss seçimi)
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    
    return model

# Veri setinin yüklenmesi
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0  # Normalizasyon

model = build_deep_model()
# Eğitim süreci
model.fit(x_train, y_train, epochs=10, batch_size=32, validation_split=0.1)

# Performans değerlendirme
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test Doğruluğu: {test_acc:.4f}")

```

---

## 5. Doğal Dil İşleme (NLP) ve Duygu Analizi

Metin verileri doğası gereği yapılandırılmamıştır. ANN'ler metni işlemek için kelimeleri yüksek boyutlu vektörlere dönüştüren **Word Embeddings** (Kelime Gömme) tekniklerini kullanır.

### NLP'de Başarıyı Artıran İleri Teknikler

* **Tokenization & Lemmatization:** Kelimelerin köklerine inilmesi ve metnin parçalara ayrılması.
* **Recurrent Neural Networks (RNN) & LSTM:** Verideki ardışık yapıyı (cümle akışını) korumak için kullanılır. Bellek hücreleri sayesinde uzun cümlelerdeki anlam bağını koparmazlar.
* **Attention Mechanism:** Modelin cümle içindeki en önemli kelimelere odaklanmasını sağlar.

---

## 6. Model Performansını Optimize Etme Stratejileri

Profesyonel bir yapay zeka mühendisi, modelin sadece eğitim verisinde değil, gerçek dünya verisinde de başarılı olmasını sağlamak için şu teknikleri uygular:

### Hiperparametre Optimizasyonu

* **Learning Rate (Öğrenme Hızı):** Çok yüksek olması modelin hedeften sapmasına, çok düşük olması ise eğitimin bitmemesine neden olur.
* **Batch Size:** Her güncellemede modele sunulan veri miktarıdır. Genellikle 32, 64 veya 128 seçilir.

### Regülarizasyon (Düzenlileştirme)

Ağın eğitim verisini ezberlemesini (Overfitting) engellemek için kullanılır:

* **L1/L2 Regularization:** Büyük ağırlık değerlerine ceza puanı keser.
* **Dropout:** Eğitim sırasında rastgele seçilen nöronların bağlantılarını koparır, böylece ağ belirli nöronlara bağımlı kalmaz.
* **Early Stopping:** Validasyon hatası artmaya başladığında eğitimi otomatik olarak durdurur.

---

## 7. Gerçek Dünya Uygulamaları ve Endüstriyel Kullanım

1. **Bilgisayarlı Görü (Computer Vision):** Otonom araçlarda nesne tespiti, tıbbi görüntülemede (MR, Röntgen) tümör teşhisi. Burada genellikle **CNN (Convolutional Neural Networks)** mimarileri kullanılır.
2. **Finansal Tahminleme:** Borsa hareketlerinin analizi ve kredi risk puanlaması.
3. **Öneri Sistemleri:** E-ticaret ve akış platformlarında (Netflix, Amazon) kullanıcı davranışına göre içerik sunulması.
4. **Biyometrik Güvenlik:** Yüz tanıma ve parmak izi eşleştirme sistemleri.

---

### Teknik Notlar

> **Not 1:** Derin öğrenme modelleri GPU (Grafik İşlem Birimi) üzerinde paralel hesaplama yaparak CPU'ya göre 10 ila 100 kat daha hızlı eğitilebilir.
> **Not 2:** Veri normalizasyonu ($[0, 1]$ veya $[-1, 1]$ arasına çekme), gradyan inişi algoritmasının çok daha hızlı yakınsamasını sağlar.
> **Not 3:** Transfer Learning tekniği ile, devasa veri setlerinde (ImageNet gibi) önceden eğitilmiş modelleri kendi küçük veri setiniz için özelleştirerek zaman ve kaynak tasarrufu sağlayabilirsiniz.

Yapay sinir ağları, sadece matematiksel bir formül yığını değil, verinin içindeki gizli hiyerarşiyi keşfeden dinamik bir mimaridir. Bugünün basit ANN yapıları, yarının genel yapay zekasına (AGI) giden yolda en temel yapı taşıdır.