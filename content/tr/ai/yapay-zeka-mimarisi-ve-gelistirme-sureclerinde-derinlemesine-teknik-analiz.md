---
title: "Yapay Zeka Mimarisi ve Geliştirme Süreçlerinde Derinlemesine Teknik Analiz"
date: 2026-03-20
type: "ai"
draft: false
math: true
description: "Transformer mimarisinden RAG sistemlerine, Onion Architecture entegrasyonundan Edge AI ve TinyML optimizasyonlarına kadar yapay zeka geliştirme süreçlerini derinlemesine inceleyin. Kod örnekleri ve matematiksel modellerle desteklenmiş kapsamlı teknik analizdir."
featured_image: "/images/ai/yapay-zeka-mimarisi-ve-gelistirme-sureclerinde-derinlemesine-teknik-analiz.png"
tags: ["ai","veri-muhendisligi", "buyuk-veri", "yapay-zeka-mimarisi", "transformer-mimarisi", "derin-ogrenme", "makine-ogrenmesi"]
---

Modern yazılım ekosistemi, geleneksel deterministik algoritmaların ötesine geçerek, olasılıksal hesaplama ve derin öğrenme temelli yapılara evrilmektedir. Bu evrimin merkezinde yer alan modellerin "mutfağına" girmek, yalnızca hazır API'leri çağırmaktan ziyade, altta yatan matematiksel ve mimari yapı taşlarını anlamayı gerektirir. Bu yazıda, Transformer mimarisinden uç birim (Edge) hesaplamaya, mimari tasarım desenlerinden veriye dayalı üretim yöntemlerine kadar geniş bir teknik yelpaze incelenecektir.

{{< figure src="/images/ai/yapay-zeka-mimarisi-ve-gelistirme-sureclerinde-derinlemesine-teknik-analiz.png" alt="Yapay Zeka Mimarisi ve Geliştirme Süreçlerinde Derinlemesine Teknik Analiz" width="1200" caption="Şekil 1: Yapay Zeka Mimarisi ve Geliştirme Süreçlerinde Derinlemesine Teknik Analiz." >}}

---

### 1. Transformer Mimarisi ve Çok Başlı Dikkat (Multi-Head Attention) Mekanizmaları

Günümüzdeki Büyük Dil Modellerinin (LLM) başarısı, 2017 yılında tanıtılan Transformer mimarisine dayanmaktadır. Geleneksel RNN (Recurrent Neural Networks) veya LSTM (Long Short-Term Memory) modellerinin aksine Transformerlar, veriyi ardışık değil, paralel olarak işler.

#### Ölçekli Nokta Çarpım Dikkat (Scaled Dot-Product Attention)
Transformer’ın kalbi, bir kelimenin cümle içindeki diğer tüm kelimelerle olan ilişkisini matematiksel olarak hesaplayan "Attention" mekanizmasıdır. Bu işlem üç ana matris üzerinden yürütülür: **Query (Q)**, **Key (K)** ve **Value (V)**.

Matematiksel formülasyon şu şekildedir:
$$Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Burada $d_k$, anahtar vektörlerin boyutunu temsil eder ve skaler çarpımın büyümesini engelleyerek gradyanların stabilize edilmesini sağlar.



