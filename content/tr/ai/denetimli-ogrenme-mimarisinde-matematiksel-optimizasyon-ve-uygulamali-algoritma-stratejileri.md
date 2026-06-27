---
title: "Denetimli Öğrenme Mimarisinde Matematiksel Optimizasyon ve Uygulamalı Algoritma Stratejileri"
date: 2026-03-02
type: "ai"
draft: false
math: true
description: "Girdi-çıktı çiftlerinden oluşan etiketli veriler üzerinden bir eşleme fonksiyonu öğrenen ve bu sayede sürekli veya kategorik değerleri tahmin etmeyi amaçlayan matematiksel modelleme yöntemidir."
featured_image: "/images/ai/denetimli-ogrenme-mimarisinde-matematiksel-optimizasyon-ve-uygulamali-algoritma-stratejileri.png"
tags: ["ai","veri-muhendisligi", "denetimli-ogrenme", "supervised-learning", "algoritma", "python", "makine-ogrenmesi"]
---

Yapay zeka ve makine öğrenmesi evreninin temel taşını oluşturan **Denetimli Öğrenme (Supervised Learning)**, özünde bir fonksiyon yaklaşımı (function approximation) problemidir. Sistem, girdi vektörleri ($x$) ile hedef etiketler ($y$) arasındaki gizli ilişkiyi öğrenmek için yapılandırılmış veri setlerini kullanır. Bu süreçte temel amaç, eğitim verisindeki örüntüleri (patterns) yakalayarak, modelin daha önce hiç görmediği veriler üzerinde en düşük hata payı ile genelleme (generalization) yapmasını sağlamaktır.

{{< figure src="/images/ai/denetimli-ogrenme-mimarisinde-matematiksel-optimizasyon-ve-uygulamali-algoritma-stratejileri.png" alt="Denetimli Öğrenme Mimarisinde Matematiksel Optimizasyon ve Uygulamalı Algoritma Stratejileri" width="1200" caption="Şekil 1: Denetimli Öğrenme Mimarisinde Matematiksel Optimizasyon ve Uygulamalı Algoritma Stratejileri." >}}

---

### 1. Matematiksel Temeller ve Kayıp Fonksiyonları (Loss Functions)

Denetimli öğrenmenin kalbinde, modelin tahminleri ile gerçek değerler arasındaki farkı nicelleştiren **Kayıp Fonksiyonları** yer alır. Optimizasyon algoritmaları, bu fonksiyonun değerini minimize etmek için model parametrelerini (ağırlıklar ve sapmalar) günceller.

*   **Ortalama Kare Hata (MSE):** Regresyon problemlerinde en yaygın kullanılan metriktir. Hataların karesini alarak büyük sapmaları daha sert cezalandırır.
    $$MSE = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$
*   **Cross-Entropy (Log Loss):** Sınıflandırma problemlerinde, tahmin edilen olasılık dağılımı ile gerçek dağılım arasındaki farkı ölçer. Özellikle derin öğrenme modellerinde sigmoid veya softmax aktivasyonları ile birlikte kullanılır.

**Not:** Modelin sadece eğitim verisini "ezberlemesi" (overfitting) durumunu engellemek için **L1 (Lasso)** veya **L2 (Ridge)** regülarizasyon teknikleri kayıp fonksiyonuna dahil edilmelidir.

---

### 2. Regresyon Analizi: Sürekli Değişken Modelleme

Regresyon, nümerik ve sürekli verilerin tahmini için kritik bir disiplindir. Mühendislik hesaplamalarından finansal modellemeye kadar geniş bir yelpazede kullanılır.

#### İleri Seviye Yaklaşımlar:
1.  **Çoklu Doğrusal Regresyon:** Birden fazla bağımsız değişkenin bağımlı değişken üzerindeki etkisini ölçer.
2.  **Polinom Regresyon:** Veriler arasındaki ilişkinin doğrusal olmadığı, eğrisel bir yapıda olduğu durumlarda yüksek dereceli terimler eklenerek karmaşıklık artırılır.
3.  **Rastgele Orman (Random Forest) Regresyonu:** Karar ağaçlarının toplu (ensemble) bir şekilde çalıştırılmasıyla varyansı düşürür ve daha stabil sonuçlar verir.

#### Örnek Uygulama: Python ve Scikit-Learn ile Regresyon Modeli
Aşağıdaki kod bloğu, yapısal bir veri seti üzerinden regresyon analizi gerçekleştiren temel bir pipeline yapısını göstermektedir:

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# Sentetik veri seti oluşturma (Örn: Yük ve Yer Değiştirme)
data = {
    'load_kn': np.random.rand(100) * 1000,
    'material_elasticity': np.random.rand(100) * 200,
    'displacement_mm': np.random.rand(100) * 50
}
df = pd.DataFrame(data)

# Veriyi hazırlama
X = df[['load_kn', 'material_elasticity']]
y = df['displacement_mm']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Feature Scaling (Özellik Ölçeklendirme)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Modelin eğitimi
model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train_scaled, y_train)

