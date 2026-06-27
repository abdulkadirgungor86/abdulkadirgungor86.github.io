---
title: "Veri Biliminde Topolojik Yaklaşımlar ve Gephi ile Graf Teorisi Temelli Ağ Analizi"
date: 2026-05-06
type: "blog"
draft: false
math: true
description: "Bu teknik blog yazısı, büyük veri setlerindeki karmaşık ilişkilerin graf teorisi ve Gephi yazılımı kullanılarak nasıl görselleştirileceğini, matematiksel metrikler ve yazılım kütüphaneleri eşliğinde derinlemesine analiz etmektedir."
featured_image: "/images/blog/veri-biliminde-topolojik-yaklasimlar-ve-gephi-ile-graf-teorisi-temelli-ag-analizi.png"
tags: ["blog", "gephi", "ag-analizi","veri-gorsellestirme","graf-teorisi","network-analysis","python","veri-bilimi", "merkeziyet-metrikleri","karmasik-sistemler"]
---

Günümüz veri ekosisteminde, ham verinin büyüklüğünden ziyade bu veriyi oluşturan birimler arasındaki ilişkisel örüntülerin tespiti stratejik bir öneme sahiptir. Geleneksel ilişkisel veritabanları ve satır-sütun bazlı analiz yöntemleri, "bağlantısallık" (connectivity) olgusunu ifade etmekte yetersiz kalmaktadır. İşte bu noktada, **Graf Teorisi** (Graph Theory) devreye girer. Karmaşık sistemleri düğümler (nodes) ve kenarlar (edges) aracılığıyla modelleyen bu disiplin, Gephi gibi açık kaynaklı araçlarla birleştiğinde, büyük veri setlerindeki gizli topolojileri açığa çıkaran devasa bir analitik güce dönüşür.

{{< figure src="/images/blog/veri-biliminde-topolojik-yaklasimlar-ve-gephi-ile-graf-teorisi-temelli-ag-analizi.png" alt="Veri Biliminde Topolojik Yaklaşımlar ve Gephi ile Graf Teorisi Temelli Ağ Analizi" width="1200" caption="Şekil 1: Veri Biliminde Topolojik Yaklaşımlar ve Gephi ile Graf Teorisi Temelli Ağ Analizi." >}}

---

### 1. Ağ Analizinin Matematiksel ve Teknik Temelleri

Bir ağ analizi süreci, matematiksel olarak bir $G = (V, E)$ grafının inşası ile başlar. Burada $V$ (Vertices), sistemi oluşturan aktörleri; $E$ (Edges) ise bu aktörler arasındaki etkileşimleri temsil eder. Gephi, bu matematiksel yapıyı işlemek için Java tabanlı bir motor kullanır ve veriyi görselleştirirken çeşitli **yerleşim algoritmaları** (Layout Algorithms) ile topolojik uzaklıkları fiziksel koordinatlara dönüştürür.

Ağ analizinde temel metriklere hakim olmak, görselleştirmenin ötesinde bir çıkarım yapabilmek için elzemdir:

* **Derece Merkeziyeti (Degree Centrality):** Bir düğüme bağlı olan toplam kenar sayısıdır. Yönlü grafiklerde "In-degree" (gelen) ve "Out-degree" (giden) olarak ikiye ayrılır.
* **Arasındalık Merkeziyeti (Betweenness Centrality):** Bir düğümün, ağdaki diğer tüm düğüm çiftleri arasındaki en kısa yollar üzerinde bulunma sıklığıdır. Bu düğümler, ağdaki "köprü" (bridge) görevini görürler ve bilgi akışını kontrol ederler.
* **Yakınlık Merkeziyeti (Closeness Centrality):** Bir düğümün ağdaki diğer tüm düğümlere olan ortalama uzaklığıdır. Bir düğümün ağın ne kadar merkezinde olduğunu gösterir.
* **Modülerlik (Modularity):** Ağın topluluk (community) yapısını ölçer. Yüksek modülerlik skoru, ağın kendi içinde yoğun, dışarıya karşı seyrek bağlantıları olan alt gruplara ayrıldığını gösterir.

### 2. Gephi İçin Veri Hazırlığı ve ETL Süreçleri

Gephi'ye veri aktarmadan önce verinin temizlenmesi ve uygun formatlara (CSV, GDF, GEXF) dönüştürülmesi gerekir. Büyük veri setlerinde bu işlem genellikle Python kütüphaneleri olan `Pandas` ve `NetworkX` ile gerçekleştirilir.

Aşağıda, bir veri setini Gephi'nin okuyabileceği "Nodes" ve "Edges" tablolarına dönüştüren örnek bir Python betiği yer almaktadır:

```python
import pandas as pd
import networkx as nx

# Ham veri setini yükleme (Örn: Sosyal medya etkileşimleri)
raw_data = pd.read_csv('interaction_log.csv')

# Kaynak ve hedef belirleme
# df yapısı: source_user, target_user, weight
edges = raw_data[['source_user', 'target_user', 'weight']]

# NetworkX objesi oluşturma
G = nx.from_pandas_edgelist(edges, source='source_user', target='target_user', edge_attr='weight')

# Düğüm listesini oluşturma (Özniteliklerle birlikte)
nodes = pd.DataFrame(G.nodes(), columns=['ID'])
nodes['Label'] = nodes['ID']

# Gephi formatında çıktı alma
nodes.to_csv('nodes_table.csv', index=False)
edges.to_csv('edges_table.csv', index=False)

```

Bu aşamada dikkat edilmesi gereken en kritik nokta, veri setindeki gürültünün (noise) temizlenmesidir. Tekil düğümler (isolates) veya çok düşük ağırlıklı kenarlar, görselleştirmede "hairball" (saç yumağı) etkisine neden olarak analizi imkansız hale getirebilir.

