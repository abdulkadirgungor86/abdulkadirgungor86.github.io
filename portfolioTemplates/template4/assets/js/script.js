document.addEventListener('DOMContentLoaded', () => {
    const kitaplar = document.querySelectorAll('.kitap');
    const modal = document.getElementById('kitap-icerik-modal');
    const modalBaslik = document.getElementById('modal-baslik');
    const modalMetin = document.getElementById('modal-metin');
    const modalKapat = document.getElementById('modal-kapat');

    const kitapIcerikleri = {
        kitap1: {
            baslik: "HTML: Web Sayfalarının İskeleti",
            metin: "HTML, yani HyperText Markup Language (Hiper Metin İşaretleme Dili), web sayfalarını oluşturmak için kullanılan standart işaretleme dilidir. İnternette gördüğünüz metinlerin, görsellerin, bağlantıların ve diğer tüm içeriklerin tarayıcıda nasıl yapılandırılacağını ve görüntüleneceğini tanımlar. Bir web sayfasının temel iskeleti HTML kodları ile kurulur; başlıklar, paragraflar, listeler, tablolar ve formlar gibi yapısal elemanlar HTML etiketleri kullanılarak belirtilir. Tek başına içerik yapısını oluşturan HTML, genellikle sayfanın görünümünü ve stilini belirleyen CSS (Cascading Style Sheets) ve sayfaya etkileşim ve dinamik özellikler katan JavaScript ile birlikte kullanılır. Web geliştirmenin ilk ve en temel adımı olan HTML'i anlamak, internetin nasıl çalıştığını kavramak için kritik öneme sahiptir. Herhangi bir web sitesinin temelini bu işaretleme dili oluşturur."
        },
        kitap2: {
            baslik: "CSS: Web Sayfalarına Stil Katmak",
            metin: "CSS, yani Cascading Style Sheets (Basamaklı Stil Şablonları), HTML ile oluşturulan web sayfalarının görünümünü ve biçimlendirmesini kontrol etmek için kullanılan bir stil sayfası dilidir. HTML içeriğin yapısını belirlerken, CSS bu içeriğin renklerini, yazı tiplerini, boyutlarını, kenar boşluklarını, arka planlarını ve sayfa düzenini (layout) tanımlar. Bir web sitesinin görsel estetiği ve kullanıcı deneyimi büyük ölçüde CSS ile sağlanır. Tek bir CSS dosyası kullanılarak birden fazla HTML sayfasının stilinin tutarlı bir şekilde yönetilmesi mümkündür, bu da bakımı kolaylaştırır ve kod tekrarını azaltır. Ayrıca, CSS'in 'responsive design' (duyarlı tasarım) yetenekleri sayesinde web sayfaları farklı ekran boyutlarına (masaüstü, tablet, mobil) otomatik olarak uyum sağlayabilir. HTML'in iskeletini giydiren CSS, modern web tasarımının vazgeçilmez bir parçasıdır."
        },
        kitap3: {
            baslik: "JavaScript: Web Sayfalarına Hayat Vermek",
            metin: "JavaScript (genellikle JS olarak kısaltılır), web sayfalarına etkileşim ve dinamik özellikler katmak için kullanılan güçlü bir programlama dilidir. HTML sayfanın yapısını, CSS ise görünümünü oluştururken, JavaScript kullanıcı eylemlerine yanıt vermeyi, içeriği değiştirmeyi, animasyonlar oluşturmayı ve sunucuyla arka planda iletişim kurmayı sağlar. Örneğin, bir formun doğru doldurulup doldurulmadığını kontrol etmek, bir düğmeye tıklandığında içeriği göstermek/gizlemek veya bu sayfadaki interaktif harita gibi özellikler JavaScript ile yapılır. Tarayıcı tarafında çalışan bu dil, web sayfalarını statik belgeler olmaktan çıkarıp yaşayan, etkileşimli uygulamalara dönüştürür. HTML ve CSS ile birlikte web geliştirmenin üç temel taşından biridir ve modern, kullanıcı dostu web deneyimleri oluşturmak için vazgeçilmezdir. Günümüzde web'in büyük bir kısmı JavaScript gücüyle çalışmaktadır."
        },
        kitap4: {
            baslik: "C#: Güçlü ve Çok Yönlü Bir Programlama Dili",
            metin: "C# (C Sharp olarak okunur), Microsoft tarafından .NET platformu için geliştirilmiş modern, nesne yönelimli ve güçlü bir programlama dilidir. Güvenli ve sağlam uygulamalar oluşturmak için tasarlanmıştır. Geniş bir kullanım alanına sahip olan C#, özellikle Windows masaüstü uygulamaları (WPF, Windows Forms), web uygulamaları ve servisleri (ASP.NET Core) geliştirmede popülerdir. Ayrıca, popüler oyun motoru Unity'nin ana dili olması sayesinde oyun geliştirmede de yaygın olarak kullanılır. Mobil uygulama geliştirmede (Xamarin ile), bulut tabanlı çözümlerde ve kurumsal düzeyde yazılımlarda da sıkça tercih edilir. Güçlü tip kontrolü, zengin standart kütüphanesi (.NET Kütüphanesi) ve geniş topluluk desteği, C#'ı geliştiriciler için cazip kılan özelliklerdendir. Öğrenmesi göreceli olarak kolay ve çok yönlü yapısıyla birçok farklı projede kullanılabilir."
        },
        kitap5: {
            baslik: "Python: Öğrenmesi Kolay, Uygulaması Geniş Programlama Dili",
            metin: "Python, okunabilirliği ve basit söz dizimi ile öne çıkan, yüksek seviyeli, yorumlamalı ve genel amaçlı bir programlama dilidir. Öğrenme kolaylığı sayesinde programlamaya yeni başlayanlar için ideal bir seçenektir. Ancak basitliğinin yanında, son derece güçlü ve çok yönlüdür. Geniş standart kütüphanesi ve zengin üçüncü parti paket ekosistemi, geliştiricilere çok çeşitli görevleri hızlı ve verimli bir şekilde tamamlama olanağı sunar. Web geliştirme (Django, Flask gibi frameworklerle), veri bilimi, makine öğrenimi, yapay zeka, bilimsel hesaplama, otomasyon ve betik (scripting) yazma gibi birçok farklı alanda yaygın olarak kullanılır. Büyük ve aktif topluluğu sayesinde bol miktarda öğrenme kaynağı, kütüphane ve destek bulunur. Python'un bu esnekliği ve gücü, onu günümüzün en popüler programlama dillerinden biri yapmıştır."
        }
    };

    function kitapAc(kitapId) {
        const icerik = kitapIcerikleri[kitapId];
        if (icerik) {
            modalBaslik.textContent = icerik.baslik;
            modalMetin.textContent = icerik.metin;
            modal.classList.add('aktif');
            modal.setAttribute('aria-hidden', 'false');
            modalKapat.focus(); // Erişilebilirlik için kapatma butonuna odaklan
        }
    }

    function modalKapatFn() {
        modal.classList.remove('aktif');
        modal.setAttribute('aria-hidden', 'true');
        // Modalı açan kitaba geri odaklanmak daha iyi bir deneyim olabilir,
        // ancak hangi kitabın açtığını takip etmek gerekir. Şimdilik genel bırakalım.
    }

    kitaplar.forEach(kitap => {
        kitap.addEventListener('click', () => {
            kitapAc(kitap.id);
        });

        kitap.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Boşluk tuşunun sayfayı kaydırmasını engelle
                kitapAc(kitap.id);
            }
        });
    });

    modalKapat.addEventListener('click', modalKapatFn);

    // Modal dışına tıklanınca kapatma
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modalKapatFn();
        }
    });

    // Esc tuşu ile kapatma
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('aktif')) {
            modalKapatFn();
        }
    });
});