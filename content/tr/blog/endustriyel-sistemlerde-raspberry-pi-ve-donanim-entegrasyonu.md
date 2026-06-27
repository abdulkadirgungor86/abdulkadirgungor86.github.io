---
title: "Endüstriyel Sistemlerde Raspberry Pi ve Donanım Entegrasyonu"
date: 2026-04-28
type: "blog"
draft: false
math: true
description: "Endüstriyel otomasyonda Raspberry Pi kullanımını, donanım izolasyonundan RTOS çekirdek optimizasyonuna ve Modbus/MQTT haberleşme protokollerine kadar teknik detaylarıyla inceleyen kapsamlı bir yazıdır."
featured_image: "/images/blog/endustriyel-sistemlerde-raspberry-pi-ve-donanim-entegrasyonu.png"
tags: ["blog","elektronik","raspberry-pi", "iiot", "iot", "endustriyel-otomasyon","mqtt", "rtos", "plc", "sensor-veri-isleme", "python"]
---

Geleneksel endüstriyel otomasyon dünyası, uzun yıllardır PLC (Programmable Logic Controller) sistemlerinin katı ve kapalı ekosistemi tarafından domine edilmiştir. Ancak Endüstri 4.0 dalgasıyla birlikte, açık kaynaklı donanımların ve yüksek seviyeli programlama dillerinin sahadaki varlığı bir hobi projesi olmaktan çıkıp profesyonel bir gereklilik haline gelmiştir. Raspberry Pi, Broadcom tabanlı SoC mimarisi ve zengin GPIO (General Purpose Input/Output) imkanlarıyla, prototipleme aşamasından uç nokta (Edge computing) kontrolörlüğüne kadar geniş bir skalada çözüm sunmaktadır.

{{< figure src="/images/blog/endustriyel-sistemlerde-raspberry-pi-ve-donanim-entegrasyonu.png" alt="Endüstriyel Sistemlerde Raspberry Pi ve Donanım Entegrasyonu" width="1200" caption="Şekil 1: Endüstriyel Sistemlerde Raspberry Pi ve Donanım Entegrasyonu." >}}

---

## Gömülü Sistem Mimarisinin Endüstriyel Standartlara Adaptasyonu

Raspberry Pi'nin endüstriyel ortamlarda kullanılabilmesi için en büyük engel donanımın kendisi değil, çevresel izolasyon ve kararlılıktır. Standart bir modelin 3.3V seviyesindeki hassas GPIO pinleri, endüstriyel sahalardaki 24V lojik seviyeleri ve yüksek elektromanyetik gürültü (EMI) karşısında savunmasızdır. Bu noktada profesyonel uygulamalar için **Compute Module 4 (CM4)** tabanlı, galvanik izolasyonlu ve DIN rayı montajına uygun taşıyıcı kartlar tercih edilmelidir.

Endüstriyel bir Raspberry Pi çözümünde mimari şu katmanlardan oluşur:

1. **Güç Katmanı:** 9-30V DC giriş aralığı, ters polarite koruması ve yüksek verimli buck-converter devreleri.
2. **İzolasyon Katmanı:** Giriş ve çıkışlarda optokuplör kullanımı (örneğin PC817 veya 6N137).
3. **İletişim Katmanı:** RS485, RS232 ve CAN-Bus protokolleri için özelleşmiş transceiver birimleri.

## Veri İletişim Protokolleri ve Saha Entegrasyonu

Endüstriyel otomasyonda Raspberry Pi, sadece bir kontrolör değil, aynı zamanda bir ağ geçididir. Modern fabrikalarda kullanılan cihazların çoğu Modbus TCP/RTU veya OPC UA protokollerini kullanır.

### Modbus RTU Uygulaması (Python/C++)

Raspberry Pi üzerinde RS485 üzerinden Modbus iletişimi kurmak için `minimalmodbus` (Python) veya `libmodbus` (C/C++) kütüphaneleri altın standarttır. Aşağıda, bir enerji analizöründen veri okuyan profesyonel düzeyde bir Python betiği örneği yer almaktadır:

```python
import minimalmodbus
import serial

# Enstrümantasyon ayarları
instrument = minimalmodbus.Instrument('/dev/ttyUSB0', 1) # Slave ID: 1
instrument.serial.baudrate = 9600
instrument.serial.bytesize = 8
instrument.serial.parity   = serial.PARITY_EVEN
instrument.serial.stopbits = 1
instrument.serial.timeout  = 0.5
instrument.mode = minimalmodbus.MODE_RTU

try:
    # Holding Register üzerinden sıcaklık verisi okuma (Adres 0x0001)
    temperature = instrument.read_register(1, number_of_decimals=1, functioncode=3)
    print(f"Saha Sıcaklık Verisi: {temperature} C")
except Exception as e:
    print(f"İletişim Hatası: {str(e)}")

```

## Yazılım Mimarisi: Gerçek Zamanlı İşletim Sistemleri (RTOS)

