---
title: "ESP32 ile IoT Dünyasına Giriş Sıfırdan İleri Seviyeye Proje Geliştirme Rehberi"
date: 2026-06-24
type: "blog"
draft: false
math: true
description: "ESP32 mikrodenetleyicisinin çift çekirdek mimarisini, pin kısıtlamalarını ve derin uyku modlarını derinlemesine inceleyerek uçtan uca MQTT bağlantılı bir sensör istasyonu geliştirdiğimiz kapsamlı teknik bir blog yazısıdır."
featured_image: "/images/blog/esp32-ile-iot-dunyasina-giris-sifirdan-ileri-seviyeye-proje-gelistirme-rehberi.png"
tags: ["blog", "iot","esp32","esp8266","arduino","free-rtos","derin-uyku","elektronik","wi-fi","bluetooth","gomulu-sistemler", "mqtt-protokolu", "arduino","arduino-ide" ]
---

Nesnelerin İnterneti (IoT) ekosisteminde donanım seçimi, bir projenin sürdürülebilirliği, güç tüketimi ve işlem kapasitesi üzerinde doğrudan belirleyici bir rol oynar. Espressif Systems tarafından geliştirilen ESP8266 ve halefi ESP32, düşük maliyetli Wi-Fi entegrasyonu sunarak gömülü sistemler dünyasında devrim yaratmıştır. Ancak bu iki platform, mimari açıdan birbirinden oldukça farklı spektrumları temsil eder.

{{< figure src="/images/blog/esp32-ile-iot-dunyasina-giris-sifirdan-ileri-seviyeye-proje-gelistirme-rehberi.png" alt="ESP32 ile IoT Dünyasına Giriş Sıfırdan İleri Seviyeye Proje Geliştirme Rehberi" width="1200" caption="Şekil 1: ESP32 ile IoT Dünyasına Giriş Sıfırdan İleri Seviyeye Proje Geliştirme Rehberi." >}}

---

## Neden IoT Projelerinde ESP32 Tercih Edilmeli?

Bir IoT projesi tasarlanırken işlem gücü, kablosuz bağlantı çeşitliliği, güç tüketimi ve birim maliyet gibi parametreler optimize edilmelidir. ESP32, bu optimizasyon eğrisinin tam merkezinde yer alır.

### ESP8266 ve ESP32 Arasındaki Farklar ve Donanım Üstünlükleri

Sektörün bir önceki gözbebeği olan ESP8266, yalnızca tek çekirdekli bir işlemciye (80 MHz) ve sınırlı sayıda çevre birimine sahipti. ESP32 ise bu mimariyi kökten değiştirerek **Xtensa çift çekirdekli 32-bit LX6** mikroişlemciyle (160 veya 240 MHz frekans aralığında çalışan) piyasaya sürüldü.

* **İşlem Gücü:** ESP8266 tek iş parçacıklı görevlerde boğulurken, ESP32 çift çekirdek yapısı sayesinde asenkron operasyonları mükemmel yönetir. Örneğin, bir çekirdek arka planda Wi-Fi yığınını (TCP/IP) yönetirken, diğer çekirdek gecikmesiz bir şekilde sensör okuma ve motor kontrolü gibi kritik görevleri (Real-Time OS altında) işleyebilir.
* **Bağlantı Çeşitliliği:** ESP8266 sadece Wi-Fi desteklerken, ESP32 hem Wi-Fi hem de Bluetooth (BR/EDR ve BLE) kombinasyonuyla gelir.

### Maliyet, Çift Çekirdek Performansı ve Güç Tüketimi Avantajları

ESP32, birkaç dolarlık bir fiyat etiketine sahip olmasına rağmen, sunduğu donanım özellikleriyle ARM Cortex-M serisi pek çok pahalı mikrodenetleyiciyle yarışır. Dahili donanımsal şifreleme hızlandırıcıları (AES, SHA-2, RSA, ECC) sayesinde, IoT güvenlik standartlarını (TLS/SSL gibi) sistem performansından ödün vermeden yerel olarak çalıştırabilir. Ayrıca, esnek saat frekansı ölçeklemesi ve gelişmiş güç modları, cihazın milisaniyeler içinde performans canavarından ultra düşük güç tüketen bir takip cihazına dönüşmesini sağlar.

---

## ESP32 Donanım Mimarisi ve Pin Yapısı (Pinout)

ESP32 geliştirme kartları (örneğin ESP32 NodeMCU Development Module), 30 veya 38 pinlik tasarımlarla karşımıza çıkar. Ancak bu pinlerin arkasındaki silikon mimariyi bilmeden hatasız donanım tasarımı yapmak imkansızdır.

