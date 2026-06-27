---
title: "GitHub Actions ile Kesintisiz CI CD Pipeline Mimarisi"
date: 2026-05-20
type: "software"
draft: false
math: true
description: "GitHub Actions kullanarak profesyonel düzeyde CI/CD süreçlerini nasıl otomatize edeceğinizi, kesintisiz (zero downtime) dağıtım stratejilerini, Kubernetes üzerinde rolling update uygulamalarını ve veritabanı geçiş süreçlerinde dikkat edilmesi gereken teknik detayları bu yazıda yer almaktadır."
featured_image: "/images/software/github-actions-ile-kesintisiz-ci-cd-pipeline-mimarisi.png"
tags: ["yazilim", "software", "github", "github-actions", "ci-cd", "zero-downtime", "devops", "deployment-strategies", "kubernetes", "docker", "pipeline-optimization", "automation", "cloud-native"]
---

Modern yazılım geliştirme dünyasında dağıtım süreçleri (deployment), kodun yazılması kadar kritik bir öneme sahiptir. Kullanıcıların uygulamanıza 7/24 erişebildiği bir ekosistemde, "bakım modu" veya "sunucu durdurma" gibi geleneksel yöntemler artık kabul edilebilir değil. Kesintisiz dağıtım (Zero Downtime Deployment), altyapınızın sürekli ayakta kalmasını sağlarken yeni özellikleri güvenle yayına almanıza olanak tanır.

{{< figure src="/images/software/github-actions-ile-kesintisiz-ci-cd-pipeline-mimarisi.png" alt="GitHub Actions ile Kesintisiz CI CD Pipeline Mimarisi" width="1200" caption="Şekil 1: GitHub Actions ile Kesintisiz CI CD Pipeline Mimarisi." >}}

---

## Modern Dağıtım Stratejileri ve Temeller

Zero Downtime hedefi için en yaygın ve güvenilir yöntemler **Blue-Green Deployment** ve **Rolling Update** stratejileridir.

* **Blue-Green:** Halihazırda çalışan ortamın (Blue) yanına tamamen aynı özelliklere sahip yeni bir ortam (Green) kurarsınız. Testler geçtikten sonra trafik yük dengeleyici (load balancer) üzerinden Green ortama aktarılır.
* **Rolling Update:** Mevcut sunucuları veya konteynerleri sırayla güncellersiniz. Bir sunucu güncellenirken diğerleri trafiği karşılamaya devam eder.

Bu stratejileri otomatize etmek için GitHub Actions, süreçleri kod (Pipeline as Code) üzerinden yönetmemizi sağlar.

---

## GitHub Actions ile Pipeline Tasarımı

Bir CI/CD pipeline'ı dört temel aşamadan oluşur: **Build, Test, Push ve Deploy.**

### 1. Build ve Test Aşaması

Kodun depoya (repository) gönderilmesiyle başlayan bu süreç, uygulamanın çalışabilir olduğundan emin olmalıdır.

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test

```

### 2. Containerization ve Registry Yönetimi

Uygulamayı bir Docker imajı haline getirmek, her ortamda aynı davranışı sergilemesini garanti eder. `docker buildx` kullanarak çoklu mimari destekli imajlar oluşturmak, günümüz bulut native altyapıları için bir standarttır.

```yaml
  push-to-registry:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: myrepo/myapp:${{ github.sha }}

```

---

## Zero Downtime İçin İleri Teknikler: Kubernetes ve Rolling Updates

Eğer altyapınızda Kubernetes kullanıyorsanız, `deployment.yaml` dosyanızdaki `strategy` bloğu kesintisiz dağıtımın anahtarıdır.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1         # Bir anda eklenebilecek yeni pod sayısı
      maxUnavailable: 0   # Güncelleme sırasında kapalı kalabilecek pod sayısı
  template:
    spec:
      containers:
      - name: app
        image: myrepo/myapp:${{ github.sha }}
        readinessProbe:   # ÖNEMLİ: Pod hazır olmadan trafiği yönlendirme
          httpGet:
            path: /health
            port: 8080

```

