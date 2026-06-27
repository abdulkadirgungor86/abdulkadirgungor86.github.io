---
title: "Microservices Orchesration: Kubernetes ve Docker ile Konteynerize Sistem Yönetimi"
date: 2026-04-01
type: "software"
draft: false
math: true
description: "Mikroservis mimarilerinde Docker ile konteynerizasyon ve Kubernetes ile uçtan uca orkestrasyon süreçlerini, ağ konfigürasyonlarından güvenlik protokollerine kadar derinlemesine inceleyen teknik yazıdır."
featured_image: "/images/software/microservices-orchesration-kubernetes-ve-docker-ile-konteynerize-sistem-yonetimi.png"
tags: ["yazilim", "software", "mikroservis", "microservices", "kubernetes", "docker", "orkestrasyon", "konteynerizasyon", "dev-ops"]
---

Modern yazılım mimarileri, monolitik yapılardan mikroservis tabanlı dağıtık sistemlere evrilirken, bu servislerin yönetimi, ölçeklenmesi ve birbirleriyle olan iletişimi en kritik zorluklardan biri haline gelmiştir. Mikroservis orkestrasyonu, konteynerize edilmiş uygulamaların yaşam döngüsünü otomatize eden bir süreçtir. Bu yazıda, Docker ve Kubernetes (K8s) özelinde, endüstri standartlarını ve ileri düzey teknik konfigürasyonları bahsedeceğiz.

{{< figure src="/images/software/microservices-orchesration-kubernetes-ve-docker-ile-konteynerize-sistem-yonetimi.png" alt="Microservices Orchesration: Kubernetes ve Docker ile Konteynerize Sistem Yönetimi" width="1200" caption="Şekil 1: Microservices Orchesration: Kubernetes ve Docker ile Konteynerize Sistem Yönetimi." >}}

---

### 1. Konteynerizasyonun Temeli: Docker Engine ve İleri Düzey İmaj Optimizasyonu

Mikroservislerin taşınabilirliği, Docker'ın sunduğu izolasyon yeteneklerine dayanır. Ancak üretim ortamında (production), imaj boyutu ve güvenliği birincil önceliktir.

#### Katmanlı Yapı ve Multi-Stage Builds
Docker imajları salt okunur katmanlardan oluşur. `Multi-stage build` tekniği, derleme araçlarını nihai imajın dışında tutarak saldırı yüzeyini küçültür ve performansı artırır.

```dockerfile
# Stage 1: Build environment
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# Stage 2: Runtime environment
FROM scratch
COPY --from=builder /app/main /main
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/main"]
```
*Not: `scratch` imajı kullanımı, işletim sistemi katmanlarını tamamen ortadan kaldırarak yalnızca binary dosyasını çalıştırır, bu da güvenliği maksimize eder.*

#### Docker Networking ve Namespace İzolasyonu
Docker, Linux çekirdeğinin `namespaces` ve `cgroups` özelliklerini kullanır. Ağ tarafında `bridge`, `host`, `overlay` ve `macvlan` sürücüleri, mikroservislerin birbirleriyle izole veya paylaşımlı bir şekilde haberleşmesini sağlar.

---

### 2. Kubernetes Mimarisi: Kontrol Düzlemi ve Veri Düzlemi

Kubernetes, konteynerlerin dağıtımı ve yönetimi için deklaratif bir yaklaşım sunar.

*   **Control Plane (Kontrol Düzlemi):** `kube-apiserver`, `etcd` (dağıtık veri deposu), `kube-scheduler` ve `kube-controller-manager` bileşenlerinden oluşur.
*   **Worker Nodes (Veri Düzlemi):** `kubelet`, `kube-proxy` ve konteyner çalışma zamanı (container runtime - Containerd veya CRI-O) barındırır.

