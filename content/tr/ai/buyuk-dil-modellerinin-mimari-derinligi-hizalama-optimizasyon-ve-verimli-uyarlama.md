---
title: "Büyük Dil Modellerinin Mimari Derinliği: Hizalama, Optimizasyon ve Verimli Uyarlama"
date: 2026-04-25
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 11-] Büyük Dil Modellerinin (LLM) insan geri bildirimiyle hizalanması, düşük dereceli matrisler (LoRA) ile verimli uyarlanması ve dağıtık donanım mimarilerinde optimize edilmesi süreçlerini kapsayan derin teknik yazıdır."
featured_image: "/images/ai/buyuk-dil-modellerinin-mimari-derinligi-hizalama-optimizasyon-ve-verimli-uyarlama.png"
tags: ["ai","veri-analizi-okulu","vao", "python", "llm", "rlhf", "nlp", "lora","deep-learning", "ai-engineering", "makine-ogrenmesi"]
---

Yapay zeka ekosistemi, ham transformatör bloklarından kullanıcıya yanıt veren asistanlara doğru evrilirken, arka planda devasa bir mühendislik operasyonu yürütülmektedir. Bir Büyük Dil Modeli (LLM), sadece milyarlarca parametreden ibaret değildir; bu parametrelerin nasıl hizalandığı, donanım kısıtları altında nasıl optimize edildiği ve spesifik görevler için nasıl uyarlanacağı, modelin başarısını belirleyen temel unsurlardır.

{{< figure src="/images/ai/buyuk-dil-modellerinin-mimari-derinligi-hizalama-optimizasyon-ve-verimli-uyarlama.png" alt="Büyük Dil Modellerinin Mimari Derinliği: Hizalama, Optimizasyon ve Verimli Uyarlama" width="1200" caption="Şekil 1: Büyük Dil Modellerinin Mimari Derinliği: Hizalama, Optimizasyon ve Verimli Uyarlama." >}}

---

## 1. Eğitim Sonrası Hizalama: RLHF ve PPO Mekanizması

Ön eğitim (Pre-training) aşamasında model, "sonraki token tahmini" (Next Token Prediction) yaparak dili ve dünyayı öğrenir. Ancak bu aşama, modelin kullanıcı niyetini anlaması veya güvenli yanıtlar vermesi için yeterli değildir. **RLHF (Reinforcement Learning from Human Feedback)**, modeli insan değerleriyle hizalamak için kullanılan altın standarttır.

### RLHF Boru Hattı (Pipeline)

RLHF üç kritik aşamadan oluşur:

1. **SFT (Supervised Fine-Tuning):** Model, yüksek kaliteli soru-cevap çiftleri üzerinde eğitilir.
2. **Ödül Modeli (Reward Model - RM) Eğitimi:** İnsanlar, modelin ürettiği farklı yanıtları (A ve B) karşılaştırarak sıralar. Bu verilerle, bir metnin "ne kadar iyi" olduğunu puanlayan ayrı bir RM eğitilir.
3. **PPO (Proximal Policy Optimization) ile Pekiştirme:** Model, RM'den yüksek puan alacak şekilde güncellenir.

PPO algoritması, modelin (Policy) çok radikal değişimler yapmasını engellemek için **KL Divergence** (Kullback-Leibler Iraksaması) kullanır. Eğer model, orijinal ağırlıklarından çok uzaklaşırsa, bir ceza mekanizması devreye girer.

```python
# PPO Güncelleme Mantığı (Kavramsal PyTorch Örneği)
import torch.nn.functional as F

def compute_ppo_loss(old_log_probs, new_log_probs, advantages, clip_range=0.2):
    ratio = torch.exp(new_log_probs - old_log_probs)
    surr1 = ratio * advantages
    surr2 = torch.clamp(ratio, 1.0 - clip_range, 1.0 + clip_range) * advantages
    policy_loss = -torch.min(surr1, surr2).mean()
    return policy_loss

```

---

## 2. GRPO: Avantaj Tabanlı Grup Optimizasyonu

Modern modellerde (DeepSeek-V3 gibi) PPO'nun yerini alan **GRPO (Group Relative Policy Optimization)**, ayrı bir Reward Model (RM) ihtiyacını azaltarak verimliliği artırır. GRPO'da model, aynı girdi için bir grup çıktı ($G$) üretir. Her çıktının kalitesi, grup içindeki diğer çıktılara göre değerlendirilir.

**Avantaj ($A$) Hesaplaması:**


$$A_i = \frac{r_i - \text{mean}(r)}{\text{std}(r)}$$

Burada $r_i$, i-inci çıktının ödülüdür. Bu yöntem, mutlak bir ödül puanı yerine, modelin "gruptaki diğer seçeneklerden daha iyi" olanı seçmesini sağlar. Bu, özellikle matematiksel kanıtlama ve kodlama gibi deterministik alanlarda çok daha stabil bir öğrenme eğrisi sunar.

---

