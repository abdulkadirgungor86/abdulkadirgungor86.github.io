---
title: "IoT Projelerinde Mimari Karar Süreçleri: ESP32 ve ESP8266 Mikrodenetleyicilerinin Teknik Analizi"
date: 2026-04-27
type: "blog"
draft: false
math: true
description: "ESP32 ve ESP8266 mikrodenetleyicilerinin mimari farklarını, bağlantı yeteneklerini ve donanım özelliklerini teknik bir derinlikle karşılaştırarak IoT projeleri için optimize edilmiş seçim rehberi sunan kapsamlı bir yazıdır."
featured_image: "/images/blog/iot-projelerinde-mimari-karar-surecleri-esp32-ve-esp8266-mikrodenetleyicilerinin-teknik-analizi.png"
tags: ["blog", "iot","esp32","esp8266","arduino","free-rtos","mikrodenetleyici","elektronik","wi-fi","bluetooth" ]
---

Nesnelerin İnterneti (IoT) ekosisteminde donanım seçimi, bir projenin sürdürülebilirliği, güç tüketimi ve işlem kapasitesi üzerinde doğrudan belirleyici bir rol oynar. Espressif Systems tarafından geliştirilen ESP8266 ve halefi ESP32, düşük maliyetli Wi-Fi entegrasyonu sunarak gömülü sistemler dünyasında devrim yaratmıştır. Ancak bu iki platform, mimari açıdan birbirinden oldukça farklı spektrumları temsil eder.

{{< figure src="/images/blog/iot-projelerinde-mimari-karar-surecleri-esp32-ve-esp8266-mikrodenetleyicilerinin-teknik-analizi.png" alt="IoT Projelerinde Mimari Karar Süreçleri: ESP32 ve ESP8266 Mikrodenetleyicilerinin Teknik Analizi" width="1200" caption="Şekil 1: IoT Projelerinde Mimari Karar Süreçleri: ESP32 ve ESP8266 Mikrodenetleyicilerinin Teknik Analizi." >}}

---

### İşlemci Mimarisi ve Hesaplama Gücü

