---
title: "Sürü Robotik Sistemlerinde Kolektif Zeka ve Dinamik Görev Alokasyonu"
date: 2026-05-09
type: "blog"
draft: false
math: true
description: "Sürü robotik sistemlerinde kolektif zeka, dinamik görev paylaşımı ve dağıtık kontrol mekanizmalarının teknik temellerini, algoritmik yaklaşımlar ve yazılım kütüphaneleriyle birlikte inceleyen teknik blog yazısıdır."
featured_image: "/images/blog/suru-robotik-sistemlerinde-kolektif-zeka-ve-dinamik-gorev-alokasyonu.png"
tags: ["blog","robotics", "robotik", "otonom","suru-robotigi", "coklu-ajan-sistemleri","gorev-dagilimi","ros2","kolektif-karar-verme","dagitik-sistemler","swarm-intelligence","akilli-robotlar" ]
---

Sürü robotiği, doğadaki sosyal organizmaların (karıncalar, arılar veya kuşlar) sergilediği kolektif davranışları temel alan, merkezi olmayan kontrol mekanizmalarına odaklanan bir robotik alt dalıdır. Tek bir sofistike robot yerine, sınırlı yeteneklere sahip çok sayıda ajanın etkileşimiyle karmaşık görevlerin yerine getirilmesi hedeflenir.

{{< figure src="/images/blog/suru-robotik-sistemlerinde-kolektif-zeka-ve-dinamik-gorev-alokasyonu.png" alt="Sürü Robotik Sistemlerinde Kolektif Zeka ve Dinamik Görev Alokasyonu" width="1200" caption="Şekil 1: Sürü Robotik Sistemlerinde Kolektif Zeka ve Dinamik Görev Alokasyonu." >}}

---

## 1. Mimari Temeller: Merkeziyetçilikten Dağıtık Sisteme Geçiş

Klasik robotik yaklaşımlarında "Merkezi Kontrol Ünitesi" (MCU), tüm verileri toplar ve her bir birime komut gönderir. Ancak sürü sistemlerinde bu durum, tek bir hata noktasının (single point of failure) tüm sistemi çökertmesine neden olur. Dağıtık sistemlerde ise her ajan yerel bilgilerle hareket eder.

### Swarm Robotik Prensipleri:

* **Ölçeklenebilirlik:** Ajan sayısının artması algoritmanın karmaşıklığını lineer olmayan şekilde etkilememelidir.
* **Esneklik (Robustness):** Birkaç robotun bozulması görevin başarısını engellememelidir.
* **Yerellik:** Robotlar yalnızca yakın çevrelerindeki arkadaşlarıyla ve ortamla etkileşime girmelidir.

---

## 2. Kolektif Karar Verme Mekanizmaları

Sürü robotlarında kararlar, bir lider tarafından verilmez; aksine, bireysel etkileşimlerin bir sonucu olarak ortaya çıkar. Bu durum, istatistiksel mekanik ve olasılıksal modellerle açıklanır.

### Çoğunluk Kuralı ve Eşik Değer Modelleri

Ajanlar, çevrelerindeki diğer ajanların durumlarını gözlemler. Eğer belirli bir eşik değerin (threshold) üzerinde ajan aynı davranışı sergiliyorsa, birey de o yönde karar değiştirir. Bu, özellikle "consensus" (fikir birliği) gerektiren durumlarda kritiktir.

### Olasılıksal Durum Geçişleri

Robotlar, Markov Zinciri (Markov Chain) modellerini kullanarak bir durumdan diğerine geçerler. Örneğin, bir nesneyi taşıma görevinde, nesnenin ağırlığına göre daha fazla yardım çağırma olasılığı artar.

---

## 3. Dinamik Görev Dağılımı Algoritmaları

Görev dağılımı, sistemin toplam verimliliğini maksimize etmek için ajanların rollere atanması sürecidir. Teknik literatürde en çok kullanılan yöntemler şunlardır:

### Pheromone Tabanlı Dağılım (Stigmergy)

Karıncaların iz bırakma davranışından esinlenilir. Dijital "feromonlar", robotların geçtikleri yollara veya tamamladıkları görevlerin üzerine bıraktıkları veri paketleridir. Yüksek feromon yoğunluğu, o görevin önceliğini veya yolun verimliliğini simgeler.

### Market Tabanlı Yaklaşımlar (Auction-Based)

Ajanlar görevler için "teklif" verir. Bir görevi en düşük maliyetle (en yakın mesafe veya en yüksek enerji seviyesi) tamamlayabilecek olan robot, görevi üstlenir.

---

## 4. Yazılım ve Kütüphane Ekosistemi

Sürü robotik sistemlerini simüle etmek ve gerçek donanıma aktarmak için özelleşmiş kütüphaneler mevcuttur:

1. **ROS 2 (Robot Operating System):** Dağıtık mimarisi ve DDS (Data Distribution Service) katmanı ile çoklu robot iletişimi için standarttır.
2. **ARGoS:** Binlerce robotun aynı anda simüle edilebildiği, yüksek performanslı bir fizik motorudur.
3. **Swarm-Sim:** Daha çok algoritmik testler ve 2D/3D görselleştirmeler için kullanılan Python tabanlı bir araçtır.
4. **Mesa:** Agent-based modeling (Ajan tabanlı modelleme) için kullanılan Python kütüphanesidir.

---

## 5. Teknik Uygulama: Python ile Basit Bir Görev Dağılım Simülasyonu

