+++
title = "Modern Yazılımın Temelleri"
description= "Prosedürel yaklaşımlardan SOLID prensiplerine, modern yazılım mimarileri ve kodlama felsefesi üzerine teknik bir inceleme."
type = "list"
weight = 60
+++

Yazılım geliştirme, sadece bir programlama dilinin sözdizimine hakim olmak değil, karmaşıklığı yönetme sanatıdır. Bir sistemin başarısı, kodun çalışmasından ziyade; değişime ne kadar direnç gösterdiği, ne kadar kolay genişletilebildiği ve bakım maliyetinin ne kadar düşük olduğuyla ölçülür.

{{< figure src="/images/software/modern-yazilim-temelleri.png" alt="Modern Yazılım Temelleri" width="1200" caption="Şekil 1: Modern Yazılım Temelleri" >}}

---
## Programlama Paradigmaları: Temelden Zirveye

Yazılım geliştirme sürecinde kullandığımız diller, problem çözme biçimimizi şekillendiren belirli paradigmalara dayanır.

* **Prosedürel Programlama:** Programı bir dizi işlem ve fonksiyon yığını olarak görür. Veri ve fonksiyonlar ayrı yerlerdedir. Küçük ölçekli betikler için ideal olsa da, projeler büyüdükçe "spaghetti code" riskini beraberinde getirir.
* **Fonksiyonel Programlama:** Yan etkilerin (side-effects) minimize edildiği, saf fonksiyonların (pure functions) ve değişmezliğin (immutability) ön planda olduğu yaklaşımdır. Matematiksel bir kesinlik sunar ve özellikle paralel işlem süreçlerinde büyük avantaj sağlar.
* **Nesne Yönelimli Programlama (OOP):** Dünyayı nesneler üzerinden modeller. Veriyi ve o veri üzerinde işlem yapacak metodları aynı yapı (class) içinde toplar. Modern kurumsal yazılımların bel kemiğidir.

## OOP Felsefesi ve Mühendislik Avantajları

OOP sadece sınıflar oluşturmak değildir; bir sistemin yaşam döngüsünü optimize etme felsefesidir. Bize sunduğu temel değerler şunlardır:

1.  **Extendibility (Genişletilebilirlik):** Mevcut kodu bozmadan yeni özellikler ekleyebilme yeteneğidir.
2.  **Reusability (Tekrar Kullanılabilirlik):** Bir kez yazılan mantığın, farklı modüllerde yeniden hayat bulmasıdır.
3.  **Maintainability (Bakım Yapılabilirlik):** Hataların kolayca izole edilmesi ve sistemin sürdürülebilir olmasıdır.

### Nesne Yönelimli Programlamanın Yapı Taşları: OOP’nin 4 Ana İlkesi

* **Encapsulation (Kapsülleme):** Veriyi dış dünyadan saklayarak, sadece belirlenen arayüzler üzerinden erişim sağlanmasıdır. Bu, veri bütünlüğünü korur.
* **Inheritance (Kalıtım):** Bir sınıfın, başka bir sınıfın özelliklerini devralmasıdır. Kod tekrarını önler ancak yanlış kullanımda "sıkı sıkıya bağlı" (tightly coupled) sistemlere yol açabilir.
* **Polymorphism (Çok Biçimlilik):** Aynı metodun farklı nesnelerde farklı davranışlar sergilemesidir. Esnekliğin anahtarıdır.
* **Abstraction (Soyutlama):** Karmaşıklığı gizleyerek kullanıcıya sadece gerekli olan fonksiyonelliği sunmaktır. `Interface` ve `Abstract` sınıflar bu işin mimari araçlarıdır.

---

## SOLID: Esnekliğin Anayasası

Kodun "temiz" kalabilmesi için Robert C. Martin tarafından formüle edilen SOLID prensipleri, her yazılım mimarının el kitabıdır.

| Prensip | Açıklama |
| :--- | :--- |
| **Single Responsibility** | Bir sınıfın veya metodun değişmek için tek bir nedeni olmalıdır. |
| **Open-Closed** | Yazılım birimleri geliştirmeye açık, değişime kapalı olmalıdır. |
| **Liskov Substitution** | Alt sınıflar, türetildikleri üst sınıfların yerine kullanılabilmelidir. |
| **Interface Segregation** | İstemciler, kullanmadıkları metodlara zorlanmamalı; dev arayüzler yerine küçük, özelleşmiş arayüzler kullanılmalıdır. |
| **Dependency Inversion** | Yüksek seviyeli modüller, düşük seviyeli modüllere bağımlı olmamalı; her ikisi de soyutlamalara bağımlı olmalıdır. |

---

## Bellek Yönetimi ve Yapı Taşları

Yazılımda performans ve yapılandırma kararları, nesne üyelerinin nasıl yönetildiğiyle doğrudan ilgilidir.

### Static ve Instance Ayrımı
* **Instance Members:** Her nesneye (instance) özeldir. Nesne belleğe (Heap) çıktığında oluşur.
* **Static Members:** Sınıfa aittir. Uygulama çalıştığı sürece bellekte (Stack/Static area) tek bir kopyası bulunur. 
* **Static Classes:** İçerisinde sadece static üyeler barındıran, örneği alınamayan sınıflardır. Genellikle yardımcı (Utility) fonksiyonlar için tercih edilir.

## Veri Erişimi ve Entity Framework Modelleri

Modern uygulama geliştirmede veritabanı ile uygulama arasındaki köprüyü (ORM) kurarken üç temel modelden bahsedebiliriz:

1.  **Database First:** Mevcut bir veritabanından modellerin otomatik oluşturulmasıdır.
2.  **Model First:** Görsel bir tasarımcı (EDMX) üzerinden veritabanı ve sınıfların üretilmesidir.
3.  **Code First:** Yazılımcının favorisidir. Önce sınıflar yazılır, veritabanı bu sınıflara göre otomatik şekillenir. Esneklik ve versiyon kontrolü (Migrations) açısından en güçlü yaklaşımdır.

## İleri Seviye Mimari ve Tasarım Desenleri

Kod yazmak sadece algoritma kurmak değildir. Uygulamanın nasıl dağıtılacağı, katmanlar arası iletişimin nasıl sağlanacağı ve tasarım desenlerinin (Design Patterns) doğru kullanımı, profesyonelliği belirler. Singleton'dan Factory'ye, Observer'dan Decorator'a kadar her desen, aslında geçmişte çözülmüş kronik bir probleme sunulan standart bir çözümdür.

---

*Yazılım ile ilgili diğer teknik incelemelerim, vaka analizlerim ve deneyim aktarımlarım bu kategori altında güncellenmeye devam edecektir.*