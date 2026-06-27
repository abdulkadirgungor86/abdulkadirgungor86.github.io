---
title: "Modern Yapay Zekanın Mimari Temelleri ve Algoritmik Stratejiler"
date: 2026-04-17
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 3-] Transformer mimarisinin dikkat mekanizmasını, multimodal veri entegrasyonunu ve pekiştirmeli öğrenmenin matematiksel karar stratejilerini teknik bir yazıdır."
featured_image: "/images/ai/modern-yapay-zekanin-mimari-temelleri-ve-algoritmik-stratejiler.png"
tags: ["ai", "veri-analizi-okulu","vao", "python", "derin-ogrenme", "transformer-mimarisi", "multi-modal-ai", "derin-ogrenme", "bellman-denklemi", "veri-bilimi", "makine-ogrenmesi"]
---

Yapay zeka dünyası, statik kurallardan dinamik ve öğrenebilen yapılara doğru devasa bir evrim geçirmiştir. Günümüzde ChatGPT gibi modellerin başarısı, sadece ham veri miktarından değil, bu veriyi işleyen Transformer mimarisinin matematiksel zekasından ve pekiştirmeli öğrenme (Reinforcement Learning) ile optimize edilen karar mekanizmalarından kaynaklanmaktadır.

{{< figure src="/images/ai/modern-yapay-zekanin-mimari-temelleri-ve-algoritmik-stratejiler.png" alt="Modern Yapay Zekanın Mimari Temelleri ve Algoritmik Stratejiler" width="1200" caption="Şekil 1: Modern Yapay Zekanın Mimari Temelleri ve Algoritmik Stratejiler." >}}

---

### Kural Tabanlı Sistemlerden Öğrenen Algoritmalara Geçiş

Yapay zekanın erken dönemlerinde hakim olan kural tabanlı (rule-based) sistemler, "Eğer A olursa B yap" şeklinde formüle edilen deterministik yapılardı. Ancak bu yöntem, karmaşık dünyayı modellemede yetersiz kaldı. Uzman emeğine bağımlılık, esneklik eksikliği ve mahremiyetin korunmasındaki zorluklar, sistemlerin kendi kurallarını veriden çıkarmasını sağlayan makine öğrenmesi modellerine geçişi zorunlu kıldı. Özellikle Nash Dengesi gibi oyun teorisi kavramları, rekabetçi ortamlarda sistemlerin nasıl stabilize olacağını ve rastgelelik (stochasticity) faktörüyle nasıl daha dayanıklı hale geleceğini gösterdi.

### Multimodal Yapay Zeka ve Tıbbi Tanı Uygulamaları

Tek modlu (unimodal) sistemler yalnızca metin veya ses gibi tek tip veriyle çalışırken, günümüzün modern mimarileri **Multimodal** bir yapıdadır. Bu, modelin aynı anda metin, görüntü ve ses gibi farklı modaliteleri işleyebilmesi anlamına gelir.

Meme kanseri teşhisi gibi kritik alanlarda bu yapı hayat kurtarıcıdır. Bir sistemin mamografi (görüntü), genetik veriler (tabüler) ve histopatolojik raporları (metin) aynı anda analiz etmesi, insan gözünün kaçırabileceği mikro örüntüleri yakalamasını sağlar. Denetimli öğrenme (supervised learning) ile eğitilen bu modeller, radyologların iş yükünü azaltarak "otomatik triyaj" mekanizmaları oluşturur. Düşük çözünürlüklü MRI verilerinin yüksek kaliteli versiyonlara dönüştürülmesi (super-resolution), yine bu öğrenme süreçlerinin bir sonucudur.

### Transformer Mimarisi ve Dikkat Mekanizması

Transformer modelleri, metin üretiminde devrim yaratmıştır. Geleneksel modellerin aksine, bir kelimeyi tahmin ederken cümlenin başındaki bir kelime ile sonundaki arasındaki ilişkiyi (bağlamı) "Attention" (Dikkat) mekanizması sayesinde ağırlıklandırabilir.

GPT-3 gibi modeller milyarlarca parametreye sahiptir. Bu parametreler, dilin olasılıksal dağılımını temsil eden devasa bir matris yığınıdır. Bir kelime üretildiğinde, o kelime sistemin girdisine geri döner ve döngüsel bir tahmin süreci başlar.

