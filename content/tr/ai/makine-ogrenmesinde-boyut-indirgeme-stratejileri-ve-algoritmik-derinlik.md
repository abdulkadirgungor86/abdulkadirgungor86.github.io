---
title: "Makine Öğrenmesinde Boyut İndirgeme Stratejileri ve Algoritmik Derinlik"
date: 2026-04-20
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 6-] Yüksek boyutlu verilerin karmaşıklığını azaltmak için kullanılan PCA ve LDA tekniklerini matematiksel temelleri, sınıflandırma performansına etkileri ve Python tabanlı teknik uygulama örnekleriyle derinlemesine incelemektedir."
featured_image: "/images/ai/makine-ogrenmesinde-boyut-indirgeme-stratejileri-ve-algoritmik-derinlik.png"
tags: ["ai","veri-analizi-okulu","vao", "python", "boyut-indirgeme", "pca", "lda", "siniflandirma", "istatistiksel-analiz", "veri-bilimi", "makine-ogrenmesi"]
---

Veri biliminde "boyutun laneti" (curse of dimensionality), öznitelik sayısı arttıkça verinin uzayda seyrekleşmesi ve modelin karmaşıklığının üstel olarak artması durumunu ifade eder. Özellikle biyoinformatik, görüntü işleme ve doğal dil işleme gibi alanlarda binlerce öznitelikle çalışmak, hem hesaplama maliyetini artırır hem de **overfitting** (aşırı uyum) riskini tetikler. Bu noktada boyut indirgeme teknikleri, verinin özünü koruyarak gürültüden arındırılmış, daha yönetilebilir bir yapı sunar.

Bu yazıda, doğrusal boyut indirgemenin iki dev ismi olan **PCA (Principal Component Analysis)** ve **LDA (Linear Discriminant Analysis)** yöntemlerini teknik bir perspektifle, matematiksel temelleri ve Python uygulamalarıyla ele alınmıştır.

{{< figure src="/images/ai/makine-ogrenmesinde-boyut-indirgeme-stratejileri-ve-algoritmik-derinlik.png" alt="Makine Öğrenmesinde Boyut İndirgeme Stratejileri ve Algoritmik Derinlik" width="1200" caption="Şekil 1: Makine Öğrenmesinde Boyut İndirgeme Stratejileri ve Algoritmik Derinlik." >}}

---

## Veri ve Öznitelik Arasındaki Mühendislik Ayrımı

Genellikle birbirinin yerine kullanılan "veri" ve "öznitelik" kavramları, aslında farklı hiyerarşilerdedir. Veri, gözlemlenen ham değerlerdir; öznitelik ise bu veriden süzülen, modelin karar verme mekanizmasına girdi sağlayan anlamlı birimlerdir. Örneğin, bir inşaat mühendisliği projesinde betonun basınç dayanımını etkileyen "su miktarı" ve "çimento miktarı" ham veridir; ancak "su/çimento oranı" türetilmiş bir özniteliktir.

Boyut indirgeme, bu öznitelik uzayını daraltırken iki temel motivasyona dayanır:

1. **Hesaplama Verimliliği:** Daha az parametre, daha hızlı eğitim ve çıkarım (inference) süresi demektir.
2. **Görselleştirme ve Açıklanabilirlik:** İnsan zihni en fazla üç boyutu kavrayabilir. Yüzlerce boyutu olan bir veri kümesini 2D veya 3D bir düzleme indirgemek, **Explainable AI (XAI)** prensipleri gereği modelin davranışını anlamayı sağlar.

---

## Temel Bileşen Analizi (PCA) ve Varyans Maksimizasyonu

PCA, denetimsiz (unsupervised) bir algoritmadır. Etiketlere ihtiyaç duymaz; odak noktası verinin sahip olduğu toplam varyansı (bilgiyi) mümkün olan en az bileşenle temsil etmektir.

### Matematiksel Temel ve Özvektörler