> **Not:** `readinessProbe` kullanmak, uygulamanızın ayağa kalktığını ancak veritabanı bağlantılarının tamamlandığı veya cache ısınma süreci bittiğinde trafiği kabul edeceğini garanti eder. Bu, kesintisiz deneyimin temel taşıdır.

---

## Veritabanı Geçişleri (Database Migrations)

Uygulamanın yeni sürümü eski veritabanı şemasıyla veya tam tersi durumla karşılaşabilir. Zero Downtime dağıtımın en zor kısmı burasıdır.

1. **Geriye Dönük Uyumluluk:** Her zaman veritabanı değişikliğini uygulamadan önce yapın. Örneğin, bir sütunu silmeden önce uygulamanın o sütunu okumayı bıraktığından emin olun.
2. **İki Aşamalı Migration:** Önce yeni sütunu ekleyin, ardından veriyi taşıyın, en son eski sütunu temizleyin.
3. **Liquibase veya Flyway Kullanımı:** Bu araçlar, veritabanı versiyonlarını kod gibi yönetmenizi sağlar.

```bash
# Örnek Liquibase komutu
liquibase --changelog-file=db/changelog/main.xml update

```

---

## İzlenebilirlik ve Geri Alma (Rollback)

Dağıtım her zaman kusursuz gitmeyebilir. Bu durumda hızla eski sürüme dönmek (rollback) gerekir. GitHub Actions üzerinde başarısızlık durumunda otomatik tetiklenen bir `on: failure` adımı eklemek, operasyonel riskleri minimize eder.

### Gözlemleme Araçları (Observability)

Sadece dağıtmak yeterli değildir, dağıtım sonrası uygulamanın "sağlığını" izlemelisiniz:

* **Prometheus & Grafana:** Sistem metriklerini takip etmek için.
* **ELK Stack (Elasticsearch, Logstash, Kibana):** Hata loglarını analiz etmek için.
* **Sentry:** Uygulama içi çalışma zamanı hatalarını anlık yakalamak için.

---

## Özet ve En İyi Pratikler

Kesintisiz dağıtım bir varış noktası değil, bir disiplindir. İşte başarılı bir süreç için dikkat etmeniz gerekenler:

1. **Küçük ve Sık Parçalar:** Değişiklikleri mümkün olduğunca küçük tutun. Büyük dağıtımların hata yapma olasılığı her zaman daha yüksektir.
2. **İzolasyon:** Geliştirme (dev), test (staging) ve üretim (production) ortamlarını birbirinden izole tutun.
3. **Otomasyon:** Süreç içerisinde hiçbir manuel müdahale olmamalıdır. "Elde yapılan" her işlem, hata payını artırır.
4. **Güvenlik:** Secret yönetimini (GitHub Secrets veya HashiCorp Vault) kullanarak hiçbir şifreyi repository içinde barındırmayın.

### Sıkça Sorulan Sorular (SSS)

**S: Neden Blue-Green yerine Rolling Update tercih etmeliyim?**
C: Rolling update, kaynak kullanımı açısından daha ekonomiktir. Blue-Green, kaynakları iki katına çıkarmanızı gerektirir ancak geçiş süreci (rollback) daha temizdir.

**S: Veritabanı şema değişikliğinde sorun yaşarsam ne olur?**
C: Uygulama kodunuzu veritabanı değişikliğinden bağımsız olarak çalışacak şekilde tasarlamalısınız. "Expand and Contract" (Genişlet ve Daralt) desenini uygulamak, veritabanı kaynaklı kesintileri ortadan kaldırır.

**S: GitHub Actions maliyetli bir çözüm mü?**
C: GitHub Actions, sunduğu otomasyon hızı ve operasyonel kolaylık göz önüne alındığında oldukça maliyet etkindir. Kendi sunucularınızda (Self-hosted runners) çalıştırarak maliyetleri daha da düşürebilirsiniz.

Bu teknik altyapı ile hem geliştirici verimliliğinizi artırabilir hem de son kullanıcınıza kesintisiz bir deneyim sunabilirsiniz. Unutmayın, iyi bir CI/CD pipeline'ı yazılımın kalitesini ve ekibin özgüvenini doğrudan etkiler.