{{< figure src="/images/software/kubernetes-mimarisi-kontrol-duzlemi-ve-veri-duzlemi.jpg" alt="Bu görsel, bulut bilişimin üç ana hizmet modelini açıklamaktadır: Hizmet Olarak Platform (PaaS), Hizmet Olarak Yazılım (SaaS) ve Hizmet Olarak Altyapı (IaaS). Bulut bilişim, talep üzerine sunulan bilişim hizmetlerinin teslim edilmesidir" width="1200" caption="Şekil 2: Bu görsel, bulut bilişimin üç ana hizmet modelini açıklamaktadır: Hizmet Olarak Platform (PaaS), Hizmet Olarak Yazılım (SaaS) ve Hizmet Olarak Altyapı (IaaS). Bulut bilişim, talep üzerine sunulan bilişim hizmetlerinin teslim edilmesidir." >}}


#### Etcd ve Durum Yönetimi
Kubernetes'in tüm cluster durumu `etcd` üzerinde saklanır. `etcd`, Raft konsensüs algoritmasını kullanan, yüksek kullanılabilirlikli bir anahtar-değer deposudur. Veri tutarlılığı (consistency), orkestrasyonun hatasız işlemesi için temel şarttır.

---

### 3. Kaynak Yönetimi ve Scheduling (Zamanlama) Stratejileri

K8s üzerinde bir Pod'un hangi düğümde (node) çalışacağına `kube-scheduler` karar verir. Bu kararı verirken `Resources Requests` ve `Limits` parametrelerini kullanır.

#### Resource Quotas ve LimitRanges
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "10"
    limits.memory: 16Gi
```
**QoS (Quality of Service) Sınıfları:**
1.  **Guaranteed:** Request ve Limit değerleri eşit olduğunda.
2.  **Burstable:** Request ve Limit değerleri farklı olduğunda.
3.  **BestEffort:** Hiçbir kaynak tanımı yapılmadığında.

Kritik servislerin her zaman `Guaranteed` sınıfında olması, düğüm üzerindeki kaynak darboğazlarında (OOM Kill durumları) bu servislerin korunmasını sağlar.

---

### 4. Hizmet Keşfi (Service Discovery) ve Trafik Yönetimi

Mikroservisler dinamik IP adreslerine sahiptir. Kubernetes `Service` objesi, bu dinamik yapı üzerinde stabil bir soyutlama katmanı sunar.

#### CoreDNS ve Cluster-Internal DNS
K8s içindeki her servis, `<service-name>.<namespace>.svc.cluster.local` formatında bir DNS kaydı alır. Bu, mikroservislerin birbirini sabit isimlerle bulmasını sağlar.

#### Ingress Controller ve Katman 7 (L7) Yönlendirme
Ingress, dış dünyadan gelen HTTP/HTTPS trafiğini yönetir. `Nginx Ingress Controller` veya `HAProxy` yaygın olarak kullanılır.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: v1-service
            port:
              number: 80
```

---

### 5. Service Mesh: Mikroservisler Arası İletişim Güvenliği

Standart K8s ağ yönetimi, gelişmiş trafik kontrolü (canary deployment, circuit breaking) ve gözlemlenebilirlik (observability) için yetersiz kalabilir. Bu noktada **Istio** veya **Linkerd** gibi Service Mesh yapıları devreye girer.

#### Sidecar Proxy Modeli
Her Pod'un yanına bir `Envoy` proxy konteyneri yerleştirilir. Tüm trafik bu proxy üzerinden geçer.
*   **mTLS (Mutual TLS):** Servisler arası iletişim varsayılan olarak şifrelenir.
*   **Circuit Breaking:** Bir servis hata vermeye başladığında, trafiği keserek sistemin tamamen çökmesini engeller.

---

### 6. Kalıcı Veri Yönetimi: PV, PVC ve StorageClass

Konteynerler doğası gereği geçicidir (ephemeral). Veriyi kalıcı hale getirmek için Kubernetes `PersistentVolume` (PV) ve `PersistentVolumeClaim` (PVC) mekanizmalarını sunar.

*   **Dynamic Provisioning:** Bulut sağlayıcıları (AWS EBS, GCE Persistent Disk) ile entegre çalışarak, bir PVC talep edildiğinde otomatik olarak uygun boyutta bir disk alanı oluşturulur.
*   **Access Modes:** `ReadWriteOnce` (tek node erişimi), `ReadOnlyMany` (çoklu read), `ReadWriteMany` (paylaşımlı yazma/okuma - NFS/Ceph gibi).

