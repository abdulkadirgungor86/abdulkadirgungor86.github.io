---
title: "Modern Veritabanı Mimarilerinde Veri Tutarlılığı ve Dağıtık Sistem Paradigmaları"
date: 2026-06-22
type: "software"
draft: false
math: true
description: "Modern veritabanı mimarilerinde veri tutarlılığı, performans ve ölçeklenebilirlik dengesini kurmak; ACID, BASE, CAP ve PACELC gibi temel dağıtık sistem paradigmalarını anlamaktan geçer. Bu yazı, ilişkisel RDBMS tasarımlarından NoSQL sistemlere uzanan veri modelleme süreçlerini, normalizasyon formlarını ve kod örnekleriyle optimizasyon stratejilerini ele almaktadır."
featured_image: "/images/software/modern-veritabani-mimarilerinde-veri-tutarliligi-ve-dagitik-sistem-paradigmalari.png"
tags: ["yazilim", "software", "db", "rdbms", "normalizasyon", "sql", "nosql", "no-sql", "acid", "base","cap", "pacelc", "veritabani","veritabani-sistemleri","buyuk-veri-yonetimi","dagitik-sistemler","veri-tutarliligi", "postgresql-indeksleme", "transaction-yonetimi", "veri-modelleme" ]
---

Günümüzün yüksek ölçekli yazılım mimarilerinde veritabanı seçimi ve tasarımı, sistemin ayakta kalma süresini (uptime), veri bütünlüğünü ve uçtan uca performansını doğrudan etkileyen en kritik karardır. Bir sistem mimarı için veritabanı, sadece verilerin depolandığı bir disk alanı değil; matematiksel teoriler, ağ kısıtlamaları ve donanım limitleri arasında kurulan hassas bir denge mekanizmasıdır.

{{< figure src="/images/software/modern-veritabani-mimarilerinde-veri-tutarliligi-ve-dagitik-sistem-paradigmalari.png" alt="Modern Veritabanı Mimarilerinde Veri Tutarlılığı ve Dağıtık Sistem Paradigmaları" width="1200" caption="Şekil 1: Modern Veritabanı Mimarilerinde Veri Tutarlılığı ve Dağıtık Sistem Paradigmaları." >}}

---

## 1. Veri Modellemenin Matematiksel Temeli: İlişkisel Tasarım ve Normalizasyon

İlişkisel veritabanlarının (RDBMS) temelinde Edgar F. Codd tarafından geliştirilen ilişkisel model ve küme teorisi yatar. Veri tutarsızlıklarını (anomaly) önlemek, veri tekrarını (redundancy) en aza indirmek ve depolama optimizasyonu sağlamak için Normalizasyon formları kullanılır.

### Normal Formların Teknik Analizi

* **1NF (Birinci Normal Form):** Her sütun atomik (bölünemez) değerler içermelidir. Tek bir hücrede virgülle ayrılmış listeler veya tekrarlayan gruplar bulunamaz.
* **2NF (İkinci Normal Form):** Sistem 1NF'de olmalı ve kısmi bağımlılık (partial dependency) barındırmamalıdır. Yani, kompoze bir birincil anahtarın (composite primary key) parçası olmayan tüm sütunlar, anahtarın *tamamına* tam bağımlı olmalıdır.
* **3NF (Üçüncü Normal Form):** Sistem 2NF'de olmalı ve geçişli bağımlılık (transitive dependency) içermemelidir. Birincil anahtar olmayan bir sütun, birincil anahtar olmayan başka bir sütuna bağımlı olamaz ($A \rightarrow B$ ve $B \rightarrow C$ ise $A \rightarrow C$ durumu engellenir).
* **BCNF (Boyce-Codd Normal Form):** 3NF'nin daha katı bir versiyonudur. Her belirleyici (determinant) bir aday anahtar (candidate key) olmak zorundadır.

### PostgreSQL Üzerinde Normalizasyon ve Indeks Optimizasyonu

Aşağıdaki SQL betiği, 3NF standartlarına uygun bir e-ticaret şeması oluşturur ve sorgu maliyetlerini düşürmek için B-Tree indeksleme mekanizmasını kullanır.

