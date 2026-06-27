---
title: "Infrastructure as Code (IaC): Terraform ve Ansible ile Altyapı Yönetimi"
date: 2026-03-24
type: "software"
draft: false
math: true
description: "Bu teknik yazı, modern DevOps ekosisteminde Terraform ve Ansible araçlarının hibrit kullanımıyla deklaratif ve imperatif altyapı yönetim stratejilerini derinlemesine analiz etmektedir."
featured_image: "/images/software/infrastructure-as-code-(iac)-terraform-ve-ansible-ile-altyapi-yonetimi.png"
tags: ["yazilim", "software", "infrastructure-as-code", "terraform", "ansible", "bulut-bilisim", "yaml", "dev-ops"]
---

Modern yazılım geliştirme yaşam döngüsünde (SDLC), geleneksel manuel altyapı yapılandırmaları yerini tamamen otomatize edilmiş, versiyonlanabilir ve tekrarlanabilir süreçlere bırakmıştır. **Infrastructure as Code (IaC)**, fiziksel donanımlardan sanal makinelere ve bulut tabanlı servislere kadar tüm altyapı bileşenlerinin yazılım geliştirme prensipleriyle (kod yazımı, test, CI/CD entegrasyonu) yönetilmesini ifade eder.

{{< figure src="/images/software/infrastructure-as-code-(iac)-terraform-ve-ansible-ile-altyapi-yonetimi.png" alt="Infrastructure as Code (IaC): Terraform ve Ansible ile Altyapı Yönetimi" width="1200" caption="Şekil 1: Infrastructure as Code (IaC): Terraform ve Ansible ile Altyapı Yönetimi." >}}

---

## 1. IaC Paradigmasında Temel Yaklaşımlar: Deklaratif vs. İmperatif

Altyapıyı kodla yönetirken karşımıza çıkan en kritik ayrım, kodun nasıl icra edildiğidir.

*   **Deklaratif (Terraform):** "Ne" yapılacağına odaklanır. Mevcut durum (current state) ile istenen durum (desired state) arasındaki farkı (drift) analiz eder ve aradaki boşluğu kapatmak için gereken adımları otomatik belirler.
*   **İmperatif (Ansible):** "Nasıl" yapılacağına odaklanır. Adım adım komut dizileri çalıştırır. Ansible her ne kadar deklaratif modüllere sahip olsa da özünde prosedürel bir akış izler.

---

## 2. Terraform: Değişmez (Immutable) Altyapı Yönetimi

HashiCorp tarafından geliştirilen Terraform, bulut sağlayıcıları (AWS, Azure, GCP) üzerinde kaynak sağlama (provisioning) konusunda endüstri standardıdır. Terraform, **HCL (Hashicorp Configuration Language)** dilini kullanır.

### Mimari Bileşenler ve State Yönetimi
Terraform'un kalbi `terraform.tfstate` dosyasıdır. Bu dosya, gerçek dünyadaki kaynakların kod karşılıklarını bir harita gibi tutar. Ekip çalışmalarında çakışmaları önlemek için bu dosya genellikle **S3** veya **Terraform Cloud** gibi uzak backend'lerde (Remote State) saklanır ve `state locking` mekanizması ile korunur.

### Örnek: AWS üzerinde VPC ve EC2 Provisioning
Aşağıdaki kod bloğu, Terraform kullanarak bir ağ katmanı ve üzerine bir sunucu inşa etme sürecini simüle eder:

```hcl
# Provider Tanımlaması
provider "aws" {
  region = "us-east-1"
}

# Sanal Özel Bulut (VPC) Oluşturma
resource "aws_vpc" "main_network" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "Production-VPC"
  }
}

# Alt Ağ (Subnet) Tanımlama
resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.main_network.id
  cidr_block = "10.0.1.0/24"
}

# EC2 Instance Kaynağı
resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu 20.04 LTS
  instance_type = "t3.medium"
  subnet_id     = aws_subnet.public_subnet.id

  root_block_device {
    volume_size = 50
    volume_type = "gp3"
  }

  tags = {
    Environment = "Production"
    Role        = "Web-Server"
  }
}

# Output: Sunucu IP Adresini Döndürme
output "server_public_ip" {
  value = aws_instance.app_server.public_ip
}
```

---

## 3. Ansible: Konfigürasyon Yönetimi ve Mutable Yaklaşım

Ansible, Python tabanlıdır ve sunuculara ajan (agent) kurulmasına gerek duymaz (**Agentless**). İletişimi **SSH** (Linux/Unix) veya **WinRM** (Windows) protokolleri üzerinden kurar. Terraform ile kurulan sunucuların içerisindeki yazılım katmanlarını yönetmekte uzmandır.

### YAML ve Playbook Yapısı
Ansible, okunabilirliği yüksek YAML formatını kullanır. "Idempotency" (Aynı komutun defalarca çalıştırılması durumunda sistemin her zaman aynı durumda kalması) prensibini savunur.

### Örnek: Web Sunucusu Konfigürasyonu (Nginx + Python Environment)
Bir sunucunun içine girip gerekli paketleri kuran ve konfigüre eden Ansible Playbook'u:

```yaml
---
- name: Web Sunucusu Hazırlama Playbook'u
  hosts: web_servers
  become: yes
  vars:
    python_version: "3.9"

  tasks:
    - name: Paket Listesini Güncelle ve Nginx Kur
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Nginx Servisini Başlat ve Enable Et
      systemd:
        name: nginx
        state: started
        enabled: yes

    - name: Uygulama Bağımlılıklarını Kur (Python-pip)
      apt:
        name: ["python3-pip", "python3-venv", "libpq-dev"]
        state: latest

    - name: Özel Nginx Config Dosyasını Kopyala
      template:
        src: ./templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: Nginx Yeniden Başlat

  handlers:
    - name: Nginx Yeniden Başlat
      service:
        name: nginx
        state: restarted
```

