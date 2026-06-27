---
title: "Makine Öğrenmesinde İstatistiksel Yaklaşımlar ve Topluluk Yöntemlerinin Mühendislik Analizi"
date: 2026-04-21
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 7-] Bayesyen olasılık kuramı ve topluluk öğrenme yöntemlerini temel alan, Naive Bayes ve Random Forest algoritmalarının matematiksel derinliğini, model performans metrikleriyle analiz eden teknik bir yazıdır."
featured_image: "/images/ai/makine-ogrenmesinde-istatistiksel-yaklasimlar-ve-topluluk-yontemlerinin-muhendislik-analizi.png"
tags: ["ai", "veri-analizi-okulu","vao", "python","naive-bayes", "random-forest", "confusion-matrix", "python-kodlama", "istatistiksel-ogrenme", "algoritma-analiz", "makine-ogrenmesi"]
---

Yapay zeka ekosistemi, veriden anlam çıkarma sürecinde farklı matematiksel temellere dayanan algoritmalarla şekillenmektedir. Modern yazılım mimarilerinde derin öğrenme (Deep Learning) her ne kadar popüler olsa da, hesaplama maliyeti ve açıklanabilirlik (explainability) açısından klasik makine öğrenmesi algoritmaları hala endüstrinin bel kemiğini oluşturmaktadır. 

{{< figure src="/images/ai/makine-ogrenmesinde-istatistiksel-yaklasimlar-ve-topluluk-yontemlerinin-muhendislik-analizi.png" alt="Makine Öğrenmesinde İstatistiksel Yaklaşımlar ve Topluluk Yöntemlerinin Mühendislik Analizi" width="1200" caption="Şekil 1: Makine Öğrenmesinde İstatistiksel Yaklaşımlar ve Topluluk Yöntemlerinin Mühendislik Analizi." >}}

---

## 1. Naive Bayes ve Olasılıksal Sınıflandırmanın Matematiksel Temeli

Naive Bayes, temelini Thomas Bayes’in olasılık kuramından alan, özellikle yüksek boyutlu metinsel verilerde (NLP) yüksek performans gösteren bir algoritmadır. Algoritmanın ismindeki "Naive" (Saf/Safdil) ifadesi, özniteliklerin (features) birbirinden tamamen bağımsız olduğu varsayımından gelir. Mühendislik perspektifinden bakıldığında, bu varsayım gerçek hayatta her zaman tutmasa da (örneğin bir cümledeki kelimeler birbirine bağımlıdır), algoritmanın hesaplama hızını inanılmaz derecede artırır.

### Bayes Teoremi ve Koşullu Olasılık

Bayes teoremi, bir olayın gerçekleşme olasılığını, o olayla ilgili ön bilgilere (prior) dayanarak güncellenmiş bir olasılık (posterior) değerine dönüştürür:

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

Burada:

* **$P(A|B)$**: B olayı gerçekleştiğinde A’nın olma olasılığı (Posterior).
* **$P(B|A)$**: A olayı doğruyken B’nin gözlem olasılığı (Likelihood).
* **$P(A)$**: A’nın başlangıçtaki olasılığı (Prior).
* **$P(B)$**: Kanıtın toplam olasılığı (Evidence).

### Laplace Smoothing ve Sıfır Olasılık Problemi

Metin analizinde, eğitim setinde hiç görülmeyen bir kelime test setinde karşımıza çıktığında, çarpım halindeki olasılık zincirini sıfıra indirger. Bu sorunu aşmak için **Laplace Smoothing** yöntemi kullanılır. Her frekansa $+1$ eklenerek modelin genelleme yeteneği korunur.

**Python Uygulaması (Scikit-Learn):**

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Metin verisi için model boru hattı oluşturma
text_clf = Pipeline([
    ('vect', CountVectorizer()), # Kelime frekans vektörü
    ('clf', MultinomialNB(alpha=1.0)) # Laplace smoothing (alpha) içeren NB
])

corpus = ["Film çok estetik ve etkileyici", "Vakit kaybı bir yapım"]
labels = [1, 0] # 1: Pozitif, 0: Negatif

text_clf.fit(corpus, labels)

