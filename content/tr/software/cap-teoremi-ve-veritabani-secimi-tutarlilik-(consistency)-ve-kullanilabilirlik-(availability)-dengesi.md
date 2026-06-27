---
title: "CAP Teoremi ve Veritabanı Seçimi: Tutarlılık (Consistency) ve Kullanılabilirlik (Availability) Dengesi"
date: 2026-03-05
type: "software"
draft: false
math: true
description: "Dağıtık sistem tasarımında Consistency (Tutarlılık), Availability (Kullanılabilirlik) ve Partition Tolerance (Bölünme Toleransı) arasındaki kritik dengeyi teknik algoritmalar ve kod örnekleriyle inceleyen kapsamlı bir çalışmadır."
featured_image: "/images/software/cap-teoremi-ve-veritabani-secimi-tutarlilik-(consistency)-ve-kullanilabilirlik-(availability)-dengesi.png"
tags: ["yazilim", "software", "cap-teoremi", "dagitik-sistemler", "veritabani-mimarisi", "nosql", "tutarlilik", "pacelc",  "distributed-systems"]
---

Dağıtık sistemlerin temel yapı taşlarından biri olan **CAP Teoremi (Brewer’s Theorem)**, ağ üzerinden haberleşen sistemlerin tasarımı sırasında ödün verilmesi gereken kritik ödünleşimleri (trade-offs) matematiksel bir çerçeveye oturtur. 2000 yılında Eric Brewer tarafından ortaya atılan ve 2002 yılında Seth Gilbert ve Nancy Lynch tarafından kanıtlanan bu prensip, bir dağıtık veri sisteminin aynı anda aşağıdaki üç özelliği birden tam anlamıyla sağlayamayacağını savunur:

1.  **Consistency (Tutarlılık):** Her okuma işlemi, en güncel yazma işlemini veya bir hata mesajını döndürür.
2.  **Availability (Kullanılabilirlik):** Her istek (hata almadan) bir yanıt alır, ancak dönen verinin en güncel olduğu garanti edilmez.
3.  **Partition Tolerance (Bölünme Toleransı):** Ağdaki düğümler arasında iletişim koptuğunda (ağ bölünmesi), sistem çalışmaya devam eder.

{{< figure src="/images/software/cap-teoremi-ve-veritabani-secimi-tutarlilik-(consistency)-ve-kullanilabilirlik-(availability)-dengesi.png" alt="CAP Teoremi ve Veritabanı Seçimi: Tutarlılık (Consistency) ve Kullanılabilirlik (Availability) Dengesi" width="1200" caption="Şekil 1: CAP Teoremi ve Veritabanı Seçimi: Tutarlılık (Consistency) ve Kullanılabilirlik (Availability) Dengesi." >}}

---

## 1. CAP Bileşenlerinin Teknik Analizi

Dağıtık bir mimaride "Ağ Bölünmesi" (Network Partition) kaçınılmaz bir gerçeklik olduğu için, modern sistemler aslında **P (Partition Tolerance)** özelliğini varsayılan olarak kabul etmek zorundadır. Bu durumda tasarımcı, **CP** veya **AP** arasında bir seçim yapmaya zorlanır.

### 1.1. Consistency (CP - Tutarlılık Odaklı Sistemler)
Bu sistemlerde veri bütünlüğü her şeyin önündedir. Eğer bir ağ bölünmesi yaşanırsa ve sistem verinin güncelliğini tüm düğümlerde doğrulayamazsa, hatalı veri dönmek yerine isteği reddeder. Genellikle **Atomic Consistency** veya **Linearizability** ilkelerine dayanır.

*   **Öne Çıkan Yapılar:** Google Spanner, MongoDB (varsayılan mod), HBase.
*   **Protokoller:** Paxos, Raft.

### 1.2. Availability (AP - Erişilebilirlik Odaklı Sistemler)
Sistemin her koşulda yanıt vermesi önceliklidir. Ağda bir kopukluk olsa dahi, ulaşılan düğüm elindeki veriyi (eski olsa bile) istemciye sunar. Bu yapılar genellikle **Eventual Consistency** (Nihai Tutarlılık) modelini benimser.