---

## 4. Terraform ve Ansible Karşılaştırmalı Teknik Analiz



| Özellik | Terraform | Ansible |
| :--- | :--- | :--- |
| **Ana Kullanım** | Orchestration / Provisioning | Configuration Management |
| **Altyapı Tipi** | Değişmez (Immutable) | Değişebilir (Mutable) |
| **Yönetim Modeli** | Client-Only (State dosyasını yönetir) | Client-Only (Ajan gerektirmez) |
| **Dil** | HCL (Strongly Typed) | YAML (Data Serialization) |
| **Hata Yönetimi** | `terraform plan` ile önizleme sunar | `dry-run` modu kısıtlıdır |

---

## 5. Hibrit Yaklaşım: Provisioning ve Configuration Orchestration

Gerçek dünya senaryolarında bu iki araç rakip değil, ortaktır. En verimli iş akışı şu şekildedir:
1.  **Terraform:** Network, Storage, DB ve Compute kaynaklarını ayağa kaldırır.
2.  **Handoff:** Terraform, oluşturduğu sunucu IP'lerini bir "Inventory" dosyası olarak dışarı verir.
3.  **Ansible:** Bu IP'leri hedef alarak sunucu içine girer; Docker kurar, SSL sertifikalarını yükler ve uygulamayı deploy eder.

### Dinamik Entegrasyon (Terraform Provisoner)
Terraform içerisinden sunucu kurulur kurulmaz Ansible'ı tetiklemek için `local-exec` provisioner kullanılabilir:

```hcl
resource "aws_instance" "worker" {
  # ... instance ayarları ...

  provisioner "local-exec" {
    command = "ansible-playbook -i ${self.public_ip}, --private-key ${var.ssh_key_path} playbook.yml"
  }
}
```

---

## 6. Gelişmiş IaC Stratejileri

### Modülerleştirme (Modules)
Tekrarlanan kod bloklarından kaçınmak (DRY prensibi) için modül kullanımı şarttır. Örneğin, her departman için ayrı bir VPC yazmak yerine parametrik bir `vpc-module` oluşturulmalıdır.

### CI/CD Pipeline Entegrasyonu
IaC kodları Git üzerinde saklanır. Bir **GitOps** yaklaşımı ile:
*   `main` branch'ine yapılan her PR (Pull Request) önce `terraform plan` komutunu çalıştırarak değişiklikleri raporlar.
*   Onaylandığında `terraform apply` ile altyapı güncellenir.
*   Ardından Ansible test suitleri (Molecule gibi) devreye girerek konfigürasyonun doğruluğunu kontrol eder.

---

## 7. Kritik Notlar ve Best Practices

> **Not 1: State Güvenliği**
> Terraform `.tfstate` dosyası içinde veritabanı şifreleri veya API key'leri barındırabilir. Bu yüzden bu dosyalar kesinlikle Git reposuna atılmamalıdır. **Vault** gibi secret manager çözümleriyle entegre edilmelidir.

> **Not 2: Sürüm Kilitleme**
> Altyapının beklenmedik şekilde bozulmaması için Provider versiyonları sabitlenmelidir:
> ```hcl
> terraform {
>   required_providers {
>     aws = {
>       source  = "hashicorp/aws"
>       version = "~> 4.0"
>     }
>   }
> }
> ```

> **Not 3: Ansible Idempotency**
> Ansible'da her zaman `state: present` veya `state: latest` gibi parametreler kullanılmalıdır. `shell` veya `command` modülleri mecbur kalmadıkça kullanılmamalıdır, çünkü bu modüller varsayılan olarak idempotent değildir.

---

## 8. Kütüphane ve Ekosistem Kaynakları

Bu teknolojileri ileri seviyeye taşımak için aşağıdaki araçlar ekosistemin ayrılmaz parçalarıdır:

1.  **Terragrunt:** Terraform için bir wrapper. Birden fazla environment (Dev, Staging, Prod) yönetimini kolaylaştırır ve konfigürasyonu minimize eder.
2.  **Ansible Galaxy:** Topluluk tarafından geliştirilen rollerin (Role) bulunduğu devasa bir kütüphanedir. Kendi rolleri yazmak yerine optimize edilmiş topluluk rollerinden yararlanılabilir.
3.  **Checkov / TFLint:** IaC kodlarını güvenlik açıkları ve syntax hataları için statik olarak analiz eden (Static Analysis) araçlardır.
4.  **Molecule:** Ansible rollerini test etmek için kullanılan bir kütüphanedir. Farklı sanallaştırma katmanlarında playbook'un başarısını test eder.

---

## Sonuç

Modern bulut mimarilerinde "tıklayarak" sunucu kurmak artık teknik bir borç (technical debt) olarak kabul edilmektedir. **Terraform** ile altyapının iskeletini oluşturmak, **Ansible** ile bu iskelete can vermek (yazılımsal konfigürasyon), sistemlerin ölçeklenebilirliğini ve felaket kurtarma (disaster recovery) senaryolarının başarısını doğrudan etkiler. IaC, sadece operasyonel bir kolaylık değil, aynı zamanda yazılım kalitesinin bir yansımasıdır.