```sql
-- Adres bilgilerini normalize ederek tekrarı önlüyoruz (3NF)
CREATE TABLE cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sipariş tablosunda geçişli bağımlılıkları kırıyoruz
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Arama performansını artırmak için B-Tree indeksi tanımlıyoruz
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date DESC);

```

> **Mimari Not:** Normalizasyon seviyesi arttıkça veri tutarlılığı maksimuma ulaşır ancak tablo birleştirmeleri (JOIN) artacağı için okuma performansında düşüş yaşanabilir. Bu durumlarda, analitik sistemlerde (OLAP) kasıtlı olarak **Denormalizasyon** tekniklerine başvurulur.

---

## 2. Monolitik Sistemlerde Güvenilirlik Garantisi: ACID Prinsipleri

Tek bir sunucu üzerinde çalışan geleneksel veritabanlarında veri bütünlüğü, ACID olarak adlandırılan dört temel ilke ile korunur.

* **Atomicity (Bölünemezlik):** Bir işlemin (transaction) kapsamındaki tüm SQL komutları ya tamamen başarılı olmalı ya da tek bir hata durumunda bile sistem işlem başlamadan önceki haline geri dönmelidir (rollback).
* **Consistency (Tutarlılık):** İşlem öncesinde ve sonrasında veritabanı tanımlanmış tüm kuralları (constraints, foreign keys, triggers) korumalıdır. Veri geçersiz bir duruma düşemez.
* **Isolation (İzolasyon):** Aynı anda çalışan birden fazla işlem birbirinin ara durumlarını görememelidir. İzolasyon seviyeleri (Read Uncommitted, Read Committed, Repeatable Read, Serializable) performans ile tutarlılık arasındaki ödünleşimi (trade-off) belirler.
* **Durability (Kalıcılık):** İşlem başarıyla tamamlandığında (commit), elektrik kesintisi veya sistem çökmesi yaşansa dahi veriler disk üzerinde kalıcı olarak saklanır. Bu genellikle **WAL (Write-Ahead Logging)** mekanizması ile sağlanır.

### C# / Entity Framework Core ile ACID Transaction Yönetimi

Aşağıdaki kod blokunda, iki farklı hesap arasında para transferi simüle edilmektedir. Gelişmiş izolasyon seviyesi (`Serializable`) kullanılarak "Phantom Read" ve "Non-repeatable Read" gibi yarış durumları (race conditions) engellenmiştir.

```csharp
using Microsoft.EntityFrameworkCore;
using System;
using System.Transactions;

public class BankContext : DbContext
{
    public DbSet<Account> Accounts { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseNpgsql("Host=localhost;Database=BankDb;Username=postgres;Password=secret");
}

public class Account
{
    public int AccountId { get; set; }
    public decimal Balance { get; set; }
}

public class WalletService
{
    private readonly BankContext _context;

    public WalletService(BankContext context)
    {
        _context = context;
    }

    public bool TransferFunds(int sourceId, int targetId, decimal amount)
    {
        // En yüksek izolasyon seviyesinde transaction başlatılıyor
        using var transaction = _context.Database.BeginTransaction(System.Data.IsolationLevel.Serializable);
        try
        {
            var sourceAcc = _context.Accounts.Find(sourceId);
            if (sourceAcc == null || sourceAcc.Balance < amount) throw new InvalidOperationException("Inadequate funds.");

            var targetAcc = _context.Accounts.Find(targetId);
            if (targetAcc == null) throw new InvalidOperationException("Target account not found.");

            // Bakiyeler güncelleniyor
            sourceAcc.Balance -= amount;
            targetAcc.Balance += amount;

            _context.SaveChanges();
            
            // Tüm işlemler başarılı ise diske yazılıyor (Atomicity & Durability)
            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            // En ufak hatada sistem eski haline dönüyor
            transaction.Rollback();
            return false;
        }
    }
}

```

---

## 3. Dağıtık Sistemlerin Kaçınılmaz Gerçekliği: CAP Teoremi

