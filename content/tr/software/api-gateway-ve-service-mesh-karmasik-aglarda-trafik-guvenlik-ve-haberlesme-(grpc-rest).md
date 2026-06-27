---
title: "API Gateway ve Service Mesh: Karmaşık Ağlarda Trafik, Güvenlik ve Haberleşme (gRPC, REST)"
date: 2026-03-01
type: "software"
draft: false
math: true
description: "Sunucusuz mimarinin temellerini, FaaS modelinin teknik detaylarını ve olay güdümlü sistemlerin maliyet odaklı ölçeklendirme avantajlarını kapsayan kapsamlı bir teknik yazıdır."
featured_image: "/images/software/api-gateway-ve-service-mesh-karmasik-aglarda-trafik-guvenlik-ve-haberlesme-(grpc-rest).png"
tags: ["yazilim", "software", "serverless", "faas", "aws-lambda", "event-driven", "bulut-bilisim", "microservices"]
---

Geleneksel sunucu yönetimi, altyapı provizyonu ve kapasite planlama süreçleri, modern yazılım geliştirme yaşam döngüsünde (SDLC) yerini operasyonel yükün bulut sağlayıcısına devredildiği **Serverless (Sunucusuz)** mimarilere bırakmaktadır. Bu makalede, Function as a Service (FaaS) modelinin teknik derinliklerini, olay güdümlü (event-driven) tasarım desenlerini ve maliyet optimizasyonu stratejilerini ele alacağız.

{{< figure src="/images/software/api-gateway-ve-service-mesh-karmasik-aglarda-trafik-guvenlik-ve-haberlesme-(grpc-rest).png" alt="API Gateway ve Service Mesh: Karmaşık Ağlarda Trafik, Güvenlik ve Haberleşme (gRPC, REST)" width="1200" caption="Şekil 1: API Gateway ve Service Mesh: Karmaşık Ağlarda Trafik, Güvenlik ve Haberleşme (gRPC, REST)." >}}

---

## 1. Serverless ve FaaS Mimarisinin Anatomisi

Serverless, geliştiricilerin sunucu yönetimiyle ilgilenmediği, kaynakların talebe göre dinamik olarak tahsis edildiği bir yürütme modelidir. Bu modelin kalbinde **FaaS (Function as a Service)** yer alır. FaaS, uygulama mantığının atomik, kısa ömürlü ve stateless (durum bilgisi saklamayan) fonksiyonlara bölünmesidir.

### Temel Karakteristikler:
*   **Abstrükt Altyapı:** İşletim sistemi yamaları, donanım güncellemeleri ve ağ konfigürasyonları soyutlanmıştır.
*   **Efemer (Kısa Ömürlü) Çalışma:** Fonksiyonlar sadece bir tetikleyici (trigger) geldiğinde ayağa kalkar ve görev bitince sonlanır.
*   **Stateless Yapı:** Fonksiyonlar arası veri paylaşımı için harici bir veritabanı (Redis, DynamoDB vb.) veya nesne depolama (S3) gereklidir.

---

## 2. Olay Güdümlü Tasarım (Event-Driven Design)

Serverless sistemler doğası gereği reaktiftir. Bir işlem, belirli bir olayın gerçekleşmesiyle başlar. Bu olaylar bir HTTP isteği, bir dosya yüklemesi veya bir mesaj kuyruğuna gelen veri olabilir.

### Tetikleyici Mekanizmaları:
1.  **Senkron Tetikleyiciler:** API Gateway üzerinden gelen RESTful istekler. İstemci, fonksiyonun yanıt vermesini bekler.
2.  **Asenkron Tetikleyiciler:** S3 (Simple Storage Service) gibi servislerde bir nesnenin oluşturulması veya SNS (Simple Notification Service) üzerinden gelen mesajlar.
3.  **Akış Temelli (Stream-based):** Kinesis veya DynamoDB Streams üzerinden sürekli veri akışının işlenmesi.



---

## 3. Otomatik Ölçeklendirme ve Konfigürasyon Yönetimi