ESP8266, 80 MHz (160 MHz'e kadar hızlandırılabilir) frekansında çalışan L106 32-bit RISC işlemci çekirdeğine sahiptir. Tek çekirdekli bu yapı, basit veri iletimi ve sensör okuma işlemleri için yeterli olsa da, eşzamanlı görev yönetiminde (multitasking) kısıtlamalar sunar.

ESP32 ise çıtayı çok daha yukarı taşır. Xtensa® Dual-Core 32-bit LX6 mikroişlemci mimarisi ile gelen bu yonga, 240 MHz hıza ulaşabilir. Çift çekirdekli yapının en büyük avantajı, bir çekirdeğin Wi-Fi ve Bluetooth yığınlarını (stack) yönetirken, diğer çekirdeğin tamamen kullanıcı koduna ve kritik hesaplamalara ayrılabilmesidir. Bu durum, gecikme hassasiyeti olan projelerde deterministik bir çalışma ortamı sağlar.

### Kablosuz Bağlantı ve Protokol Desteği

ESP8266 yalnızca 2.4 GHz Wi-Fi (802.11 b/g/n) desteği sunar. Bu, cihazı internete bağlamak için yeterli olsa da modern bağlantı ihtiyaçlarında yetersiz kalabilir.

ESP32 ise hibrit bir iletişim modülüdür. Wi-Fi'ın yanı sıra hem Bluetooth Classic hem de Bluetooth Low Energy (BLE) desteği sunar. BLE desteği, özellikle pil ile çalışan giyilebilir teknolojiler ve akıllı ev sensörleri için hayati önem taşır; çünkü veri iletimi gerekmediğinde güç tüketimi mikroamper seviyelerine indirilebilir.

### Bellek ve Depolama Yönetimi

Gömülü yazılım geliştirmede RAM kapasitesi, çalışma zamanı (runtime) stabilitesi için kritiktir:

* **ESP8266:** Yaklaşık 160 KB dahili RAM sunar, ancak bunun yalnızca küçük bir kısmı kullanıcıya ayrılmıştır (genellikle 40-50 KB arası).
* **ESP32:** 520 KB dahili SRAM ile gelir. Ayrıca PSRAM (Pseudo-Static RAM) desteği sayesinde harici bellek birimleri ile bu kapasite megabayt seviyelerine çıkarılabilir. Bu özellik, görüntü işleme veya yoğun veri tamponlama (buffering) gerektiren uygulamalarda ESP32'yi rakipsiz kılar.

### Pin Konfigürasyonu ve Periferik Birimler

Giriş/Çıkış (I/O) zenginliği, donanım tasarımında esneklik sağlar. ESP8266, sınırlı sayıda GPIO pinine sahiptir ve sadece tek bir 10-bit ADC (Analog-Dijital Dönüştürücü) kanalı barındırır.

ESP32 ise bir "çevre birimi canavarı" olarak nitelendirilebilir:

* **Kapasitif Dokunmatik Sensörler:** 10 adet GPIO pini dokunmatik yüzey olarak kullanılabilir.
* **ADC ve DAC:** 12-bit çözünürlüğünde 18 ADC kanalı ve 2 adet 8-bit DAC (Dijital-Analog Dönüştürücü) kanalı mevcuttur.
* **Hızlı Haberleşme:** 3x UART, 3x SPI, 2x I2C, CAN Bus 2.0 ve I2S arayüzleri ile ses işleme ve endüstriyel haberleşme protokollerini destekler.
* **Donanımsal Hızlandırma:** AES, SHA-2, RSA ve ECC gibi kriptografik algoritmalar için donanımsal hızlandırıcılar içerir, bu da güvenli veri iletiminde işlemci yükünü minimize eder.

---

### Yazılım Geliştirme ve Kütüphane Ekosistemi

Her iki platform da Arduino IDE, MicroPython ve Espressif’in kendi geliştirme çerçevesi olan ESP-IDF (IoT Development Framework) ile uyumludur. Ancak ESP32’nin FreeRTOS (Real-Time Operating System) tabanlı yapısı, profesyonel projelerde görevlerin (tasks) önceliklendirilmesine olanak tanır.

#### ESP32 için Çoklu Çekirdek Kullanımı (FreeRTOS) Örneği

Aşağıdaki kod parçası, ESP32’nin her iki çekirdeğini aynı anda nasıl kullanabileceğimizi göstermektedir. Bu yapı ESP8266'da teknik olarak mümkün değildir.

```cpp
#include <Arduino.h>

// Görev tutamaçları
TaskHandle_t Task1;
TaskHandle_t Task2;

void setup() {
  Serial.begin(115200);

  // 0. Çekirdekte çalışacak görev (Sistem görevleri veya sensör okuma)
  xTaskCreatePinnedToCore(
    Task1code,   /* Görev fonksiyonu */
    "Task1",     /* Görev adı */
    10000,       /* Stack boyutu */
    NULL,        /* Parametreler */
    1,           /* Öncelik */
    &Task1,      /* Tutamaç */
    0);          /* Çekirdek ID */

  // 1. Çekirdekte çalışacak görev (Kullanıcı arayüzü veya veri iletimi)
  xTaskCreatePinnedToCore(
    Task2code,   /* Görev fonksiyonu */
    "Task2",     /* Görev adı */
    10000,       /* Stack boyutu */
    NULL,        /* Parametreler */
    1,           /* Öncelik */
    &Task2,      /* Tutamaç */
    1);          /* Çekirdek ID */
}

void Task1code( void * pvParameters ){
  for(;;){
    Serial.print("Görev 1 Çekirdek: ");
    Serial.println(xPortGetCoreID());
    delay(1000);
  } 
}

void Task2code( void * pvParameters ){
  for(;;){
    Serial.print("Görev 2 Çekirdek: ");
    Serial.println(xPortGetCoreID());
    delay(700);
  }
}

void loop() {
  // Ana loop genellikle boş bırakılır veya 3. bir görev gibi davranır
}

```

### Güç Tüketimi ve Uyku Modları

Taşınabilir IoT cihazlarında enerji verimliliği en kritik parametredir. ESP8266, yaklaşık 20 µA civarında bir "Deep Sleep" akımına sahiptir. ESP32 ise içindeki "Ultra Low Power" (ULP) yardımcı işlemcisi sayesinde, ana çekirdekler tamamen kapalıyken bile belirli eşik değerlerini takip edebilir. ESP32'nin derin uyku modundaki tüketimi 10 µA seviyelerine kadar düşebilir.

### Karşılaştırmalı Teknik Tablo

| Özellik | ESP8266 | ESP32 |
| --- | --- | --- |
| **MCU** | Tensilica L106 32-bit | Xtensa Dual-Core LX6 32-bit |
| **Hız** | 80 - 160 MHz | 160 - 240 MHz |
| **Wi-Fi** | 802.11 b/g/n | 802.11 b/g/n |
| **Bluetooth** | Yok | Bluetooth v4.2 BR/EDR ve BLE |
| **RAM** | ~160 KB | 520 KB |
| **Flash (Dahili)** | Yok (Harici Çip ile 16MB'a kadar) | 4 MB (Genellikle dahili) |
| **GPIO Sayısı** | 17 | 36 |
| **ADC** | 1 Kanal (10-bit) | 18 Kanal (12-bit) |
| **Donanımsal Şifreleme** | Yazılımsal | Donanımsal (AES, SHA, vb.) |

---

### Proje Gereksinimlerine Göre Seçim Stratejisi

Hangi platformu seçeceğiniz, projenizin karmaşıklığına ve bütçesine bağlıdır.

#### Ne Zaman ESP8266 Seçilmeli?

1. **Maliyet Odaklılık:** Eğer binlerce adet üretilecek basit bir akıllı priz veya sıcaklık sensörü yapıyorsanız, ESP8266 maliyet avantajı sağlar.
2. **Alan Kısıtı:** ESP-01 gibi modüller oldukça küçüktür ve dar alanlara kolayca entegre edilebilir.
3. **Basitlik:** Karmaşık protokollerin (SSL/TLS gibi) yoğun yük bindirmediği uygulamalarda öğrenme eğrisi daha düşüktür.

#### Ne Zaman ESP32 Seçilmeli?

1. **Gelişmiş Güvenlik:** TLS/SSL sertifikalarını işlemek ve şifreli veri trafiği yönetmek için ESP32’nin donanımsal hızlandırıcıları şarttır.
2. **Ses ve Görüntü:** I2S arayüzü üzerinden ses akışı sağlamak veya bir kamera modülü (ESP32-CAM) kullanmak istiyorsanız ESP32 tek seçenektir.
3. **Düşük Güç Tüketimi:** BLE gereksinimi olan pil beslemeli projelerde ESP32'nin güç yönetimi üstündür.
4. **Geleceğe Hazırlık:** OTA (Over-The-Air) güncellemeleri sırasında ESP32’nin geniş belleği, çift imaj (dual partition) yönetimini daha güvenli hale getirir.

### Teknik Notlar ve Kritik Uyarılar

> **Not 1: Gerilim Seviyeleri**
> Her iki mikrodenetleyici de **3.3V** mantık seviyesi ile çalışır. 5V toleranslı değillerdir. Pinlere uygulanacak doğrudan 5V, çiplerin kalıcı hasar almasına neden olacaktır. Logic Level Converter (Mantıksal Seviye Dönüştürücü) kullanımı zorunludur.

> **Not 2: Wi-Fi Çakışmaları**
> ESP8266'da Wi-Fi işlemleri ve kullanıcı kodu aynı çekirdeği paylaştığı için, `delay()` fonksiyonu gibi engelleyici (blocking) kodlar Wi-Fi yığınının çökmesine (Watchdog Timer Reset) neden olabilir. ESP32’de bu risk, görevlerin farklı çekirdeklere dağıtılmasıyla minimize edilir.

> **Not 3: Anten Seçimi**
> Eğer projeniz metal bir muhafaza içinde olacaksa, PCB üzerindeki dahili antenler (trace antenna) verim sağlamaz. Bu durumda üzerinde IPEX konnektörü bulunan (ESP32-WROOM-32U gibi) modelleri tercih ederek harici anten kullanmalısınız.

Sonuç olarak, ESP8266 hobi dünyasına giriş ve basit otomasyonlar için hala geçerli bir seçenek olsa da; ESP32, modern IoT dünyasının gerektirdiği işlem gücü, güvenlik ve bağlantı çeşitliliği için endüstriyel standart haline gelmiştir. Mühendislik perspektifinden bakıldığında, maliyet farkının giderek azaldığı günümüzde, ESP32’nin sunduğu esneklik her zaman daha güvenli bir yatırımdır.