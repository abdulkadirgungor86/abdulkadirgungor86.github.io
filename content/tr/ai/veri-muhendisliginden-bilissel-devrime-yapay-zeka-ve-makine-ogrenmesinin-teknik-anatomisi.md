---
title: "Veri Mühendisliğinden Bilişsel Devrime Yapay Zeka ve Makine Öğrenmesinin Teknik Anatomisi"
date: 2026-04-15
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 1-] Bu kapsamlı teknik inceleme, kural tabanlı uzman sistemlerden modern transformatör mimarilerine ve üretken ağlara kadar yapay zekanın evrimsel sürecini, biyolojik analojiler ve yazılım dünyasındaki pratik uygulama katmanlarıyla derinlemesine analiz etmektedir."
featured_image: "/images/ai/veri-muhendisliginden-bilissel-devrime-yapay-zeka-ve-makine-ogrenmesinin-teknik-anatomisi.png"
tags: ["ai", "veri-analizi-okulu","vao", "python", "derin-ogrenme", "pytorch", "transformer", "veri-bilimi", "makine-ogrenmesi"]
---

Yapay zeka (AI), modern hesaplama teorisinin en uç noktasını temsil eden, veriyi algoritmik süreçler aracılığıyla anlamlı çıktılara, tahminlere ve otonom kararlara dönüştüren disiplinler arası bir alandır. Günümüzde bu yolculuk, basit kural tabanlı sistemlerden, milyarlarca parametreli devasa transformatör modellerine evrilmiştir. 

{{< figure src="/images/ai/veri-muhendisliginden-bilissel-devrime-yapay-zeka-ve-makine-ogrenmesinin-teknik-anatomisi.png" alt="Veri Mühendisliğinden Bilişsel Devrime Yapay Zeka ve Makine Öğrenmesinin Teknik Anatomisi" width="1200" caption="Şekil 1: Veri Mühendisliğinden Bilişsel Devrime Yapay Zeka ve Makine Öğrenmesinin Teknik Anatomisi." >}}

---

## 1. Tarihsel Perspektif ve Sembolik Yapay Zeka Yaklaşımı

Yapay zekanın ilk dönemleri, "Sembolik Yapay Zeka" veya "İyi Eski Moda Yapay Zeka" (GOFAI) olarak adlandırılan yaklaşımla şekillenmiştir. 1966 yılında Joseph Weizenbaum tarafından geliştirilen **ELIZA**, doğal dil işlemenin (NLP) en ilkel ama etkili örneklerinden biridir. ELIZA, örüntü eşleme (pattern matching) ve yer değiştirme metodolojisi kullanarak bir psikoterapisti taklit etmiştir. Teknik olarak ELIZA, bir öğrenme sürecinden ziyade, önceden tanımlanmış script’ler üzerinden çalışan bir string işleme motorudur.

1997 yılındaki **Deep Blue vs. Kasparov** karşılaşması ise arama uzayının optimizasyonu açısından bir dönüm noktasıdır. Deep Blue, "brute-force" arama kapasitesi ve "alpha-beta pruning" algoritması kullanarak saniyede 200 milyon satranç pozisyonunu analiz edebiliyordu. Ancak bu sistem de veriden öğrenmiyor, sadece uzmanlar tarafından girilen değerlendirme fonksiyonlarını (heuristic evaluation functions) kullanarak en iyi hamleyi hesaplıyordu.

---

## 2. Uzman Sistemler ve Karar Destek Mekanizmaları

Uzman sistemler, belirli bir etki alanındaki (domain) insan bilgisini "Eğer-İse" (IF-THEN) kuralları dizisine dönüştüren bilgi tabanlı sistemlerdir. Tıbbi tanı süreçlerinde kullanılan uzman sistemler, semptomları girdi olarak alır ve bir çıkarım motoru (inference engine) aracılığıyla sonuç üretir.

### Teknik Örnek Karar Destek Mekanizmasının Python ile Modellenmesi

Aşağıda, bir inme vakası için karar destek mekanizmasının basit bir mantıksal modellemesi yer almaktadır. Bu yapı, kuralların kod içine nasıl gömüldüğünü göstermektedir:

