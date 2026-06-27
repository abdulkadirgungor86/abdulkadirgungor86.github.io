---
title: "Modern Makine Öğrenmesinde Hassas Dengeler ve Stratejik Yaklaşımlar"
date: 2026-04-22
type: "ai"
draft: false
math: true
description: "[-Veri Analiz Okulu, Notlar 8-] Bu yazı, Destek Vektör Makineleri'nin geometrik optimizasyon stratejileri ile Pekiştirmeli Öğrenme'nin ödül odaklı karar verme mekanizmalarını ve Markov Karar Süreçleri'nin matematiksel temellerini teknik bir derinlikle analiz etmektedir."
featured_image: "/images/ai/modern-makine-ogrenmesinde-hassas-dengeler-ve-stratejik-yaklasimlar.png"
tags: ["ai", "veri-analizi-okulu","vao", "python", "svm", "derin-ogrenme", "pekistirmeli-ogrenme", "algoritma-analiz", "makine-ogrenmesi"]
---

Yapay zeka ekosistemi, veriden anlam çıkarma ve bu anlamı eyleme dönüştürme süreçlerinde iki devasa sütun üzerine yükselir: Geometrik sınırlar çizen denetimli öğrenme algoritmaları ve deneyim odaklı karar verme mekanizmaları olan pekiştirmeli öğrenme modelleri. Günümüzün karmaşık veri setlerinde sadece doğru tahmin yapmak yetmez; gürültüye karşı direnç göstermek ve dinamik ortamlarda en iyi stratejiyi geliştirmek hayati önem taşır. 

{{< figure src="/images/ai/modern-makine-ogrenmesinde-hassas-dengeler-ve-stratejik-yaklasimlar.png" alt="Modern Makine Öğrenmesinde Hassas Dengeler ve Stratejik Yaklaşımlar" width="1200" caption="Şekil 1: Modern Makine Öğrenmesinde Hassas Dengeler ve Stratejik Yaklaşımlar." >}}

---

## Destek Vektör Makineleri ve Maksimum Marj Optimizasyonu

Destek Vektör Makineleri (Support Vector Machine - SVM), temelde bir sınıflandırma problemini yüksek boyutlu bir uzayda optimal hiper düzlemi bulma problemine indirger. Ancak SVM'i sıradan bir lojistik regresyondan ayıran temel fark, **"maksimum marj" (maximum margin)** ilkesidir.

### Hiper Düzlem ve Geometrik Dayanıklılık

Bir veri setini iki sınıfa ayıran sonsuz sayıda doğru (veya hiper düzlem) çizilebilir. Ancak bu doğruların çoğu, gürültülü bir veri noktasıyla karşılaştığında yanlış sınıflandırma yapmaya meyillidir. SVM, sınıflar arasındaki boşluğu (tampon bölgeyi) en geniş tutan hiper düzlemi seçer. Bu genişlik matematiksel olarak $2/\|w\|$ formülü ile ifade edilir. Burada $\|w\|$, düzlemin normal vektörünün normudur. Marjı maksimize etmek, $\|w\|^2/2$ değerini minimize etmeye eşdeğerdir ve bu bir kuadratik programlama problemidir.

### Hard Margin ve Soft Margin Ayrımı

Eğer veri setimiz kusursuz bir şekilde doğrusal olarak ayrılabiliyorsa, **Hard Margin SVM** kullanılır. Burada hiçbir hata toleransı yoktur:


$$y_i(w \cdot x_i + b) \geq 1$$


Ancak gerçek dünya verileri gürültülüdür ve bazen sınıflar iç içe geçer. Bu durumda devreye **Soft Margin** girer. $\xi$ (slack variables) dediğimiz gevşeklik değişkenleri eklenerek, belirli bir ceza ($C$ parametresi) karşılığında bazı noktaların marjı ihlal etmesine izin verilir. $C$ parametresi, marj genişliği ile eğitim hatası arasındaki dengeyi kuran kritik bir hiperparametredir.

