---
title: "Otonom Sistemlerin Mühendislik Mimarisi: SLAM, Sensör Füzyonu ve Reinforcement Learning Süreçleri"
date: 2026-03-11
type: "ai"
draft: false
math: true
description: "Robotik sistemlerde konumlandırma, veri birleştirme ve makine öğrenmesi algoritmalarının teknik derinliğini, C++ ve Python uygulamalarıyla birlikte inceleyen kapsamlı rehberdir."
featured_image: "/images/ai/otonom-sistemlerin-muhendislik-mimarisi-slam-sensor-fuzyonu-ve-reinforcement-learning-surecleri.png"
tags: ["ai","otonom-sistemler", "buyuk-veri", "slam", "takviyeli-ogrenme", "robotik","robotics" ,"makine-ogrenmesi"]
---

Otonom sistemler, yalnızca mekanik birer yapı olmanın ötesinde, karmaşık algoritmaların ve yüksek yoğunluklu veri işleme süreçlerinin fiziksel dünyayla kusursuz bir uyum içinde çalışmasıdır. Modern robotik mimarileri; algılama, haritalama ve karar verme süreçlerini bir araya getirerek dinamik ortamlarda bağımsız hareket kabiliyeti sunar. Bu yazıda, otonom sistemlerin temel sütunları olan SLAM, Sensör Füzyonu ve Takviyeli Öğrenme (RL) kavramlarını derinlemesine teknik bir perspektifle inceleyeceğiz.

{{< figure src="/images/ai/otonom-sistemlerin-muhendislik-mimarisi-slam-sensor-fuzyonu-ve-reinforcement-learning-surecleri.png" alt="Otonom Sistemlerin Mühendislik Mimarisi: SLAM, Sensör Füzyonu ve Reinforcement Learning Süreçleri" width="1200" caption="Şekil 1: Otonom Sistemlerin Mühendislik Mimarisi: SLAM, Sensör Füzyonu ve Reinforcement Learning Süreçleri." >}}

---

### 1. SLAM (Simultaneous Localization and Mapping): Eşzamanlı Haritalama ve Konumlandırma

Bir robotun bilinmeyen bir ortama bırakıldığında karşılaştığı en büyük zorluk, "Neredeyim?" ve "Çevremde ne var?" sorularına aynı anda yanıt vermektir. SLAM, robotun sensör verilerini kullanarak çevrenin bir haritasını oluştururken, aynı zamanda bu harita içerisindeki kendi konumunu (pose) kestirmesi sürecidir.

#### Matematiksel Arka Plan ve EKF-SLAM
SLAM süreçlerinde genellikle Bayesyen filtreleme yöntemleri kullanılır. Genişletilmiş Kalman Filtresi (Extended Kalman Filter - EKF), doğrusal olmayan sistem modellerini doğrusallaştırarak durum tahmini yapar.

$$x_k = f(x_{k-1}, u_k) + w_k$$
$$z_k = h(x_k) + v_k$$

Burada $x_k$ robotun konumunu, $u_k$ kontrol girdisini, $z_k$ ise sensör ölçümünü temsil eder.



#### C++ ile Basit Bir Odometri Entegrasyonu
Modern SLAM uygulamalarında (örneğin gmapping veya ORB-SLAM) genellikle ROS (Robot Operating System) kütüphaneleri kullanılır. Aşağıda, bir robotun hareket verilerini işleyen temel bir yapı örneği yer almaktadır:

```cpp
#include <iostream>
#include <vector>
#include <cmath>

struct Pose {
    double x, y, theta;
};

class SimpleOdometry {
public:
    Pose current_pose = {0.0, 0.0, 0.0};

    void update(double v, double w, double dt) {
        current_pose.x += v * cos(current_pose.theta) * dt;
        current_pose.y += v * sin(current_pose.theta) * dt;
        current_pose.theta += w * dt;
        
        std::cout << "Konum: [" << current_pose.x << ", " 
                  << current_pose.y << "] Açısı: " << current_pose.theta << std::endl;
    }
};
```

**Teknik Not:** SLAM uygulamalarında "Loop Closure" (Döngü Kapatma) kritik bir öneme sahiptir. Robot daha önce geçtiği bir noktayı tanıdığında, biriken hata payını (drift) sıfırlayarak haritayı optimize eder.

---

### 2. Sensör Füzyonu: Veri Birleştirme ve Yüksek Doğruluk

Tek bir sensör (sadece kamera veya sadece Lidar) çevresel faktörlerden (ışık, yağmur, mesafe limitleri) etkilenir. Sensör füzyonu, farklı modalitelerden gelen verileri matematiksel olarak birleştirerek tekil bir "çevresel model" oluşturur.

#### Lidar ve Kamera Füzyonu
Lidar, çevrenin 3D nokta bulutunu (Point Cloud) yüksek hassasiyetle sunarken; kamera, nesne sınıflandırma (object detection) ve renk bilgisi sağlar. Bu iki verinin kalibrasyonu, dışsal (extrinsic) matrisler aracılığıyla gerçekleştirilir.

*   **Kalman Filtresi (Unscented Kalman Filter - UKF):** Karmaşık manevralarda standart Kalman filtresinin yetersiz kaldığı durumlarda, olasılık dağılımını daha iyi temsil eden Sigma noktalarını kullanarak daha kararlı sonuçlar üretir.

#### Python Üzerinden Basit Bir Veri Füzyon Mantığı
Özellikle otonom sürüş projelerinde kullanılan `filterpy` kütüphanesi, bu süreçlerin simülasyonunda etkilidir.