Standart bir Raspberry Pi OS (Debian tabanlı), "best-effort" prensibiyle çalışır. Yani bir görevin tam olarak ne zaman yürütüleceğini garanti edemez. Endüstriyel hassasiyetteki kontrol döngüleri (örneğin bir servo motorun 10ms'lik periyotlarla sürülmesi) için **PREEMPT_RT** yaması uygulanmış bir çekirdek (kernel) kullanılması şarttır.

### Kernel Optimizasyonu ve Kararlılık

Endüstriyel sistemlerde SD kartların bozulması (corruption) en büyük risklerden biridir. Bu sorunu aşmak için:

* **ReadOnly File System:** İşletim sistemini salt okunur modda çalıştırarak ani güç kesintilerinde veri bozulmasını engellemek.
* **OverlayFS:** Değişiklikleri RAM üzerinde tutup disk üzerine yazmamak.
* **Watchdog Timer:** Sistemin donması durumunda otomatik olarak donanımsal reset atan dahili birimlerin aktif edilmesi.

## Gelişmiş Sensör Veri İşleme ve MQTT Entegrasyonu

Raspberry Pi'yi bir IIoT (Industrial Internet of Things) cihazına dönüştüren temel unsur, sahadan topladığı verileri buluta veya yerel bir SCADA sistemine iletme yeteneğidir. JSON formatındaki verilerin MQTT protokolü ile taşınması, düşük bant genişliği tüketimi ve yüksek güvenilirlik sağlar.

```python
import paho.mqtt.client as mqtt
import json
import time

MQTT_BROKER = "192.168.1.100"
MQTT_TOPIC = "factory/machine1/telemetry"

client = mqtt.Client()
client.connect(MQTT_BROKER, 1883, 60)

def publish_sensor_data(sensor_id, value):
    payload = {
        "timestamp": int(time.time()),
        "sensor_id": sensor_id,
        "value": value,
        "unit": "Celsius"
    }
    client.publish(MQTT_TOPIC, json.dumps(payload))

# Döngü içerisinde veri gönderimi
while True:
    # Yapay zeka veya lojik katmanından gelen veri
    sample_value = 45.2 
    publish_sensor_data("TEMP_01", sample_value)
    time.sleep(5)

```

## Yapay Zeka Destekli Kestirimci Bakım

Raspberry Pi 4 ve 5 serilerinin CPU gücü, uç noktada hafifletilmiş (Lightweight) yapay zeka modellerini çalıştırmak için yeterlidir. TensorFlow Lite veya ONNX Runtime kullanarak, bir motorun titreşim verileri üzerinden arıza tespiti yapmak mümkündür.

İvmeölçer (MPU6050 gibi) üzerinden gelen yüksek frekanslı veriler, Fast Fourier Transform (FFT) işleminden geçirilerek spektral analiz yapılır. Eğer spektrumdaki harmonikler normal değerlerin dışına çıkarsa, sistem otomatik olarak operatöre uyarı gönderir veya hattı güvenli moda alır.

### Önemli Teknik Notlar

* **Termal Yönetim:** Endüstriyel panoların iç sıcaklığı 50-60°C derecelere çıkabilir. Raspberry Pi'nin "throttling" (performans düşürme) yapmaması için pasif soğutuculu metal kasalar veya aktif fan kontrol sistemleri kullanılmalıdır.
* **EMC Uyumluluğu:** Cihazın CE/FCC sertifikalı endüstriyel shield'lar ile korunması, çevredeki büyük motor sürücülerinin (VFD) yarattığı parazitleri filtreleyecektir.
* **Güvenlik:** Varsayılan kullanıcı adlarını değiştirmek, SSH portunu özelleştirmek ve gereksiz servisleri kapatmak siber güvenlik mimarisinin ilk adımıdır.

## Veritabanı ve Yerel Kayıt Stratejileri

İnternet bağlantısının kesildiği durumlarda veri kaybını önlemek için yerel bir veritabanı (Edge DB) kullanımı kritiktir. **InfluxDB** (Zaman serisi veritabanı) ve görselleştirme için **Grafana**, Raspberry Pi üzerinde oldukça verimli çalışır.

1. **InfluxDB:** Sensör verilerini zaman damgasıyla saklar.
2. **Grafana:** Bu verileri gerçek zamanlı grafiklere dönüştürür ve belirlenen eşik değerleri aşıldığında alarm üretir.
3. **SQLite:** Daha basit yapılandırma verileri ve cihaz ayarları için tercih edilen hafif bir SQL motorudur.

## Sonuç: Hibrit Bir Gelecek

Raspberry Pi tabanlı endüstriyel otomasyon, geleneksel PLC'lerin yerini tamamen almaktan ziyade, onların eksik kaldığı "veri analitiği, ağ iletişimi ve esnek programlama" alanlarını tamamlamaktadır. Python'un kütüphane zenginliği ile endüstriyel sahanın sert koşullarını birleştiren mühendisler, çok daha düşük maliyetli ve çok daha akıllı kontrol sistemleri inşa edebilmektedir. Bu dönüşümde anahtar kelime donanım değil, bu donanımı endüstriyel standartlara göre optimize edebilen yazılım mimarisidir.