PCA’nın çalışma mantığı, verinin kovaryans matrisini ($S$) analiz ederek, verinin en çok yayıldığı (varyansın en yüksek olduğu) doğrultuları bulmaya dayanır. Bu doğrultulara **Temel Bileşenler (Principal Components)** denir.

* **PC1 (Birinci Bileşen):** Verideki en büyük varyansı yakalayan yöndür.
* **PC2 (İkinci Bileşen):** PC1'e dik (orthogonal) olan ve geri kalan varyansı en üst düzeye çıkaran yöndür.

Bu süreç, özdeğer (eigenvalue) ve özvektör (eigenvector) hesaplamasıyla gerçekleştirilir. Bir $S$ kovaryans matrisinin en büyük özdeğerine karşılık gelen özvektör, verinin en baskın bileşenini belirler.

### Boyut Sayısının Belirlenmesi: Scree Plot ve PoV

Kaç bileşenin korunacağına karar verirken **Açıklanan Varyans Oranı (Proportion of Variance - PoV)** kullanılır. Eğer ilk iki bileşen toplam varyansın %90'ını açıklıyorsa, veriyi bu iki boyuta indirgemek veri kaybını minimal tutar. **Scree Plot** grafiğinde ise "dirsek" (elbow) noktası, optimum bileşen sayısını seçmek için kullanılan en yaygın yöntemdir.

---

## Doğrusal Ayırt Edici Analiz (LDA) ile Sınıf Ayrımı

PCA verinin geneline odaklanırken, LDA denetimli (supervised) bir yaklaşımdır. LDA'nın temel hedefi, veriyi indirgerken sınıflar arasındaki ayrılabilirliği (separability) maksimuma çıkarmaktır.

### LDA’nın Optimizasyon Kriteri

LDA iki temel istatistiği optimize eder:

1. **Sınıf İçi Dağılım (Within-class scatter - $S_w$):** Aynı sınıfa ait noktaların birbirine ne kadar yakın olduğunu ölçer. Bunun **minimum** olması istenir.
2. **Sınıflar Arası Dağılım (Between-class scatter - $S_b$):** Farklı sınıfların merkezlerinin birbirine ne kadar uzak olduğunu ölçer. Bunun **maksimum** olması istenir.

LDA, $J(w) = \frac{S_b}{S_w}$ oranını maksimize eden bir izdüşüm uzayı oluşturur. Bu sayede, sınıflandırma modelleri için çok daha başarılı bir ön işleme adımı sağlar.

---

## PCA ve LDA Karşılaştırmalı Analizi

| Özellik | PCA (Temel Bileşen Analizi) | LDA (Doğrusal Ayırt Edici Analiz) |
| --- | --- | --- |
| **Öğrenme Türü** | Denetimsiz (Unsupervised) | Denetimli (Supervised) |
| **Hedef** | Maksimum varyansı korumak | Sınıf ayrılabilirliğini maksimize etmek |
| **Girdi** | Sadece öznitelikler ($X$) | Öznitelikler ($X$) ve Etiketler ($y$) |
| **Aykırı Değerler** | Duyarlıdır (Varyansı saptırabilir) | Sınıf merkezlerine göre daha dirençlidir |
| **Kullanım Alanı** | Veri sıkıştırma, Gürültü giderme | Sınıflandırma öncesi öznitelik çıkarma |

---

## Python ile Uygulama ve Teknik Implementasyon

Modern veri bilimi projelerinde bu algoritmalar genellikle `scikit-learn` kütüphanesi ile uygulanır. Aşağıda, her iki yöntemin de bir veri kümesi üzerinde nasıl koşturulacağına dair kapsamlı bir kod örneği bulunmaktadır.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn import datasets
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.preprocessing import StandardScaler

# 1. Veri Setinin Hazırlanması (Iris veri seti)
iris = datasets.load_iris()
X = iris.data
y = iris.target
target_names = iris.target_names

# PCA ve LDA için verinin ölçeklendirilmesi (Standardization) önemlidir
sc = StandardScaler()
X_scaled = sc.fit_transform(X)

