---
title: "Robotik Sistemlerin Evrimi ve ROS 2 Ekosistemine Modern Geçiş Stratejileri"
date: 2026-05-08
type: "blog"
draft: false
math: true
description: "Bu blog yazısı, robotik sistemlerin ROS 1'den ROS 2'ye geçiş sürecindeki mimari değişimleri, DDS tabanlı haberleşme katmanının teknik avantajlarını ve modern yazılım kütüphaneleriyle sistem modernizasyonu stratejilerini detaylı bir teknik dille ele almaktadır."
featured_image: "/images/blog/robotik-sistemlerin-evrimi-ve-ros-2-ekosistemine-modern-gecis-stratejileri.png"
tags: ["blog","robotic", "robotik", "otonom","ros2","dds", "endustriyel-otomasyon", "gercek-zamanli-sistemler","kontrol-sistemleri","mikroservis"]
---

Robotik dünyası, son on yılda monolitik yapılardan dağıtık ve modüler mimarilere doğru devasa bir evrim geçirdi. Bu evrimin merkezinde yer alan Robot İşletim Sistemi (ROS), özellikle "Lush" ve "Noetic" gibi sürümlerle akademik ve endüstriyel standartları belirledi. Ancak, gerçek zamanlı veri işleme gereksinimleri, endüstriyel güvenlik standartları ve çoklu robot koordinasyonu gibi modern ihtiyaçlar, orijinal ROS mimarisinin sınırlarını zorlamaya başladı. Bu noktada ROS 2, Data Distribution Service (DDS) katmanı üzerine inşa edilen yeni mimarisiyle, robotik sistemleri laboratuvar ortamından çıkarıp kritik endüstriyel operasyon sahalarına taşıyor.

{{< figure src="/images/blog/robotik-sistemlerin-evrimi-ve-ros-2-ekosistemine-modern-gecis-stratejileri.png" alt="Robotik Sistemlerin Evrimi ve ROS 2 Ekosistemine Modern Geçiş Stratejileri" width="1200" caption="Şekil 1: Robotik Sistemlerin Evrimi ve ROS 2 Ekosistemine Modern Geçiş Stratejileri." >}}

---
## 1. ROS 1’den ROS 2’ye Mimari Paradigma Değişimi

ROS 1 mimarisi, "ROS Master" adını verdiğimiz merkezi bir kayıt defterine dayanıyordu. Tüm düğümler (nodes) birbirini bulmak için bu merkeze ihtiyaç duyuyordu. Bu durum, "Single Point of Failure" (Tekil Başarısızlık Noktası) riskini beraberinde getiriyordu. ROS 2, bu yapıyı tamamen terk ederek **DDS (Data Distribution Service)** standardına geçiş yaptı.

### DDS Katmanının Teknik Avantajları

DDS, endüstriyel, havacılık ve askeri sistemlerde kullanılan, merkezsiz bir iletişim protokolüdür. ROS 2’nin bu katman üzerinde yükselmesi şu teknik kazanımları sağlar:

* **Discovery (Keşif):** Düğümler birbirini dinamik olarak bulur, merkezi bir sunucuya ihtiyaç duymazlar.
* **Quality of Service (QoS):** Veri paketlerinin önceliği, güvenilirliği (Reliability) ve geçmiş verilerin saklanması (Durability) gibi parametreler her bir topic bazında yapılandırılabilir.
* **Real-Time Capability:** ROS 2, gerçek zamanlı işletim sistemleri (RTOS) ile entegre çalışabilecek şekilde deterministik bir yapı sunar.

## 2. Yazılım Mimarisi ve Kütüphane Modernizasyonu

Eski sistemleri ROS 2’ye taşırken en büyük zorluklardan biri, istemci kütüphanelerinin (`rclcpp` ve `rclpy`) tamamen yeniden yazılmış olmasıdır. ROS 1'deki `roscpp` ve `rospy` kütüphaneleri yerini daha modüler ve performans odaklı bir yapıya bırakmıştır.

### Lifecycle Nodes ve Yönetilebilirlik

ROS 2 ile gelen "Managed Nodes" (Yönetilen Düğümler) kavramı, bir robotun durum makinesini (state machine) doğrudan kontrol etmeyi sağlar. Bir düğümün; *Unconfigured*, *Inactive*, *Active* ve *Finalized* durumları arasında geçiş yapması, sistemin güvenli bir şekilde başlatılmasını ve hata durumunda kontrollü bir şekilde durdurulmasını sağlar.

```cpp
#include <rclcpp/rclcpp.hpp>
#include <rclcpp_lifecycle/lifecycle_node.hpp>

class RobotSensorNode : public rclcpp_lifecycle::LifecycleNode {
public:
    RobotSensorNode() : LifecycleNode("sensor_node") {}

    CallbackReturn on_configure(const rclcpp_lifecycle::State &) {
        // Sensör donanımını ilklendir
        RCLCPP_INFO(get_logger(), "Sensör konfigüre ediliyor...");
        return CallbackReturn::SUCCESS;
    }

    CallbackReturn on_activate(const rclcpp_lifecycle::State &) {
        // Veri yayınına başla
        RCLCPP_INFO(get_logger(), "Sensör aktif hale getirildi.");
        return CallbackReturn::SUCCESS;
    }
};

```

## 3. Donanım Entegrasyonu ve ROS 2 Control

Eski sistemlerde motor sürücüleri ve sensörler genellikle karmaşık ve standart olmayan arayüzlerle kontrol ediliyordu. ROS 2 ile birlikte `ros2_control` çerçevesi (framework), donanım soyutlama katmanını (Hardware Abstraction Layer - HAL) standartlaştırdı.