Sistem ölçeklenip tek bir sunucunun sınırlarını aştığında, veriler birden fazla düğüme (node) kopyalanır (replication). Eric Brewer tarafından ortaya atılan CAP Teoremi, dağıtık bir sistemin şu üç özellikten sadece ikisini aynı anda tam anlamıyla sağlayabileceğini kanıtlar:

1. **Consistency (Tutarlılık):** Her düğüm aynı anda en güncel veriyi okur. Bir düğüme yazılan veri, anında diğer tüm düğümlerde güncellenir.
2. **Availability (Erişilebilirlik):** Sistemdeki bazı düğümler çökse bile, çalışan her düğüm hata vermeden bir yanıt (okuma/yazma) dönebilmelidir.
3. **Partition Tolerance (Bölünme Toleransı):** Düğümler arasındaki ağ iletişimi koptuğunda veya paketler kaybolduğunda (network partition), sistem çalışmaya devam edebilmelidir.

Gerçek dünya ağlarında kopmalar ve gecikmeler kaçınılmaz olduğu için, dağıtık bir sistem mimari olarak **Partition Tolerance (P)** özelliğini seçmek *zorundadır*. Bu durumda seçim ikiye indirgenir:

* **CP (Consistency / Partition Tolerance):** Ağ bölündüğünde tutarlılığı korumak adına erişilebilirlikten vazgeçilir. Düğümler arası senkronizasyon sağlanamazsa hata dönülür (Örn: HBase, MongoDB, Redis).
* **AP (Availability / Partition Tolerance):** Ağ bölündüğünde sistem her koşulda yanıt vermeye devam eder ancak farklı düğümlerden farklı (eski) veriler okunabilir. Ağ düzeldiğinde veri senkronize edilir (Örn: Cassandra, CouchDB).

---

## 4. Ağ Bölünmesi Olmadığında Ne Olur? PACELC Teoremi

CAP Teoremi, yalnızca bir ağ bölünmesi (Partition) durumuna odaklandığı için normal çalışma koşullarındaki gecikme parametrelerini göz ardı eder. Daniel Abadi tarafından geliştirilen **PACELC Teoremi**, CAP'in eksik bıraktığı bu boşluğu doldurur.

Formülasyon şu şekilde okunur: Eğer bir ağ bölünmesi (**P**) varsa, sistem **A**vailability (Erişilebilirlik) veya **C**onsistency (Tutarlılık) arasında seçim yapar; **E**lse (aksi takdirde, yani sistem normal çalışırken), sistem **L**atency (Gecikme) veya **C**onsistency (Tutarlılık) arasında bir tercih yapmak zorundadır.

$$\text{If } \mathbf{P} \rightarrow (\mathbf{A} \lor \mathbf{C}) \quad \mathbf{E}\text{lse} \rightarrow (\mathbf{L} \lor \mathbf{C})$$

Bu teorem veritabanlarını dört ana sınıfa ayırır:

| Sınıf | Bölünme Anında | Normal Çalışmada | Örnek Veritabanı |
| --- | --- | --- | --- |
| **PC/EC** | Tutarlılık (C) | Tutarlılık (C) | PostgreSQL (Sync Repl.), BigTable |
| **PA/EL** | Erişilebilirlik (A) | Düşük Gecikme (L) | Apache Cassandra, Amazon DynamoDB |
| **PC/EL** | Tutarlılık (C) | Düşük Gecikme (L) | MongoDB (Primary-Secondary) |
| **PA/EC** | Erişilebilirlik (A) | Tutarlılık (C) | VoltDB |

---

## 5. Dağıtık Dünyanın Esnek Yaklaşımı: BASE Modeli

Geleneksel ACID modelinin katı tutarlılık kuralları, yatayda ölçeklenen AP/EL sınıfı dağıtık sistemlerde performans darboğazına neden olur. Bu darboğazı aşmak için BASE modeli geliştirilmiştir:

