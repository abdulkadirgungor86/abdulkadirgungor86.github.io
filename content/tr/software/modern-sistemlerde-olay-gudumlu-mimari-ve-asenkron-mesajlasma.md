---
title: "Modern Sistemlerde Olay Güdümlü Mimari ve Asenkron Mesajlaşma"
date: 2026-05-21
type: "software"
draft: false
math: true
description: "Dağıtık sistem mimarlar için asenkron mesajlaşma rehberi. RabbitMQ’nun esnek routing yapısı ile Kafka’nın yüksek throughput kapasitesini karşılaştırın, projenize en uygun çözümü seçin."
featured_image: "/images/software/modern-sistemlerde-olay-gudumlu-mimari-ve-asenkron-mesajlasma.png"
tags: ["yazilim", "software", "event-driven-architecture", "rabbitmq", "apache-kafka", "asynchronous-messaging", "message-broker", "distributed-systems","microservices","system-design","software-architecture","backend-development","scalability"]
---

Günümüz dağıtık sistemlerinde, monolitik yapılardan mikro hizmet mimarilerine geçişle birlikte, servisler arası iletişim stratejileri sistemin ölçeklenebilirliği ve dayanıklılığı üzerinde belirleyici bir rol oynamaya başlamıştır. Geleneksel HTTP tabanlı (REST veya gRPC) senkron iletişim modelleri, özellikle yüksek trafikli ve servisler arası bağımlılığın yüksek olduğu senaryolarda "darboğaz" (bottleneck) oluşturabilir. İşte tam bu noktada, **Event-Driven Architecture (EDA)** yani Olay Güdümlü Mimari, sistemlerin birbiriyle eşzamansız (asenkron) konuşmasını sağlayarak yüksek performanslı bir çalışma ortamı sunar.

{{< figure src="/images/software/modern-sistemlerde-olay-gudumlu-mimari-ve-asenkron-mesajlasma.png" alt="Modern Sistemlerde Olay Güdümlü Mimari ve Asenkron Mesajlaşma" width="1200" caption="Şekil 1: Modern Sistemlerde Olay Güdümlü Mimari ve Asenkron Mesajlaşma." >}}

---

## Olay Güdümlü Mimari Nedir

Olay güdümlü mimari, bir sistemdeki durum değişiminin (event) başka servisler tarafından tetiklenerek işlemesi mantığına dayanır. Burada kritik nokta, göndericinin (producer) alıcıdan (consumer) haberdar olmamasıdır. Servisler birbirine doğrudan bağlı (decoupled) değildir; arada bir mesaj broker'ı bulunur.

### Asenkron İletişimin Avantajları

1. **Düşük Gecikme (Latency):** Servis, işlemin bitmesini beklemeden diğer görevlerine devam eder.
2. **Hata Toleransı (Resilience):** Alıcı servis kapalı olsa dahi mesaj kuyrukta bekletilir; servis ayağa kalktığında işlenir.
3. **Ölçeklenebilirlik:** Yük arttığında sadece kuyruğu tüketen (consumer) servis sayısını artırarak yatay genişleme (scale-out) yapabilirsiniz.

---

## RabbitMQ ile Mesaj Kuyruğu Yönetimi

RabbitMQ, **AMQP (Advanced Message Queuing Protocol)** tabanlı, geleneksel bir mesaj broker'ıdır. Akıllı bir kuyruklama mantığına sahiptir ve daha çok karmaşık yönlendirme (routing) kuralları gerektiren iş kuyruklarında tercih edilir.

### RabbitMQ Temel Kavramları

* **Exchange:** Mesajların geldiği yer. Gelen mesajı hangi kuyruğa (queue) göndereceğine karar verir (Direct, Fanout, Topic, Headers).
* **Queue:** Mesajların işlenmek üzere beklediği bellek veya disk tabanlı yapılar.

### Uygulama Örneği: C# (.NET) ile RabbitMQ Producer

Bir sipariş servisi düşünelim. Sipariş oluşturulduğunda e-posta gönderim servisini tetiklememiz gerekiyor.

```csharp
var factory = new ConnectionFactory() { HostName = "localhost" };
using (var connection = factory.CreateConnection())
using (var channel = connection.CreateModel())
{
    channel.QueueDeclare(queue: "email_queue", durable: true, exclusive: false, autoDelete: false);

    var message = "Siparişiniz onaylandı: #12345";
    var body = Encoding.UTF8.GetBytes(message);

    channel.BasicPublish(exchange: "", routingKey: "email_queue", basicProperties: null, body: body);
}

```