```python
class StrokeExpertSystem:
    def __init__(self):
        # Bilgi tabanı: Belirli semptomların ağırlıklarını tanımlıyoruz
        self.knowledge_base = {
            "facial_droop": 0.4,
            "speech_difficulty": 0.4,
            "arm_weakness": 0.2
        }

    def infer_diagnosis(self, patient_symptoms):
        confidence_score = 0
        for symptom, is_present in patient_symptoms.items():
            if is_present:
                confidence_score += self.knowledge_base.get(symptom, 0)
        
        # Karar eşiği %60 olarak belirlenmiştir
        if confidence_score >= 0.6:
            return "Ön Tanı: İskemik İnme Şüphesi. Acil CT taraması önerilir."
        return "Semptomlar eşik değerin altında, alternatif tanılar değerlendirilmeli."

patient = {"facial_droop": True, "speech_difficulty": True, "arm_weakness": False}
expert = StrokeExpertSystem()
print(expert.infer_diagnosis(patient))

```

Bu sistemler deterministiktir; yani aynı girdiye her zaman aynı çıktıyı verirler ve sistemin dışına çıkma yetenekleri yoktur.

---

## 3. Makine Öğrenmesi ve Matematiksel Modelleme Süreçleri

Makine öğrenmesi, kural tabanlı sistemlerden farklı olarak, verideki gizli örüntüleri istatistiksel yöntemlerle bulan ve bir $f(x) = y$ fonksiyonu inşa eden süreçtir. Burada amaç, hata fonksiyonunu (loss function) minimize ederek modelin ağırlıklarını ($w$) optimize etmektir.

### Genelleme ve Ezberleme Arasındaki Kritik Denge

* **Genelleme (Generalization):** Modelin eğitim verisinde görmediği yeni veriler üzerinde doğru tahminlerde bulunma yeteneğidir.
* **Ezberleme (Overfitting):** Modelin verideki gürültüyü (noise) öğrenmesi ve sadece eğitim setinde yüksek başarı gösterip gerçek dünyada başarısız olmasıdır. Genellikle regülarizasyon (L1, L2) teknikleri ile kontrol edilir.

---

## 4. Derin Öğrenme ve Katmanlı Sinir Ağları

Derin öğrenme (Deep Learning), yapay sinir ağlarının (ANN) çok sayıda gizli katman (hidden layers) eklenerek karmaşık hale getirilmiş formudur. Her katman, verinin daha soyut bir temsilini öğrenir.

### Backpropagation Algoritması ve Hata Dağıtımı

Backpropagation (Geri Yayılım), ağın yaptığı hatayı çıkış katmanından giriş katmanına doğru dağıtarak ağırlıkları güncelleyen temel algoritmadır. Gradyan inişi (Gradient Descent) ile birlikte çalışır. Matematiksel olarak, zincir kuralı (chain rule) kullanılarak her ağırlığın toplam hata üzerindeki kısmi türevi (${\partial E}/{\partial w}$) hesaplanır.

### Modern Bir Derin Öğrenme Katmanının PyTorch ile İnşası

```python
import torch
import torch.nn as nn
import torch.optim as optim

class DeepModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(DeepModel, self).__init__()
        # Girişten gizli katmana geçiş
        self.layer1 = nn.Linear(input_dim, hidden_dim) 
        # Doğrusal olmayan aktivasyon: ReLU
        self.activation = nn.ReLU() 
        # Gizli katmandan çıkışa geçiş
        self.layer2 = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        x = self.layer1(x)
        x = self.activation(x)
        x = self.layer2(x)
        return x

# Hiperparametreler ve Optimizasyon
model = DeepModel(input_dim=1024, hidden_dim=512, output_dim=10)
optimizer = optim.Adam(model.parameters(), lr=1e-4)
criterion = nn.CrossEntropyLoss()

```

---

## 5. Üretken Yapay Zeka ve Çekişmeli Öğrenme Mimarileri

Üretken Yapay Zeka (Generative AI), sadece sınıflandırma yapmakla kalmaz, yeni veri sentezler. Burada en dikkat çekici mimari **Generative Adversarial Networks (GAN)** yani Çekişmeli Üretici Ağlardır.

Bu mimari iki ağın rekabetine dayanır:

1. **Generator (Üretici):** Rastgele gürültüden başlayarak gerçek veriye benzeyen örnekler üretir.
2. **Discriminator (Ayırt Edici):** Verinin gerçek mi yoksa üretici tarafından mı yapıldığını anlamaya çalışan bir "denetçi" görevi görür.

