document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementleri
    const anaBaslik = document.getElementById('ana-baslik');
    const anaMetin = document.getElementById('ana-metin');
    const menuLinkleri = document.querySelectorAll('#menu-listesi a'); // <<<< Menü <a> elementleri
    const menuToggle = document.getElementById('menu-toggle');
    const menuListesi = document.getElementById('menu-listesi');

    // Orijinal Metinler
    const orjinalBaslik = anaBaslik.getAttribute('data-text') || '';
    const orjinalMetin = anaMetin.getAttribute('data-text') || '';
    // Menü linklerinin orijinal metinleri (DİKKAT: Bu dizi menuLinkleri ile aynı sırada olmalı)
    const orjinalMenuTexts = Array.from(menuLinkleri).map(a => a.getAttribute('data-text') || '');

    // Animasyon Ayarları
    const karakterler = 'XrBm*#%?_-=/\\';
    const cozmeHizi = 50; // ms
    const tiklamaCozmeSuresi = 5000; // ms
    const ilkYuklemeCozmeSuresi = 5000; // ms

    // Sayfa İçerikleri (Örnekler aynı)
    const sayfaIcerikleri = {
        anasayfa: { baslik: "Ana Sayfa", metin: "Kriptoloji ve yazılım, günümüz dijital dünyasında güvenliği sağlamak için sıkı bir iş birliği içinde çalışır. Kriptoloji, veriyi koruma ve iletişimi güvence altına alma teorisini ve algoritmalarını sunarken, yazılım bu teorileri pratik uygulamalara dönüştürür. Güvenli bir web sitesi, mesajlaşma uygulaması veya finansal sistem, temelinde kriptografik fonksiyonları (şifreleme, çözme, hash alma, dijital imza) çalıştıran yazılım kodlarına dayanır. Yazılım geliştiriciler, bu kriptografik araçları doğru ve etkin bir şekilde kullanarak sistemleri saldırılara karşı dayanıklı hale getirirler. Ancak, kriptografik algoritmaların gücü kadar, bunların yazılım içindeki hatasız uygulanması da kritiktir. Yanlış implementasyonlar, en güçlü şifreleri bile etkisiz kılabilir. Bu nedenle, güvenli yazılım geliştirme süreçleri kriptolojinin ayrılmaz bir parçasıdır." },
        hakkinda: { baslik: "Hakkında", metin: "Ben bir yaratıcı, bir inşa eden ve bir yenilikçiyim. Bir geliştirici olarak yolculuğum, fikirleri etkileyici dijital deneyimlere dönüştürme tutkusuyla şekilleniyor. Kodlama benim için sadece bir yetenek değil; hayalleri gerçeğe dönüştüren, görünmezi görünür kılan bir ifade biçimi. Her projem, yaratıcılığı, hassasiyeti ve amacı birleştiren bir çalışma. Duyarlı tasarımlardan, cihazlara uygun arayüzlere kadar estetik ve işlevselliği bir arada sunmaya olan bağlılığımı yansıtıyor. Animasyonlar sayesinde arayüzlere hayat katarken, kullanıcı ihtiyaçlarına tam anlamıyla hitap eden çözümler tasarlıyorum. Felsefemin merkezinde insanlar var. İhtiyaçlarını anlamak, deneyimlerini geliştirmek ve teknoloji ile insan arasında köprüler kurmak. Tasarımın, ilham veren, problemleri çözen ve hikaye anlatan gücüne inanıyorum. Birlikte, kalıcı bir iz bırakan dijital dünyayı keşfedelim ve bir kod satırıyla hayallerimizi gerçeğe dönüştürelim. " },
        kriptoloji: { baslik: "Kriptoloji", metin: "Kriptoloji, bilgiyi yetkisiz erişimden korumak ve güvenliğini sağlamak amacıyla kullanılan yöntemleri inceleyen bilim dalıdır. Temelde iki ana alanı kapsar: Kriptografi ve Kriptanaliz. Kriptografi, veriyi anlaşılmaz hale getirmek için şifreleme (encryption) algoritmaları tasarlar ve uygular; böylece sadece doğru anahtara sahip olanlar bilgiyi çözebilir (decryption). Kriptanaliz ise bu şifreli mesajları kırma, şifreleme sistemlerinin zayıflıklarını analiz etme ve çözme üzerine yoğunlaşır. Tarih boyunca askeri ve diplomatik haberleşmede kritik rol oynayan kriptoloji, günümüzde internet bankacılığı, e-ticaret, güvenli e-posta, mesajlaşma uygulamaları ve dijital imzalar gibi sayısız alanda veri güvenliğinin temelini oluşturur. AES, RSA gibi modern şifreleme standartları, dijital dünyadaki gizliliğimizi ve güvenliğimizi sağlamada hayati öneme sahiptir. Bu alan sürekli gelişerek yeni tehditlere karşı koymaya çalışır." },
        iletisim: { baslik: "İletişim", metin: "Bana ulaşmak isterseniz, aşağıdaki email üzerinden kullanabilirsiniz. Her türlü soru, iş birliği veya proje fikri için benimle iletişime geçmekten çekinmeyin. İşinizi bir adım öteye taşıyacak yenilikçi çözümler ve yaratıcı fikirler üretmek için sabırsızlanıyorum. Email:abdulkadirgungor.86@outlook.com"}
    };

    // --- Animasyon Fonksiyonları ---
    function rastgeleKarakter() {
        return karakterler[Math.floor(Math.random() * karakterler.length)];
    }

    // Şifrele: Elementin textContent'ini rastgele karakterlerle doldurur
    function metniSifrele(element, orjinalText) {
        if (!element || typeof element.textContent === 'undefined' || !orjinalText) {
            if(element) element.textContent = ''; // Hata varsa boşalt
            return;
        }
        const uzunluk = orjinalText.length;
        let sifreliMetin = '';
        for (let i = 0; i < uzunluk; i++) {
            sifreliMetin += rastgeleKarakter();
        }
        element.textContent = sifreliMetin; // textContent'i güncelle
        // console.log(`Şifrelendi: ${orjinalText} -> ${element.textContent}`, element);
    }

    // Çöz: Elementin textContent'ini zamanla orijinal metne dönüştürür
    function metniCoz(element, orjinalText, sure) {
        if (!element || typeof element.textContent === 'undefined' || !orjinalText) {
            if (element) element.textContent = orjinalText || ''; // Hata varsa orijinali göster
            return Promise.resolve();
        }

        const hedefSure = sure || 5000;
        const harfler = orjinalText.split('');
        const uzunluk = orjinalText.length;

        // Eğer metin zaten doğruysa veya boşsa, animasyona gerek yok
        if (element.textContent === orjinalText || uzunluk === 0) {
             if (uzunluk === 0) element.textContent = ''; // Boş metin ise içeriği temizle
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            let guncelMetin = element.textContent.split(''); // Mevcut (şifreli) metinden başla
            // Eğer mevcut metnin uzunluğu farklıysa, doğru uzunlukta rastgele başla
             if (guncelMetin.length !== uzunluk) {
                guncelMetin = Array(uzunluk).fill('').map(rastgeleKarakter);
                element.textContent = guncelMetin.join('');
             }

            let intervalId;
            const baslangicZamani = Date.now();

            const adimAt = () => {
                const gecenSure = Date.now() - baslangicZamani;
                const ilerleme = Math.min(gecenSure / hedefSure, 1);
                const cozulmesiGerekenIndex = Math.floor(ilerleme * uzunluk);
                let degisiklikYapildi = false;

                for (let i = 0; i < uzunluk; i++) {
                    if (i < cozulmesiGerekenIndex) {
                        // Sırası gelen harfi düzelt
                        if (guncelMetin[i] !== harfler[i]) {
                            guncelMetin[i] = harfler[i];
                            degisiklikYapildi = true;
                        }
                    } else {
                        // Henüz sırası gelmeyenleri rastgele değiştir
                        const yeniKarakter = rastgeleKarakter();
                        if (guncelMetin[i] !== yeniKarakter) {
                            guncelMetin[i] = yeniKarakter;
                            degisiklikYapildi = true;
                        }
                    }
                }

                // Sadece değişiklik varsa DOM'u güncelle (performans için)
                if (degisiklikYapildi) {
                    element.textContent = guncelMetin.join('');
                }

                // Süre dolduysa veya metin tamamen çözüldüyse bitir
                if (ilerleme >= 1) {
                    // Son kontrol: metni kesin doğru yap
                    if (element.textContent !== orjinalText) {
                         element.textContent = orjinalText;
                    }
                    clearInterval(intervalId);
                    // console.log(`Çözüldü: ${orjinalText}`, element);
                    resolve();
                }
            };
            intervalId = setInterval(adimAt, cozmeHizi);
        });
    }


    // --- İlk Yükleme Animasyonu (TÜM hedefler çözülecek) ---
    async function baslatIlkAnimasyonlar() {
        console.log("[Animasyon] Başlatılıyor...");

        // 1. Tüm hedefleri şifrele (Başlık, Metin, *ve Menü Linkleri*)
        console.log("[Animasyon] Şifreleme adımı...");
        metniSifrele(anaBaslik, orjinalBaslik);
        metniSifrele(anaMetin, orjinalMetin);
        // *** HER BİR MENÜ LİNKİNİ ŞİFRELE ***
        menuLinkleri.forEach((linkElement, index) => {
            const text = orjinalMenuTexts[index];
            metniSifrele(linkElement, text); // Doğrudan <a> elementini hedef al
        });
        console.log("[Animasyon] Şifreleme tamamlandı.");

        // 2. Tüm hedeflerin çözülme Promise'lerini oluştur ve başlat
        console.log("[Animasyon] Çözülme adımı başlıyor...");
        const tumPromiseListesi = []; // Tüm promise'leri tutacak dizi

        // Başlık ve Metin Promise'leri
        tumPromiseListesi.push(metniCoz(anaBaslik, orjinalBaslik, ilkYuklemeCozmeSuresi));
        tumPromiseListesi.push(metniCoz(anaMetin, orjinalMetin, ilkYuklemeCozmeSuresi));

        // *** HER BİR MENÜ LİNKİ İÇİN ÇÖZME PROMISE'İ OLUŞTUR VE DİZİYE EKLE ***
        menuLinkleri.forEach((linkElement, index) => {
            const text = orjinalMenuTexts[index];
            // metniCoz bir Promise döndürdüğü için doğrudan diziye ekleyebiliriz
            tumPromiseListesi.push(metniCoz(linkElement, text, ilkYuklemeCozmeSuresi));
        });
        console.log(`[Animasyon] ${tumPromiseListesi.length} adet çözülme işlemi başlatıldı.`);

        // 3. Tüm Promise'lerin tamamlanmasını bekle
        console.log("[Animasyon] Tüm çözülmelerin bitmesi bekleniyor...");
        // Promise.allSettled kullanarak hangi promise'in neden başarısız olduğunu görebiliriz (hata ayıklama için)
        const sonuclar = await Promise.allSettled(tumPromiseListesi);
        console.log("[Animasyon] Tüm çözülme işlemleri tamamlandı (settled).");

        // Hata kontrolü (isteğe bağlı ama önerilir)
        sonuclar.forEach((sonuc, index) => {
             if (sonuc.status === 'rejected') {
                 console.error(`[Animasyon] Çözülme Hatası (Index ${index}):`, sonuc.reason);
             }
        });


        // 4. İlk linki aktif yap
        const ilkLink = menuLinkleri[0];
        if (ilkLink) {
            ilkLink.classList.add('aktif');
            console.log("[Arayüz] İlk menü linki aktif edildi.");
        } else {
            console.warn("[Arayüz] Aktif edilecek ilk menü linki bulunamadı.");
        }
    }

    // --- Titreşim Fonksiyonu ---
    function sayfayiTitret() {
        document.body.classList.add('shake-animation');
        setTimeout(() => {
            document.body.classList.remove('shake-animation');
        }, 200);
    }

    // --- Menü Tıklama İşlevi ---
    let animasyonDevamEdiyor = false;
    async function icerikYukleVeCoz(id) {
        // ... (Bu kısım öncekiyle aynı, sadece başlık ve metni animasyonla yükler) ...
        if (animasyonDevamEdiyor) return;
        animasyonDevamEdiyor = true;
        console.log(`[İçerik] Yükleniyor: ${id}`);
        const icerik = sayfaIcerikleri[id];
        if (icerik) {
            metniSifrele(anaBaslik, icerik.baslik.length);
            metniSifrele(anaMetin, icerik.metin.length);
            menuLinkleri.forEach(link => { link.classList.remove('aktif'); if (link.getAttribute('data-id') === id) { link.classList.add('aktif'); } });
            if (menuListesi.classList.contains('aktif')) { menuListesi.classList.remove('aktif'); menuToggle.setAttribute('aria-expanded', 'false'); }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log(`[İçerik] Çözülüyor: ${id}`);
            try { await Promise.all([metniCoz(anaBaslik, icerik.baslik, tiklamaCozmeSuresi), metniCoz(anaMetin, icerik.metin, tiklamaCozmeSuresi)]); console.log(`[İçerik] Çözüldü: ${id}`); }
            catch (error) { console.error(`[İçerik] '${id}' çözülmesinde hata:`, error); }
            finally { animasyonDevamEdiyor = false; }
        } else { console.warn(`[İçerik] Bulunamadı: ${id}`); animasyonDevamEdiyor = false; }
    }

    // --- Olay Dinleyicileri ---
    menuLinkleri.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-id');
            if (!link.classList.contains('aktif') && !animasyonDevamEdiyor) { icerikYukleVeCoz(targetId); }
        });
    });
    menuToggle.addEventListener('click', () => { if (animasyonDevamEdiyor) return; const acikMi = menuListesi.classList.toggle('aktif'); menuToggle.setAttribute('aria-expanded', acikMi); });

    // --- Başlatma ---
    baslatIlkAnimasyonlar(); // Sayfa yüklenince animasyonları başlat
    setInterval(sayfayiTitret, 10000); // Periyodik titreşimi başlat

});