Aşağıdaki kod bloğu, ajanların çevrelerindeki görev yoğunluğuna göre karar verdiği temel bir eşik değer (threshold) algoritmasını simüle etmektedir.

```python
import numpy as np

class RobotAgent:
    def __init__(self, id, threshold):
        self.id = id
        self.threshold = threshold
        self.state = "IDLE"  # Başlangıç durumu boşta
        self.energy = 100

    def decide_task(self, stimulus):
        """
        Stimulus (uyaran) arttıkça robotun görevi üstlenme olasılığı artar.
        P(active) = S^2 / (S^2 + T^2)
        """
        probability = (stimulus**2) / (stimulus**2 + self.threshold**2)
        if np.random.rand() < probability:
            self.state = "WORKING"
        else:
            self.state = "IDLE"

class SwarmController:
    def __init__(self, num_robots):
        self.robots = [RobotAgent(i, np.random.randint(10, 50)) for i in range(num_robots)]
        self.task_demand = 100 # Başlangıç görev ihtiyacı

    def update_system(self):
        active_workers = 0
        for robot in self.robots:
            robot.decide_task(self.task_demand)
            if robot.state == "WORKING":
                active_workers += 1
        
        # Görev talebi, çalışan sayısına göre azalır ama zamanla artar
        self.task_demand = max(0, self.task_demand - active_workers + 5)
        print(f"Aktif Robotlar: {active_workers}, Kalan Talep: {self.task_demand}")

# Simülasyonu başlat
swarm = SwarmController(50)
for step in range(10):
    swarm.update_system()

```

---

## 6. Haberleşme Protokolleri ve Senkronizasyon

Çoklu ajan sistemlerinde veri iletimi genellikle **UDP (User Datagram Protocol)** üzerinden gerçekleştirilir. TCP'nin getirdiği "handshake" yükü, yüzlerce robotun anlık konum bilgisi paylaştığı bir ortamda ciddi gecikmelere (latency) yol açar.

### Pub/Sub Modeli

Robotlar belirli "topic"lere (konulara) abone olur. Örneğin, `/environment/obstacle` kanalına abone olan tüm robotlar, herhangi bir ajanın tespit ettiği engelden anında haberdar olur. Bu noktada **Zenoh** veya **FastDDS** gibi kütüphaneler, düşük gecikmeli iletişim için ROS 2 ile entegre çalışır.

---

## 7. Kolektif Karar Verme: Sürü Zekası Algoritmaları

### Particle Swarm Optimization (PSO)

Sürü robotlarının en iyi çözümü (örneğin bir gaz sızıntısının kaynağını) bulması için kullanılan matematiksel modeldir. Her robot (parçacık), kendi en iyi konumunu ($p_{best}$) ve sürünün genel en iyi konumunu ($g_{best}$) takip eder.

Hız güncelleme formülü şu şekildedir:


$$v_{i}(t+1) = w \cdot v_{i}(t) + c_{1} \cdot r_{1} \cdot (p_{best,i} - x_{i}(t)) + c_{2} \cdot r_{2} \cdot (g_{best} - x_{i}(t))$$

Burada $w$ atalet katsayısını, $c_1$ ve $c_2$ ise öğrenme parametrelerini temsil eder.

---

## 8. Donanım Seviyesinde Sürü Robotiği

Yazılım algoritmaları ne kadar güçlü olursa olsun, fiziksel kısıtlamalar her zaman mevcuttur. Sürü çalışmalarında genellikle düşük maliyetli ancak sensör kapasitesi yüksek platformlar tercih edilir.

* **Kilobots:** Harvard Üniversitesi tarafından geliştirilen, binlerce adet kullanılabilen minyatür robotlar.
* **e-puck2:** Eğitim ve araştırma odaklı, zengin sensör setine sahip mikro robotlar.
* **Crazyflie:** Sürü halindeki uçan robot (drone) çalışmaları için ideal açık kaynaklı platform.

> **Önemli Not:** Gerçek dünya uygulamalarında robotların birbirine çarpmaması için **Artificial Potential Fields (APF)** veya **Velocity Obstacles (VO)** gibi çarpışma önleme algoritmaları görev dağılımı koduna entegre edilmelidir.

---

## 9. Gelecek Perspektifi: Heterojen Sürüler

Güncel araştırmalar, tüm robotların aynı özelliklere sahip olduğu "homojen" sürülerden, farklı yeteneklere sahip (bazıları uçan, bazıları karada giden, bazıları yüksek işlem gücüne sahip) "heterojen" sürülere kaymaktadır. Bu sistemlerde görev dağılımı, sadece mesafe tabanlı değil, yetenek tabanlı (capability-aware) hale gelmektedir.

Örneğin, bir arama kurtarma senaryosunda drone'lar alanı tararken (keşif görevi), paletli robotlar enkaz altındaki nesneleri taşımak (manipülasyon görevi) üzere optimize edilir.

---

## 10. Sonuç ve Değerlendirme

Sürü robotik sistemleri, bireysel basitliğin kolektif karmaşıklığa dönüştüğü bir mühendislik harikasıdır. Çoklu ajan algoritmaları ile sağlanan dinamik görev dağılımı, sistemin esnekliğini ve hayatta kalma kabiliyetini artırır. Yazılım tarafında ROS 2 gibi modern kütüphaneler ve PSO gibi matematiksel modeller, bu sistemlerin teoriden pratiğe dökülmesini sağlar. Gelecekte bu sistemler; tarımsal otomasyondan, savunma sanayine ve hatta mikrorobotların vücut içinde ilaç taşımasına kadar geniş bir yelpazede kritik roller üstlenecektir.