---

### 7. Otomasyon: Horizontal Pod Autoscaler (HPA) ve VPA

Yük arttığında sistemin otomatik tepki vermesi gerekir.

#### HPA Algoritması
HPA, CPU veya bellek kullanımını izleyerek replica sayısını artırır.
$$DesiredReplicas = ceil(CurrentReplicas \times \frac{CurrentMetricValue}{TargetMetricValue})$$

```bash
kubectl autoscale deployment my-api --cpu-percent=70 --min=3 --max=10
```

---

### 8. Gözlemlenebilirlik (Observability) ve Log Yönetimi

Dağıtık sistemlerde hata ayıklama (debugging), merkezi izleme araçları olmadan imkansızdır.

*   **Prometheus & Grafana:** Metrik toplama ve görselleştirme için standarttır. `PromQL` dili ile karmaşık sorgular yapılabilir.
*   **ELK/EFK Stack (Elasticsearch, Fluentd, Kibana):** Logların merkezi bir yerde toplanması ve indekslenmesi.
*   **OpenTelemetry:** Dağıtık izleme (distributed tracing) için vendor-bağımsız bir standart sunar. İsteklerin servisler arasındaki yolculuğunu takip eder.

---

### 9. Güvenlik ve RBAC (Role-Based Access Control)

Kubernetes cluster güvenliği, "en az ayrıcalık" (least privilege) ilkesine dayanmalıdır.

*   **RBAC:** Kullanıcılara veya ServiceAccount'lara belirli kaynaklar (Pod, Deployment) üzerinde belirli işlemler (get, list, create) yapma yetkisi verir.
*   **Network Policies:** Pod'lar arası ağ trafiğini kısıtlar. Varsayılan olarak tüm Pod'lar birbiriyle konuşabilir; `NetworkPolicy` ile bu kısıtlanmalıdır.

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: api-allow-db
spec:
  podSelector:
    matchLabels:
      app: database
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: backend-api
```

---

### 10. Modern Deployment Stratejileri

Mikroservis mimarisinde kesintisiz güncelleme esastır.

1.  **Rolling Update:** Eski versiyon Pod'lar yavaş yavaş kapatılırken yenileri açılır. K8s'in varsayılan yöntemidir.
2.  **Blue/Green Deployment:** İki tam ortam (Mavi ve Yeşil) hazırdır. Trafik bir anda eskiden yeniye kaydırılır.
3.  **Canary Release:** Yeni versiyon, toplam trafiğin sadece küçük bir kısmını (%5-%10) alacak şekilde dağıtılır.

---

### Sonuç ve Teknik Değerlendirme

Mikroservis orkestrasyonu, sadece konteynerleri çalıştırmak değil, bu konteynerlerin birbirleriyle güvenli, ölçeklenebilir ve yönetilebilir bir şekilde etkileşim kurmasını sağlamaktır. Docker, paketleme standardını belirlerken; Kubernetes, bu paketlerin üretim ölçeğindeki operasyonel karmaşıklığını yönetir. 

İleri düzey bir sistem mimarı için sadece YAML dosyaları yazmak yeterli değildir; ağ katmanındaki paket iletiminden (iptables/ipvs), depolama birimlerinin gecikme sürelerine, servis mesh üzerindeki mTLS yükünden, `etcd` üzerindeki yazma yoğunluğuna kadar her detayın optimize edilmesi gerekir. Bu ekosistem, sürekli gelişen CNCF (Cloud Native Computing Foundation) projeleriyle desteklenerek modern bulut-yerli uygulamaların belkemiğini oluşturmaya devam etmektedir.

> **Teknik Not:** Kubernetes konfigürasyonlarında `apiServer` güvenliği için anonim erişimlerin kapatılması ve `etcd` verisinin disk üzerinde şifrelenmesi (encryption at rest), kurumsal düzeyde bir zorunluluktur. Ayrıca, `Helm` veya `Kustomize` gibi araçlar kullanarak konfigürasyon yönetimi şablonlaştırılmalı, CI/CD süreçlerine (GitOps - ArgoCD/Flux) entegre edilmelidir.