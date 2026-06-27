---
title: "Gungor-robot-car: ESP32 Kamera Kontrollü Robot Araba"
date: 2026-05-13
type: "blog"
draft: false
description: "ESP32-WROVER modülü ile WiFi üzerinden canlı görüntü aktarabilen ve tarayıcı tabanlı arayüz ile uzaktan kontrol edilebilen robotik araç projesidir."
featured_image: "/images/blog/github-proje-3-gungor-robot-car.png"
tags: ["blog", "robotik", "robotic", "iot", "embedded", "cplusplus", "arduino", "esp32", "esp32-cam", "esp32-camera", "remote-control", "robotic-car", "electronic", "elektronik", "software-hardware"]
---

**Gungor-robot-car**, ESP32-WROVER modülü ve kamera modülü kullanılarak tasarlanmış, tarayıcı üzerinden canlı görüntü izleme ve uzaktan hareket kontrolü sağlayan bir robotik araç projesidir.

{{< figure src="/images/blog/github-proje-3-gungor-robot-car.png" alt="Gungor Kameralı Robot Araba" width="1200" caption="Şekil 1: Gungor Kameralı Robot Araba." >}}

## 1. Mimari Yaklaşım
Proje, ESP32'nin dahili WiFi yeteneklerini kullanarak bir HTTP sunucusu gibi çalışır. Kullanıcılar, yerel ağ üzerinden tarayıcı tabanlı bir arayüze bağlanarak aracı yönetebilir ve canlı video akışını (MJPEG) görüntüleyebilir.

## 2. Teknik Özellikler ve Donanım
Projenin temel teknik yapısı şu şekilde yapılandırılmıştır:

* **Mikrodenetleyici:** ESP32 Wrover Module.
* **Bağlantı:** WiFi üzerinden HTTP sunucusu.
* **Kamera:** Canlı video akışı (MJPEG) desteği.
* **Kontrol:** Tarayıcı tabanlı kontrol paneli.
* **Ek Özellikler:** Uzaktan LED aydınlatma kontrolü ve kamera ayarları (çözünürlük, parlaklık) değiştirme imkanı.

### Donanım Pin Yapılandırması
Robotun hareket ve aydınlatma yönetimi için aşağıdaki GPIO pinleri tanımlanmıştır:

| Fonksiyon | GPIO Pini |
| :--- | :--- |
| Sol Motor (İleri) | 14 |
| Sol Motor (Geri) | 2 |
| Sağ Motor (İleri) | 13 |
| Sağ Motor (Geri) | 15 |
| LED | 4 |

## 3. Kontrol Mekanizması
Kontrol paneli, HTTP GET istekleri göndererek çalışır. Butonlara basıldığında tetiklenen komutlar şunlardır:

* **İleri (`/go`)**: Sol ve sağ motorları ileri yönde çalıştırır.
* **Geri (`/back`)**: Sol ve sağ motorları geri yönde çalıştırır.
* **Sol (`/left`)**: Robotun kendi ekseninde sola dönmesini sağlar.
* **Sağ (`/right`)**: Robotun kendi ekseninde sağa dönmesini sağlar.
* **DUR (`/stop`)**: Tüm motorları durdurur.
* **Işık Kontrolü**: LED'i açmak (`/ledon`) veya kapatmak (`/ledoff`) için kullanılır.

## 4. Kurulum
Projenin çalışması için Arduino IDE üzerinde ESP32 kart kütüphanelerinin yüklü olması gerekmektedir. Yapılandırma aşamasında `gungor-robot-car-v3_0.ino` dosyası içerisindeki `hostname`, `ssid` ve `password` alanlarının yerel WiFi ağ bilgilerine göre güncellenmesi zorunludur.

---

### Proje Erişimi
Projenin kaynak kodlarına ve teknik dokümanlarına aşağıdaki bağlantıdan ulaşabilirsiniz:

> **Proje Linki:** [https://github.com/abdulkadirgungor86/Gungor-robot-car](https://github.com/abdulkadirgungor86/Gungor-robot-car)

### Sonuç
Gungor-robot-car, WiFi teknolojisi ile görüntü işleme ve motor kontrolünü birleştiren kapsamlı bir IoT uygulamasıdır. Bu proje, kendi kablosuz kontrollü robotunu geliştirmek isteyenler için ideal bir altyapı sunmaktadır.