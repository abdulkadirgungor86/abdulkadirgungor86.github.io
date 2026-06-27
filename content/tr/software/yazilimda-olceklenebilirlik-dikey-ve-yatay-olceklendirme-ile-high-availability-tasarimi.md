---
title: "Yazılımda Ölçeklenebilirlik: Dikey ve Yatay Ölçeklendirme ile High-Availability Tasarımı"
date: 2026-04-14
type: "software"
draft: false
math: true
description: "Bu makale, modern yazılım sistemlerinde artan yükü yönetmek için kullanılan dikey ve yatay ölçeklendirme tekniklerini, yük dengeleme algoritmalarını ve kesintisiz hizmet sağlayan yüksek erişilebilirlik (High-Availability) mimarilerini teknik kod örnekleriyle derinlemesine incelemektedir."
featured_image: "/images/software/yazilimda-olceklenebilirlik-dikey-ve-yatay-olceklendirme-ile-high-availability-tasarimi.png"
tags: ["yazilim", "software", "olceklenebilirlik", "yatay-olceklendirme", "dikey-olceklendirme", "load-balancing", "veritabani-sharding", "dev-ops"]
---

Günümüzün dinamik trafik yüklerine sahip yazılım ekosistemlerinde, bir uygulamanın sadece işlevsel olması yeterli değildir. Sistemin, artan kullanıcı sayısına ve veri hacmine yanıt verebilme yeteneği, yani **ölçeklenebilirliği (scalability)**, projenin sürdürülebilirliği açısından kritik bir parametredir. Bu blog yazısında, dikey ve yatay ölçeklendirme tekniklerini, yük dengeleme mekanizmalarını ve yüksek erişilebilirlik (High Availability) tasarım prensiplerini derinlemesine ele alınacaktır.

{{< figure src="/images/software/yazilimda-olceklenebilirlik-dikey-ve-yatay-olceklendirme-ile-high-availability-tasarimi.png" alt="Yazılımda Ölçeklenebilirlik: Dikey ve Yatay Ölçeklendirme ile High-Availability Tasarımı" width="1200" caption="Şekil 1: Yazılımda Ölçeklenebilirlik: Dikey ve Yatay Ölçeklendirme ile High-Availability Tasarımı" >}}

---

### 1. Ölçeklenebilirlik Kavramı ve Performans Metrikleri

Ölçeklenebilirlik, bir sistemin kaynak eklenerek artan iş yükünü karşılama yeteneğidir. Performans ile ölçeklenebilirlik genellikle karıştırılır; performans, tek bir isteğin ne kadar sürede yanıtlandığı (latency) ile ilgiliyken; ölçeklenebilirlik, sistemin saniyede kaç isteği (throughput) başarıyla işleyebildiği ile ilgilidir.

**Temel Performans Göstergeleri (KPIs):**
*   **Response Time (Yanıt Süresi):** İsteğin gönderilmesi ile yanıtın alınması arasındaki süre.
*   **Throughput (İş çıkarma):** Birim zamanda işlenen toplam işlem sayısı.
*   **Resource Utilization:** CPU, RAM ve I/O kaynaklarının kullanım yüzdesi.

---

### 2. Dikey Ölçeklendirme (Vertical Scaling - Scaling Up)

Dikey ölçeklendirme, mevcut olan tek bir sunucunun kapasitesini (CPU, RAM, Disk) artırarak performans kazanımı elde etme yöntemidir. 

#### Avantajları ve Dezavantajları:
*   **Kolay Yönetim:** Yazılım mimarisinde büyük değişiklikler gerektirmez. Veritabanı konfigürasyonları genellikle aynı kalır.
*   **Inter-process Communication:** Veriler aynı makine üzerinde olduğu için ağ gecikmesi (network latency) yaşanmaz.
*   **Sınırlamalar:** Bir noktadan sonra donanım limitlerine (Hardware Wall) takılır. Ayrıca, sunucu donanımını yükseltmek için genellikle sistemin kapatılması gerekir (Downtime).
*   **Single Point of Failure (SPOF):** Tek bir güçlü sunucuya bağımlılık, o sunucu çöktüğünde tüm sistemin durması anlamına gelir.

---

### 3. Yatay Ölçeklendirme (Horizontal Scaling - Scaling Out)

Yatay ölçeklendirme, sisteme daha fazla sunucu (node) ekleyerek iş yükünü dağıtma prensibine dayanır. Modern mikroservis mimarilerinin ve bulut bilişim (Cloud Computing) dünyasının temelini oluşturur.

#### Uygulama Katmanında Yatay Ölçeklendirme
Uygulamanın yatayda ölçeklenebilmesi için **Stateless (Durumsuz)** tasarlanması gerekir. Kullanıcı oturum bilgileri (session) uygulama sunucusunda değil, merkezi bir cache mekanizmasında (Redis, Memcached) tutulmalıdır.

**Örnek: Python/FastAPI ile Stateless Session Yönetimi (Redis)**

```python
from fastapi import FastAPI, Depends
import redis

app = FastAPI()
# Redis bağlantı havuzu
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def get_session_data(session_id: str):
    # Veri yerel bellek yerine Redis'ten çekilir
    data = r.get(f"session:{session_id}")
    return data

@app.get("/profile")
async def read_profile(session_id: str):
    user_data = get_session_data(session_id)
    return {"user": user_data, "server": "Node_A"}
```

#### Veritabanı Katmanında Yatay Ölçeklendirme
Veritabanlarını yatayda ölçeklemek, uygulama katmanına göre daha karmaşıktır. Burada devreye **Sharding** ve **Replication** girer.