* **Basically Available (Temel Düzeyde Erişilebilir):** Sistem, veri tutarlılığı bozulsa dahi her sorguya bir yanıt vermeyi garanti eder. Kısmi kesintiler sistemi tamamen durdurmaz.
* **Soft State (Esnek Durum):** Veri durumları dinamiktir. Düğümler arası senkronizasyon arka planda devam ettiği için, dışarıdan bir girdi olmasa bile veriler zamanla değişebilir.
* **Eventual Consistency (Nihai Tutarlılık):** Sistem anlık olarak tutarsız veri sunabilir ancak belirli bir süre sonra, yeni bir güncelleme gelmediği takdirde tüm düğümler eşitlenir ve aynı veriyi gösterir.

### Node.js ve DataStax Cassandra Sürücüsü ile Nihai Tutarlılık Ayarları

Apache Cassandra, PACELC teorisinde PA/EL modelinin en agresif uygulayıcılarından biridir. Sorgu bazında tutarlılık seviyeleri ayarlanarak mimari esneklik sağlanabilir.

```javascript
const cassandra = require('cassandra-driver');

// Cluster bağlantı ayarları
const client = new cassandra.Client({
    contactPoints: ['192.168.1.50', '192.168.1.51'],
    localDataCenter: 'datacenter1',
    keyspace: 'inventory'
});

async function insertProductStock(productId, stockCount) {
    const query = 'UPDATE product_stock SET stock = ? WHERE product_id = ?';
    
    // PACELC dengesini kod seviyesinde yönetiyoruz
    // LOCAL_QUORUM: Düğümlerin çoğunluğundan onay bekler (Yüksek Tutarlılık - EC dengesi)
    // ONE: Tek bir düğüme yazılması yeterlidir (Düşük Gecikme - EL dengesi)
    const options = { 
        prepare: true, 
        consistency: cassandra.types.consistencies.localQuorum 
    };

    try {
        await client.execute(query, [stockCount, productId], options);
        console.log('Stock updated successfully under Quorum consensus.');
    } catch (err) {
        console.error('Consensus failed or network timed out:', err);
    }
}

async function getProductStock(productId) {
    const query = 'SELECT stock FROM product_stock WHERE product_id = ?';
    
    // Okuma işleminde gecikmeyi düşürmek için nihai tutarlılık seviyesini 'ONE' yapıyoruz
    const options = { 
        prepare: true, 
        consistency: cassandra.types.consistencies.one 
    };

    const result = await client.execute(query, [productId], options);
    return result.rows[0];
}

```

---

## 6. Gelişmiş Konsensüs Algoritmaları ve Dağıtık İzolasyon

Modern NewSQL veritabanları (CockroachDB, Google Spanner), ACID'in dikey güvenilirliği ile NoSQL'in yatay ölçeklenebilirliğini birleştirmeyi hedefler. Bu sistemler, verilerin düğümler arasında güvenli bir şekilde dağıtılması ve mutasyonların onaylanması için **Raft** veya **Paxos** gibi konsensüs algoritmalarını kullanır.

Ek olarak, dağıtık sistemlerde zaman algısı ve saat senkronizasyonu (NTP kaymaları nedeniyle) zor olduğu için, küresel düzeyde benzersiz sıralama mekanizmaları (`TrueTime API` veya `Hybrid Logical Clocks - HLC`) devreye girer. Bu sayede coğrafi olarak dağıtık düğümlerde bile **Serializable** izolasyon seviyesi sağlanabilir.

---

## Sonuç ve Mimari Seçim Matrisi

Doğru veritabanı mimarisini seçmek, uygulamanın iş mantığı gereksinimlerine bağlıdır. Finansal işlemler, muhasebe ve mutlak veri doğruluğu gerektiren projelerde **ACID** uyumlu, normalize edilmiş **RDBMS** yapıları tercih edilmelidir. Anlık veri akışının yüksek olduğu, milisaniyelerin kritik önem taşıdığı sosyal medya platformları, IoT telemetri sistemleri veya büyük veri analiz araçlarında ise **BASE** modelini benimseyen, **PACELC** matrisinde **PA/EL** odaklı tasarlanmış **NoSQL** mimarileri operasyonel sürekliliği garanti edecektir.