---
title: "Modern Dil Modellerinin Nöral Mimarisi ve Token Seviyesinden Akıl Yürütmeye Uzanan Evrimi"
date: 2026-04-24
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 10-] Bu yazıda, Transformer mimarisinin matematiksel temellerini, dikkat (attention) mekanizmalarının vektörel işleyişini ve büyük dil modellerinin (LLM) veriden anlam çıkarma süreçlerini teknik bir derinlikle ele alan kapsamlı bir incelemedir."
featured_image: "/images/ai/modern-dil-modellerinin-noral-mimarisi-ve-token-seviyesinden-akil-yurutmeye-uzanan-evrimi.png"
tags: ["ai", "veri-analizi-okulu","vao", "python", "transformer-mimarisi", "nlp", "llm", "tokenizasyon", "attention-mechanism","noral-aglar","ai-hizalama", "pytorch", "makine-ogrenmesi"]
---

Yapay zeka ekosisteminde son on yılda yaşanan en büyük kırılma, verinin sadece işlenmesi değil, dilin geometrik bir uzayda yeniden inşa edilmesiyle gerçekleşti. Modern Büyük Dil Modelleri (LLMs), ham metin yığınlarını alıp onları çok boyutlu vektör uzaylarında anlamlı ilişkilere dönüştüren devasa birer istatistiksel makinedir. Ancak bu makinelerin "düşünüyor" gibi görünmesinin ardında, Transformer mimarisinin sunduğu matematiksel zarafet ve ölçekleme yasalarının getirdiği emergent (ortaya çıkan) kabiliyetler yatar.

{{< figure src="/images/ai/modern-dil-modellerinin-noral-mimarisi-ve-token-seviyesinden-akil-yurutmeye-uzanan-evrimi.png" alt="Modern Dil Modellerinin Nöral Mimarisi ve Token Seviyesinden Akıl Yürütmeye Uzanan Evrimi" width="1200" caption="Şekil 1: Modern Dil Modellerinin Nöral Mimarisi ve Token Seviyesinden Akıl Yürütmeye Uzanan Evrimi." >}}

---

## 1. Vektörel Uzayda Anlam Arayışı: Tokenizasyon ve Embedding Katmanı

Dil modelleri metni doğrudan okuyamaz. İşlem süreci, metnin **Tokenization** adı verilen bir yöntemle alt birimlere ayrılmasıyla başlar. Günümüzde yaygın olarak kullanılan *Byte Pair Encoding (BPE)* veya *WordPiece* gibi algoritmalar, kelimeleri nadirliklerine göre parçalar. Örneğin, "yapay" kelimesi tek bir token olabilirken, "yapay zekalaştıramadıklarımızdan mısınız" gibi kompleks bir yapı birçok alt birime bölünür.

Tokenlar daha sonra **Embedding** katmanında $d_{model}$ boyutlu (örneğin 4096 veya daha fazla) yoğun vektörlere dönüştürülür. Bu vektörler, kelimenin semantik konumunu belirler. Ancak Transformer mimarisi "sırasız" bir yapı olduğu için, kelimenin cümle içindeki konumunu modele öğretmek amacıyla **Positional Encoding** eklenir.

$$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{model}})$$

$$PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d_{model}})$$

Bu trigonometrik fonksiyonlar, modele tokenlar arasındaki göreceli mesafeyi anlama yetisi kazandırır.

---

## 2. Transformer Mimarisi: Attention Mekanizmasının Matematiksel Temeli

Transformer'ın kalbi, **Scaled Dot-Product Attention** mekanizmasıdır. Modelin "odaklanma" yeteneği, her token için oluşturulan üç temel vektöre dayanır: **Query (Q)**, **Key (K)** ve **Value (V)**.

Bir token, diğer tokenlarla ne kadar ilişkili olduğunu anlamak için kendi Query vektörünü, diğerlerinin Key vektörleriyle çarpar (dot product). Bu işlem, bir benzerlik skor matrisi oluşturur:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Buradaki $\sqrt{d_k}$ ölçekleme faktörü, gradyanların yok olmasını veya patlamasını engeller. **Multi-Head Attention** ise bu işlemin paralel olarak farklı "başlıklar" altında yapılmasıdır. Her başlık farklı bir dilbilgisel özelliği (örneğin biri özne-yüklem ilişkisini, diğeri zaman eklerini) öğrenir.

---

## 3. Eğitim Stratejileri: Katmanlı Bir Öğrenme Taksonomisi

Modern bir dil modelinin inşası, katmanlı bir kek hazırlamaya benzer. Her katman, modelin bir üst seviyedeki bilişsel yeteneğini destekler.

### A. Self-Supervised Pretraining (Denetimsiz Ön Eğitim)

Modelin "dünya bilgisini" kazandığı aşamadır. Trilyonlarca kelime üzerinden model, "Bir sonraki kelime nedir?" sorusuna yanıt arar. **Causal Language Modeling (CLM)** yaklaşımında model, kendisinden sonra gelen tokenları göremez. Bu, eğitim sırasında bir **Masking** matrisi ile sağlanır.

### B. Supervised Fine-Tuning (SFT - Komut Uyarlama)

Ön eğitimli model bir "otomatik tamamlayıcı" iken, SFT ile bir "asistana" dönüşür. Burada model, kaliteli ve insan tarafından yazılmış (Soru-Cevap) çiftleriyle eğitilir.