### GPIO Pinleri, ADC, DAC ve PWM Kullanım Kuralları

ESP32 üzerindeki pinlerin multiplexing (çoğullama) yeteneği çok yüksektir, yani hemen hemen her GPIO pini yazılımsal olarak farklı işlevlere atanabilir. Ancak bazı kritik kısıtlamalar mevcuttur:

* **Sadece Giriş Pinleri (Input-Only):** GPIO 34, 35, 36 ve 39 numaralı pinlerin dahili pull-up veya pull-down dirençleri yoktur ve yalnızca giriş modunda (`INPUT`) kullanılabilirler. Çıkış (PWM veya dijital lojik yüksek) olarak sürülemezler.
* **Strapping Pinleri:** GPIO 0, 2, 5, 12 ve 15 pinleri boot (açılış) modunu belirler. Bu pinlere kalıcı olarak harici bir donanım bağlarken, açılış esnasındaki lojik seviyelerine (0 veya 1) dikkat edilmelidir; aksi takdirde kart "Flash" modunda kalabilir veya boot döngüsüne girebilir.
* **ADC Sınırları (Analog to Digital Converter):** ESP32'de iki adet 12-bit ADC bloğu (ADC1 ve ADC2) bulunur. Toplamda 18 kanala kadar analog okuma yapılabilir. Ancak **ADC2 kanalları, Wi-Fi aktif olarak kullanılırken çalışmaz.** Eğer Wi-Fi üzerinden veri aktarırken analog sensör okuyacaksanız, mutlaka ADC1 kanallarını (GPIO 32 - 39 arası) tercih etmelisiniz.
* **DAC (Digital to Analog Converter):** Gerçek analog çıkış veren iki adet 8-bit DAC kanalı (GPIO 25 ve GPIO 26) mevcuttur.
* **PWM (LEDC):** Donanımsal PWM kanalları (16 bağımsız kanal) frekans ve çözünürlük konfigürasyonu esnekliğiyle motor sürücüleri ve LED dimmer sistemleri için idealdir.

### Protokol Destekleri: I2C, SPI ve UART ile Sensör Bağlantıları

ESP32, donanımsal olarak birden fazla seri iletişim arabirimini destekler:

