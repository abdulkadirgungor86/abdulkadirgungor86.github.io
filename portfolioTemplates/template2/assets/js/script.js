document.addEventListener('DOMContentLoaded', function() {
    const rainContainer = document.querySelector('.rain');
    const pageTitle = document.getElementById('page-title');
    const pageText = document.getElementById('page-text');
    const menuLinks = document.querySelectorAll('.menu a[data-content]');
    const contentElement = document.querySelector('.content');
    const lightningElement = document.querySelector('.lightning');

    function createRaindrop() {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        drop.style.left = Math.random() * 100 + '%';
        const randomDuration = Math.random() * 1.2 + 0.4;
        drop.style.animationDuration = randomDuration + 's';
        const randomDelay = Math.random() * 6;
        drop.style.animationDelay = randomDelay + 's';
        rainContainer.appendChild(drop);
        setTimeout(() => {
             if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
             }
        }, (randomDuration + randomDelay + 0.5) * 1000);
    }
    const creationInterval = 50;
    let dropCreationInterval = setInterval(createRaindrop, creationInterval);

    const pageContent = {
        home: {
            title: "Geleceği Kodlayan Eller: Dijital Evrenin Yaratıcıları",
            text: "Sürekli evrilen bir teknoloji ufkunda, kodlama geleceğe atılan imzadır. Bu, sadece mevcut sorunlara çözüm bulmak değil, aynı zamanda yarının olasılıklarını bugünden tasarlamaktır. Fonksiyonellik ve estetiğin ötesinde, her kod parçası yenilikçiliğe açılan bir kapıdır. Bu portfolyo, projelerimin bir sergisinden çok daha fazlası; teknoloji ve tasarımın kesişiminde sürekli olarak sınırları zorlayan bir keşif yolculuğunun güncesidir. Her girişimde hedefim, soyut fikirleri elle tutulur dijital gerçeklere dönüştürmek ve bu süreçte kullanıcılar için anlamlı bir fark yaratmaktır. İleriyi düşünen tasarımlar ve pürüzsüz etkileşimlerle, dijital etkileşimleri daha sezgisel ve güçlü kılıyorum. Kullanıcıları sadece tatmin etmek değil, onlara geleceğin potansiyelini bugünden hissettirmek istiyorum. Dijital çağın bir kaşifi olarak, teknolojiyle insan potansiyeli arasındaki bağı güçlendiriyorum. Kod, benim için sadece bir araç değil, aynı zamanda geleceği öngörme ve onu şekillendirme iradesidir. Bu portfolyo, imkansız görüneni mümkün kılma ve geleceği birlikte kodlama vizyonunu paylaşmak için bir çağrıdır. Yeniliğin başladığı yere hoş geldiniz."
        },
        about: {
            title: "Hakkımda",
            text: "Yeni şeyler ortaya koymak, yapılandırmak ve geliştirmek benim için bir yaşam biçimi. Bir geliştirici olarak bu yolculuk, içimdeki fikirleri dijital dünyada yaşayan, nefes alan deneyimlere dönüştürme ateşli isteğiyle başladı. Kodlama benim için bir meslekten çok daha fazlası; bir tutku, hayal gücünü gerçeğe dönüştürmenin, potansiyeli somutlaştırmanın en güçlü yolu. Her proje, bu tutkunun bir yansımasıdır; estetik ve işlevsellik arasındaki mükemmel dengeyi bulma arayışımı gösterir. Kullanıcıyı merkezine alan, her ekranda harika görünen ve akıcı animasyonlarla keyif veren arayüzler yaratmaya adanmışlığımı ortaya koyar. Kalbimde her zaman insan faktörü yatar: Empati kurmak, ihtiyaçları sezmek ve teknolojiyle insan arasındaki bağı güçlendirmek. Tasarımın sadece sorun çözmekle kalmayıp, ilham verebileceğine de derinden inanıyorum. Bu dijital keşif yolculuğunda bana katılın; kodun sihrini kullanarak birlikte unutulmaz işlere imza atalım ve hayallerimizi satır satır gerçeğe dönüştürelim."
        },
        projects: {
            title: "Projeler",
            text: "Projelerim, teknoloji ve yaratıcılığı birleştirerek hem yenilikçi hem de pratik çözümler sunmaktadır. Dikkat çeken çalışmalarım arasında GitHub üzerinde bulunan, güvenlik açığı tespiti ve önlemeye odaklanan siber güvenlik uygulamaları yer almaktadır. Ayrıca .NET Core MVC/API ve tasarım desenleri kullanılarak geliştirilmiş modern, işlevsel yazılım projeleri ve akademik verimliliği artırmaya yönelik üniversite için hazırlanmış eğitim dokümanları da bulunmaktadır. Tüm bu çalışmalar; teknik yetkinliğimi, analitik problem çözme becerimi ve kullanıcı odaklı tasarım yaklaşımımı yansıtmaktadır. Gelecekteki hedefim, işbirliği içinde yenilikçi projeler geliştirmeye devam etmektir."
        },
        contact: {
            title: "İletişim",
            text: "Benimle iletişime geçmek isterseniz, bunu yapmanın en doğrudan yolu aşağıda belirtilen e-posta adresini kullanmaktır. Lütfen bu adresi kullanarak bana dilediğiniz zaman yazmaktan çekinmeyin. Aklınızda herhangi bir soru varsa veya sadece bir konuda sohbet etmek isterseniz kapım her zaman açıktır. Potansiyel iş birliği fırsatları veya birlikte hayata geçirebileceğimiz yeni proje fikirleri hakkında konuşmaktan büyük heyecan duyarım. Mevcut işinizi veya projelerinizi bir sonraki seviyeye taşıyacak özgün, yenilikçi çözümler ve yaratıcı stratejiler geliştirmek için sizinle birlikte çalışmayı sabırsızlıkla bekliyorum. Gelin, fikirlerinizi nasıl gerçeğe dönüştürebileceğimizi birlikte keşfedelim. Bana ulaşabileceğiniz e-posta adresim şudur: abdulkadirgungor.86@outlook.com. Mesajınızı en kısa sürede yanıtlamak için elimden geleni yapacağım."
        }
    };

     function loadInitialContent() {
        try {
            if (!pageTitle || !pageText) { console.error("Başlık veya metin elementi DOM'da bulunamadı!"); return; }
            const initialContentKey = 'home';
            const initialContent = pageContent[initialContentKey];
            if (initialContent?.title && initialContent?.text) {
                pageTitle.textContent = initialContent.title;
                pageText.textContent = initialContent.text;
                pageTitle.style.opacity = 1;
                pageText.style.opacity = 1;
            } else {
                console.error("Başlangıç içeriği ('home') pageContent objesinde bulunamadı veya eksik!");
                pageTitle.textContent = "Hoş Geldiniz";
                pageText.textContent = "İçerik yüklenirken bir sorun oluştu.";
            }
        } catch (error) { console.error("Başlangıç içeriği yüklenirken kritik hata:", error); }
     }

    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            if (!pageTitle || !pageText) { console.error("İçerik değiştirilemiyor: Başlık veya metin elementi bulunamadı!"); return; }
            const contentKey = this.dataset.content;
            const newContent = pageContent[contentKey];
            if (!newContent || this.classList.contains('active')) {
                if (!newContent) console.warn(`'${contentKey}' için içerik bulunamadı.`);
                return;
            }
            pageTitle.style.opacity = 0;
            pageText.style.opacity = 0;
            setTimeout(() => {
                pageTitle.textContent = newContent.title || "Başlık Yok";
                pageText.textContent = newContent.text || "Metin bulunamadı.";
                pageTitle.style.opacity = 1;
                pageText.style.opacity = 1;
                 if (contentElement) {
                    contentElement.scrollTop = 0;
                 }
            }, 400);
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    loadInitialContent();

    function triggerLightning() {
        const currentTitle = document.getElementById('page-title');
        const currentText = document.getElementById('page-text');
        const lightningOverlay = document.querySelector('.lightning');

        if (!lightningOverlay || !currentTitle || !currentText) return;

        lightningOverlay.classList.add('active');
        currentTitle.classList.add('text-shake');
        currentText.classList.add('text-shake');

        setTimeout(() => {
            lightningOverlay.classList.remove('active');
        }, 100); // Şimşek parlama süresi

        // Animasyon 4 kere (iteration-count: 4) 0.25s sürdüğü için toplam 1 saniye sürer.
        // 1 saniye + küçük bir tampon süre (100ms) sonra sınıfı kaldır.
        setTimeout(() => {
            if (currentTitle.classList.contains('text-shake')) {
                 currentTitle.classList.remove('text-shake');
            }
             if (currentText.classList.contains('text-shake')) {
                 currentText.classList.remove('text-shake');
            }
        }, 1100); // Toplam 1.1 saniye
    }

    setInterval(triggerLightning, 10000);

});