Serverless mimarinin en güçlü yönü **"Scale-to-Zero"** (sıfıra ölçeklenme) yeteneğidir. Trafik olmadığında kaynak tüketimi ve maliyet sıfırdır. Yük arttığında ise bulut sağlayıcısı milisaniyeler içinde yeni "container"lar başlatarak yatayda ölçeklenir.

### Teknik Not: Soğuk Başlatma (Cold Start)
Bir fonksiyon uzun süre çağrılmadığında, çalışma ortamı serbest bırakılır. Yeni bir istek geldiğinde ortamın tekrar hazırlanması sürecine *Cold Start* denir. Java veya .NET gibi runtime'larda bu süre, Python veya Node.js'e göre daha uzundur. Bunu optimize etmek için **Provisioned Concurrency** (önceden tahsis edilmiş eşzamanlılık) kullanılabilir.

---

## 4. Uygulama Örneği: Python ve AWS Lambda ile Görüntü İşleme

Aşağıdaki örnekte, bir S3 bucket'ına yüklenen resmin boyutlarını otomatik olarak değiştiren olay güdümlü bir fonksiyonun teknik yapısı yer almaktadır.

**Gerekli Kütüphaneler:** `boto3`, `Pillow`

```python
import boto3
import os
import sys
import uuid
from PIL import Image

s3_client = boto3.client('s3')

def resize_image(image_path, resized_path):
    with Image.open(image_path) as image:
        image.thumbnail((128, 128))
        image.save(resized_path)

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        # Geçici dosya yolları
        download_path = f"/tmp/{uuid.uuid4()}{key}"
        upload_path = f"/tmp/resized-{key}"
        
        # S3'ten indirme
        s3_client.download_file(bucket, key, download_path)
        
        # İşleme
        resize_image(download_path, upload_path)
        
        # Geri yükleme
        s3_client.upload_file(upload_path, f"{bucket}-resized", f"resized-{key}")
        
    return {
        'status': 'success',
        'processed_files': len(event['Records'])
    }
```

---

## 5. Maliyet Odaklı Yaklaşım ve FinOps

Serverless mimarilerde maliyet; **istek sayısı**, **yürütme süresi** ve **tahsis edilen bellek** miktarına göre hesaplanır.

### Optimizasyon Stratejileri:
*   **Memory Tuning:** Fonksiyona gereğinden fazla RAM atamak maliyeti artırırken, az atamak işlem süresini uzatabilir. AWS Lambda Power Tuning gibi araçlarla CPU/RAM dengesi optimize edilmelidir.
*   **Timeout Yönetimi:** Fonksiyonların sonsuz döngüde kalmasını engellemek için katı zaman aşımı süreleri belirlenmelidir.
*   **Log Filtreleme:** CloudWatch gibi loglama servisleri yüksek maliyet kalemleri olabilir. Sadece kritik logların (ERROR/WARN) saklanması sağlanmalıdır.

---

## 6. Gelişmiş Orchestration: Step Functions ve Durable Functions

Tekil bir fonksiyon genellikle karmaşık iş akışlarını yönetmek için yetersizdir. İş mantığının birden fazla fonksiyon arasında bölündüğü durumlarda "State Machine" yapıları kullanılır.

