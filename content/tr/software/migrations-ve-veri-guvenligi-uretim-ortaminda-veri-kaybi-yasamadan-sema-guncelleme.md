---
title: "Migrations ve Veri Güvenliği: Üretim Ortamında Veri Kaybı Yaşamadan Şema Güncelleme"
date: 2026-04-02
type: "software"
draft: false
math: true
description: "Üretim ortamındaki büyük ölçekli veritabanlarında, veriyi kilitlemeden ve servis kesintisi yaratmadan güvenli şema güncellemeleri yapmayı sağlayan ileri düzey migrasyon stratejileri ve teknik uygulama yöntemleridir."
featured_image: "/images/software/migrations-ve-veri-guvenligi-uretim-ortaminda-veri-kaybi-yasamadan-sema-guncelleme.png"
tags: ["yazilim", "software", "veritabani-migrasyonu", "veri-guvenligi", "zero-downtime", "database-engineering", "sql", "veri-butunlugu"]
---

Yazılım geliştirme yaşam döngüsünde (SDLC), uygulamanın evrimi kaçınılmaz olarak veritabanı şemasının değişimini gerektirir. Ancak üretim (production) ortamında, milyonlarca satırlık verinin bulunduğu canlı bir sistemde şema güncellemesi yapmak, "hareket halindeki bir uçağın motorunu değiştirmeye" benzer. Hatalı bir `ALTER TABLE` sorgusu, tabloların kilitlenmesine (table locking), servis kesintilerine veya geri dönülemez veri kayıplarına yol açabilir.

{{< figure src="/images/software/migrations-ve-veri-guvenligi-uretim-ortaminda-veri-kaybi-yasamadan-sema-guncelleme.png" alt="Migrations ve Veri Güvenliği: Üretim Ortamında Veri Kaybı Yaşamadan Şema Güncelleme" width="1200" caption="Şekil 1: Migrations ve Veri Güvenliği: Üretim Ortamında Veri Kaybı Yaşamadan Şema Güncelleme." >}}

---

### 1. Şema Değişimlerinde Temel Riskler ve Kilitleme Mekanizmaları

İlişkisel veritabanlarında (RDBMS) bir şema değişikliği yapıldığında, veritabanı motoru veri tutarlılığını korumak için ilgili nesne üzerinde bir **Metadata Lock (MDL)** oluşturur.

*   **DML (Data Manipulation Language):** `INSERT`, `UPDATE`, `DELETE` işlemleri genellikle satır bazlı kilitler kullanır.
*   **DDL (Data Definition Language):** `ALTER TABLE`, `CREATE INDEX` gibi işlemler tablo seviyesinde kilit gerektirebilir.

Özellikle MySQL (InnoDB) gibi motorlarda, büyük bir tabloya sütun eklemek veya bir sütun tipini değiştirmek, tüm tabloyu okuma/yazmaya kapatabilir. Bu durum, trafik altındaki bir sistemde isteklerin kuyruğa girmesine ve sonunda sistemin çökmesine (cascading failure) neden olur.

---

### 2. Geriye Dönük Uyumluluk: İki Aşamalı Dağıtım (Two-Phase Deployment)

Veri kaybını önlemenin ve kesintiyi sıfıra indirmenin altın kuralı, **kod ve veritabanı değişikliklerini birbirinden ayırmaktır.** Bir sütunu silmek veya ismini değiştirmek asla tek bir adımda yapılmamalıdır.

#### Genişlet ve Daralt (Expand and Contract) Deseni
Bu strateji, uygulamanın hem eski hem de yeni şema yapısıyla aynı anda çalışabilmesini sağlar.

1.  **Aşama (Genişlet):** Yeni sütun eklenir. Uygulama kodu güncellenir; artık veriyi hem eski hem yeni sütuna yazar, ancak sadece eskiden okur.
2.  **Aşama (Eşitleme):** Arka planda çalışan bir betik (backfill script), eski verileri yeni sütuna taşır.
3.  **Aşama (Geçiş):** Uygulama kodu güncellenir; artık veriyi yeni sütundan okur.
4.  **Aşama (Daralt):** Eski sütun güvenli bir şekilde silinir.

---

### 3. Çevrimiçi Şema Değişikliği (Online Schema Change) Araçları

Büyük ölçekli veritabanlarında standart SQL komutları yerine, tabloyu kilitlemeyen yardımcı araçlar kullanılmalıdır. Bu araçlar genellikle "Shadow Table" (Gölge Tablo) mantığıyla çalışır.

*   **gh-ost (GitHub Online Schema Transfomer):** Tetikleyici (trigger) kullanmadan, binary loglar üzerinden değişiklikleri işler. Veritabanı üzerindeki yükü minimize eder.
*   **pt-online-schema-change (Percona Toolkit):** Hedef tablonun bir kopyasını oluşturur, değişiklikleri kopya üzerinde yapar ve triggerlar aracılığıyla canlı veriyi senkronize eder. İşlem bitince tabloların adını değiştirir (atomic swap).

---

### 4. Teknik Uygulama ve Kod Örnekleri

Migrasyon süreçlerinde manuel müdahaleyi azaltmak için **Flyway** veya **Liquibase** gibi araçlar kullanılmalıdır. Aşağıda, Python (SQLAlchemy/Alembic) ve Node.js (Knex.js) ekosistemlerinde güvenli migrasyon örnekleri yer almaktadır.

#### Örnek: Alembic ile Güvenli Sütun Ekleme (PostgreSQL)

PostgreSQL'de bir sütuna `NOT NULL` kısıtlaması eklemek, mevcut satırlar için bir varsayılan değer gerektirir ve bu büyük tablolarda risklidir.

