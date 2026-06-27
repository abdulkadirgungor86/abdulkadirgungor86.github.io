---
title: "Denetimsiz Öğrenme: Verinin Gizli Geometrisi ve Algoritmik Keşif Teknikleri"
date: 2026-03-03
type: "ai"
draft: false
math: true
description: "Bu yazı, etiketlenmemiş veri setlerinden anlamlı örüntüler çıkarmak için kullanılan kümeleme, boyut indirgeme ve anomali tespiti metodolojileri, matematiksel temelleri ve modern yazılım implementasyonlarıyla birlikte detaylandırılmaktadır."
featured_image: "/images/ai/denetimsiz-ogrenme-verinin-gizli-geometrisi-ve-algoritmik-kesif-teknikleri.png"
tags: ["ai","veri-muhendisligi", "buyuk-veri", "denetimsiz-ogrenme", "pca", "kumeleme", "makine-ogrenmesi"]
---

Denetimsiz öğrenme (Unsupervised Learning), veri biliminin en sofistike ve keşifsel alanlarından biridir. Geleneksel denetimli öğrenme metodolojilerinin aksine, burada sistem bir "öğretmen" (target labels) yardımı olmadan, ham verinin topolojik yapısını ve istatistiksel dağılımını analiz ederek anlamlı korelasyonlar türetir. Bu makalede, kümeleme algoritmalarından boyut indirgeme tekniklerine, modern kütüphane implementasyonlarından matematiksel arka plana kadar geniş bir teknik spektrum incelenecektir.

{{< figure src="/images/ai/denetimsiz-ogrenme-verinin-gizli-geometrisi-ve-algoritmik-kesif-teknikleri.png" alt="Denetimsiz Öğrenme: Verinin Gizli Geometrisi ve Algoritmik Keşif Teknikleri" width="1200" caption="Şekil 1: Denetimsiz Öğrenme: Verinin Gizli Geometrisi ve Algoritmik Keşif Teknikleri." >}}

---

## 1. Denetimsiz Öğrenme Paradigması ve Matematiksel Temeller

Denetimli öğrenmede temel amaç $y = f(x)$ fonksiyonunu optimize etmekken, denetimsiz öğrenmede odak noktası $P(x)$ olasılık yoğunluk fonksiyonunun veya verinin içsel geometrisinin modellenmesidir. Veri setinde etiketlerin bulunmaması, modelin kayıp fonksiyonunu (loss function) verinin kendi varyansı veya mesafe metrikleri üzerinden kurgulamasını gerektirir.

### Veri Temsili ve Mesafe Metrikleri
Algoritmaların başarısı, veri noktaları arasındaki "benzerliği" nasıl tanımladığımıza bağlıdır. En sık kullanılan metrikler şunlardır:
*   **Öklid Mesafesi (Euclidean Distance):** Geometrik yakınlık.
*   **Manhattan Mesafesi:** Izgara tabanlı veri yapılarında tercih edilir.
*   **Cosine Similarity:** Özellikle NLP süreçlerinde vektörlerin yönsel benzerliğini ölçmek için kullanılır.

---

## 2. Kümeleme (Clustering) Stratejileri

Kümeleme, verinin homojen alt gruplara ayrılması sürecidir. Burada amaç, küme içi benzerliği maksimize ederken, kümeler arası benzerliği minimize etmektir.

### 2.1. K-Means Algoritması ve Optimizasyonu
K-Means, centroid tabanlı bir yinelemeli algoritmadır. Süreç, rastgele $k$ adet merkez atanmasıyla başlar ve küme içi kareler toplamının (Inertia) minimize edilmesiyle devam eder.

**Teknik Not:** $k$ değerinin belirlenmesinde "Elbow Method" veya "Silhouette Score" analizi kritik rol oynar. 

```python
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Sentetik veri oluşturma
data = np.random.rand(500, 2)

# K-Means modelleme
kmeans = KMeans(n_clusters=4, init='k-means++', max_iter=300, n_init=10, random_state=42)
pred_y = kmeans.fit_predict(data)

# Cluster merkezlerini ve dağılımı görselleştirme
plt.scatter(data[:,0], data[:,1], c=pred_y)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=300, c='red', label='Centroids')
plt.show()
```



### 2.2. Hiyerarşik Kümeleme (Hierarchical Clustering)
Hiyerarşik yöntemler, veriyi bir ağaç yapısında (Dendrogram) organize eder. İki ana yaklaşım mevcuttur:
1.  **Agglomerative (Aşağıdan Yukarı):** Her nokta başlangıçta bir kümedir ve birbirine en yakın kümeler birleştirilir.
2.  **Divisive (Yukarıdan Aşağı):** Tüm veri tek bir kümedir ve parçalanarak ilerlenir.

### 2.3. Yoğunluk Tabanlı Kümeleme: DBSCAN
K-Means'in aksine DBSCAN (Density-Based Spatial Clustering of Applications with Noise), küme sayısını önceden bilmeye gerek duymaz ve aykırı değerleri (noise) otomatik olarak izole eder. Karmaşık geometrik şekillere sahip kümeleri ayırmada üstündür.

---

## 3. Boyut İndirgeme (Dimensionality Reduction)

Yüksek boyutlu veri setlerinde karşılaşılan "Boyut Laneti" (Curse of Dimensionality), modellerin hesaplama maliyetini artırırken genelleme yeteneğini düşürür. Boyut indirgeme, verinin özünü koruyarak öznitelik sayısını azaltır.