Bu süreçte kullanılan "Minimax" oyun teorisi yaklaşımı, iki ağın birbirini geliştirmesini sağlayarak sentetik veri üretiminde devrim yaratmıştır.

---

## 6. Transformatör Modelleri ve Dikkat Mekanizması Devrimi

2017 yılında Google araştırmacıları tarafından yayınlanan **"Attention is All You Need"** makalesi, bugünkü LLM (Büyük Dil Modelleri) çağını başlatan Transformer mimarisini tanıttı. Transformer'lar, veriyi ardışık olarak işlemek yerine "Self-Attention" mekanizması ile verideki tüm öğelerin birbirleriyle olan bağlamını eşzamanlı olarak hesaplar.

Bu mekanizma sayesinde model, uzun cümlelerdeki uzak kelimelerin birbiri üzerindeki etkisini (context) kaybetmeden analiz eder. Bugün kullandığımız gelişmiş doğal dil işleme sistemlerinin kalbinde bu paralel işlem yeteneği yatmaktadır.

---

## 7. Biyolojik Tasarruf ve Algoritmik Verimlilik İlişkisi

Doğada zeka, her zaman enerji maliyetiyle dengelenmiştir. **Tunikat (Deniz Fışkırtması)** adlı canlı, larva evresinde hareket etmek ve kendine uygun bir yuva bulmak için bir beyne ihtiyaç duyar. Ancak bir yüzeye tutunup sabit bir yaşam formuna geçtiğinde, artık karmaşık karar verme mekanizmalarına ihtiyaç duymaz ve metabolik tasarruf amacıyla kendi beynini sindirir.

Yapay zeka sistemlerinde de benzer bir "evrimsel tasarruf" süreci uygulanmaktadır. Devasa modellerin (over-parameterized) enerji tüketimini azaltmak için şu teknikler kullanılır:

* **Pruning (Budama):** Önemsiz ağırlıkların ağdan temizlenmesi.
* **Quantization (Niceleme):** Ağırlıkların 32-bit yerine 8-bit veya 4-bit gibi daha düşük hassasiyetle saklanması.
* **Knowledge Distillation:** Büyük bir modelin (Teacher) bilgisinin daha küçük ve hızlı bir modele (Student) aktarılması.

---

## 8. Teknik Analiz ve Yazılım Kaynakları Özeti

Geleceğin yapay zeka sistemleri, sadece daha fazla veriyle değil, daha anlamlı ve açıklanabilir (Explainable AI) süreçlerle şekillenecektir. Verinin saf halinden "zekaya" dönüşme süreci, yazılım ve donanımın mükemmel bir uyumuyla mümkündür.

### Kullanılan Temel Kütüphaneler ve Araç Setleri

1. **NumPy ve Pandas:** Veri ön işleme ve matris matematiği için vazgeçilmezdir.
2. **Scikit-Learn:** Kümeleme (K-Means), boyut indirgeme (PCA) ve klasik sınıflandırma algoritmaları için standarttır.
3. **TensorFlow ve PyTorch:** Karmaşık derin öğrenme mimarilerinin inşa edildiği ana çatılardır.
4. **Hugging Face:** Hazır eğitilmiş Transformer modellerine ve veri setlerine erişim sağlayan ekosistemdir.
5. **OpenCV:** Görüntü işleme ve bilgisayarlı görü projelerinde veri hazırlama katmanı olarak kullanılır.

### Önemli Geliştirici Notları

* **Memory Management:** Büyük modellerle çalışırken CUDA bellek yönetimi hayati önem taşır. `torch.cuda.empty_cache()` gibi komutlar GPU üzerindeki gereksiz yükleri temizlemek için kritiktir.
* **Data Pipeline:** Verinin diskten GPU'ya taşınması sırasında darboğaz oluşmaması için "Multi-processing" destekli veri yükleyiciler kullanılmalıdır.
* **Explainability:** Modelin bir tahmini neden yaptığını anlamak için SHAP veya LIME kütüphaneleri ile özelliklerin (feature) etkisi analiz edilmelidir.

Zeka, verinin doğru şekilde yapılandırılması ve amaca yönelik işlenmesiyle ortaya çıkan bir yan üründür. Bugünün sistemleri insan bilincini henüz taklit edemese de, belirli görevlerde insan üstü performans sergilemeye devam etmektedir.