#### Multi-Head Attention Uygulama Örneği (Python/PyTorch)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super(MultiHeadAttention, self).__init__()
        self.num_heads = num_heads
        self.d_model = d_model
        assert d_model % num_heads == 0
        
        self.depth = d_model // num_heads
        
        self.wq = nn.Linear(d_model, d_model)
        self.wk = nn.Linear(d_model, d_model)
        self.wv = nn.Linear(d_model, d_model)
        
        self.dense = nn.Linear(d_model, d_model)
        
    def split_heads(self, x, batch_size):
        x = x.view(batch_size, -1, self.num_heads, self.depth)
        return x.permute(0, 2, 1, 3)

    def forward(self, v, k, q, mask):
        batch_size = q.size(0)
        
        q = self.split_heads(self.wq(q), batch_size)
        k = self.split_heads(self.wk(k), batch_size)
        v = self.split_heads(self.wv(v), batch_size)
        
        # Ölçekli nokta çarpım dikkati
        matmul_qk = torch.matmul(q, k.transpose(-1, -2))
        dk = torch.tensor(self.depth, dtype=torch.float32)
        scaled_attention_logits = matmul_qk / torch.sqrt(dk)
        
        if mask is not None:
            scaled_attention_logits += (mask * -1e9)
            
        attention_weights = F.softmax(scaled_attention_logits, dim=-1)
        output = torch.matmul(attention_weights, v)
        
        output = output.permute(0, 2, 1, 3).contiguous()
        concat_attention = output.view(batch_size, -1, self.d_model)
        
        return self.dense(concat_attention)
```

---

### 2. Onion Architecture (Soğan Mimarisi) ile AI Entegrasyonu

Yapay zeka servislerini bir yazılım projesine dahil ederken, iş mantığının (Domain Logic) teknolojik araçlara bağımlı hale gelmesi en büyük risklerden biridir. Onion Architecture, bu bağımlılığı tersine çevirerek çekirdek mantığı izole eder.

*   **Domain Layer:** AI modelinin girdileri ve çıktıları için gerekli olan "Entity" ve "Value Object" yapılarını barındırır.
*   **Application Layer:** LLM çağrılarını koordine eden interaktörler (Services) burada yer alır.
*   **Infrastructure Layer:** OpenAI, Hugging Face veya yerel bir Llama 3 modeline bağlanan somut implementasyonlar (Adapters) bu katmandadır.

#### Dependency Injection ile Model Soyutlama
Yazılımın bir gün GPT-4 kullanırken, ertesi gün yerel bir modele geçebilmesi için "Inversion of Control" prensibi uygulanmalıdır.

```csharp
public interface IAIService {
    Task<string> ProcessPromptAsync(string prompt);
}

// Infrastructure katmanında somutlama
public class OpenAIGateway : IAIService {
    public async Task<string> ProcessPromptAsync(string prompt) {
        // API çağrı mantığı
    }
}

// Domain/Application katmanında kullanım
public class TextAnalyzer {
    private readonly IAIService _aiService;
    public TextAnalyzer(IAIService aiService) => _aiService = aiService;
    
    public async Task Analyze(string text) {
        var result = await _aiService.ProcessPromptAsync(text);
        // Analiz işlemleri
    }
}
```

---

### 3. Edge AI ve TinyML: Kısıtlı Kaynaklarda Yapay Zeka

Bulut tabanlı yapay zeka çözümleri her zaman verimli olmayabilir (gecikme, maliyet veya gizlilik nedeniyle). Edge AI, modelin doğrudan ESP32, Arduino veya ARM tabanlı işlemciler üzerinde çalıştırılmasıdır.

#### Model Optimizasyon Teknikleri
Mikrodenetleyicilerde bellek (SRAM) kısıtlı olduğu için modellerin şu işlemlerden geçmesi gerekir:
1.  **Quantization (Nicemleme):** 32-bit float ağırlıkların 8-bit integer (INT8) formatına dönüştürülmesi.
2.  **Pruning (Budama):** Modelin çıktısına etkisi olmayan düşük ağırlıklı nöronların silinmesi.
3.  **Knowledge Distillation:** Büyük bir öğretici modelin (Teacher), küçük bir öğrenci modele (Student) bilgi aktarması.

#### TinyML Örneği: TensorFlow Lite for Microcontrollers
Arduino üzerinde bir ivmeölçer verisini sınıflandırmak için `tflite-micro` kütüphanesi kullanılır.

```cpp
#include <TensorFlowLite_ESP32.h>
#include "model_data.h" // Önceden eğitilmiş ve C dizisine dönüştürülmüş model