* **UART:** 3 adet donanımsal UART birimi vardır. `Serial0` genellikle programlama ve loglama için ayrılmıştır. `Serial1` ve `Serial2` harici donanımlar (GPS modülleri, Nextion ekranlar vb.) için serbesttir.
* **I2C:** Varsayılan olarak GPIO 21 (SDA) ve GPIO 22 (SCL) kullanılır. Wire kütüphanesi ile 400 kHz (Fast Mode) hızında stabil çalışır.
* **SPI:** Donanımsal olarak VSPI ve HSPI olmak üzere iki kullanılabilir SPI veri yolu sunar. SD kart modülleri ve yüksek çözünürlüklü TFT ekranlar için yüksek veri hızlarına (80 MHz'e kadar) ulaşabilir.

---

## Kablosuz Bağlantı Teknolojileri: Wi-Fi ve BLE

ESP32'yi gerçek bir IoT elemanı yapan unsur, RF (Radyo Frekansı) alt sistemidir. 2.4 GHz bandında çalışan bu modül, hem geniş bant veri transferleri hem de düşük enerjili yakındaki cihazlarla etkileşim için optimize edilmiştir.

### Wi-Fi İstasyon (STA) ve Erişim Noktası (AP) Modları

ESP32 üç farklı Wi-Fi modunda çalıştırılabilir:

1. **Station (STA) Modu:** Cihaz bir ev veya iş yeri router'ına (modem) istemci olarak bağlanır, IP alır ve internete çıkış yapar.
2. **Access Point (AP) Modu:** Cihaz kendi yerel Wi-Fi ağını yayınlar. Akıllı telefonlar veya bilgisayarlar bu ağa bağlanarak cihazın içindeki gömülü web sunucusuna erişebilir (Özellikle ilk kurulum/Wi-Fi şifresi tanımlama aşamaları için kritiktir).
3. **Dengeli (STA+AP) Modu:** Her iki modun aynı anda aktif olması durumudur.

### BLE ile Akıllı Telefon Entegrasyonu ve Veri Alışverişi

BLE (Bluetooth Low Energy), klasik Bluetooth'a göre çok daha az enerji tüketen, GATT (Generic Attribute Profile) mimarisine dayalı bir teknolojidir. ESP32, bir BLE Server (Sunucu) olarak yapılandırılarak servisler ve karakteristikler (Characteristics) tanımlayabilir. Mobil uygulamalar (örneğin nRF Connect veya özel yazılmış bir Flutter uygulaması) bu karakteristiklere bağlanarak cihaz konfigürasyonunu kablosuz ve internet bağımsız olarak gerçekleştirebilir.

---

## ESP32 Güç Yönetimi ve Derin Uyku Modları

Pille çalışan saha tipi IoT projelerinde, cihazın sürekli 80-120 mA akım çekmesi kabul edilemez. ESP32, bu sorunu çözmek için gelişmiş güç yönetimi modları sunar.

### IoT Cihazlarında Pil Ömrünü Uzatmanın Sırları

ESP32'de Aktif Mod, Modem Uyku, Hafif Uyku (Light Sleep) ve Derin Uyku (Deep Sleep) modları bulunur.

* **Derin Uyku (Deep Sleep):** Bu modda ana CPU çekirdekleri, Wi-Fi/Bluetooth modülleri ve RAM'in neredeyse tamamı kapatılır. Sadece ultra düşük güçlü **ULP (Ultra Low Power) yardımcı işlemcisi** ve **RTC (Real-Time Clock)** birimi aktif kalır. Akım tüketimi **10 µA ile 25 µA** seviyelerine kadar düşer.
* **Bellek Koruma koruması (`RTC_DATA_ATTR`):** Derin uykuya geçildiğinde normal RAM sıfırlanır. Ancak `RTC_DATA_ATTR` öneki ile tanımlanan değişkenler RTC yavaş belleğinde saklanır ve cihaz uyandığında kaldığı yerden (örneğin sayaç değerleri, kalibrasyon verileri) devam edebilir.

### Harici Kesmeler (External Interrupts) ile Cihazı Uyandırma

Cihaz derin uykudan belirli bir süre sonra (Zamanlayıcı - Timer yardımıyla) uyandırılabileceği gibi, harici bir fiziksel etkiyle de uyandırılabilir. Örneğin, bir kapı sensörü (reed anahtar) tetiklendiğinde veya bir butona basıldığında ilgili GPIO pini üzerindeki lojik değişim, harici kesme (External Wakeup) tetikleyerek cihazı mikro saniyeler içinde tam performans moduna döndürür.

---

## Popüler IoT Protokolleri ve ESP32 Entegrasyonu

Verinin sensörden okunması sürecin sadece ilk adımıdır; bu verinin buluta taşınması standartlaşmış uygulama protokolleri gerektirir.

### MQTT Protokolü ile Broker Bağlantısı

MQTT (Message Queuing Telemetry Transport), yayınla/abone ol (Publish/Subscribe) modeline dayanan, hafif ve paket overhead'i (veri yükü maliyeti) çok düşük olan bir TCP/IP protokolüdür. Kısıtlı bant genişliğine sahip IoT sistemleri için biçilmiş kaftandır. ESP32 üzerinde sıklıkla `PubSubClient` kütüphanesi kullanılır. Veriler bir aracıya (Mosquitto, HiveMQ, AWS IoT Core) gönderilir ve o veriye abone olan tüm istemciler (Dashboard'lar, veri tabanları) anlık olarak güncellenir.

### HTTP REST API ile Web Sunucularına Veri Gönderme

Daha geleneksel web altyapıları veya üçüncü parti kurumsal yazılımlarla entegrasyon için HTTP POST/GET istekleri kullanılır. ESP32, `HTTPClient` kütüphanesi yardımıyla JSON formatındaki verileri RESTful API servislerine iletebilir. Ancak HTTP protokolünün TCP el sıkışma süreçleri ve header yükleri, MQTT'ye göre daha fazla enerji ve veri tüketimine yol açar.

---

## Örnek Uygulama: Bulut Bağlantılı Sensör İstasyonu Projesi

Teorik bilgileri somutlaştırmak adına; bir adet sıcaklık/nem sensöründen (DHT22) veri okuyan, bu verileri derin uyku döngüleri arasında koruyan ve Wi-Fi üzerinden MQTT Broker'a güvenli bir şekilde aktaran uçtan uca prodüksiyon seviyesinde bir C++ kaynak kodu aşağıda sunulmuştur.

### Kullanılan Kütüphaneler ve Yazılım Gereksinimleri