### Kernel Trick: Düşük Boyuttan Yüksek Boyuta Sıçrayış

Veri doğrusal olarak ayrılamadığında (örneğin dairesel bir dağılım), veriyi daha yüksek bir boyuta taşımak gerekir. Ancak yüksek boyutta koordinat hesaplamak maliyetlidir. **Kernel Trick**, veriyi gerçekten taşımadan, düşük boyuttaki noktaların iç çarpımlarını kullanarak yüksek boyuttaki etkileşimi hesaplamamızı sağlar.

**Yaygın Kernel Fonksiyonları:**

* **Linear Kernel:** $K(x, y) = x \cdot y$
* **Polynomial Kernel:** $K(x, y) = (x \cdot y + c)^d$
* **RBF (Gaussian) Kernel:** $K(x, y) = \exp(-\gamma \|x - y\|^2)$

#### Python ile SVM Uygulama Örneği

```python
import numpy as np
from sklearn import svm
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Veri Hazırlığı ve Ölçeklendirme
# SVM ölçek farkına karşı çok hassastır, bu yüzden StandartScaler şarttır.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Modelin Kurulması (RBF Kernel ve C Parametresi ile)
clf = svm.SVC(kernel='rbf', C=1.0, gamma='scale')
clf.fit(X_train, y_train)

# Destek Vektörlerine Erişim
support_vectors = clf.support_vectors_
print(f"Destek Vektör Sayısı: {len(support_vectors)}")

```

---

## Pekiştirmeli Öğrenme ve Karar Verme Mekanizmaları

Pekiştirmeli Öğrenme (Reinforcement Learning - RL), bir ajanın (agent) bir çevre (environment) içerisinde ödülleri maksimize etmek için eylemler gerçekleştirdiği bir öğrenme paradigmasıdır. Denetimli öğrenmenin aksine, burada ajana ne yapması gerektiği söylenmez; ajan hangi eylemin daha çok ödül getirdiğini deneyerek keşfeder.

### Ajan ve Çevre Etkileşimi

Süreç, ajanın mevcut durumu ($S_t$) gözlemlemesiyle başlar. Ajan bir aksiyon ($A_t$) seçer ve çevre buna karşılık bir sonraki durumu ($S_{t+1}$) ve bir ödül ($R_{t+1}$) döndürür. Bu döngü, ajanın kümülatif ödülü maksimize eden bir **politika (policy - $\pi$)** geliştirmesine kadar sürer.

### Bölümlü ve Sürekli Görevler

1. **Bölümlü Görevler (Episodic):** Bir başlangıç ve bitiş noktası vardır (Örn: Bir satranç maçı). Toplam getiri, adımların toplamıdır.
2. **Sürekli Görevler (Continuing):** Doğal bir sonu yoktur (Örn: Bir fabrikanın enerji yönetimi). Burada sonsuz toplamın yakınsaması için **iskonto faktörü ($\gamma$)** kullanılır:

$$G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots$$



$\gamma = 0$ ise ajan miyoptur (sadece anlık ödüle bakar), $\gamma \to 1$ ise ajan stratejik ve uzun vadeli düşünür.

---

## Markov Karar Süreçleri: RL'in Matematiksel İskeleti

RL problemlerinin çoğu Markov Karar Süreçleri (MDP) çerçevesinde modellenir. Bir sürecin "Markov" özelliğine sahip olması, geleceğin sadece şimdiki ana bağlı olması, geçmişin ise önemsiz olması demektir.

### MDP Bileşenleri