```

---

## 2. Karar Ağaçlarından Random Forest Mimarisine Geçiş

Karar ağaçları (Decision Trees), veriyi belirli eşik değerlerine göre dallara ayıran hiyerarşik yapılardır. Ancak tek bir karar ağacı, eğitim verisine aşırı uyum sağlama (**overfitting**) eğilimindedir. Bu noktada devreye giren **Random Forest**, "Bagging" (Bootstrap Aggregating) tekniğini kullanan bir topluluk algoritmasıdır.

### Karar Ağaçlarında Entropi ve Bilgi Kazancı

Bir düğümün (node) neye göre bölüneceğine **Information Gain** (Bilgi Kazancı) veya **Gini Impurity** karar verir. Matematiksel olarak entropi ($H$), sistemdeki belirsizliği temsil eder:

$$H(S) = -\sum_{i=1}^{c} p_i \log_2(p_i)$$

Random Forest, veri setinden rastgele örnekler seçer ve her ağaç için rastgele öznitelik alt kümeleri kullanarak binlerce farklı ağaç oluşturur. Sonuç ise bu ağaçların oylaması (classification) veya ortalaması (regression) ile belirlenir.

### Overfitting ve Budama Stratejileri

Ağaç derinliği ($max\_depth$) sınırlanmazsa, model gürültüyü (noise) öğrenmeye başlar.

* **Pre-pruning:** Ağaç oluşurken belirli bir derinlikte veya minimum örnek sayısında durdurulması.
* **Post-pruning:** Ağaç tamamlandıktan sonra hata oranını artırmayan dalların kesilmesi.

---

## 3. Topluluk Yöntemlerinde İleri Seviye: Gradient Boosting

Random Forest ağaçları paralel ve bağımsız olarak eğitirken, **Gradient Boosting** (GBM) ardışık bir yol izler. Her yeni ağaç, bir önceki ağacın yaptığı hataları (residual errors) minimize etmek üzere kurgulanır.

Mühendislik uygulamalarında sıklıkla tercih edilen **XGBoost**, **LightGBM** ve **CatBoost** gibi kütüphaneler, bu mantığın optimize edilmiş versiyonlarıdır. Özellikle yapılandırılmış (tabüler) verilerde, bu modeller çoğu zaman derin öğrenme modellerinden daha üstün performans sergiler.

---

## 4. Model Performans Analizi ve Karmaşıklık Matrisi

Bir modelin başarısını sadece "Accuracy" (Doğruluk) üzerinden değerlendirmek, özellikle dengesiz veri setlerinde (Imbalanced Data) büyük bir hatadır. Örneğin; 1000 kişilik bir grupta sadece 5 kişi hasta ise, modelin herkese "sağlıklı" demesi %99.5 doğruluk verir ama hiçbir hastayı tespit edemediği için medikal açıdan başarısızdır.

### Confusion Matrix Bileşenleri

* **True Positive (TP):** Doğru tahmin edilen pozitif durumlar.
* **False Positive (FP):** Yanlışlıkla pozitif denilen negatifler (Tip I Hata).
* **False Negative (FN):** Pozitif olanın kaçırılması (Tip II Hata).
* **True Negative (TN):** Doğru tahmin edilen negatif durumlar.

### Türetilmiş Metrikler

1. **Precision (Kesinlik):** Pozitif tahminlerin ne kadarının gerçekten doğru olduğu. Yanlış alarm (FP) maliyeti yüksekse önemlidir.

$$Precision = \frac{TP}{TP + FP}$$


2. **Recall (Duyarlılık):** Gerçek pozitiflerin ne kadarının yakalandığı. Bir durumu kaçırmanın (FN) maliyeti yüksekse (kanser teşhisi gibi) kritiktir.

$$Recall = \frac{TP}{TP + FN}$$


3. **F1-Score:** Precision ve Recall'un harmonik ortalamasıdır. Sınıf dengesizliği olan durumlarda en güvenilir metriktir.

---

## 5. Uygulama Mimarisi ve Kod Örneği

Aşağıdaki blokta, bir Random Forest modelinin eğitimi ve performansının detaylı metriklerle analiz edilmesini içeren kapsamlı bir Python örneği yer almaktadır.

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report, f1_score

# Sentetik veri seti oluşturma
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, weights=[0.9, 0.1], random_state=42)

# Eğitim ve test ayrımı
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Random Forest modelinin hiperparametre konfigürasyonu
model = RandomForestClassifier(
    n_estimators=100, 
    max_depth=10, 
    min_samples_split=5,
    class_weight='balanced', # Dengesiz veri setleri için ağırlıklandırma
    random_state=42
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Model değerlendirme
print("Karmaşıklık Matrisi:\n", confusion_matrix(y_test, y_pred))
print("\nDetaylı Rapor:\n", classification_report(y_test, y_pred))

```

---

## 6. Mühendislik Notları ve Mimari Karar Verme

Makine öğrenmesi projelerinde model seçimi, verinin yapısına ve iş gereksinimlerine göre değişir:

* **Veri Miktarı Az İse:** Naive Bayes gibi düşük varyanslı modeller tercih edilebilir.
* **Veri Boyutluluğu Yüksekse (NLP):** TF-IDF veya Word2Vec vektörleri ile Multinomial Naive Bayes kombinasyonu hız/performans dengesi sağlar.
* **Yorumlanabilirlik Gerekiyorsa:** Karar ağaçları veya lojistik regresyon, modelin neden bu kararı verdiğini görselleştirmek için idealdir.
* **Maksimum Performans Gerekiyorsa:** Hiperparametre optimizasyonu yapılmış (GridSearchCV veya Optuna ile) Random Forest veya Gradient Boosting modelleri kullanılmalıdır.

### Donanım ve Bellek Yönetimi Hakkında Notlar

Büyük veri setleriyle çalışırken bellek yönetimi (RAM) kritik hale gelir. Random Forest algoritması `n_jobs=-1` parametresi ile tüm CPU çekirdeklerini paralel olarak kullanabilir. Ancak ağaç derinliği kontrolsüz artarsa, modelin kapladığı alan (pickle dosyası boyutu) gigabaytlar seviyesine ulaşabilir. Bu durum, özellikle gömülü sistemlerde veya kısıtlı kaynaklara sahip sunucularda (Edge Computing) model dağıtımı yaparken göz önünde bulundurulmalıdır.

### Sonuç ve Değerlendirme

Makine öğrenmesi sadece bir algoritma seçimi değil, verinin istatistiksel dağılımını anlama ve bu dağılıma en uygun matematiksel modeli eşleme sanatıdır. Naive Bayes'in olasılık temelli yaklaşımı, Random Forest'ın topluluk gücü ve Confusion Matrix'in analitik derinliği, sağlam bir yapay zeka sisteminin temel taşlarını oluşturur. Gelişmiş Transformer modelleri her ne kadar büyük ölçekli problemlerde devrim yaratsa da, mühendislik disiplini her zaman "en karmaşık olanı" değil, "problemi en verimli çözen" aracı seçmeyi gerektirir.