```python
"""Sütun ekleme ve kademeli kısıtlama uygulanması"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # 1. Adım: Sütunu NULL olabilir şekilde ekle (Hızlı işlem)
    op.add_column('users', sa.Column('account_status', sa.String(20), nullable=True))
    
    # 2. Adım: Varsayılan değerleri arka planda güncelle (Batching)
    # Bu kısım genellikle uygulama seviyesinde veya küçük parçalı SQL'ler ile yapılır.
    op.execute("UPDATE users SET account_status = 'active' WHERE account_status IS NULL")
    
    # 3. Adım: NULL kısıtlamasını sonra ekle
    op.alter_column('users', 'account_status', nullable=False)

def downgrade():
    op.drop_column('users', 'account_status')
```

#### Örnek: Knex.js ile İndeks Yönetimi

Üretim ortamında indeks oluştururken `CONCURRENTLY` anahtar kelimesi hayati önem taşır.

```javascript
// PostgreSQL için kilitlemesiz indeks oluşturma
exports.up = function(knex) {
  return knex.raw('CREATE INDEX CONCURRENTLY idx_user_email ON users(email)');
};

exports.down = function(knex) {
  return knex.raw('DROP INDEX CONCURRENTLY idx_user_email');
};
```
*Not: `CONCURRENTLY` kullanımı işlem (transaction) blokları içinde çalışmaz, bu nedenle migrasyon aracının transaction ayarları buna göre yapılandırılmalıdır.*

---

### 5. Veri Göçü (Data Migration) ve Toplu İşleme (Batching)

Sadece yapısal değil, verinin kendisinin değiştiği durumlarda (örneğin bir JSON alanın ayrıştırılması), tüm tabloyu tek bir `UPDATE` sorgusu ile güncellemeye çalışmak işlem günlüğünü (transaction log) doldurabilir ve veritabanını yanıt veremez hale getirebilir.

**İdeal Yaklaşım:** Veriyi küçük parçalar (chunks) halinde işlemek.

```sql
-- Büyük bir tabloda güvenli veri güncelleme mantığı
DO $$
DECLARE
    row_count INT;
BEGIN
    LOOP
        UPDATE orders 
        SET status_code = 1 
        WHERE status_code IS NULL 
        AND id IN (SELECT id FROM orders WHERE status_code IS NULL LIMIT 5000);
        
        GET DIAGNOSTICS row_count = ROW_COUNT;
        EXIT WHEN row_count = 0;
        
        COMMIT; -- Her parçadan sonra commit ederek lockları serbest bırak
        PERFORM pg_sleep(0.1); -- Veritabanının nefes almasına izin ver
    END LOOP;
END $$;
```

---

### 6. Blue-Green Deployment ve Veritabanı Katmanı

Uygulama katmanında Blue-Green deployment yapılıyorsa, veritabanı her iki sürümle de uyumlu olmalıdır.

*   **Blue (Eski Sürüm):** Şema v1 ile çalışıyor.
*   **Green (Yeni Sürüm):** Şema v2 ile çalışıyor.

Eğer migrasyon şemayı v2'ye yükselttiyse ve Green sürümünde bir hata çıkarsa, Blue sürümüne geri dönüldüğünde uygulama hata almamalıdır. Bu yüzden **Yıkıcı Değişiklikler (Breaking Changes)** her zaman bir sonraki sürümde (N+1) temizlenmelidir.

---

### 7. Migrasyon Güvenlik Kontrol Listesi (Checklist)

Üretim ortamına bir migrasyon göndermeden önce aşağıdaki teknik kriterler doğrulanmalıdır:

1.  **Lock Analizi:** `ALTER TABLE` işlemi tabloyu kilitliyor mu? Ne kadar süreceği test ortamında (üretim verisi hacmiyle) simüle edildi mi?
2.  **Geri Dönüş Planı (Rollback):** `downgrade` betiği hazır mı? Veri silindiyse geri dönüş yedeği var mı?
3.  **Yedekleme:** Migrasyon öncesi "Point-in-Time Recovery" (PITR) destekli yedek alındı mı?
4.  **Bağımlılıklar:** Migrasyon sırasında veritabanı tetikleyicileri, görünümler (views) veya saklı yordamlar (stored procedures) bozuluyor mu?
5.  **Disk Alanı:** Bazı `ALTER` işlemleri tablonun bir kopyasını oluşturur. Sunucuda yeterli disk alanı (en az tablo boyutu kadar boş alan) var mı?

---

### 8. Gelişmiş Kütüphaneler ve Araç Setleri

Modern mikroservis mimarilerinde migrasyon yönetimi için kullanılan popüler araçlar:

*   **Java/Kotlin:** Flyway, Liquibase.
*   **Go:** Golang-migrate, SQL-migrate.
*   **Node.js:** TypeORM, Sequelize, Prisma.
*   **Python:** Alembic (Django için yerleşik `makemigrations`).
*   **Ruby:** Active Record Migrations.

### Son Notlar ve Stratejik Önem

Veritabanı migrasyonları sadece bir kod parçası değil, sistemin sürekliliğini belirleyen kritik bir operasyondur. "Hızlı hareket et ve bir şeyleri boz" felsefesi veritabanı katmanında geçerli değildir. Her zaman savunmacı (defensive) programlama prensipleri uygulanmalı, verinin atomik yapısı korunmalı ve otomatik test süreçlerine (CI/CD) migrasyon testleri (dry-run) entegre edilmelidir.

Unutulmamalıdır ki; uygulama kodundaki bir hata dakikalar içinde düzeltilebilir, ancak bozulmuş veya kaybolmuş bir verinin kurtarılması saatler, hatta günler sürebilir. Bu nedenle migrasyon stratejilerinde her zaman en kötü senaryo üzerinden planlama yapılmalıdır.