---
title: "BilgeAdamEvimiKur: .NET 8.0 ve C# ile Hibrit N-Katmanlı E-Ticaret Mimarisi"
date: 2026-05-11
type: "blog"
draft: false
description: "Modern web teknolojileri kullanılarak geliştirilen, ölçeklenebilir ve modüler yapılı N-katmanlı e-ticaret platformu 'BilgeAdamEvimiKur' projesinin teknik detaylarını ve mimari yaklaşımını inceleyen bir teknik dokümandır."
featured_image: "/images/software/github-proje-1-bilgeadamevimikur.png"
tags: ["yazilim", "software", "web", "dotnet", "csharp", "ecommerce", "e-ticaret", "yazilim-mimarisi", "software-architecture", "n-tier", "web-development"]
---

Modern e-ticaret sistemleri, kullanıcı deneyimini iyileştirmek, yüksek trafik altında performanslı çalışmak ve sürdürülebilir bir kod yapısı sunmak için güçlü mimari temellere ihtiyaç duyar. **BilgeAdamEvimiKur**, .NET 8.0 ekosisteminin en güncel özelliklerini kullanarak, hibrit N-Katmanlı (N-Tier) mimari yaklaşımıyla kurgulanmış kapsamlı bir e-ticaret çözümüdür.

{{< figure src="/images/software/github-proje-1-bilgeadamevimikur.png" alt="\"BilgeAdamEvimiKur\"; .NET 8.0 ve C# ile Hibrit N-Katmanlı (N-Tier) E-Ticaret Projesi" width="1200" caption="Şekil 1: \"BilgeAdamEvimiKur\"; .NET 8.0 ve C# ile Hibrit N-Katmanlı (N-Tier) E-Ticaret Projesi" >}}

## 1. Mimari Yaklaşım: Hibrit N-Katmanlı Yapı

Proje, iş mantığını veri erişiminden ve kullanıcı arayüzünden tamamen ayıran klasik N-katmanlı mimariyi benimserken, modern yazılım prensiplerini de entegre eder. Bu yapı sayesinde, sistemin modülerliği artırılmış ve teknik borç minimize edilmiştir.

### Katmanlar Arası İletişim
* **Presentation Layer (Sunum Katmanı):** Kullanıcı etkileşiminin yönetildiği, modern arayüz bileşenlerini içeren katman.
* **Business Logic Layer (BLL):** İş kurallarının, validasyonların ve operasyonel süreçlerin merkezi.
* **Data Access Layer (DAL):** Entity Framework Core aracılığıyla veritabanı işlemlerinin soyutlandığı katman.
* **Common/Infrastructure:** Proje genelinde kullanılan yardımcı sınıflar, loglama ve güvenlik konfigürasyonları.

## 2. Kullanılan Teknolojiler ve Araçlar

Projenin temelini oluşturan teknoloji yığını, güncel standartlara uygun olarak seçilmiştir:

* **Framework:** .NET 8.0 (En yüksek performans ve güvenlik standartları)
* **Programlama Dili:** C#
* **ORM:** Entity Framework Core (Veritabanı yönetimi ve Code-First yaklaşımı)
* **Veritabanı:** SQL Server (İlişkisel veri modellemesi için)
* **Mimari Kalıplar:** Repository Pattern, Unit of Work, Dependency Injection

## 3. Temel Özellikler ve İşlevsellik

BilgeAdamEvimiKur, kullanıcıların ihtiyaçlarını karşılayan geniş bir özellik seti sunar:

* **Sepet Yönetimi:** Dinamik olarak yönetilen ürün sepeti ve stok kontrol mekanizmaları.
* **Güvenli Ödeme Entegrasyonu:** Sipariş süreçlerinin yönetildiği uçtan uca ödeme modülleri.
* **Kullanıcı Yönetimi:** Kimlik doğrulama ve yetkilendirme süreçlerinde Identity Framework kullanımı.
* **Kategori ve Ürün Filtreleme:** Kullanıcıların aradıkları ürüne hızlı erişimini sağlayan optimize edilmiş sorgular.

## 4. Yazılım Geliştirme Standartları

Kod kalitesini ve sürdürülebilirliği sağlamak adına projede uygulanan prensipler şunlardır:

* **SOLID Prensipleri:** Her katmanın tek bir sorumluluğu üstlendiği, esnek ve genişletilebilir bir kod tabanı.
* **Dependency Injection (DI):** Servislerin decouple edilmesiyle test edilebilirliğin artırılması.
* **Clean Code:** Okunabilir, anlaşılır ve bakım yapılabilir kod standartları.

---

### Proje Erişimi ve Geliştirme

Proje, açık kaynaklı olarak geliştirilmekte olup topluluk katkılarına ve teknik incelemelere açıktır. Projenin kaynak kodlarına, güncel dokümantasyonuna ve kurulum adımlarına aşağıdaki bağlantı üzerinden erişebilirsiniz:

> **Proje Linki:** [https://github.com/abdulkadirgungor86/BilgeAdamEvimiKur](https://github.com/abdulkadirgungor86/BilgeAdamEvimiKur)

### Sonuç

BilgeAdamEvimiKur projesi, özellikle .NET teknolojilerine ilgi duyan geliştiriciler için N-katmanlı mimarinin gerçek dünya senaryolarında nasıl başarıyla uygulanabileceğini gösteren başarılı bir örnektir. Modern geliştirme süreçlerini ve en iyi uygulamaları (best practices) içerisinde barındıran bu yapı, profesyonel e-ticaret projeleri için sağlam bir temel oluşturmaktadır.