> **Not:** RabbitMQ, "Smart Broker, Dumb Consumer" mantığıyla çalışır. Yani mesajın durumu broker tarafından yönetilir.

---

## Apache Kafka ile Yüksek Performanslı Akış Yönetimi

Kafka, bir mesaj kuyruğundan ziyade **Dağıtık Log (Distributed Log)** yapısındadır. Kafka, mesajları silmez; yapılandırılan süre boyunca (retention policy) diskte tutar. Bu, "Event Sourcing" ve "CQRS" mimarileri için onu mükemmel kılar.

### Kafka Neden Farklıdır?

* **Partitioning:** Veriler partition'lara bölünür, bu da paralel işlem yapma kapasitesini inanılmaz artırır.
* **Consumer Group:** Bir mesajın bir grup içindeki sadece bir consumer tarafından okunmasını sağlar.
* **Pull Modeli:** Consumer, broker'dan veriyi kendi hızına göre çeker (RabbitMQ'da broker veriyi iter).

### Uygulama Örneği: Java ile Kafka Producer

Kafka, yüksek hacimli veri transferi için idealdir. Örneğin, bir log analiz sistemi için:

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.send(new ProducerRecord<String, String>("log-topic", "key-1", "Sistem hatası oluştu!"));
producer.close();

```

---

## RabbitMQ vs Kafka: Hangisini Seçmeli?

Bu iki teknoloji rakip gibi görünse de aslında farklı kullanım senaryolarına hizmet ederler.

| Özellik | RabbitMQ | Apache Kafka |
| --- | --- | --- |
| **Mimari** | Mesaj Broker (Akıllı) | Dağıtık Log (Pasif) |
| **Veri İşleme** | İş bittiğinde silinir | Belirli süre tutulur |
| **Mesaj Yönlendirme** | Çok esnek (Routing key) | Sadece Topic tabanlı |
| **Performans** | Orta (Düşük gecikme) | Çok yüksek (Yüksek throughput) |

### Ne Zaman RabbitMQ?

* İşlemlerin karmaşık bir şekilde yönlendirilmesi gerekiyorsa.
* Mesajın işlenip silinmesi gereken klasik "task queue" (görev kuyruğu) ihtiyaçlarında.
* Legacy sistemlerle uyumluluk gerektiğinde.

### Ne Zaman Kafka?

* Büyük veri (Big Data) işleme veya gerçek zamanlı stream işleme ihtiyaçlarında.
* Event Sourcing gibi geçmiş olayların tekrar oynatılması (replay) gereken durumlarda.
* Yüksek throughput (saniyede milyonlarca mesaj) gereken sistemlerde.

---

## İleri Seviye Konular: Hata Yönetimi ve Idempotency

Asenkron mimaride en büyük problem, ağ hataları veya servis çökmesi durumunda mesajın işlenememesidir.

1. **Dead Letter Queues (DLQ):** İşlenemeyen mesajlar bir "çöp kutusu" kuyruğuna atılır. Daha sonra manuel müdahale ile incelenir.
2. **Idempotency (Tekrarlanan İşlem Koruması):** Aynı mesaj ağ hatası yüzünden iki kez tüketilebilir. Sistemin, aynı ID'li bir işlemi ikinci kez işlediğinde bunu anlaması ve hata döndürmemesi (veya işlememesi) gerekir. Veritabanı seviyesinde `UNIQUE` kısıtlar veya Redis üzerinde "işlendi" flag'leri tutularak bu sorun çözülür.

## Sonuç

Doğru mimari seçimi, projenizin gelecek yıllardaki büyüme kapasitesini belirler. RabbitMQ, esnekliği ve kolay kurulumu ile mikro hizmetler arası doğrudan haberleşmede mükemmel bir çözüm ortağıyken; Kafka, verinin bir akış olarak kabul edildiği, yüksek trafikli modern mimarilerin vazgeçilmezidir.

Asenkron yapıya geçerken unutulmaması gereken en önemli kural: **"Eventual Consistency" (Sonuçsal Tutarlılık).** Sisteminizdeki tüm verilerin anlık değil, birkaç milisaniye veya saniye gecikmeli olarak birbirine uyum sağlayacağını kabul ederek kod yazmanız, EDA dünyasında hayatta kalmanızı sağlar.