# Tahmin ve Değerlendirme
predictions = model.predict(X_test_scaled)
print(f"MSE: {mean_squared_error(y_test, predictions)}")
print(f"R2 Score: {r2_score(y_test, predictions)}")
```

---

### 3. Sınıflandırma (Classification) ve Karar Sınırları

Sınıflandırma, veriyi önceden tanımlanmış diskret kategorilere atama işlemidir. Bu süreçte algoritma, sınıfları birbirinden ayıran en uygun **Karar Sınırını (Decision Boundary)** bulmaya çalışır.

#### Temel Algoritmalar ve Mekanizmalar:
*   **Lojistik Regresyon:** İsmi regresyon olsa da aslında bir sınıflandırma algoritmasıdır. Lojistik (sigmoid) fonksiyonunu kullanarak çıktıları 0 ile 1 arasında bir olasılık değerine sıkıştırır.
*   **Destek Vektör Makineleri (SVM):** Sınıflar arasındaki marjini (boşluğu) maksimize eden hiper-düzlemi bulur. "Kernel Trick" yöntemiyle doğrusal olmayan verileri yüksek boyutlu uzaylara taşıyarak sınıflandırabilir.
*   **XGBoost / LightGBM:** Gradyan artırma (Gradient Boosting) tabanlı bu kütüphaneler, zayıf öğrenicileri birleştirerek günümüzdeki en güçlü sınıflandırma performanslarını sergiler.

**Not:** Dengesiz veri setlerinde (imbalanced datasets) sadece doğruluk (accuracy) oranına bakmak yanıltıcı olabilir. Bu durumlarda **Precision (Kesinlik)**, **Recall (Duyarlılık)** ve **F1-Score** metrikleri üzerinden analiz yapılmalıdır.

---

### 4. Görüntü İşleme ve Derin Denetimli Öğrenme

Denetimli öğrenmenin en ileri aşaması, Evrişimli Sinir Ağları (CNN) kullanılarak yapılan görüntü sınıflandırma ve nesne tespitidir. Görüntüler piksel matrisleri olarak işlenir ve model, kenar, köşe veya doku gibi öznitelikleri (features) otomatik olarak hiyerarşik bir yapıda öğrenir.

#### Katman Mimarisi:
1.  **Convolutional Layer:** Filtreler aracılığıyla öznitelik haritaları oluşturur.
2.  **Pooling (Havuzlama):** Boyutsal indirgeme yaparak hesaplama yükünü azaltır ve modelin özniteliklere karşı konumsal toleransını artırır.
3.  **Fully Connected Layer:** Öğrenilen öznitelikleri sınıf etiketlerine bağlar.

#### Örnek Uygulama: TensorFlow/Keras ile Binary Sınıflandırma
Bir yapı elemanındaki çatlakların "kritik" veya "normal" olarak sınıflandırılması için kullanılan basit bir mimari:

```python
import tensorflow as tf
from tensorflow.keras import layers, models

def create_model():
    model = models.Sequential([
        # İlk evrişim katmanı
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
        layers.MaxPooling2D((2, 2)),
        
        # İkinci evrişim katmanı
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        
        # Düzleştirme ve Yoğun katmanlar
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.5), # Ezberlemeyi önlemek için
        layers.Dense(1, activation='sigmoid') # İkili sınıflandırma çıktısı
    ])
    
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    return model

crack_detector = create_model()
crack_detector.summary()
```

---

### 5. Yazılım Ekosistemi ve Kütüphane Seçimi

Modern yapay zeka projelerinde verimlilik, doğru araçların seçimine bağlıdır. Endüstri standartları haline gelmiş kütüphaneler şunlardır:

*   **Scikit-Learn:** Geleneksel makine öğrenmesi algoritmaları (SVM, Karar Ağaçları, Regresyon) ve veri ön işleme araçları için birincil tercihtir.
*   **PyTorch / TensorFlow:** Derin öğrenme, sinir ağları ve büyük ölçekli tensor hesaplamaları için GPU desteği sunan güçlü framework'lerdir.
*   **OpenCV:** Görüntü ön işleme, filtreleme ve bilgisayarlı görü projelerinde veri hazırlığı için vazgeçilmezdir.
*   **Pandas & NumPy:** Vektörel hesaplamalar, veri manipülasyonu ve matris işlemleri için temel altyapıyı sağlar.
*   **Matplotlib & Seaborn:** Veri dağılımı, korelasyon matrisleri ve model performans metriklerinin görselleştirilmesi için kullanılır.

---

### 6. Veri Hazırlığı ve Özellik Mühendisliği (Feature Engineering)

Bir denetimli öğrenme modelinin başarısı, beslendiği verinin kalitesiyle doğrudan ilişkilidir. Mühendislik perspektifinden veri hazırlama adımları şunları içermelidir:

1.  **Eksik Veri Yönetimi (Imputation):** Boş değerlerin ortalama, medyan veya regresyon tahminleri ile doldurulması.
2.  **Kategorik Kodlama (Encoding):** Metinsel sınıfların (örneğin: "Hasarlı", "Sağlam") sayısal değerlere (One-Hot Encoding veya Label Encoding) dönüştürülmesi.
3.  **Boyut İndirgeme (PCA):** Modelin karmaşıklığını azaltmak ve "boyutun laneti" (curse of dimensionality) etkisinden kurtulmak için temel bileşen analizinin uygulanması.

---

### 7. Hiperparametre Optimizasyonu

Algoritmaların varsayılan ayarları her zaman en iyi sonucu vermez. Modelin performansını zirveye taşımak için **Grid Search** veya **Randomized Search** yöntemleri kullanılarak hiperparametreler optimize edilmelidir. Örneğin bir SVM modelinde `C` parametresi (hata toleransı) ve `gamma` (karar sınırı eğriliği) değerlerinin hassas ayarı, modelin başarısını doğrudan etkiler.

**Son Not:** Denetimli öğrenme süreci doğrusal bir yol değil, bir döngüdür. Veri toplama, modelleme, test ve hata analizi adımları, hedeflenen metrikler sağlanana kadar tekrarlanmalıdır. Özellikle teknik projelerde, modelin sadece yüksek başarı göstermesi yeterli değildir; aynı zamanda **açıklanabilir (explainable AI)** olması, verilen kararların arkasındaki parametrik nedenlerin anlaşılması bakımından büyük önem taşır.