```python
import numpy as np
from filterpy.kalman import KalmanFilter

def initialize_fusion_filter():
    f = KalmanFilter(dim_x=2, dim_z=1)
    f.x = np.array([[0.], [0.]])       # Başlangıç durumu (konum ve hız)
    f.F = np.array([[1., 1.], [0., 1.]]) # Durum geçiş matrisi
    f.H = np.array([[1., 0.]])          # Ölçüm matrisi
    f.P *= 1000.                        # Kovaryans (belirsizlik)
    f.R = 5                             # Ölçüm gürültüsü
    f.Q = 0.1                           # Süreç gürültüsü
    return f

# Lidar'dan gelen mesafe verisiyle güncelleme
filter = initialize_fusion_filter()
filter.predict()
filter.update(10.5) # Ölçülen değer
```



---

### 3. Takviyeli Öğrenme (Reinforcement Learning - RL)

Robotların önceden programlanmış katı kurallar yerine, çevreyle etkileşime girerek "en iyi stratejiyi" bulması sürecidir. Bir robot, bir eylem (Action) gerçekleştirir, karşılığında bir ödül (Reward) veya ceza alır ve bir sonraki durumu (State) gözlemler.

#### Markov Karar Süreci (MDP) ve Q-Learning
Otonom sistemlerde RL, genellikle Markov Karar Süreci olarak modellenir. Temel amaç, toplam beklenen ödülü maksimize edecek optimal politikayı ($\pi$) bulmaktır.

$$Q(s, a) = Q(s, a) + \alpha [r + \gamma \max Q(s', a') - Q(s, a)]$$

*   **Deep Q-Networks (DQN):** Robotun durumu çok karmaşıksa (örneğin yüksek çözünürlüklü bir görüntü), Q değerlerini tahmin etmek için derin sinir ağları kullanılır.

#### Yazılım Kaynakları ve Kütüphaneler
RL projelerinde endüstri standardı haline gelmiş kütüphaneler şunlardır:
*   **OpenAI Gym/Gymnasium:** Robotik simülasyonlar için standart arayüz.
*   **Stable Baselines3:** PyTorch tabanlı, optimize edilmiş RL algoritmaları (PPO, DDPG, SAC).
*   **MuJoCo:** Yüksek hassasiyetli fizik motoru.

**Not:** Robotik kolların nesne yakalama (grasping) yetenekleri genellikle PPO (Proximal Policy Optimization) algoritmaları ile eğitilir. Bu algoritmalar, eğitim sırasında politikanın çok büyük adımlarla değişmesini engelleyerek kararlı bir öğrenme süreci sağlar.

---

### 4. Sistem Entegrasyonu: ROS 2 ve Robotik Yazılım Mimarisi

Tüm bu teknik bileşenler, bir işletim sistemi gibi çalışan ancak aslında bir haberleşme katmanı olan **ROS 2 (Robot Operating System)** üzerinde birleşir. ROS 2, düğümler (nodes) arası asenkron veri akışını sağlar.

#### Kritik Yazılım Bileşenleri:
1.  **FastDDS:** ROS 2'nin altında yatan, verilerin gerçek zamanlı ve güvenli iletilmesini sağlayan iletişim protokolü.
2.  **MoveIt:** Robot kollarının planlaması ve manipülasyonu için kullanılan ana kütüphane.
3.  **Nav2 (Navigation 2):** Mobil robotların SLAM verilerini kullanarak engellerden sakınmasını ve rotasını belirlemesini sağlayan yığın (stack).

---

### 5. Gelişmiş Teknik Detaylar ve Uygulama Notları

#### Lidar Veri İşleme (Point Cloud Library - PCL)
Robotun çevresini anlamlandırması için nokta bulutlarını filtrelemesi gerekir. Voxel Grid filtresi, veri yoğunluğunu azaltırken yapısal bilgiyi korur.

```cpp
#include <pcl/filters/voxel_grid.h>

void filterCloud(pcl::PointCloud<pcl::PointXYZ>::Ptr cloud) {
    pcl::VoxelGrid<pcl::PointXYZ> sor;
    sor.setInputCloud(cloud);
    sor.setLeafSize(0.01f, 0.01f, 0.01f); // 1cm çözünürlük
    sor.filter(*cloud);
}
```

#### Gerçek Zamanlılık ve Gecikme (Latency)
Otonom bir araç 100 km/s hızla giderken, sensör füzyon algoritmasındaki 100 ms'lik bir gecikme, aracın yaklaşık 2.8 metre yol kat etmesi demektir. Bu nedenle, kritik algoritmalar genellikle Python yerine C++ ile yazılmalı ve RTOS (Real-Time Operating System) çekirdekleri üzerinde koşturulmalıdır.

**Sonuç olarak;**
Otonom sistemler; matematiksel modelleme, düşük seviyeli donanım kontrolü ve yüksek seviyeli yapay zeka yaklaşımlarının bir sentezidir. SLAM ile dünyayı anlamlandıran, Sensör Füzyonu ile gürültüden arınan ve Reinforcement Learning ile strateji geliştiren bir robot, modern mühendisliğin en uç noktasını temsil eder. Bu teknolojilerin verimli çalışması, seçilen yazılım kütüphanelerinin (ROS 2, PCL, PyTorch) ve algoritmik optimizasyonların doğruluğuna doğrudan bağlıdır.