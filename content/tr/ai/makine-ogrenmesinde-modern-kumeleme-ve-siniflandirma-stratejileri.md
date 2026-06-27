---
title: "Makine Öğrenmesinde Modern Kümeleme ve Sınıflandırma Stratejileri"
date: 2026-04-19
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 5-] Veri biliminde doğrusal sınıflandırma modellerinden K-means kümeleme algoritmalarına, model optimizasyonundan aşırı uyumu engelleyen regülarizasyon tekniklerine kadar uzanan kapsamlı ve teknik bir yazıdır."
featured_image: "/images/ai/makine-ogrenmesinde-modern-kumeleme-ve-siniflandirma-stratejileri.png"
tags: ["ai", "veri-analizi-okulu","vao", "python", "derin-ogrenme", "kmeans", "kumeleme", "siniflandirma", "lloyd-algoritmasi", "veri-bilimi", "makine-ogrenmesi"]
---

Yapay zeka ve veri bilimi ekosisteminde, ham verinin anlamlı bir içgörüye dönüştürülmesi süreci iki temel sütun üzerine inşa edilir: Denetimli (Supervised) ve denetimsiz (Unsupervised) öğrenme. Bu yazıda, doğrusal sınıflandırma modellerinden başlayarak, kümeleme algoritmalarının matematiksel derinliklerine, aşırı uyum (overfitting) problemlerinin regülarizasyon teknikleriyle çözümüne ve pratik Python uygulamalarına ele alınacaktır.

{{< figure src="/images/ai/makine-ogrenmesinde-modern-kumeleme-ve-siniflandirma-stratejileri.png" alt="Makine Öğrenmesinde Modern Kümeleme ve Sınıflandırma Stratejileri" width="1200" caption="Şekil 1: Makine Öğrenmesinde Modern Kümeleme ve Sınıflandırma Stratejileri." >}}

---

## Doğrusal Sınıflandırma ve Karar Sınırlarının Matematiği

Sınıflandırma, bir veri noktasının öznitelik vektörünü ($x$) girdi olarak alıp, önceden tanımlanmış bir ayrık etikete ($y$) eşleme sürecidir. En temel yaklaşım olan doğrusal sınıflandırmada, model bir "karar düzlemi" (decision hyperplane) oluşturur.

### Doğrusal Sinyal ve Aktivasyon

Bir doğrusal modelin kalbi, girdi özniteliklerinin ağırlıklı toplamı olan doğrusal sinyaldir. Matematiksel olarak şu şekilde ifade edilir:

$$z = \sum_{i=1}^{n} w_i x_i + b$$

Burada $w$ parametreleri her bir özelliğin karar üzerindeki etkisini (önem derecesini) belirlerken, $b$ (bias) terimi karar sınırının orijinden kaydırılmasını sağlar. Eğer veri kümesi "doğrusal ayrılabilir" (linearly separable) ise, **Perceptron Learning Algorithm (PLA)** gibi algoritmalar bu ağırlıkları mükemmel bir ayrım sağlayana kadar günceller. Ancak gerçek dünya verileri nadiren bu kadar temizdir. Gürültülü veya hafif iç içe geçmiş verilerde, hata payını minimize eden **Pocket Algorithm** devreye girer; bu algoritma eğitim süreci boyunca elde edilen en iyi ağırlık setini hafızasında ("cebinde") tutar.

### Doğrusal Olmayan Dönüşümler

Veri seti dairesel veya karmaşık bir yapıdaysa, doğrusal modeller doğrudan başarısız olur. Bu noktada **Kernel Trick** veya öznitelik mühendisliği ile veriyi daha yüksek boyutlu bir uzaya taşımak gerekir. Örneğin, iki boyutlu düzlemde ayrılamayan veriler, $x^2 + y^2$ gibi dönüşümlerle üçüncü bir boyuta taşındığında bir düzlemle kesilebilir hale gelir.

---

## Denetimsiz Öğrenme ve Kümeleme Mimarisi

Sınıflandırmanın aksine kümeleme, verinin etiketlenmediği durumlarda gizli yapıları keşfetmek için kullanılır. Temel amaç, **küme içi benzerliği (intra-cluster similarity)** maksimize ederken, **kümeler arası benzerliği (inter-cluster similarity)** minimize etmektir.

### Lloyd Algoritması ve K-Means Mekanizması

K-Means, iteratif bir yer değiştirme algoritmasıdır ve genellikle Lloyd Algoritması ile eş anlamlı kullanılır. Algoritma şu optimizasyon problemini çözmeye çalışır:

$$J = \sum_{j=1}^{k} \sum_{x \in C_j} ||x - \mu_j||^2$$

Burada $\mu_j$, $j$. kümenin merkezidir (centroid). Süreç şu şekilde işler:

