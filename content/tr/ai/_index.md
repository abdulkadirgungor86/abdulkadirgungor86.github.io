+++
title = "Yapay Zeka ve Makine Öğrenmesi"
description = "Denetimli, denetimsiz ve pekiştirmeli öğrenme modellerinden teknik derinliğe kadar modern yapay zeka ekosistemi."
type = "list"
weight = 60
+++

Günümüzde dijital dönüşümün en güçlü itici gücü olan **Yapay Zeka (AI)**, veriyi sadece işleyen değil, veriden anlam devşiren sistemlerin bütünüdür. Bu ekosistemin temel taşı olan **Makine Öğrenmesi (Machine Learning)**, matematiksel modellemeler ve istatistiksel yöntemler kullanarak sistemlerin deneyim yoluyla performanslarını iyileştirmelerini sağlar. Mühendislik disipliniyle yaklaşıldığında bu süreç; veri toplama, özellik mühendisliği (feature engineering) ve model optimizasyonu gibi titiz aşamalardan oluşur.

{{< figure src="/images/ai/yapay-zeka-makine-ogrenmesi.png" alt="Yapay Zeka ve Makine Öğrenmesi" width="1200" caption="Şekil 1: Yapay Zeka ve Makine Öğrenmesi." >}}

---

### Temel ve Gelişmiş Öğrenme Paradigmaları

Makine öğrenmesi süreçleri; verinin işleniş biçimine, "öğretici" sinyalinin varlığına ve mimari yaklaşımlara göre ana ve hibrit teknik kategorilere ayrılır:

#### 1. Denetimli Öğrenme (Supervised Learning)

Denetimli öğrenme, girdi-çıktı çiftlerinden oluşan etiketlenmiş bir veri seti üzerinde çalışır. Model, eğitim süreci boyunca hedef çıktılara ne kadar yaklaştığını ölçen bir **kayıp fonksiyonu (loss function)** üzerinden kendini optimize eder.

* **Regresyon Analizi:** Sürekli ve sayısal değerlerin tahmini için kullanılır. Örneğin, yapısal bir elemanın üzerindeki yük miktarına bağlı olarak oluşan yer değiştirme (displacement) değerlerinin hesaplanması tipik bir regresyon problemidir.
* **Sınıflandırma (Classification):** Veriyi diskret kategorilere ayırır. Lojistik regresyon, destek vektör makineleri (SVM) ve karar ağaçları bu alanın temel algoritmalarıdır. Görüntü işleme teknolojilerinde bir çatlağın kritik olup olmadığını belirlemek bu sınıfa girer.

#### 2. Denetimsiz Öğrenme (Unsupervised Learning)

Bu yaklaşımda veri setinde etiket veya hedef çıktı bulunmaz. Algoritma, verinin kendi iç yapısındaki gizli örüntüleri ve benzerlikleri keşfetmek zorundadır.

* **Kümeleme (Clustering):** K-Means veya hiyerarşik kümeleme gibi tekniklerle benzer özellik gösteren veri noktaları gruplandırılır. Özellikle büyük veri setlerinde aykırı değer tespiti (anomaly detection) için hayati önem taşır.
* **Boyut İndirgeme (Dimensionality Reduction):** PCA (Temel Bileşen Analizi) gibi yöntemlerle, yüksek boyutlu karmaşık veri setleri, bilgi kaybı minimumda tutularak daha yönetilebilir alt uzaylara indirgenir.

#### 3. Yarı Denetimli Öğrenme (Semi-Supervised Learning)

Denetimli ve denetimsiz öğrenmenin dinamik bir karışımıdır. Gerçek dünya senaryolarında verinin ham olarak toplanması kolayken, uzmanlar tarafından etiketlenmesi son derece maliyetli ve zaman alıcıdır. Bu yaklaşım, az sayıdaki etiketli veri ile çok büyük miktardaki etiketlenmemiş veriyi aynı anda kullanarak modelin genelleme yeteneğini artırır.

* **Kendi Kendini Eğitme (Self-Training):** Model önce az sayıdaki etiketli veriyle eğitilir. Ardından etiketlenmemiş veriler hakkında tahminlerde bulunur. En yüksek güven skoruna sahip tahminler, "sözde etiket" (pseudo-label) olarak kabul edilerek veri setine eklenir ve model yeniden eğitilir.
* **Graf Tabanlı Modeller:** Veri noktalarının birbirine olan geometrik veya istatistiksel benzerlikleri üzerinden bir graf (ağ) yapısı kurulur. Etiket bilgisi, bu graf üzerinde yakın komşuluk ilişkilerine göre yayılır. Yapısal hasar tespiti için sensör ağlarından gelen verilerin az bir kısmı etiketliyken, tüm sistemin durumunu anlamada kritik bir yöntemdir.

#### 4. Öz-Denetimli Öğrenme (Self-Supervised Learning)

