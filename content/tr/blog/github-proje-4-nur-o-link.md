---
title: "Nur-o-link: Uzaktan Kontrollü Robotik Kol ve Araç Sistemi"
date: 2026-05-14
type: "blog"
draft: false
description: "Nur-o-link projesi, uzaktan kontrol edilebilir robotik kol ve otonom araç özelliklerini birleştiren, donanım ve yazılımın etkileşimini ön plana çıkaran yenilikçi bir robotik çalışmadır."
featured_image: "/images/blog/github-proje-4-nur-o-link.png"
tags: ["blog", "robotic", "robotic-arm", "robotik", "iot", "embedded", "cplusplus", "arduino","esp32","remote-control","uzaktan-kontrol", "robot-kol","software-hardware","rex-8in1-v2","elektronik"]
---

Robotik dünyasında kontrol ve hareket kabiliyeti, sistemlerin işlevselliğini belirleyen en kritik iki faktördür. **Nur-o-link** projesi, hem hassas bir robotik kol mekanizmasını hem de uzaktan kontrol edilebilir bir araç sistemini birleştirerek, esnek ve çok yönlü bir robotik platform sunmaktadır.

{{< figure src="/images/blog/github-proje-4-nur-o-link.png" alt="Nur-o-link: Uzaktan Kontrollü Robotik Kol ve Araç Sistemi" width="1200" caption="Şekil 1: Nur-o-link: Uzaktan Kontrollü Robotik Kol ve Araç Sistemi." >}}

## 1. Mimari Yaklaşım: Hibrit Robotik Tasarım
Nur-o-link, sadece bir araç değil, aynı zamanda fiziksel dünyada görev yapabilen bir manipülatör sistemidir. Proje, aracın hareketliliği ile robotik kolun kavrama ve taşıma yeteneklerini aynı gömülü sistem üzerinde başarıyla entegre eder.

### Sistemin Temel Bileşenleri
* **Mobil Platform:** Uzaktan komutlarla yönlendirilen, otonom veya manuel sürüş yeteneğine sahip araç gövdesi.
* **Robotik Kol:** Hassas pozisyonlama ve nesne yönetimi için kullanılan, çok eksenli hareket kabiliyetine sahip mekanik kol.
* **Kontrol Merkezi:** Uzaktan sinyalleri işleyerek hem aracı hem de kolu senkronize bir şekilde yöneten merkezi işlem birimi.

## 2. Teknolojik Altyapı
Sistem, gerçek zamanlı tepki süreleri ve donanım kontrolü gereksinimleri gözetilerek geliştirilmiştir:

* **Mikrokontrolcü:** Çoklu motor sürücülerini ve sensör verilerini yönetebilen Arduino tabanlı kontrol birimleri.
* **Dil:** Düşük gecikmeli iletişim ve doğrudan donanım yönetimi için optimize edilmiş C/C++.
* **Uzaktan İletişim:** Kablosuz protokoller aracılığıyla operatörden gelen komutların kesintisiz aktarımı.
* **Hareket Yönetimi:** Servo motorlar ve DC motorların PWM sinyalleri ile hassas kontrolü.

## 3. Temel İşlevsellik
Nur-o-link, karmaşık görevleri yerine getirebilecek şekilde tasarlanmıştır:

* **Uzaktan Kontrol:** Mobil platformun ve robotik kolun, kullanıcı tarafından anlık olarak yönlendirilmesi.
* **Çok Yönlü Görevler:** Aracın hareket ederek istenen noktaya ulaşması ve ardından robotik kolun üzerindeki yükü veya objeyi yönetmesi.
* **Düşük Gecikmeli Komut İşleme:** Uzaktan gönderilen sinyallerin, mekanik hareketlere minimum tepki süresiyle dönüştürülmesi.

## 4. Yazılım ve Tasarım Prensipleri
Sistemin sürdürülebilirliği ve donanım üzerindeki kararlılığı için şu prensipler benimsenmiştir:

* **Modüler Yazılım:** Araç hareketleri ve kol manipülasyonu için birbirinden bağımsız, yönetilebilir kod blokları.
* **Genişletilebilirlik:** İleride eklenebilecek sensörler veya otonom modlar için esnek bir mimari.
* **Donanım Soyutlama:** Yazılım katmanının, mekanik aksamın karmaşıklığından arındırılarak daha sade bir arayüzle yönetilmesi.

---

### Proje Erişimi ve Geliştirme
Nur-o-link projesi, uzaktan kontrollü robotik sistemler ve mekanik-yazılım bütünleşmesi konusunda pratik yapmak isteyen geliştiriciler için mükemmel bir referanstır. Projenin kaynak kodlarını incelemek ve kendi sisteminize entegre etmek için aşağıdaki bağlantıyı kullanabilirsiniz:

> **Proje Linki:** [https://github.com/abdulkadirgungor86/Nur-o-link](https://github.com/abdulkadirgungor86/Nur-o-link)

### Sonuç
Nur-o-link, robotik tutkunlarına sadece bir "araç" yapmanın ötesine geçerek, hareketli bir sistem üzerine nasıl "manipülatör" ekleneceğini ve bu iki farklı mekanizmanın nasıl uyumlu çalışacağını gösteren etkileyici bir çalışmadır. Yazılımın fiziksel harekete dönüştüğü bu projede, keşfedecek çok şey var.