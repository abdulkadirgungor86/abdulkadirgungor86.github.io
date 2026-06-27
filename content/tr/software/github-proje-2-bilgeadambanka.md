---
title: "BilgeAdamBanka: .NET 8.0 ile Güvenli ve Katmanlı Bankacılık API Mimarisi"
date: 2026-05-12
type: "blog"
draft: false
description: "Kredi kartı işlemleri yönetimi için geliştirilen, yüksek performanslı, ölçeklenebilir ve N-katmanlı mimari prensiplerine dayanan 'BilgeAdamBanka' projesinin teknik detayları ve altyapısını içermektedir."
featured_image: "/images/software/github-proje-2-bilgeadambanka.png"
tags: ["yazilim", "software", "web", "dotnet", "csharp", "banka-api", "bank-api", "yazilim-mimarisi", "software-architecture", "n-tier", "web-development", "rest-api"]
---

Modern finansal sistemler, verilerin güvenliği, işlemlerin doğrulanması ve sistemin sürdürülebilirliği için sağlam mimari temellere ihtiyaç duyar. **BilgeAdamBanka**, .NET 8.0 ekosisteminin sunduğu güncel imkanları kullanarak, kredi kartı işlemlerini (CRUD operasyonları) yönetmek için kurgulanmış, hibrit N-Katmanlı (N-Tier) bir API çözümüdür.

{{< figure src="/images/software/github-proje-2-bilgeadambanka.png" alt="\"BilgeAdamBanka\"; kredi kartı işlemlerini (oluşturma, görüntüleme, güncelleme, silme) yönetmek için katmanlı mimari yapısına sahip bir Banka API sistemini içermektedir." width="1200" caption="Şekil 1: \"BilgeAdamBanka\"; kredi kartı işlemlerini (oluşturma, görüntüleme, güncelleme, silme) yönetmek için katmanlı mimari yapısına sahip bir Banka API sistemini içermektedir." >}}

## 1. Mimari Yaklaşım: Katmanlı Yapı
Proje, iş mantığının veri erişiminden ve dış dünyaya açık olan API uç noktalarından tamamen ayrıldığı N-katmanlı bir yapı üzerine inşa edilmiştir. Bu modülerlik, sistemin test edilebilirliğini ve sürdürülebilirliğini üst düzeye çıkarır.

### Katmanların Sorumlulukları
* **API Layer (Sunum Katmanı):** Dış dünyadan gelen HTTP isteklerinin karşılandığı, modellerin doğrulandığı ve yanıtların döndürüldüğü giriş noktasıdır.
* **Business Logic Layer (BLL):** Bankacılık işlemlerine dair iş kurallarının (örneğin; kart limit kontrolleri, işlem validasyonları) merkezidir.
* **Data Access Layer (DAL):** Entity Framework Core kullanarak veritabanı ile doğrudan iletişime geçen, CRUD işlemlerinin soyutlandığı katmandır.
* **Infrastructure:** Merkezi loglama, hata yönetimi ve güvenlik konfigürasyonlarının yer aldığı destek katmanıdır.

## 2. Kullanılan Teknolojiler ve Araçlar
Proje, güncel standartları ve endüstriyel en iyi uygulamaları takip eden bir teknoloji yığını ile geliştirilmiştir:

* **Framework:** .NET 8.0
* **Dil:** C#
* **ORM:** Entity Framework Core
* **Veritabanı:** SQL Server (İlişkisel modelleme)
* **Mimari Desenler:** Repository Pattern, Unit of Work, Dependency Injection

## 3. Temel İşlevsellik
BilgeAdamBanka, bir bankacılık API'sinden beklenen temel kredi kartı yönetim fonksiyonlarını güvenli bir şekilde sunar:

* **İşlem Yönetimi:** Kredi kartı bilgilerinin güvenli bir şekilde oluşturulması, listelenmesi, güncellenmesi ve sistemden kaldırılması.
* **Veri Tutarlılığı:** Katmanlar arası geçişlerde kullanılan DTO (Data Transfer Object) kullanımı sayesinde veritabanı şeması ile dış arayüz birbirinden izole edilmiştir.
* **Sorgu Optimizasyonu:** Repository Pattern kullanımı sayesinde, veritabanı sorguları optimize edilmiş ve kod tekrarı minimize edilmiştir.

## 4. Yazılım Standartları
Kodun profesyonel standartlarda kalması için şu prensipler uygulanmıştır:

* **SOLID:** Kodun esnek, genişletilebilir ve hata payı düşük bir yapıda tutulması.
* **Dependency Injection:** Servislerin birbirine bağımlılığının azaltılması, böylece test süreçlerinin kolaylaştırılması.
* **RESTful İlkeleri:** Standart HTTP metodları (GET, POST, PUT, DELETE) kullanılarak tutarlı bir API tasarımı.

---

### Proje Erişimi ve Geliştirme
BilgeAdamBanka projesi, modern bir bankacılık modülünün mimari olarak nasıl kurgulanabileceğini göstermektedir. Projenin kaynak kodlarına ve teknik yapısına aşağıdaki bağlantıdan ulaşabilirsiniz:

> **Proje Linki:** [https://github.com/abdulkadirgungor86/BilgeAdamBanka](https://github.com/abdulkadirgungor86/BilgeAdamBanka)

### Sonuç
.NET 8.0 ve N-katmanlı mimarinin gücünü birleştiren BilgeAdamBanka, özellikle finansal teknolojiler (FinTech) alanında proje geliştirmek isteyenler için temel bir referans niteliğindedir. Sağlam bir veritabanı soyutlaması ve temiz kod prensipleri sayesinde, bu yapı üzerine yeni modüller eklemek oldukça kolaydır.