# 2. PCA Uygulaması
# 2 bileşene indirgeyerek görselleştirme sağlıyoruz
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# 3. LDA Uygulaması
# LDA denetimli olduğu için y etiketlerini de alıyor
lda = LinearDiscriminantAnalysis(n_components=2)
X_lda = lda.fit(X_scaled, y).transform(X_scaled)

# 4. Sonuçların Görselleştirilmesi
plt.figure(figsize=(12, 5))

# PCA Grafiği
plt.subplot(1, 2, 1)
for color, i, target_name in zip(['navy', 'turquoise', 'darkorange'], [0, 1, 2], target_names):
    plt.scatter(X_pca[y == i, 0], X_pca[y == i, 1], color=color, alpha=.8, lw=2, label=target_name)
plt.legend(loc='best', shadow=False, scatterpoints=1)
plt.title('PCA: Verinin Varyans Odaklı İzdüşümü')

# LDA Grafiği
plt.subplot(1, 2, 2)
for color, i, target_name in zip(['navy', 'turquoise', 'darkorange'], [0, 1, 2], target_names):
    plt.scatter(X_lda[y == i, 0], X_lda[y == i, 1], alpha=.8, color=color, label=target_name)
plt.legend(loc='best', shadow=False, scatterpoints=1)
plt.title('LDA: Sınıf Ayrımı Odaklı İzdüşüm')

plt.show()

# Açıklanan Varyans Oranlarının Yazdırılması
print(f"PCA Açıklanan Varyans Oranı (PC1 + PC2): {np.sum(pca.explained_variance_ratio_):.2f}")

```

---

## İleri Seviye Notlar ve Teknik Uyarılar

### Ölçeklendirme (Standardization) Gerekliliği

PCA, verinin varyansına baktığı için farklı birimlerdeki veriler (örneğin milimetre ve kilometre) algoritmayı yanıltabilir. Bir özniteliğin sayısal değerlerinin çok büyük olması, onun daha önemli olduğu anlamına gelmez. Bu yüzden `StandardScaler` gibi yöntemlerle veriyi ortalaması 0, standart sapması 1 olacak şekilde dönüştürmek kritiktir.

### Kernel Teknikleri ile Doğrusallıktan Çıkma

PCA ve LDA doğrusal dönüşümlerdir. Ancak veri dairesel veya karmaşık bir manifold yapısındaysa, doğrusal yöntemler yetersiz kalır. Bu durumda **Kernel PCA** kullanılarak veriler yüksek boyutlu bir uzaya (Hilbert uzayı) taşınır ve orada doğrusal olarak ayrıştırılır.

### Bellek Yönetimi ve Büyük Veri

Çok büyük veri setlerinde (Big Data), tüm kovaryans matrisini belleğe yüklemek mümkün olmayabilir. Bu gibi durumlarda **Incremental PCA** (IPCA) tercih edilerek veri küçük parçalar (mini-batches) halinde işlenir.

---

## Algoritmik Seçim Stratejisi

Hangi yöntemi seçeceğiniz tamamen verinizin doğasına ve nihai hedefinize bağlıdır. Eğer amacınız sadece veriyi sıkıştırmak ve gürültüyü azaltmaksa, etiketleri kullanmayan ve genel yapıyı koruyan **PCA** en güvenli limandır. Ancak elinizde etiketli bir veri seti varsa ve bir sınıflandırma modelinin (SVM, Random Forest gibi) performansını artırmak istiyorsanız, sınıflar arasındaki sınırları belirginleştiren **LDA** çok daha etkili sonuçlar verecektir.

Boyut indirgeme, modern makine öğrenmesi boru hatlarının (pipelines) ayrılmaz bir parçasıdır. Doğru uygulandığında sadece model hızını artırmakla kalmaz, aynı zamanda verinin altındaki gizli örüntüleri ortaya çıkararak daha sağlam ve kararlı yapay zeka sistemleri inşa etmemize olanak tanır.