*   **AWS Step Functions:** Görsel iş akışları oluşturarak hataları yönetir (retry logic), dallanmalar yapar (choice state) ve paralel işlemler yürütür.
*   **Azure Durable Functions:** Kod üzerinden (C# veya Python) durumsal iş akışlarını yönetmenize olanak tanır.



---

## 7. Güvenlik ve İzolasyon Katmanı

Serverless ortamlarda geleneksel ağ güvenliği (Firewall vb.) yerini **Kimlik ve Erişim Yönetimi (IAM)** ilkelerine bırakır.

*   **Least Privilege (En Az Yetki) Prensibi:** Her fonksiyonun sadece ihtiyaç duyduğu kaynağa (örneğin sadece belirli bir S3 klasörü) erişimi olmalıdır.
*   **VPC Entegrasyonu:** Hassas veritabanlarına erişim için fonksiyonlar izole edilmiş sanal özel ağlar (VPC) içinde çalıştırılmalıdır.
*   **Secret Management:** API anahtarları veya veritabanı şifreleri kod içinde değil, AWS Secrets Manager veya HashiCorp Vault gibi servislerde tutulmalıdır.

---

## 8. CI/CD ve Altyapı Kodlama (IaC)

Manuel dağıtımlar serverless mimarilerde yönetilemez bir karmaşa yaratır. Bu nedenle **Infrastructure as Code (IaC)** kullanımı zorunludur.

### Popüler Frameworkler:
1.  **Serverless Framework:** YAML tabanlı yapılandırma ile AWS, Azure ve GCP desteği sağlar.
2.  **AWS SAM (Serverless Application Model):** AWS ekosistemi için optimize edilmiş CloudFormation uzantısı.
3.  **Terraform:** Çoklu bulut ortamları için deklaratif altyapı yönetimi.

**Örnek Serverless Framework Yapılandırması (`serverless.yml`):**
```yaml
service: image-processing-service

provider:
  name: aws
  runtime: python3.9
  region: eu-central-1
  iamRoleStatements:
    - Effect: Allow
      Action:
        - s3:GetObject
        - s3:PutObject
      Resource: "arn:aws:s3:::my-images-bucket/*"

functions:
  resize:
    handler: handler.lambda_handler
    events:
      - s3:
          bucket: my-images-bucket
          event: s3:ObjectCreated:*
```

---

## 9. Monitoring ve Observability (Gözlemlenebilirlik)

Serverless sistemlerde "distribute tracing" (dağıtık izleme) hayati önem taşır. Bir isteğin hangi fonksiyonlardan geçtiğini ve nerede darboğaz oluştuğunu anlamak için şu araçlar kullanılır:
*   **AWS X-Ray:** İsteklerin servisler arasındaki yolculuğunu haritalandırır.
*   **Prometheus & Grafana:** Metriklerin görselleştirilmesi.
*   **Lumigo / Thundra:** Serverless odaklı spesifik hata ayıklama platformları.

---

## 10. Gelecek Vizyonu: WebAssembly (Wasm) ve Edge Computing

Serverless dünyası sadece merkezi veri merkezlerinden ibaret değildir. **Edge Computing** ile fonksiyonlar kullanıcıya en yakın lokasyonda (CDN noktalarında) çalıştırılmaktadır (örn. Cloudflare Workers, Lambda@Edge). Bu noktada **WebAssembly (Wasm)**, hafifliği ve güvenlik izolasyonu sayesinde FaaS için yeni bir standart haline gelmektedir.

### Kritik Notlar:
> **Veritabanı Bağlantıları:** İlişkisel veritabanları (PostgreSQL, MySQL) bağlantı havuzu (connection pooling) konusunda serverless ile sorun yaşayabilir. Bu durumlarda **RDS Proxy** gibi ara katmanlar kullanılmalıdır.
>
> **Vendor Lock-in:** Belirli bir bulut sağlayıcısının spesifik servislerine (örn. DynamoDB) aşırı bağımlılık, sistemin başka bir platforma taşınmasını zorlaştırabilir. Mimari tasarlanırken soyutlama katmanları (Adapter pattern) dikkate alınmalıdır.

---

### Sonuç

Serverless mimari, "altyapı değil kod odaklı" bir dönüşümü temsil eder. FaaS ile olay güdümlü sistemler inşa etmek, sadece operasyonel verimlilik sağlamakla kalmaz, aynı zamanda milisaniye bazlı ücretlendirme ile teknolojik maliyetleri doğrudan iş değeriyle hizalar. Ancak bu esneklik; sıkı bir güvenlik disiplini, doğru gözlemlenebilirlik araçları ve optimize edilmiş bir kod yapısı gerektirir. Modern yazılım mimarı için Serverless, bir araçtan ziyade, ölçeklenebilir dijital dönüşümün temel yapı taşıdır.