### C. RLHF (İnsan Geri Bildirimiyle Pekiştirmeli Öğrenme)

Modelin güvenliğini ve insan tercihlerine uyumunu (Alignment) sağlamak için kullanılır. **PPO (Proximal Policy Optimization)** veya **DPO (Direct Preference Optimization)** algoritmalarıyla, modelin ürettiği yanıtlar bir ödül modeli (Reward Model) tarafından puanlanır.

---

## 4. Teknik Uygulama: Transformer Blok Yapısı ve PyTorch Örneği

Bir Transformer bloğunun temel yapısını kod seviyesinde incelemek, mekanizmanın nasıl işlediğini anlamak için kritiktir. Aşağıdaki Python örneği, basit bir Self-Attention katmanının `PyTorch` kütüphanesi kullanılarak nasıl inşa edilebileceğini göstermektedir.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleSelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super(SimpleSelfAttention, self).__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads

        assert (self.head_dim * heads == embed_size), "Embedding boyutu başlık sayısına bölünmelidir."

        self.values = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.keys = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.queries = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.fc_out = nn.Linear(heads * self.head_dim, embed_size)

    def forward(self, values, keys, query, mask):
        N = query.shape[0]
        value_len, key_len, query_len = values.shape[1], keys.shape[1], query.shape[1]

        # Vektörleri başlıklara (heads) ayır
        values = values.reshape(N, value_len, self.heads, self.head_dim)
        keys = keys.reshape(N, key_len, self.heads, self.head_dim)
        queries = query.reshape(N, query_len, self.heads, self.head_dim)

        # Enerji hesaplama (Dot-product)
        energy = torch.einsum("nqhd,nkhd->nhqk", [queries, keys])

        if mask is not None:
            energy = energy.masked_fill(mask == 0, float("-1e20"))

        # Dikkat ağırlıkları (Attention weights)
        attention = torch.softmax(energy / (self.embed_size ** (1/2)), dim=3)

        out = torch.einsum("nhql,nlhd->nqhd", [attention, values]).reshape(
            N, query_len, self.heads * self.head_dim
        )

        return self.fc_out(out)

```

---

## 5. İleri Akıl Yürütme Teknikleri: CoT ve ToT Yaklaşımları

Modelin parametreleri dondurulduktan sonra bile, onun bilişsel performansını artırmak mümkündür. Buna "Prompt Mühendisliği" dense de aslında yapılan işlem modelin **In-Context Learning** (Bağlam İçi Öğrenme) yeteneğini tetiklemektir.

* **Chain of Thought (CoT):** Modeli "Adım adım düşün" (Let's think step by step) komutuyla yönlendirerek, karmaşık bir problemi alt parçalara bölmesini sağlamaktır. Bu, modelin işlem sırasında "ara duraklar" oluşturmasına ve mantık hatalarını azaltmasına olanak tanır.
* **Tree of Thought (ToT):** Tek bir lineer düşünce hattı yerine, modelin farklı olasılıkları bir ağaç yapısı gibi dallandırması ve her bir dalın başarısını değerlendirerek en mantıklı yola sapmasıdır.
* **Self-Consistency:** Model aynı soruya 10 farklı yanıt üretir ve çoğunluk oyu (majority voting) ile en tutarlı olanı seçilir. Bu, özellikle matematiksel işlemlerde hata payını minimize eder.

---

## 6. Ölçekleme Yasaları ve Ortaya Çıkan Yetenekler (Emergent Abilities)

OpenAI ve Google gibi devlerin araştırmaları, model performansının üç temel değişkene bağlı olduğunu kanıtlamıştır: **Hesaplama gücü (Compute), Veri boyutu ve Parametre sayısı.**

Belirli bir eşik aşıldığında (genellikle 7B+ parametre), modeller eğitimlerinde doğrudan hedef alınmayan "mizah anlama", "kod yazma" veya "çeviri" gibi yetenekleri kendiliğinden sergilemeye başlar. Ancak bu büyüme beraberinde **Hallucination** (Halüsinasyon) riskini de getirir. Modelin amacı gerçeği söylemek değil, olasılığı en yüksek token'ı seçmektir. Bu nedenle, teknik mimaride **RAG (Retrieval-Augmented Generation)** gibi dış kaynaklı veri doğrulama sistemleri modern uygulamaların vazgeçilmezi haline gelmiştir.

---

## Sonuç: Nöral Semantiğin Geleceği

Bugün dil modelleri, sadece metin üreten araçlar olmaktan çıkıp, yazılım geliştirme süreçlerinden bilimsel araştırmalara kadar her alanda birer "işlemci" görevi görmektedir. Transformer mimarisinin getirdiği paralelleştirme gücü ve Attention mekanizmasının sunduğu bağlamsal derinlik, makinelerin insan dilini sadece taklit etmesini değil, onun altındaki mantıksal yapıyı matematiksel olarak simüle etmesini sağlamıştır. Gelecekte, daha az enerji tüketen ve daha uzun bağlam pencerelerine (Context Window) sahip modeller, dijital asistan kavramını tamamen otonom ajanlara dönüştürecektir.

> **Teknik Not:** Bellek yönetimi tarafında, KV Cache (Key-Value Caching) mekanizması, çıkarım (inference) hızını artırmak için önceki adımlarda hesaplanan Key ve Value vektörlerini saklar. Bu, özellikle uzun metin üretimlerinde GPU üzerindeki hesaplama yükünü dramatik şekilde düşürür.