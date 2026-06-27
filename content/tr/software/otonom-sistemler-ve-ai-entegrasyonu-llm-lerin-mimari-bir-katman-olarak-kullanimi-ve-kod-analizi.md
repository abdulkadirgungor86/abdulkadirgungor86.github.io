---
title: "Otonom Sistemler ve AI Entegrasyonu: LLM'lerin Mimari Bir Katman Olarak Kullanımı ve Kod Analizi"
date: 2026-04-08
type: "software"
draft: false
math: true
description: "Otonom sistemlerde LLM'lerin bilişsel bir mimari katman olarak yapılandırılmasını, ReAct karar mekanizmaları ve fonksiyon çağrısı (tool use) üzerinden teknik bir derinlikle inceleyen kapsamlı çalışmadır."
featured_image: "/images/software/otonom-sistemler-ve-ai-entegrasyonu-llm-lerin-mimari-bir-katman-olarak-kullanimi-ve-kod-analizi.png"
tags: ["yazilim", "software", "otonom-sistemler", "yapay-zeka-entegrasyonu", "llm", "robotik-kodlama", "ai", "buyuk-dil-modelleri", "python", "makine-ogrenmesi"]
---

Otonom sistemlerin evrimi, klasik kontrol teorilerinden ve deterministik algoritmalardan, bilişsel yeteneklere sahip dinamik yapılara doğru evrilmektedir. Geleneksel robotik ve otonom sistemler, önceden tanımlanmış karar ağaçları ve sensör füzyonu algoritmalarıyla sınırlıydı. Ancak, Büyük Dil Modellerinin (LLM) sistemsel bir "mimari katman" olarak entegrasyonu, bu sistemlerin belirsizlik yönetimi ve karmaşık görev planlama kapasitesini kökten değiştirmiştir.

{{< figure src="/images/software/otonom-sistemler-ve-ai-entegrasyonu-llm-lerin-mimari-bir-katman-olarak-kullanimi-ve-kod-analizi.png" alt="Otonom Sistemler ve AI Entegrasyonu: LLM'lerin Mimari Bir Katman Olarak Kullanımı ve Kod Analizi" width="1200" caption="Şekil 1: Otonom Sistemler ve AI Entegrasyonu: LLM'lerin Mimari Bir Katman Olarak Kullanımı ve Kod Analizi" >}}

---

### 1. LLM Tabanlı Otonom Mimari Katmanları

Bir otonom sistemde LLM, sadece bir metin arayüzü değil, sistemin "Prefrontal Korteks"i gibi işlev görür. Bu mimari genellikle dört ana katmandan oluşur:

*   **Algılama ve Vektörleştirme Katmanı:** Sensör verilerinin (LiDAR, Kamera, IMU) veya yapılandırılmamış metin verilerinin sayısal vektörlere (embeddings) dönüştürüldüğü aşamadır.
*   **Bilişsel Planlama (Reasoning) Katmanı:** LLM'in "Düşünce Zinciri" (Chain of Thought - CoT) protokollerini kullanarak karmaşık görevleri alt görevlere böldüğü merkezdir.
*   **Bellek Yönetimi (Memory Management):** Kısa süreli bellek (context window) ve uzun süreli bellek (Vektör Veritabanları - RAG) arasındaki veri akışını yönetir.
*   **Eylem ve Kontrol Katmanı (Action Layer):** LLM çıktılarının (genellikle JSON veya Python kodu) sistem çağrılarına veya motor sürücülerine (ROS2 düğümleri gibi) iletildiği katmandır.

---

### 2. Otonom Ajanlarda "Düşünce Zinciri" ve ReAct Yaklaşımı

Otonom sistemlerde LLM'lerin karar verme mekanizması genellikle **ReAct (Reason + Act)** paradigması üzerine kurulur. Bu yaklaşımda model, önce bir gözlem yapar (Observation), bu gözlem üzerine bir muhakeme yürütür (Thought) ve ardından bir eylem (Action) gerçekleştirir.

#### Teknik Analiz: ReAct Döngüsü

Bir robotik kolun karmaşık bir nesneyi ayırması senaryosunda LLM şu mantıksal akışı izler:
1.  **Düşünce:** "Masanın üzerinde bir kırmızı küp ve bir mavi silindir var. Kırmızı küpü kutuya koymam istendi."
2.  **Eylem:** `get_object_coordinates("red_cube")` -> `move_arm(x, y, z)`
3.  **Gözlem:** "Küp kavrandı ancak ağırlık dengesi bozuldu."
4.  **Düşünce:** "Tutuş açısını 15 derece optimize etmeliyim."



---

### 3. Kod Analizi: LLM Entegrasyonu ve Araç Kullanımı (Tool Use)

Modern otonom sistemlerde LLM'ler, doğrudan donanımı kontrol etmek yerine API'lar veya özel fonksiyonlar (tools) üzerinden etkileşime girer. Aşağıda, Python dilinde **LangChain** ve **Pydantic** kütüphanelerini kullanarak bir otonom ajan prototipi örneği verilmiştir.