* `WiFi.h` (Dahili ESP32 Wi-Fi kütüphanesi)
* `PubSubClient.h` (Nick O'Leary tarafından geliştirilen MQTT istemcisi)
* `DHT.h` (Adafruit Unified Sensor kütüphanesi)

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// --- Donanım ve Pin Tanımlamaları ---
#define DHTPIN 4          // DHT22 Data pini GPIO 4'e bağlı
#define DHTTYPE DHT22     // Sensör tipi: DHT 22 (AM2302)
#define TIME_TO_SLEEP 15  // Cihazın uykuda kalacağı süre (Saniye cinsinden)
#define uS_TO_S_FACTOR 1000000ULL  // Mikrosaniyeden saniyeye dönüşüm katsayısı

// --- Ağ ve Protokol Konfigürasyonu ---
const char* ssid = "YUKSEK_HIZLI_WIFI_AGI";
const char* password = "Guclu_Wifi_Sifresi_123";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "esp32/sensor_istasyonu/veri";

// --- Global Nesne Tanımlamaları ---
DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

// --- RTC Bellek Yönetimi ---
// Bu değişken derin uyku modunda sıfırlanmaz, RTC belleğinde tutulur.
RTC_DATA_ATTR int bootCount = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Baglaniliyor: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int counter = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    counter++;
    if(counter > 20) { // 10 saniye içinde bağlanamazsa reset at veya uyu
      Serial.println("\nWi-Fi Baglantisi Basarisiz. Derin uykuya geciliyor.");
      esp_deep_sleep_start();
    }
  }

  Serial.println("");
  Serial.println("Wi-Fi baglantisi saglandi.");
  Serial.print("IP Adresi: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  // Döngü yerine tek seferlik kontrol, bloke kalmamak adına kritik
  if (!client.connected()) {
    Serial.print("MQTT baglantisi aranıyor...");
    // Benzersiz bir Client ID oluşturuluyor
    String clientId = "ESP32Client-";
    clientId += String(random(0, 0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("Baglandi.");
    } else {
      Serial.print("Hata kodu: ");
      Serial.print(client.state());
      Serial.println(" 5 saniye sonra tekrar denenecek.");
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Önyükleme sayısını artır ve ekrana yazdır
  ++bootCount;
  Serial.println("--- SENSOR ISTASYONU AKTIF ---");
  Serial.println("Boot Sayisi: " + String(bootCount));

  // Wi-Fi ve MQTT Kurulumları
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);

  if (!client.connected()) {
    reconnect_mqtt();
  }
  
  // Arka plandaki MQTT süreçlerini işlet
  client.loop();

  // --- Sensör Okuma Aşaması ---
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Okumaların doğruluğunu valide et
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Sensorden veri okunamadi! Veri iletimi iptal edildi.");
  } else {
    // JSON formatında veri paketi hazırlama
    String payload = "{";
    payload += "\"boot_sayisi\":" + String(bootCount) + ",";
    payload += "\"sicaklik\":" + String(temperature, 2) + ",";
    payload += "\"nem\":" + String(humidity, 2);
    payload += "}";

    Serial.print("Yayınlanacak Veri: ");
    Serial.println(payload);

    // MQTT payload gönderimi
    if(client.publish(mqtt_topic, payload.c_str())) {
      Serial.println("Veri MQTT Broker'a basariyla iletildi.");
    } else {
      Serial.println("Veri iletimi basarisiz.");
    }
  }

  // MQTT baglantısını kibarca kapat ve Wi-Fi ağından ayrıl
  client.disconnect();
  WiFi.disconnect(true);
  
  // --- Derin Uyku Konfigürasyonu ---
  Serial.println("Cihaz " + String(TIME_TO_SLEEP) + " saniyeligine derin uykuya geciyor.");
  Serial.flush(); 
  
  // Zamanlayıcı uykusunu kur
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  
  // Derin uykuyu başlat
  esp_deep_sleep_start();
  
  // Bu satırdan sonraki kodlar asla calısmaz, cihaz resetlenerek setup()'tan baslar.
}

void loop() {
  // Derin uyku mimarisinde loop fonksiyonu bos bırakılır.
}

```

---

## Sonuç ve IoT Geleceğinde ESP32'nin Rolü

ESP32, sunduğu donanım mimarisi ve zengin açık kaynak topluluk desteği sayesinde endüstri standardı bir geliştirme platformuna dönüşmüştür. Nesnelerin İnterneti mimarilerinde güvenlik (TLS 1.3), kararlılık ve düşük güç tüketimi gibi unsurların tamamını tek bir SoC (System on Chip) üzerinde birleştirebilmesi, onu rakiplerinin önüne geçirmektedir. Geleceğin Edge AI (Uçta Yapay Zeka) ve akıllı şehir yapılarında ESP32 türevleri (ESP32-S3, ESP32-C6 gibi RISC-V tabanlı yeni nesil işlemciler) ekosistemi domine etmeye devam edecektir.