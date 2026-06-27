---
title: "Observability (İzlenebilirlik): Loglama, Metrikler ve Tracing ile Sistem Sağlığı"
date: 2026-04-05
type: "software"
draft: false
math: true
description: "Modern mikroservis mimarilerinde sistem sağlığını optimize etmek için loglama, metrik analizi ve dağıtık izleme tekniklerinin derinlemesine incelendiği teknik bir yazıdır."
featured_image: "/images/software/observability-(izlenebilirlik)-loglama-metrikler-ve-tracing-ile-sistem-sagligi.png"
tags: ["yazilim", "software", "observability", "mikroservis", "distributed-tracing", "open-telemetry", "sre", "microservices"]
---

Mikroservis mimarilerinin ve bulut bilişim ekosistemlerinin karmaşıklığı, sistemlerin sadece "çalışıyor" veya "çalışmıyor" şeklinde izlenmesini imkansız hale getirmiştir. Geleneksel izleme (monitoring), sistemin dışarıdan görünen çıktılarına odaklanırken; **Observability (İzlenebilirlik)**, sistemin dahili durumunu ürettiği veriler (telemetri) üzerinden anlamlandırma yeteneğidir. Bir sistemin izlenebilir olması için üç temel sütuna (The Three Pillars) dayanması gerekir: **Loglar, Metrikler ve Tracing (İzleme).**

{{< figure src="/images/software/observability-(izlenebilirlik)-loglama-metrikler-ve-tracing-ile-sistem-sagligi.png" alt="Observability (İzlenebilirlik): Loglama, Metrikler ve Tracing ile Sistem Sağlığı" width="1200" caption="Şekil 1: Observability (İzlenebilirlik): Loglama, Metrikler ve Tracing ile Sistem Sağlığı." >}}

---

### 1. Loglama: Olayların Kronolojik Kaydı

Loglama, sistem içerisinde belirli bir zaman diliminde meydana gelen ayrık olayların metin tabanlı kayıtlarıdır. Bir hata oluştuğunda "neden" sorusuna cevap veren en temel veri kaynağıdır.

#### Yapılandırılmış Loglama (Structured Logging)
Modern sistemlerde logların sadece düz metin (plain text) olarak tutulması, analiz edilebilirliği zorlaştırır. Bunun yerine JSON formatında yapılandırılmış loglar tercih edilir.

**Örnek Go (Zap Library) Uygulaması:**
```go
package main

import (
	"go.uber.org/zap"
	"time"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	logger.Info("İşlem başlatıldı",
		zap.String("context", "order_service"),
		zap.Int("user_id", 4582),
		zap.Duration("latency", 150*time.Millisecond),
	)
}
```

**Teknik Not:** Log seviyelerinin (DEBUG, INFO, WARN, ERROR, FATAL) doğru kullanımı, depolama maliyetlerini optimize etmek ve alarm gürültüsünü (alert fatigue) azaltmak için kritiktir.

---

### 2. Metrikler: Sayısal Agregasyon ve Performans Analizi

Metrikler, zaman serisi verileridir. Sistemin sağlığını sayısal değerler (CPU kullanımı, bellek tüketimi, saniyedeki istek sayısı) üzerinden takip etmemizi sağlar. Metriklerin en büyük avantajı, düşük depolama maliyeti ve hızlı sorgulanabilir olmasıdır.

#### Metrik Tipleri
*   **Counter:** Sadece artan değerler (Örn: Toplam HTTP isteği).
*   **Gauge:** Anlık artıp azalabilen değerler (Örn: Aktif kuyruk uzunluğu).
*   **Histogram:** Verilerin belirli aralıklara (bucket) göre dağılımı (Örn: Yanıt süreleri / Latency).

**Prometheus ve Python (prometheus_client) Kullanımı:**
```python
from prometheus_client import start_http_server, Summary, Counter
import random
import time

# İstek süresini takip eden bir histogram/summary
REQUEST_TIME = Summary('request_processing_seconds', 'İşlem süresi açıklaması')
# Hatalı işlemleri sayan bir counter
ERROR_COUNT = Counter('order_processing_errors_total', 'Toplam hata sayısı')

@REQUEST_TIME.time()
def process_request(t):
    time.sleep(t)
    if random.random() < 0.1:
        ERROR_COUNT.inc()

if __name__ == '__main__':
    start_http_server(8000)
    while True:
        process_request(random.random())
```