* **Durum Kümesi ($S$):** Ajanın bulunabileceği tüm pozisyonlar.
* **Eylem Kümesi ($A$):** Yapılabilecek hamleler.
* **Geçiş Olasılığı ($P$):** $P(s' | s, a)$ formülü ile ifade edilir; $s$ durumunda $a$ aksiyonu yapıldığında $s'$ durumuna geçme ihtimalidir.
* **Ödül Fonksiyonu ($R$):** Yapılan eylemin kalitesini belirleyen sayısal değer.

### Değer Fonksiyonları ve Bellman Denklemleri

Bir durumun ne kadar "iyi" olduğunu anlamak için **Durum Değer Fonksiyonu ($V(s)$)** ve bir durumda belirli bir aksiyonu almanın ne kadar iyi olduğunu anlamak için **Aksiyon Değer Fonksiyonu ($Q(s, a)$)** kullanılır. Optimal değer fonksiyonları, Bellman denklemleri aracılığıyla özyinelemeli (recursive) olarak çözülür.

---

## Keşif ve Sömürü Dengesi (Exploration vs. Exploitation)

RL'in en büyük paradoksu budur. Ajan, bildiği en iyi yolu mu izlemeli (exploitation), yoksa daha iyi bir yol olup olmadığını görmek için yeni yollar mı denemeli (exploration)?

En yaygın çözüm **$\epsilon$-greedy** yaklaşımıdır:

* Küçük bir olasılıkla ($\epsilon$) rastgele bir aksiyon seçilir (Keşif).
* Geri kalan büyük olasılıkla ($1-\epsilon$) mevcut en iyi aksiyon seçilir (Sömürü).

#### Basit Bir Q-Learning Yapısı

```python
import numpy as np

# Q-tablosunu başlat (Durum x Aksiyon boyutunda)
q_table = np.zeros([state_space_size, action_space_size])

# Hiperparametreler
learning_rate = 0.1
discount_factor = 0.95
epsilon = 0.1

for episode in range(1000):
    state = env.reset()
    done = False
    
    while not done:
        # Epsilon-greedy ile aksiyon seçimi
        if np.random.uniform(0, 1) < epsilon:
            action = env.action_space.sample()
        else:
            action = np.argmax(q_table[state])
            
        next_state, reward, done, _ = env.step(action)
        
        # Q-Value Güncelleme (Bellman Denklemine Dayalı)
        old_value = q_table[state, action]
        next_max = np.max(q_table[next_state])
        
        new_value = (1 - learning_rate) * old_value + learning_rate * (reward + discount_factor * next_max)
        q_table[state, action] = new_value
        state = next_state

```

---

## SVM ve RL Arasındaki Temel Farklar ve Kullanım Alanları

Her iki teknoloji de yapay zekanın parçası olsa da, uygulama sahaları ve mantıkları taban tabana zıttır:

| Özellik | Destek Vektör Makineleri (SVM) | Pekiştirmeli Öğrenme (RL) |
| --- | --- | --- |
| **Öğrenme Türü** | Denetimli (Supervised) | Etkileşimli (Interactive) |
| **Veri Gereksinimi** | Etiketlenmiş veri setleri | Çevre ile canlı etkileşim |
| **Temel Amaç** | Veriyi hiper düzlemle ayırmak | Kümülatif ödülü maksimize etmek |
| **Karar Yapısı** | Statik (Tek seferlik tahmin) | Dinamik (Sıralı kararlar) |
| **Hassasiyet** | Özellik ölçeklendirmeye çok duyarlı | Keşif/Sömürü dengesine duyarlı |

### Son Notlar ve Teknik Öneriler

Veri biliminde başarı, doğru algoritmayı seçmekten ziyade, algoritmanın içsel mekanizmalarına hakim olmaktan geçer. SVM kullanırken verinin normalize edilmesi ve doğru kernel seçimi modelin gürültü direncini belirler. RL tarafında ise ödül fonksiyonunun tasarımı (reward shaping), ajanın "hile" yapıp yapmayacağını veya gerçekten hedefi öğrenip öğrenmeyeceğini tayin eder.

Özellikle yüksek boyutlu ve gürültülü verilerde SVM'in **Dual Form** üzerinden çözülmesi, kernel trick avantajını kullanarak hesaplama maliyetini düşürür. RL projelerinde ise karmaşık durum uzaylarını yönetmek için derin öğrenme ile RL'in birleşimi olan **Deep Q-Networks (DQN)** gibi modern mimarilerin tercih edilmesi, ajanın genelleme yeteneğini artıracaktır.