### 3.1. Temel Bileşen Analizi (PCA)
PCA, veri setindeki varyansı maksimize eden yeni dik eksenler (Principal Components) oluşturur. Bu işlem, kovaryans matrisinin özdeğer (eigenvalue) ve özvektör (eigenvector) dekompozisyonuna dayanır.



### 3.2. t-SNE ve UMAP
Görselleştirme amaçlı kullanılan bu teknikler, yüksek boyutlu uzaydaki komşuluk ilişkilerini düşük boyutlu (genelde 2D veya 3D) uzaya taşırken korumayı amaçlar. t-SNE doğrusal olmayan yapılar için mükemmeldir ancak hesaplama maliyeti yüksektir; UMAP ise daha hızlı ve küresel yapıyı korumada daha başarılıdır.

```python
from sklearn.decomposition import PCA
import pandas as pd

# Örnek bir yüksek boyutlu veri seti (Örn: 10 özellik)
high_dim_data = np.random.normal(size=(100, 10))

# PCA uygulaması: Bilginin %95'ini koruyarak boyut indirgeme
pca = PCA(n_components=0.95)
reduced_data = pca.fit_predict(high_dim_data)

print(f"Orijinal Boyut: {high_dim_data.shape[1]}")
print(f"İndirgenmiş Boyut: {reduced_data.shape[1]}")
```

---

## 4. Aykırı Değer Tespiti (Anomaly Detection)

Denetimsiz öğrenmenin en kritik uygulama alanlarından biri anomali tespitidir. Özellikle finansal dolandırıcılık, ağ güvenliği ve endüstriyel sistemlerin bakımında kullanılır.

*   **Isolation Forest:** Veri noktalarını izole etmek için rastgele ağaçlar oluşturur. Anomaliler normal verilere göre daha kısa dallarda izole edilirler.
*   **Local Outlier Factor (LOF):** Bir noktanın yoğunluğunu komşularıyla kıyaslar. Düşük yoğunluklu bölgelerdeki noktalar anomali olarak etiketlenir.

---

## 5. Yazılım Ekosistemi ve Kütüphaneler

Denetimsiz öğrenme projelerinde kullanılan temel stack şu bileşenlerden oluşur:

1.  **Scikit-Learn:** Endüstri standardıdır. `KMeans`, `PCA`, `DBSCAN` gibi algoritmaların optimize edilmiş hallerini içerir.
2.  **PyTorch & TensorFlow:** Autoencoder (Oto-kodlayıcılar) gibi sinir ağı tabanlı denetimsiz yapılar için kullanılır.
3.  **CuML (RAPIDS):** GPU üzerinde hızlandırılmış makine öğrenmesi algoritmaları sunar. Büyük veri setlerinde CPU'ya göre 10-50 kat hız avantajı sağlar.
4.  **NetworkX / Gephi:** Veri arasındaki ilişkileri grafik teorisiyle modellemek ve topluluk tespiti (Community Detection) yapmak için hayati önem taşır.

---

## 6. Modern Uygulama: Autoencoders

Derin öğrenme dünyasında denetimsiz öğrenme, "Autoencoder" mimarileriyle hayat bulur. Bir Autoencoder, girdi verisini sıkıştırılmış bir temsil formuna (Bottleneck/Latent Space) indirger ve ardından orijinal veriyi bu kısıtlı bilgiden tekrar inşa etmeye (Reconstruction) çalışır.

**Mimarinin Bileşenleri:**
*   **Encoder:** Özellik çıkarma ve boyut küçültme.
*   **Latent Space:** Verinin en yoğun ve anlamlı özeti.
*   **Decoder:** Sıkıştırılmış veriden orijinal girdiyi yeniden oluşturma.

---

## 7. Teknik Uygulama Notları ve Best-Practices

Denetimsiz öğrenme modellerini geliştirirken dikkat edilmesi gereken mühendislik detayları şunlardır:

1.  **Feature Scaling (Özellik Ölçeklendirme):** Kümeleme algoritmaları mesafe tabanlı olduğu için `StandardScaler` veya `MinMaxScaler` kullanımı zorunludur. Aksi halde, büyük sayısal değerlere sahip özellikler modeli domine eder.
2.  **Varyans Analizi:** PCA uygularken, açıklanan varyans oranının (Explained Variance Ratio) kümülatif toplamı izlenmelidir. Genelde %80-%95 arası varyansın korunması hedeflenir.
3.  **Duyarlılık Analizi:** Denetimsiz modellerin objektif bir başarı metriği (Accuracy gibi) olmadığı için, sonuçlar farklı parametre setleriyle (hyperparameter tuning) test edilmeli ve alan uzmanları tarafından valide edilmelidir.

> **Önemli Not:** Denetimsiz öğrenme, genellikle denetimli öğrenme süreçlerinden önce bir "ön işleme" (preprocessing) adımı olarak kullanılır. Örneğin, ham verideki gürültüyü temizlemek veya öznitelik sayısını azaltarak modelin aşırı öğrenmesini (overfitting) engellemek amacıyla boyut indirgeme tekniklerine başvurulur.

Denetimsiz öğrenme yöntemleri, verinin içinde gizli kalmış hiyerarşileri ve yapıları gün yüzüne çıkararak, veri bilimcilerine ham bilgiden stratejik içgörüler devşirme imkanı sağlar. Özellikle büyük ölçekli sistemlerde, etiketleme maliyetlerinin yüksek olduğu senaryolarda bu algoritmalar yegane çözüm yoludur.