### 3. Dinamik Yerleşim Algoritmaları ve Kuvvet Odaklı Görselleştirme

Gephi'nin kalbi, yerleşim (layout) sekmesinde atar. Statik veriyi yaşayan bir organizmaya dönüştüren bu algoritmalar, fiziksel kuvvet simülasyonlarına dayanır.

* **ForceAtlas2:** Büyük ağlar için optimize edilmiş, lineer olmayan bir algoritmadır. Düğümleri itme (repulsion) ve kenarları çekme (attraction) kuvvetiyle konumlandırır. Bu algoritma, toplulukları birbirinden uzaklaştırarak yapısal boşlukları netleştirir.
* **Fruchterman-Reingold:** Düğümleri atomlar gibi düşünür ve aralarındaki enerjiyi minimize etmeye çalışır. Daha estetik ve dengeli dağılımlar sunar ancak çok büyük veri setlerinde hesaplama maliyeti yüksektir.
* **OpenOrd:** Çok büyük ölçekli ağlarda (milyonlarca düğüm) kümelenmeleri hızlıca tespit etmek için kullanılır.

**Teknik Not:** Büyük veri setlerinde çalışırken, `Gravity` (Yerçekimi) parametresini artırmak düğümlerin dağılmasını önlerken, `Scaling` parametresi kümeler arasındaki mesafeyi açarak detaylı inceleme olanağı sağlar.

### 4. İstatistiksel Hesaplamalar ve Filtreleme Teknikleri

Görselleştirme yapıldıktan sonra Gephi'nin sağ panelindeki "Statistics" araçları çalıştırılmalıdır. Özellikle **Modularity** algoritmasının çalıştırılması, düğümlerin renklendirilmesi için "Class" verisini üretir.

Filtreleme aşamasında ise `Topology` filtreleri kullanılarak ağ sadeleştirilmelidir. Örneğin, sadece `Degree` değeri 5'ten büyük olan düğümleri göstermek, ağın çekirdek (core) yapısına odaklanmayı sağlar. `Giant Component` filtresi ise ağdan kopuk olan küçük grupları eleyerek ana yapı üzerinde çalışmayı mümkün kılar.

### 5. Yazılım Ekosistemi ve Kütüphane Entegrasyonu

Ağ analizi sadece Gephi ile sınırlı değildir. Karmaşık projelerde Gephi, bir "görsel inceleme" katmanı olarak kullanılırken, hesaplama katmanında farklı kütüphaneler rol alır:

* **NetworkX (Python):** Prototipleme ve temel analitik hesaplamalar için standarttır.
* **iGraph (C/C++/R/Python):** Yüksek performanslı hesaplamalar ve karmaşık algoritmalar (Örn: Walktrap, InfoMap) için tercih edilir.
* **Graph-tool (C++ / Python):** OpenMP desteği sayesinde çok çekirdekli işlemcilerde devasa ağları saniyeler içinde analiz edebilir.
* **Sigma.js / D3.js:** Gephi'de hazırlanan analizlerin web ortamında etkileşimli olarak yayınlanması için kullanılan JavaScript kütüphaneleridir.

### 6. Siber Güvenlik ve Malware Analizinde Ağ Topolojisi

Veri biliminin ötesinde, ağ analizi siber güvenlikte kritik bir rol oynar. Bir malware (kötü amaçlı yazılım) örneğinin sistemdeki API çağrıları arasındaki ilişkiler bir graf olarak modellenebilir.

Örneğin, bir Windows PE dosyasının içe aktardığı fonksiyonlar (imports) ve bu fonksiyonların birbirini çağırma sırası bir yönlü graf oluşturur. Gephi ile yapılan analizlerde, zararlı yazılımların "fonksiyonel imza"ları (signature-based detection yerine davranışsal analiz) bu grafların topolojik benzerliklerinden tespit edilebilir. Benzer şekilde, ağ trafiği analizinde (PCAP verileri), IP adresleri arasındaki trafik yoğunluğu Gephi'ye aktarılarak botnet yapıları veya DDoS saldırı merkezleri saniyeler içinde görselleştirilebilir.

### 7. Sonuç ve Stratejik Çıkarımlar

Gephi ile ağ analizi, bir veri görselleştirme sürecinden ziyade bir keşifsel veri analizi (EDA) metodolojisidir. Karmaşık sistemlerin içerisindeki kaosu düzenli bir yapıya büründüren bu araç, karar vericilere sistemin zayıf noktalarını, en etkili aktörlerini ve gizli alt gruplarını sunar.

**Önemli Notlar:**

* **Veri Formatı:** Her zaman `.gexf` formatını tercih edin; çünkü bu format hiyerarşik yapıları ve dinamik (zamana bağlı) verileri destekler.
* **Ölçeklenebilirlik:** Gephi, RAM tabanlı bir araçtır. 100.000+ düğüm üzerindeki analizlerde Java bellek ayarlarını (`gephi.conf` dosyasından `Xmx` değerini) artırmayı unutmayın.
* **Anlamlandırma:** Tek başına bir graf hiçbir şey ifade etmez. Görselleştirmeyi mutlaka merkeziyet ölçümleri ve istatistiksel testlerle (p-value, dağılım analizleri) destekleyin.

Ağ analizi, verinin içindeki "bağlamı" görmemizi sağlar. Gephi ise bu bağlamı bir sanat eserine ve stratejik bir rapora dönüştüren en güçlü enstrümandır. Yazılım kaynaklarını doğru kullanarak ve matematiksel temellere sadık kalarak, en karmaşık ilişkiler bile çözülebilir hale gelir.