*   **Database Sharding:** Verinin belirli bir anahtara (sharding key) göre farklı fiziksel veritabanlarına bölünmesidir.
*   **Read Replicas:** Yazma işlemlerinin bir ana sunucuya (Master), okuma işlemlerinin ise kopyalara (Slave/Replica) dağıtılmasıdır.



---

### 4. Yük Dengeleme (Load Balancing) Stratejileri

Yatay ölçeklendirilmiş bir yapıda, gelen isteklerin sunuculara nasıl dağıtılacağını **Load Balancer** belirler.

#### Algoritmalar:
1.  **Round Robin:** İstekleri sırayla sunuculara gönderir.
2.  **Least Connections:** Aktif bağlantı sayısı en az olan sunucuyu seçer.
3.  **IP Hash:** Kullanıcının IP adresine göre her zaman aynı sunucuya yönlendirilmesini sağlar (Sticky Sessions).

**Nginx Konfigürasyon Örneği:**

```nginx
http {
    upstream my_backend_cluster {
        least_conn; # En az bağlantısı olan sunucuya yönlendir
        server 10.0.0.1:8080 weight=3;
        server 10.0.0.2:8080;
        server 10.0.0.3:8080 backup; # Diğerleri çökerse devreye girer
    }

    server {
        listen 80;
        location / {
            proxy_pass http://my_backend_cluster;
        }
    }
}
```

---

### 5. Yüksek Erişilebilirlik (High Availability - HA) Tasarımı

High Availability, bir sistemin üzerinde anlaşılan bir zaman dilimi boyunca (örneğin %99.999 - Five Nines) kesintisiz hizmet verebilme yeteneğidir. HA tasarımı için **Redundancy (Yedeklilik)** şarttır.

#### HA İçin Kritik Bileşenler:
*   **Health Checks:** Load balancer, arkasındaki sunucuların sağlıklı olup olmadığını sürekli kontrol etmelidir.
*   **Failover Mekanizmaları:** Bir bileşen çöktüğünde trafiğin otomatik olarak yedeğe aktarılmasıdır.
*   **Data Consistency (Veri Tutarlılığı):** Dağıtık sistemlerde CAP teoremi (Consistency, Availability, Partition Tolerance) çerçevesinde tutarlılık ve erişilebilirlik dengesi kurulmalıdır.

#### Circuit Breaker Deseni
Dağıtık sistemlerde bir servis çöktüğünde, ona istek gönderilmeye devam edilmesi kaynakların tükenmesine neden olur. **Circuit Breaker**, hatalı servise giden trafiği keserek sistemin geri kalanını korur.

**Java/Spring Boot ve Resilience4j Örneği:**

```java
@CircuitBreaker(name = "inventoryService", fallbackMethod = "fallbackInventory")
public ProductDetails getProductDetails(String productId) {
    return inventoryClient.getInventory(productId);
}

public ProductDetails fallbackInventory(String productId, Throwable t) {
    // Servis kapalıysa varsayılan veya cache verisi dön
    return new ProductDetails(productId, "N/A", 0);
}
```

---

### 6. Bulut Yerleşik (Cloud-Native) Ölçeklendirme Araçları

Modern mimarilerde ölçeklendirme manuel yapılmaz. Konteynerizasyon ve orkestrasyon araçları bu süreci otomatiğe bağlar.

*   **Docker:** Uygulamayı ve bağımlılıklarını izole bir paket haline getirir.
*   **Kubernetes (K8s):** Konteynerlerin otomatik ölçeklendirilmesini (Horizontal Pod Autoscaler - HPA) sağlar.
*   **Service Mesh (Istio, Linkerd):** Mikroservisler arası trafiği, güvenliği ve gözlemlenebilirliği yönetir.

**Kubernetes HPA (Horizontal Pod Autoscaler) Tanımı:**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

### 7. Veritabanı Seviyesinde Gelişmiş Ölçeklendirme: NoSQL ve SQL Karşılaştırması

Ölçeklenebilirlik tartışmasında veritabanı seçimi hayati önem taşır. 
*   **Relational (SQL):** ACID uyumluluğu nedeniyle dikey ölçeklendirmeye daha yatkındır. Ancak PostgreSQL ve MySQL gibi sistemler, **Vitess** (YouTube tarafından geliştirilen) veya **Citus** gibi araçlarla yatayda ölçeklenebilir hale getirilebilir.
*   **NoSQL (Cassandra, MongoDB, DynamoDB):** Tasarım gereği yatay ölçeklendirmeye (Partitioning) odaklanmıştır. Devasa veri kümeleri için idealdir.

> **Not:** Yazılım mimarisinde "Gümüş Kurşun" (Silver Bullet) yoktur. Dikey ölçeklendirme maliyet/zaman açısından başlangıçta avantajlıyken, küresel ölçekte bir sistem için yatay ölçeklendirme kaçınılmazdır.

### Sonuç

Yüksek trafikli ve kritik görevli (mission-critical) uygulamalar oluşturmak, altyapının her katmanında ölçeklenebilirliği düşünmeyi gerektirir. Uygulama katmanında stateless yapılar, veritabanı katmanında replication ve sharding stratejileri, ağ katmanında ise akıllı yük dengeleyiciler ve circuit breaker gibi tasarım desenleri kullanarak; hem yüksek performanslı hem de asla çökmeyen (High Availability) sistemler inşa edilebilir. 

Unutulmamalıdır ki; en iyi ölçeklenen sistem, en az bileşene sahip olan değil, bileşenleri arasındaki bağımlılığı (tight coupling) en aza indirmiş ve hata anında kendi kendini iyileştirebilen (self-healing) sistemdir.