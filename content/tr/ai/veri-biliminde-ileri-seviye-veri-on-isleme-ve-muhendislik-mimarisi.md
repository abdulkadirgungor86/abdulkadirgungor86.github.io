---
title: "Veri Biliminde İleri Seviye Veri Ön İşleme ve Mühendislik Mimarisi"
date: 2026-03-15
type: "ai"
draft: false
math: true
description: "Analitik modelleme süreçlerinde verinin ham formdan işlenmiş bir öznitelik matrisine dönüştürülmesi; istatistiksel metodolojiler ve hesaplamalı tekniklerin senteziyle teknik bir incelemedir."
featured_image: "/images/ai/veri-biliminde-ileri-seviye-veri-on-isleme-ve-muhendislik-mimarisi.png"
tags: ["ai","veri-bilimi", "makine-ogrenmesi", "veri-on-isleme", "ozellik-muhendisligi", "istatistiksel-analiz", "veri-madenciligi"]
---

Analitik modelleme süreçlerinde verinin ham formdan işlenmiş bir öznitelik matrisine dönüştürülmesi, istatistiksel metodolojiler ve hesaplamalı tekniklerin bir sentezidir. Bir veri madenciliği boru hattında (pipeline), verinin topolojik yapısını anlamak ve gürültüden arındırmak, nihai modelin genelleme yeteneğini doğrudan belirler.

{{< figure src="/images/ai/veri-biliminde-ileri-seviye-veri-on-isleme-ve-muhendislik-mimarisi.png" alt="İleri Seviye Veri Ön İşleme ve Mühendislik Mimarisi" width="1200" caption="Şekil 1: Veri toplama aşamasından başlayarak özellik matrisi ve optimize edilmiş girdi üretimine kadar uzanan veri rafine etme boru hattı." >}}

---

## 1. Keşifsel Veri Analizi (EDA) ve Olasılık Dağılımları

Veri setine ilk müdahale, değişkenlerin olasılık yoğunluk fonksiyonlarının (PDF) incelenmesiyle başlar. Parametrik testlerin ve birçok makine öğrenmesi algoritmasının temel varsayımı, verinin **Gaussian (Normal) Dağılım** sergilemesidir.

### Moment Analizi ve Dağılım Dönüşümü
Verinin sadece ortalama ve varyansına değil, üçüncü ve dördüncü momentleri olan **Skewness (Çarpıklık)** ve **Kurtosis (Basıklık)** değerlerine bakılmalıdır. Pozitif çarpık bir dağılımda (sağa kuyruklu), veriye Logaritmik veya Box-Cox dönüşümü uygulanarak dağılımın simetrik hale getirilmesi hedeflenir.

### Çok Değişkenli Analiz (Multivariate Analysis)
Değişkenler arasındaki eşli ilişkiler (pairwise relationships) incelenirken Pearson korelasyon katsayısının yanı sıra, doğrusal olmayan ilişkileri yakalamak adına Spearman Rank veya Kendall’s Tau katsayıları hesaplanmalıdır.

---

## 2. Gelişmiş Aykırı Değer (Outlier) Teşhisi ve Eliminasyonu

Aykırı değerler, veri setindeki varyansı yapay olarak şişirerek model katsayılarının sapmasına (bias) neden olur.

* **Mahalanobis Mesafesi:** Tek değişkenli analizde kullanılan IQR yönteminin aksine, Mahalanobis mesafesi çok değişkenli uzayda bir noktanın kütle merkezine olan uzaklığını hesaplar. Bu yöntem, değişkenler arasındaki kovaryansı hesaba katarak, tek başına aykırı görünmeyen ancak değişken kombinasyonlarında anomali teşkil eden gözlemleri yakalar.
* **Isolation Forest:** Veriyi rastgele özellikler üzerinden bölerek (partitioning) izole eden ağaç tabanlı bir algoritmadır. Aykırı değerler daha az bölme işlemiyle izole edilebildiği için, bu yöntem büyük veri setlerinde doğrusal olmayan anomalilerin tespiti için yüksek performans sergiler.

---

## 3. Eksik Veri Mekanizmaları ve İmputasyon Teknikleri

Eksik veri analizi, verinin neden eksik olduğunun (MCAR, MAR, MNAR) belirlenmesiyle başlar.

* **MICE (Multivariate Imputation by Chained Equations):** Her bir eksik değişkenin diğer değişkenler tarafından modellendiği iteratif bir yöntemdir. Basit ortalama atamasının aksine, verideki belirsizliği korur ve istatistiksel çıkarımların gücünü artırır.
* **Iterative Imputer:** Regresyon temelli bu yaklaşım, eksik sütunu hedef değişken olarak belirleyip diğer sütunları öznitelik (feature) kabul ederek bir tahmin modeli oluşturur. Bu süreç, tüm eksik değerler yakınsayana kadar devam eder.

---

## 4. Özellik Mühendisliği (Feature Engineering) ve Boyut İndirgeme

Yüksek boyutlu veri setlerinde (Curse of Dimensionality), öznitelik sayısının gözlem sayısına oranla çok fazla olması modelin ezberlemesine (overfitting) yol açar.

### PCA (Principal Component Analysis)
Verideki maksimum varyansı temsil eden yeni ve birbirine dik (orthogonal) bileşenler oluşturur. Özvektör ve özdeğer (eigenvalue/eigenvector) ayrıştırması kullanarak, bilgi kaybını minimize ederek boyut küçültür.

### Özellik Etkileşimi (Feature Interaction)
İki bağımsız değişkenin etkileşimi (örneğin: $x_1 \times x_2$), hedef değişken üzerinde tekil etkilerinden daha büyük bir açıklayıcılığa sahip olabilir. Polinominal özellik türetme bu aşamada kritik rol oynar.

---

## 5. Veri Dönüşümü ve Skalaj Stratejileri

Gradyan tabanlı optimizasyon kullanan veya mesafe tabanlı (KNN, SVM) algoritmalar, özelliklerin ölçeğine karşı hassastır.

* **RobustScaler:** Aykırı değerlere karşı dirençlidir; veriyi medyan ve IQR kullanarak ölçeklendirir. Eğer veri setinde temizlenemeyen uç değerler varsa, StandardScaler yerine bu yöntem tercih edilmelidir.
* **Power Transformer:** Veriyi daha Gaussian benzeri hale getirmek için Yeo-Johnson veya Box-Cox transformasyonlarını kullanarak varyans kararlılığı sağlar. Bu, özellikle **Heteroscedasticity (Değişen Varyans)** sorununun çözümü için elzemdir.

---

## 6. Kodlama (Encoding) ve Veri Tipolojisi Yönetimi

Kategorik değişkenlerin kardinalitesi (benzersiz değer sayısı) yüksekse, klasik One-Hot Encoding yöntemi "seyrek matris" (sparse matrix) problemine ve aşırı boyutlanmaya neden olur.

* **Target Encoding:** Her bir kategoriyi, hedef değişkenin o kategorideki ortalaması ile değiştirir. Ancak bu işlem, veri sızıntısına (data leakage) çok açık olduğu için çapraz doğrulama (cross-validation) ile birlikte ve gürültü eklenerek (smoothing) uygulanmalıdır.
* **Weight of Evidence (WoE):** Özellikle kredi skorlama modellerinde tercih edilen, kategorilerin hedef değişkeni ayırt etme gücünü logaritmik oranlarla ifade eden teknik bir yaklaşımdır. Değişkenin tahmine katkısını maksimize ederken kategorik karmaşıklığı doğrusal bir forma sokar.