Denetimsiz öğrenmenin modern ve güçlü bir alt kümesidir. Harici bir insan etiketine ihtiyaç duymaz; bunun yerine verinin kendi iç yapısını, bağlamını veya geometrisini kullanarak kendi etiketini kendi üretir (pretext task). Özellikle Büyük Dil Modellerinin (LLM) ve modern bilgisayarlı görü (Computer Vision) sistemlerinin temelini oluşturur.

* **Bağlamsal Tahmin (Context Prediction):** Bir metindeki sonraki kelimeyi tahmin etme veya bir görüntünün rastgele kapatılan (maskelenmiş) bir bölümünü geri döndürme süreçleridir.
* **Karşılaştırmalı Öğrenme (Contrastive Learning):** Aynı verinin farklı augmentasyonlar (döndürme, kırpma) uygulanmış versiyonlarını birbirine yaklaştırırken, farklı verilere ait görselleri uzaklaştırarak verinin evrensel bir temsilini (embedding) öğrenir.

#### 5. Aktarımlı Öğrenme (Transfer Learning)

Sıfırdan model eğitmenin bilgisayarlı hesaplama (computational) maliyetini ve veri ihtiyacını radikal şekilde azaltan bir paradigmadır. Daha önce devasa veri setleriyle eğitilmiş ve genel özellikleri (kenarlar, dokular, temel geometrik yapılar) öğrenmiş bir modelin ağırlıkları dondurularak veya ince ayar (fine-tuning) yapılarak spesifik bir mühendislik problemine uyarlanır.

* **Özellik Çıkarıcı (Feature Extractor):** Önceden eğitilmiş ağın alt katmanları sabit tutulur, sadece en sondaki sınıflandırma katmanı yeni probleme göre değiştirilir.
* **İnce Ayar (Fine-Tuning):** Düşük bir öğrenme oranı (learning rate) ile önceden eğitilmiş modelin tüm katmanları, yeni ve daha küçük olan hedef veri setine göre hafifçe optimize edilir.

#### 6. Aktif Öğrenme (Active Learning)

Modelin öğrenme sürecinde pasif bir alıcı olmak yerine, hangi verilerin etiketlenmesi gerektiğine kendisinin karar verdiği etkileşimli bir algoritma döngüsüdür. Algoritma, tahmin üretirken en çok "kararsız" kaldığı veya varyansın en yüksek olduğu veri noktalarını seçerek bir uzmanın (oracle) etiketlemesini talep eder. Böylece minimum etiketli veriyle maksimum model başarımı hedeflenir.

#### 7. Pekiştirmeli Öğrenme (Reinforcement Learning)

Dinamik bir ortamda bir ajanın (agent), aldığı geri bildirimlere (ödül veya ceza) göre en uygun stratejiyi geliştirmesi esasına dayanır. Diğer yöntemlerin aksine burada veri seti statik değil, etkileşimli bir süreçtir.

* **Politika Geliştirme (Policy Optimization):** Ajan, uzun vadeli toplam ödülü maksimize edecek kararlar almayı öğrenir. Otonom robotik sistemlerin denge kontrolü ve karmaşık oyun stratejileri bu modelle kurgulanır.

---

### Teknik Terimler ve Mühendislik Yaklaşımı

Başarılı bir modelin inşası, sadece algoritma seçimiyle değil, aynı zamanda aşağıdaki teknik parametrelerin doğru yönetilmesiyle mümkündür:

* **Özellik Mühendisliği (Feature Engineering):** Ham veriden modelin başarısını artıracak anlamlı değişkenlerin türetilmesi sürecidir.
* **Aşırı Öğrenme (Overfitting):** Modelin eğitim verisindeki gürültüyü ezberlemesi sonucu gerçek hayattaki (görmediği) verilerde başarısız olmasıdır. Regülerizasyon teknikleriyle (L1/L2) kontrol altına alınır.
* **Sözde Etiketleme (Pseudo-Labeling):** Yarı denetimli öğrenmede modelin kendi yüksek güvenilirlikli tahminlerini, eğitim setine yeni doğrular olarak kabul ettirmesi mekanizmasıdır.
* **Veri Artırımı (Data Augmentation):** Mevcut verileri döndürme, gürültü ekleme, ölçekleme gibi yöntemlerle sentetik olarak çoğaltarak aşırı öğrenmeyi engelleyen tekniklerin bütünüdür.
* **Yapay Sinir Ağları (ANN):** Çok katmanlı yapılardan oluşan, doğrusal olmayan karmaşık problemleri çözebilen ve derin öğrenmenin (Deep Learning) temelini oluşturan mimarilerdir.

Bu teknik temeller, fiziksel sistemlerin dijital modellerle entegrasyonunda ve akıllı karar destek mekanizmalarının kurulmasında kilit rol oynamaktadır.

---

*Bu ve benzer konuları kapsayan yapay zeka ve makine öğrenmesi ile ilgili yazılarım bu başlık altında bulunacaktır.*