1. **Atama Adımı:** Her veri noktası, kendisine en yakın olan merkeze atanır (Öklid mesafesi kullanılır).
2. **Güncelleme Adımı:** Kümelerin merkezleri, o kümeye atanan tüm noktaların aritmetik ortalaması alınarak yeniden hesaplanır.

### Python ile K-Means Uygulaması

Aşağıdaki kod bloğu, `scikit-learn` kütüphanesi kullanarak sentetik bir veri seti üzerinde kümeleme işlemini gerçekleştirmekte ve görselleştirmektedir:

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

# Sentetik veri seti oluşturma
X, y = make_blobs(n_samples=500, centers=4, cluster_std=0.60, random_state=0)

# K-Means modelini eğitme
kmeans = KMeans(n_clusters=4, init='k-means++', max_iter=300, n_init=10)
y_kmeans = kmeans.fit_predict(X)

# Görselleştirme
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, s=50, cmap='viridis')
centers = kmeans.cluster_centers_
plt.scatter(centers[:, 0], centers[:, 1], c='red', s=200, alpha=0.75, marker='X')
plt.title("K-Means Kümeleme Sonuçları")
plt.show()

```

---

## Model Optimizasyonu ve Hiperparametre Seçimi

Bir kümeleme modelinde en kritik soru "Kaç küme (K) olmalı?" sorusudur. Bunun için iki temel metrik kullanılır:

1. **Dirsek Yöntemi (Elbow Method):** K değerine karşılık gelen toplam kare hata (Inertia) grafiğe dökülür. Hatanın azalma hızının aniden düştüğü ve grafiğin bir dirsek şeklini aldığı nokta, optimal K değerini temsil eder.
2. **Silüet Skoru (Silhouette Score):** Bir noktanın kendi kümesine ne kadar benzer, komşu kümelere ne kadar uzak olduğunu -1 ile +1 arasında bir değerle ölçer. +1'e yakın değerler kusursuz kümelemeyi gösterir.

---

## Model Esnekliği ve Regülarizasyon Teknikleri

Yüksek kapasiteli modeller (karmaşık sinir ağları veya derin karar ağaçları), eğitim verisindeki gürültüyü öğrenme eğilimindedir. Bu durum **Overfitting (Aşırı Uyum)** olarak adlandırılır. Modeli dizginlemek ve genelleme yeteneğini artırmak için regülarizasyon uygulanır.

### Açık (Explicit) Regülarizasyon

Bu yöntemde, modelin kayıp fonksiyonuna (loss function) bir ceza terimi eklenir:

* **L1 (Lasso):** Ağırlıkların mutlak değerini ekler. Bazı ağırlıkları tam olarak sıfıra çekerek özellik seçimi (feature selection) yapar.
* **L2 (Ridge):** Ağırlıkların karelerini ekler. Ağırlıkları küçültür ancak sıfırlamaz, bu da katsayıların daha dengeli yayılmasını sağlar.

### Örtük (Implicit) Regülarizasyon

Doğrudan matematiksel fonksiyona müdahale etmek yerine, eğitim sürecinin doğasını değiştirir:

* **Dropout:** Eğitim sırasında nöronların belirli bir yüzdesini rastgele devre dışı bırakarak ağın belirli bir yola bağımlı kalmasını engeller.
* **Early Stopping:** Validasyon hatası artmaya başladığı anda eğitimi durdurur.
* **Data Augmentation:** Mevcut veriyi döndürme, ölçeklendirme veya gürültü ekleme yoluyla çoğaltarak modelin daha fazla varyasyon görmesini sağlar.

---

## Teknik Notlar ve Uygulama Stratejileri

* **Öznitelik Ölçeklendirme:** K-Means mesafe tabanlı bir algoritma olduğu için, maaş (binler) ve yaş (onlar) gibi farklı skaladaki veriler mutlaka `StandardScaler` veya `MinMaxScaler` ile normalize edilmelidir. Aksi takdirde büyük değerli özellikler kümeyi domine eder.
* **Boyut İndirgeme:** Eğer 100'den fazla öznitelik varsa, kümeleme öncesinde **PCA (Principal Component Analysis)** uygulanarak hem gürültü azaltılmalı hem de hesaplama maliyeti düşürülmelidir.
* **Algoritma Seçimi:** Veri kümesi dairesel değil de uzatılmış (elongated) formdaysa, K-Means yerine **Gaussian Mixture Models (GMM)** veya yoğunluk tabanlı **DBSCAN** tercih edilmelidir.

Makine öğrenmesi modelleri, sadece veri yüklemek ve çıktı almak değildir; bu süreç her bir parametrenin (ağırlıklar, bias, K sayısı) verinin geometrisiyle olan savaşıdır. Doğru regülarizasyon ve model seçimi, bu savaşı kazanan bir yapay zeka mimarisinin anahtarıdır.