*   **Öne Çıkan Yapılar:** Apache Cassandra, CouchDB, DynamoDB.
*   **Yöntemler:** Gossip Protocol, Hinted Handoff.

---

## 2. Tutarlılık Modelleri ve Algoritmik Yaklaşımlar

CAP teoreminin "C" harfi genellikle yanlış anlaşılır. Teknik literatürde bu, ACID prensiplerindeki tutarlılıktan ziyade, tüm düğümlerin aynı anda aynı veriyi görmesi anlamına gelir.

### 2.1. Raft Konsensüs Algoritması ile Tutarlılık Sağlama
CP sistemlerinde tutarlılığı sağlamak için kullanılan en popüler algoritmalardan biri Raft'tır. Raft, bir "Leader" seçimi ve "Log Replication" mekanizması üzerine kuruludur.

Aşağıdaki pseudo-kod, bir liderin log girişini diğer düğümlere nasıl dağıttığını ve çoğunluk (quorum) sağlandığında nasıl commit ettiğini simüle eder:

```python
class RaftNode:
    def __init__(self, node_id, peers):
        self.node_id = node_id
        self.peers = peers
        self.log = []
        self.commit_index = 0
        self.state = "Follower"

    def receive_append_entries(self, leader_id, term, entry):
        # Liderden gelen veriyi loga ekle
        self.log.append(entry)
        return True, self.node_id

    def replicate_log(self, entry):
        if self.state != "Leader":
            return False
            
        votes = 1 # Kendi oyu
        for peer in self.peers:
            success, p_id = peer.receive_append_entries(self.node_id, current_term, entry)
            if success:
                votes += 1
        
        # Quorum Check (N/2 + 1)
        if votes > (len(self.peers) + 1) / 2:
            self.commit_index += 1
            self.apply_to_state_machine(entry)
            return "Committed"
        return "Failed - No Quorum"
```

---

## 3. Veritabanı Seçimi ve Mimari Kararlar

Veritabanı seçimi, uygulamanın iş mantığına (business logic) göre şekillenir.

### 3.1. CP Seçimi: Finansal ve Envanter Sistemleri
Bir bankacılık uygulamasında, bakiyenin yanlış görünmesi kabul edilemez. Bu yüzden **Strong Consistency** gereklidir.
*   **Etcd:** Kubernetes gibi orkestrasyon araçlarında konfigürasyon verilerini tutarlı şekilde saklamak için kullanılır.
*   **Redis (Wait Command):** Redis normalde AP eğilimlidir ancak `WAIT` komutu ile senkron replikasyon zorlanarak CP özelliklerine yaklaştırılabilir.

### 3.2. AP Seçimi: Sosyal Medya ve Analitik
Bir tweet'in veya beğeni sayısının 1 saniye geç güncellenmesi sistemin durmasından daha iyidir.
*   **Cassandra:** Geniş ölçekli yazma operasyonları için tasarlanmıştır. "LWW" (Last Write Wins) stratejisi ile çakışmaları çözer.
*   **Riak:** Vektör saatleri (Vector Clocks) kullanarak veri sürümlerini takip eder.



---

## 4. PACELC: CAP'in Genişletilmiş Hali

Modern dünyada CAP teoremi yetersiz kalabilmektedir çünkü ağ bölünmesi (Partition) her zaman gerçekleşmez. **PACELC** teoremi, normal çalışma zamanındaki (Else) gecikme (Latency) ve tutarlılık (Consistency) dengesini de sorgular.

> **PACELC Formülasyonu:**
> - **P** (Partition) durumunda; **A** (Availability) veya **C** (Consistency) seçilir.
> - **E** (Else - Normal durumda); **L** (Latency) veya **C** (Consistency) seçilir.

Örneğin, **Amazon DynamoDB** bir PA/EL sistemidir. Bölünme anında kullanılabilirliği (A) seçerken, normal durumda düşük gecikmeyi (L) hedefler.