## 3. Parametre Verimli Uyarlama (PEFT) ve LoRA

Milyarlarca parametreye sahip bir modeli (örneğin Llama-3 70B) tam olarak eğitmek (Full Fine-Tuning), devasa bir VRAM gerektirir. **LoRA (Low-Rank Adaptation)**, modelin orijinal ağırlıklarını ($W_0$) dondurarak, ağırlık değişimini ($\Delta W$) iki düşük dereceli matrisin çarpımı olarak ifade eder.

**Matematiksel Formülasyon:**
Bir $d \times d$ boyutundaki matrisi güncellemek yerine, $d \times r$ ve $r \times d$ boyutlarında iki matris ($A$ ve $B$) kullanılır. Burada $r$ (rank), genellikle 8 veya 16 gibi çok küçük bir değerdir.

$$W = W_0 + B \cdot A$$

Bu teknik, eğitilecek parametre sayısını %10.000 oranında azaltabilir.

### QLoRA: 4-Bit Kuantizasyon ve Double Quantization

**QLoRA**, LoRA'yı bir adım ileri taşıyarak ana modeli **NormalFloat4 (NF4)** formatında 4-bite sıkıştırır. Bu sayede 65 milyar parametreli bir model, tek bir 48GB GPU'da eğitilebilir hale gelir.

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# 4-bit yapılandırması
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

model = AutoModelForCausalLM.from_pretrained("llama-3-8b", quantization_config=bnb_config)

# LoRA Ayarları
config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none"
)

lora_model = get_peft_model(model, config)

```

---

## 4. Bellek Yönetimi ve Veri Hassasiyeti (Precision)

LLM eğitiminde bellek (VRAM) darboğazı, sadece model ağırlıklarından değil, **Optimizer States** ve **Gradients**'den kaynaklanır. FP32 (Single Precision) kullanımı çok hassastır ancak bellek düşmanıdır.

* **FP16 / BF16:** Modern GPU'lar (A100, H100) **BFloat16** formatını destekler. BF16, FP16 ile aynı bellek alanını kaplamasına rağmen, FP32 ile aynı dinamik aralığa (exponent) sahiptir. Bu, eğitim sırasında "underflow/overflow" riskini minimize eder.
* **Mixed Precision Training:** Hesaplamalar düşük hassasiyette (FP16/BF16) yapılırken, ağırlıkların master kopyası yüksek hassasiyette (FP32) tutulur.

---

## 5. Dağıtık Eğitim ve ZeRO Optimizasyonu

Tek bir GPU'ya sığmayan modeller için **DeepSpeed** tarafından geliştirilen **ZeRO (Zero Redundancy Optimizer)** protokolleri kullanılır:

1. **ZeRO-1:** Optimizer durumlarını GPU'lar arasında paylaştırır.
2. **ZeRO-2:** Gradyanları da paylaştırarak bellek yükünü azaltır.
3. **ZeRO-3 (Full Parameter Sharding):** Model ağırlıklarını da parçalara ayırır. Bir katman işleneceği zaman ilgili GPU, ağırlıkları diğerlerinden toplar, işlemi yapar ve sonra siler.

---

## 6. Model Damıtma (Distillation) ve Budama (Pruning)

Büyük modellerin bilgisini küçük modellere aktarmak (Knowledge Distillation), edge cihazlarda LLM çalıştırmak için kritiktir.

* **Soft Targets:** Öğrenci model, öğretmen modelin sadece en yüksek olasılıklı kelimesini değil, tüm olasılık dağılımını (logits) taklit eder.
* **Structured Pruning:** Modeldeki düşük öneme sahip (örneğin dikkat başlıkları veya katmanlar) yapılar tamamen çıkarılır. Bu, modelin "seyrek" (sparse) bir yapıda çalışmasını sağlar.

---

## 7. Çıkış Süreci ve Paralelleştirme Stratejileri

Model eğitildikten sonra, saniyede kaç token üretilebileceği (throughput) ticari başarı için kritiktir.

* **Tensor Parallelism (TP):** Tek bir matris çarpımı işlemini birden fazla GPU'ya böler. Çok hızlı iletişim gerektirir (NVLink).
* **Pipeline Parallelism (PP):** Modeli katman bazında böler. GPU 1 ilk 10 katmanı, GPU 2 sonraki 10 katmanı işler.
* **Continuous Batching:** Bir kullanıcının yanıtı biter bitmez, boşalan slotu yeni bir istekle doldurarak GPU'nun boş kalmasını engeller (vLLM kütüphanesinin temelidir).

> **Teknik Not:** LLM optimizasyonu bir "denge" sanatıdır. KL Divergence ile yaratıcılık ve doğruluk arasında denge kurulurken; LoRA ve Quantization ile donanım maliyeti ve performans arasında denge kurulur. Geleceğin modelleri, daha büyük değil, veriyi daha efektif işleyen "akıllı" optimizasyon katmanlarına sahip olacaktır.