```python
import torch
import torch.nn as nn

# Basit bir Self-Attention mekanizması temsili
class ScaledDotProductAttention(nn.Module):
    def __init__(self):
        super(ScaledDotProductAttention, self).__init__()

    def forward(self, Q, K, V, mask=None):
        # Q: Query, K: Key, V: Value matrisleri
        d_k = Q.size(-1)
        # Enerji skoru hesaplama: (Q * K^T) / sqrt(d_k)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        # Softmax ile olasılık dağılımı oluşturma
        attention_weights = torch.softmax(scores, dim=-1)
        # Değer matrisi ile ağırlıklandırma
        return torch.matmul(attention_weights, V), attention_weights

```

### Denetimsiz Öğrenme ve K-Means Algoritması

Verinin etiketlenmediği senaryolarda, sistemlerin verideki gizli yapıları keşfetmesi gerekir. Bir robotun çiftlikteki hayvanları (tavuk, koyun, inek) önceden tanımlanmış bir etiketi olmadan ayırması gerektiğinde **K-Means** gibi kümeleme algoritmaları devreye girer.

Algoritma şu adımları izler:

1. **Sentroid Belirleme:** Rastgele $K$ adet merkez noktası seçilir.
2. **Atama:** Her veri noktası, öklid mesafesi gibi metriklerle kendine en yakın merkeze atanır.
3. **Güncelleme:** Kümelerin merkezleri, atanan noktaların ortalamasına göre yeniden hesaplanır.
4. **Yakınsama:** Merkezler artık değişmeyene kadar süreç devam eder.

```python
from sklearn.cluster import KMeans
import numpy as np

# Örnek hayvan verileri: [Ağırlık, Boy]
X = np.array([[2, 0.5], [1.5, 0.4], [50, 1.2], [45, 1.1], [200, 1.8]])
# 3 farklı hayvan türü olduğunu varsayalım
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)

print("Küme Merkezleri:", kmeans.cluster_centers_)

```

### Pekiştirmeli Öğrenmenin Matematiği ve Stratejik Kararlar

Pekiştirmeli Öğrenme (RL), bir ajanın çevreyle etkileşime girerek ceza ve ödül mekanizması üzerinden optimal politikayı (policy) bulmasıdır. Özellikle satranç gibi çok adımlı problemlerde veya uçuş simülatörlerinde, bir hamlenin değeri ancak oyunun veya uçuşun sonunda netleşir (delayed reward).

RL'nin temelinde **Bellman Denklemi** yatar. Bir durumun (state) değeri, sadece o anki ödül değil, gelecekteki beklenen indirimli (discounted) ödüllerin toplamıdır:

$$V(s) = \max_a (R(s,a) + \gamma \sum_{s'} P(s,a,s') V(s'))$$

Burada $\gamma$ (gamma) indirim faktörü, gelecekteki ödüllerin bugünkü değerini belirler. Eğer $\gamma$ düşükse ajan "oportünist" davranır, yüksekse uzun vadeli stratejiler geliştirir.

### Veri ve Korelasyon Paradoksu

Makine öğrenmesinde sıkça düşülen bir hata, korelasyonu neden-sonuç ilişkisi (causality) ile karıştırmaktır. Korsan sayısının azalması ile küresel ısınmanın artması arasında negatif bir korelasyon olabilir, ancak bu korsanların dünyayı soğuttuğu anlamına gelmez. Veri bize sadece "ne" olduğunu söyler, "neden" olduğunu söylemez. Bu yüzden modelleri kurarken saha bilgisi ve mantıksal hipotezler (domain expertise) kritik rol oynar.

**Notlar:**

* **Feature Engineering:** Veriyi doğrudan modele sokmak yerine, önemli özellikleri (örneğin uçakların aynı havaalanına iniş yapması gibi şirket evliliği sinyalleri) manuel veya algoritmik olarak ayıklamak model başarısını artırır.
* **Web Scraping:** Dinamik veri toplama süreçlerinde haber akışları ve sosyal medya verileri, modelin güncel kalmasını sağlar.

Bu teknik mimariyi anlamak, yapay zekanın sadece bir "kara kutu" değil, matematiksel prensipler üzerine inşa edilmiş devasa bir olasılık makinesi olduğunu kavramaktır.

---

**Teknik Kaynaklar ve Kütüphaneler:**

* **Veri Manipülasyonu:** NumPy, Pandas
* **Görselleştirme:** Matplotlib, Seaborn
* **Derin Öğrenme:** PyTorch, TensorFlow, Transformers (Hugging Face)
* **Kümeleme ve Analiz:** Scikit-Learn