---

## 5. Yazılım Kaynakları ve Kütüphane Entegrasyonları

Dağıtık sistem geliştiricileri için tutarlılık ve kullanılabilirlik yönetiminde kullanılan bazı kritik kütüphaneler:

*   **JGroups (Java):** Kümeleme (clustering) ve güvenilir grup iletişimi için kullanılır. AP sistemlerinde düğümler arası haberleşme için idealdir.
*   **Akka (Scala/Java):** "Actor Model" mimarisi ile dağıtık eyalet yönetimini kolaylaştırır.
*   **Consul (Go):** Hizmet keşfi (Service Discovery) için CP modelini kullanan, Raft tabanlı bir araçtır.
*   **Boto3 (Python):** AWS DynamoDB üzerinde `ConsistentRead=True` parametresi ile AP sisteminde CP benzeri davranışlar sergilemenizi sağlar.

### Örnek: Python ile Dağıtık Bir Lock Mekanizması (CP Yaklaşımı)
Tutarlılık gerektiren bir işlemde, aynı kaynağa aynı anda erişimi engellemek için `etcd` üzerinden kilit (lock) kullanımı:

```python
import etcd3

def perform_consistent_update(resource_id, new_value):
    client = etcd3.client()
    
    # Dağıtık kilit oluşturma (Lease ile)
    lock = client.lock(f'lock-{resource_id}', ttl=10)
    
    if lock.acquire():
        try:
            # Kritik bölge (Critical Section)
            print(f"Updating {resource_id} to {new_value}")
            client.put(resource_id, new_value)
        finally:
            lock.release()
    else:
        print("Could not acquire lock, consistency preserved.")
```

---

## 6. Sonuç ve Stratejik Notlar

Veritabanı seçimi, sadece bir teknoloji tercihi değil, sistemin hangi hata türüne tolerans göstereceğinin beyanıdır.

*   **Yüksek Trafikli Read-Heavy Sistemler:** AP/EL tercih edilerek `ReadOnly` replikalar üzerinden yük dağıtılmalıdır.
*   **Kritik Yazma İşlemleri:** CP odaklı, Quorum tabanlı yazma protokolleri (örn. MongoDB Write Concern: `majority`) kullanılmalıdır.
*   **Hibrit Modeller:** Günümüzde birçok veritabanı (Couchbase, CosmosDB) "Tunable Consistency" (Ayarlanabilir Tutarlılık) sunar. Bu, her sorgu bazında CAP dengesinin değiştirilebilmesine olanak tanır.

**Teknik Not:** Bir sistem asla "CA" olamaz. Çünkü ağ bölünmesi bir seçenek değil, donanım ve altyapı seviyesinde bir risktir. Eğer bir sistem "P" özelliğini reddediyorsa, bu onun tek bir fiziksel sunucu üzerinde çalıştığını ve dağıtık olmadığını gösterir. Bu durumda zaten CAP teoreminden bahsedilemez.

Dağıtık sistem mimarı, "Mükemmel veritabanı var mıdır?" sorusu yerine "Hangi veri kaybı veya gecikme türü benim iş modelim için en az maliyetlidir?" sorusuna yanıt aramalıdır.

---
**Özet Tablo: CAP ve Veritabanı Sınıflandırması**

| Sistem Türü | Öncelik | Örnek Veritabanları | Temel Kullanım Senaryosu |
| :--- | :--- | :--- | :--- |
| **CP** | Tutarlılık | etcd, HBase, MongoDB | Finansal kayıtlar, yapılandırma yönetimi |
| **AP** | Kullanılabilirlik | Cassandra, Voldemort | İçerik akışları, log toplama, analitik |
| **CA** | (Teorik/Yerel) | RDBMS (Postgres, MySQL) | Tek sunuculu ACID gereksinimleri |

Bu mimari perspektif, mikroservis geçişlerinde ve veri katmanı tasarımlarında karşılaşılan karmaşıklığı yönetmek için en güçlü araçtır.