### Modern Donanım Arayüzleri

`HardwareComponentInfo` ve `SystemInterface` yapıları sayesinde, bir robot kolu veya otonom bir mobil platform (AMR) için yazılan kontrolcü, donanım değişse bile aynı kalabilir. Bu, "Controller Manager" aracılığıyla dinamik olarak kontrolcü yüklemeyi ve boşaltmayı mümkün kılar.

**Önemli Kütüphaneler:**

* **`nav2` (Navigation 2):** ROS 2 için geliştirilen, davranış ağaçları (Behavior Trees) kullanan gelişmiş navigasyon yığını.
* **`MoveIt 2`:** Robot kollarının planlaması ve manipülasyonu için endüstri standardı olan kütüphanenin ROS 2 versiyonu.
* **`Fast-DDS` / `CycloneDDS`:** İletişim katmanında kullanılan popüler DDS implementasyonları.

## 4. Geçiş Sürecindeki Kritik Zorluklar

Modernizasyon süreci sadece kod kopyalamaktan ibaret değildir. Karşılaşılan temel engeller şunlardır:

### Mesaj Tipleri ve Dönüşüm (The Bridge)

ROS 1 ve ROS 2 sistemlerinin bir arada çalışması gerektiği durumlarda `ros1_bridge` kullanılır. Ancak bu köprü, yüksek frekanslı veri akışlarında (örneğin LiDAR verisi) ciddi bir gecikme (latency) ve CPU yükü yaratabilir. Bu nedenle, kritik sistemlerin kademeli değil, modül bazlı tam geçişle modernize edilmesi önerilir.

### Build Sistemi: Catkin’den Colcon’a

ROS 1’deki `catkin_make` yerini `colcon build` sistemine bırakmıştır. Paket tanımlamalarında kullanılan `package.xml` dosyaları artık `format 3` standardını desteklemek zorundadır. Ayrıca, CMake yapılandırmaları `ament_cmake` kütüphanesini kullanacak şekilde revize edilmelidir.

## 5. Güvenlik Katmanı: SROS 2

Geleneksel robotik sistemlerin en zayıf halkası siber güvenlikti. ROS 2, `SROS 2` eklentisi ile iletişim katmanında yerleşik güvenlik sunar.

* **Authentication (Kimlik Doğrulama):** Sadece yetkili düğümler ağa katılabilir.
* **Encryption (Şifreleme):** Veri paketleri AES-GCM algoritmaları ile şifrelenir.
* **Access Control (Erişim Kontrolü):** Hangi düğümün hangi topic üzerine yazabileceği veya okuyabileceği detaylı olarak tanımlanır.

## 6. Uygulama Örneği: Modern Bir Subscriber Yapısı

Aşağıdaki kod parçası, ROS 2’nin C++ API'sini kullanarak QoS (Quality of Service) ayarları yapılmış modern bir abone (subscriber) örneğini göstermektedir. Bu yapı, veri kaybının kabul edilemez olduğu telemetri verileri için optimize edilmiştir.

```cpp
#include <memory>
#include "rclcpp/rclcpp.hpp"
#include "sensor_msgs/msg/imu.hpp"

class ImuProcessor : public rclcpp::Node {
public:
  ImuProcessor() : Node("imu_processor") {
    // Güvenilir iletişim için QoS yapılandırması
    auto qos = rclcpp::QoS(rclcpp::KeepLast(10));
    qos.reliable();
    qos.durability_volatile();

    subscription_ = this->create_subscription<sensor_msgs::msg::Imu>(
      "/robot/sensor/imu", qos, 
      std::bind(&ImuProcessor::topic_callback, this, std::placeholders::_1));
  }

private:
  void topic_callback(const sensor_msgs::msg::Imu::SharedPtr msg) const {
    RCLCPP_INFO(this->get_logger(), "İvme Verisi: [x: %.2f, y: %.2f, z: %.2f]",
                msg->linear_acceleration.x, 
                msg->linear_acceleration.y, 
                msg->linear_acceleration.z);
  }
  rclcpp::Subscription<sensor_msgs::msg::Imu>::SharedPtr subscription_;
};

int main(int argc, char * argv[]) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<ImuProcessor>());
  rclcpp::shutdown();
  return 0;
}

```

## 7. Sonuç ve Gelecek Projeksiyonu

Eski robotik mimarileri ROS 2’ye taşımak, başlangıçta yüksek bir mühendislik maliyeti gibi görünse de uzun vadede sistemin ölçeklenebilirliği ve güvenliği için bir zorunluluktur. DDS tabanlı iletişim, gelişmiş gerçek zamanlılık ve zengin kütüphane desteği, robotları sadece "otonom araçlar" olmaktan çıkarıp, birbirleriyle ve bulut sistemleriyle entegre çalışan "akıllı ekosistemler" haline getirmektedir.

Modernizasyon sürecinde en iyi yaklaşım, sistemin donanım katmanından başlayarak `ros2_control` yapısına entegre edilmesi ve ardından navigasyon/planlama katmanlarının `Nav2` ve `MoveIt 2` gibi güncel standartlara taşınmasıdır. Geleceğin robotik sistemleri, bu modern mimari üzerinde yükselen yapay zeka algoritmaları ile şekillenecektir.

> **Teknik Not:** Geçiş sürecinde bellek yönetimine dikkat edilmelidir. ROS 2’de kullanılan `UniquePtr` ve `SharedPtr` mekanizmaları, sıfır-kopya (zero-copy) veri aktarımı için `loaned messages` özelliği ile birleştirilerek yüksek bant genişliğine sahip sensör verilerinde CPU kullanımını %30'a kadar azaltabilir.