```python
import os
from typing import List
from langchain.agents import Tool, AgentExecutor, LLMSingleActionAgent
from langchain.prompts import StringPromptTemplate
from langchain_openai import OpenAI
from pydantic import BaseModel, Field

# Otonom Sistemin Yeteneklerini Tanımlayan Sınıf
class RobotController(BaseModel):
    """Robotik donanım üzerinde doğrudan kontrol sağlayan API."""
    
    def move_to_target(self, coordinates: str):
        # Donanım seviyesinde motor sürücülerine komut gönderimi (Örn: ROS2 Publisher)
        print(f"Hareket ediliyor: {coordinates}")
        return "Hedefe ulaşıldı."

    def scan_environment(self, sensor_type: str):
        # LiDAR veya Kamera verisi analizi
        print(f"{sensor_type} ile çevre taranıyor...")
        return "Engel tespit edilmedi."

# LLM'in kullanabileceği araçların (Tools) tanımlanması
controller = RobotController()
tools = [
    Tool(
        name="Navigator",
        func=controller.move_to_target,
        description="Robotun belirli koordinatlara gitmesini sağlar."
    ),
    Tool(
        name="Scanner",
        func=controller.scan_environment,
        description="Çevredeki engelleri sensörler aracılığıyla tespit eder."
    )
]

# Prompt Mühendisliği: Sistemin davranış sınırlarını belirleme
template = """Sen bir otonom keşif robotusun. 
Görevin, verilen hedeflere güvenli bir şekilde ulaşmaktır.
Şu araçlara erişimin var: {tools}

Akış:
Soru: Yapman gereken görev
Düşünce: Ne yapman gerektiğini düşün
Eylem: Kullanılacak araç [{tool_names}]
Eylem Girdisi: Araca gönderilecek veri
Gözlem: Aracın sonucu
... (bu Düşünce/Eylem/Gözlem döngüsü 3 kez tekrarlanabilir)
Düşünce: Artık nihai cevabı biliyorum.
Nihai Cevap: Görevin tamamlanma durumu.

Görev: Mutfaktaki masanın yanına git ve yolu tara.
"""
```

Bu kod bloğunda, LLM'e sadece metin üretme görevi verilmemiş, aynı zamanda `Navigator` ve `Scanner` gibi fiziksel dünya ile etkileşime giren "fonksiyonlar" atanmıştır. Bu, otonom sistemlerde **Functional Call** (Fonksiyon Çağrısı) mekanizmasının temelidir.

---

### 4. Yazılım Kaynakları ve Kritik Kütüphaneler

Otonom sistemler ve AI entegrasyonunda endüstri standardı haline gelmiş kütüphaneler şunlardır:

*   **LangChain / LangGraph:** Karmaşık ajan döngüleri ve durumsal yönetim (state management) için kullanılır. Özellikle LangGraph, otonom süreçleri bir "yönlendirilmiş döngüsel olmayan grafik" (DAG) yerine döngüsel bir grafik olarak modellemeye olanak tanır.
*   **AutoGPT / BabyAGI:** Otonom görev yönetimi ve kendi kendine hedef belirleme algoritmalarının öncüleridir.
*   **Hugging Face Transformers / Accelerate:** Modellerin yerel cihazlarda (Edge AI) optimize edilmiş şekilde çalıştırılmasını sağlar.
*   **LlamaIndex (GPT Index):** Otonom sistemin "bilgi tabanı" ile (PDF'ler, sensör logları, veritabanları) etkileşimini optimize eden RAG (Retrieval-Augmented Generation) kütüphanesidir.
*   **ROS2 (Robot Operating System):** LLM çıktılarını fiziksel robot hareketlerine dönüştüren ara katman yazılımıdır. `micro-ROS` ile gömülü sistemlerle haberleşme sağlanır.

---

### 5. Mimari Katman Olarak LLM'in Dezavantajları ve "Guardrails" Mekanizması

Otonom sistemlerde LLM kullanımı, **Hallucination** (Halüsinasyon) riski nedeniyle kritik güvenlik açıklarına yol açabilir. Robotik bir sistemin, olmayan bir nesneyi varmış gibi algılayıp manevra yapması felaketle sonuçlanabilir.

Bu riskleri minimize etmek için **Guardrails (Güvenlik Duvarları)** katmanı kullanılır.
*   **NVIDIA NeMo-Guardrails:** LLM çıktılarını belirli politikalar çerçevesinde filtreler.
*   **Pydantic Output Parsing:** LLM'den gelen çıktının belirli bir veri yapısında (Örn: float koordinat listesi) olup olmadığını çalışma zamanında doğrular.

> **Teknik Not:** Otonom sistemlerde determinizm sağlamak için LLM sıcaklığı (temperature) genellikle `0.0` değerine ayarlanmalıdır. Bu, modelin her seferinde en yüksek olasılıklı (ve en tutarlı) cevabı üretmesini sağlar.

---

### 6. Gelecek Perspektifi: Multimodal Otonomi

Geleceğin otonom sistemleri sadece metin tabanlı LLM'lerden değil, **VLM (Vision-Language Models)** yani Görsel-Dil Modellerinden güç alacaktır. Bu modeller, bir kameradan gelen görüntüyü "token" seviyesinde işleyerek, metne ihtiyaç duymadan doğrudan uzamsal mantık yürütebilir. 

Örneğin, **Google RT-2 (Robotic Transformer 2)**, görsel veriyi doğrudan motor komutlarına (tokenized actions) dönüştürerek, LLM'lerin semantik bilgisini robotik kontrolün hassasiyetiyle birleştirmiştir.

### Sonuç

LLM'lerin otonom sistemlere mimari bir katman olarak eklenmesi, "akıllı" sistemlerden "bilinçli" (akıl yürüten) sistemlere geçişin anahtarıdır. Kod analizi ve mimari yaklaşımlar göstermektedir ki; başarı, modelin büyüklüğünde değil, bu modelin fiziksel dünya araçlarıyla (Tools) ne kadar sıkı ve güvenli entegre edildiğindedir. Geliştiriciler için odak noktası artık sadece model eğitimi değil, bu modelleri otonom döngülerde hatasız çalıştıracak "orkestrasyon" katmanları olmalıdır.