// Bellek havuzu tahsisi
const int kTensorArenaSize = 10 * 1024;
uint8_t tensor_arena[kTensorArenaSize];

void setup() {
  static tflite::MicroMutableOpResolver<5> resolver;
  resolver.AddFullyConnected();
  resolver.AddSoftmax();
  
  static tflite::MicroInterpreter interpreter(
      model, resolver, tensor_arena, kTensorArenaSize, error_reporter);
      
  interpreter.AllocateTensors();
}
```

---

### 4. RAG (Retrieval-Augmented Generation) Mekanizması

Statik LLM modelleri, eğitim verilerinin kesildiği tarihten sonraki bilgileri bilmezler. RAG, bu problemi modeli yeniden eğitmek yerine (Fine-tuning), modele dış kaynaklardan (vektör veri tabanları) ilgili dökümanları "hatırlatarak" çözer.

#### RAG İş Akış Hattı (Pipeline)
1.  **Ingestion:** PDF veya SQL verileri küçük parçalara (Chunks) bölünür.
2.  **Embedding:** Bu parçalar, anlamsal vektörlere dönüştürülür (örn: `sentence-transformers`).
3.  **Vector Store:** Vektörler, Pinecone, Milvus veya ChromaDB gibi veri tabanlarında saklanır.
4.  **Retrieval:** Kullanıcı sorusuna en benzer dökümanlar "Cosine Similarity" ile bulunur.
5.  **Generation:** Sorgu + Dökümanlar, LLM'e bağlam (context) olarak gönderilir.



#### LangChain ile RAG Uygulaması

```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 1. Doküman İşleme
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
texts = text_splitter.split_documents(documents)

# 2. Vektörleştirme ve Saklama
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma.from_documents(texts, embeddings, persist_directory="./db")

# 3. Geri Getirme (Retrieval)
query = "Sistemin güvenlik protokolleri nelerdir?"
docs = vector_db.similarity_search(query)

# 4. LLM Besleme
context = "\n".join([doc.page_content for doc in docs])
prompt = f"Bağlam: {context}\n\nSoru: {query}\nCevap:"
```

---

### Teknik Notlar ve Gelişmiş Stratejiler

> **Not 1: Vektör Uzayında Boyut Laneti**
> Vektör boyutları arttıkça (örn. 1536d), öklid mesafesi anlamsızlaşmaya başlar. RAG sistemlerinde genellikle "Cosine Similarity" tercih edilmelidir çünkü yönsel benzerlik, büyüklük farklarından daha kritiktir.

> **Not 2: Fine-Tuning vs RAG**
> Eğer sistemin yeni bilgiler öğrenmesi gerekiyorsa **RAG**, sistemin belirli bir stil, ton veya format kazanması gerekiyorsa **Fine-tuning (LoRA/QLoRA)** tercih edilmelidir.

> **Not 3: GPU Bellek Yönetimi**
> LLM'leri yerel olarak çalıştırırken (Self-hosting), KV Cache yönetimi bellek tüketimini doğrudan etkiler. **vLLM** gibi kütüphaneler PagedAttention kullanarak GPU belleğini dinamik olarak yönetir ve %20-40 oranında verimlilik artışı sağlar.

### Sonuç

Yapay zeka sistemlerinin geliştirilmesi; matematiksel modellemenin, sistem mimarisinin ve donanım kısıtlarının bir kesişim noktasıdır. Transformer mimarisinin teorik altyapısından, Onion Architecture'ın sağladığı modülerliğe ve RAG sistemlerinin dinamik veri yeteneğine kadar her katman, sürdürülebilir bir AI ekosistemi için hayati önem taşır. Geliştiricilerin sadece API tüketicisi olmaktan çıkıp bu alt sistemlere hakim olması, optimize edilmiş ve yüksek performanslı otonom sistemlerin inşasında anahtar rol oynamaktadır.