---

### 3. Distributed Tracing (Dağıtık İzleme)

Bir isteğin (request), birbiriyle konuşan onlarca farklı servis arasındaki yolculuğunu uçtan uca takip etme işlemidir. Her istek için benzersiz bir **Trace ID** oluşturulur ve her servis bu isteği işlerken kendi **Span ID**'sini ekler.

#### OpenTelemetry (OTel) Standardı
Günümüzde izlenebilirlik dünyasında standart haline gelen OpenTelemetry, farklı programlama dillerinden telemetri verilerini toplamak için ortak bir protokol sunar.

**Java (Spring Boot + OpenTelemetry) Örneği:**
```java
@RestController
public class OrderController {

    private final Tracer tracer;

    public OrderController(OpenTelemetry openTelemetry) {
        this.tracer = openTelemetry.getTracer("order-service");
    }

    @GetMapping("/checkout")
    public String checkout() {
        Span span = tracer.spanBuilder("db-transaction").startSpan();
        try (Scope scope = span.makeCurrent()) {
            // Veritabanı işlemleri burada simüle edilir
            return "Order Processed";
        } finally {
            span.end();
        }
    }
}
```

---

### 4. Observability Ekosistemi ve Araç Zinciri (Tooling)

İzlenebilirliği sağlamak için kullanılan popüler açık kaynaklı ve ticari araçlar şu şekildedir:

| Katman | Araçlar |
| :--- | :--- |
| **Veri Toplama (Collector)** | OpenTelemetry, Fluentd, Logstash |
| **Depolama (Storage)** | Prometheus (Metrik), Elasticsearch (Log), Jaeger (Tracing) |
| **Görselleştirme (Visualization)** | Grafana, Kibana |
| **Alarm Yönetimi** | Alertmanager, PagerDuty |

---

### 5. SRE Perspektifi: Altın Sinyaller (The Four Golden Signals)

Google SRE (Site Reliability Engineering) prensiplerine göre bir sistemin izlenebilirliği şu dört kritere dayanmalıdır:

1.  **Latency (Gecikme):** Bir isteği işlemek için geçen süre.
2.  **Traffic (Trafik):** Sisteme gelen yük (HTTP istekleri, bant genişliği).
3.  **Errors (Hatalar):** Başarısız olan isteklerin oranı (5xx kodları, timeoutlar).
4.  **Saturation (Doygunluk):** Kaynakların ne kadarının kullanıldığı (CPU, I/O, Disk).

---

### 6. Gelişmiş İzlenebilirlik Teknikleri ve Notlar

#### Bağlamsal Yayılım (Context Propagation)
Dağıtık izlemede en kritik konu, Trace ID bilgisinin HTTP header'ları veya gRPC metadata'sı aracılığıyla bir servisten diğerine aktarılmasıdır. Genellikle `W3C Trace Context` standartları kullanılır (`traceparent` header).

#### Örnekleme (Sampling)
Yüksek trafikli sistemlerde her isteği trace etmek ciddi bir performans yükü ve depolama maliyeti getirir. Bu nedenle:
*   **Head-based Sampling:** İstek başladığında trace edilip edilmeyeceğine karar verilir.
*   **Tail-based Sampling:** İşlem bittikten sonra (örneğin sadece hatalıysa veya yavaşsa) kaydedilmesine karar verilir.

---

### 7. Sonuç ve Mimari Strateji

Observability, sadece sisteme araçlar eklemek değildir; bu bir mühendislik kültürüdür. Loglar "ne oldu", metrikler "nerede sorun var", tracing ise "sorun nerede başladı ve nasıl yayıldı" sorularına cevap verir. 

Etkili bir strateji için:
*   Tüm servislerde standart bir log formatı (JSON) kullanılmalı.
*   Anlamlı metrikler toplanmalı (Sadece CPU değil, business logic metrikleri de).
*   Kritik yollar (critical path) üzerinde mutlaka dağıtık izleme uygulanmalı.
*   Görselleştirme panelleri (Dashboards), sistemin darboğazlarını bir bakışta gösterecek şekilde tasarlanmalıdır.

Bu üç veri tipinin (Logs, Metrics, Traces) korelasyonu (Correlation), bir olay anında kök neden analizini (Root Cause Analysis - RCA) saniyeler mertebesine indirerek sistemin kullanılabilirliğini (Availability) maksimize eder.

