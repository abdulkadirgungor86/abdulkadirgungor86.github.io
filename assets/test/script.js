document.addEventListener('DOMContentLoaded', function() {
    const rainContainer = document.querySelector('.rain');
    const pageTitle = document.getElementById('page-title');
    const pageText = document.getElementById('page-text');
    const menuLinks = document.querySelectorAll('.menu a[data-content]');
    const contentElement = document.querySelector('.content');

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
            title: "Gün Batımında Huzurlu Kıyı",
            text: "Güneş, gökyüzünü sıcak turuncu, pembe ve mor tonlarına boyayarak ufuk çizgisinin ardına doğru yavaşça süzülüyor. Bu muhteşem renk cümbüşü, sakin denizin yüzeyinde dans eden altın pırıltılarıyla birleşiyor. Dalgalar, kıyıya nazikçe vururken çıkardıkları ritmik ses, adeta bir ninni gibi ruhu okşuyor. Hafifçe çiseleyen yağmur, bu büyülü atmosfere eşlik ediyor; her damla, cama bıraktığı izle ve toprağa düşerken yaydığı taze kokuyla anın dinginliğini pekiştiriyor. Bu manzara, doğanın en saf ve etkileyici anlarından birini sunuyor; telaşlı dünyanın gürültüsünden uzak, sadece denizin fısıltısı, yağmurun şarkısı ve batan güneşin vedası var. Burada zaman yavaşlıyor, düşünceler berraklaşıyor ve içsel bir huzur tüm benliği sarıyor. Gökyüzündeki pamuksu bulutlar, pastel renklerle bezenmiş bir tabloyu andırıyor ve hafif rüzgarla yavaşça süzülerek manzaraya derinlik katıyor. Bu an, hem bir sonun melankolisini hem de yeni bir başlangıcın umudunu taşıyor içinde. Gözlerinizi kapatıp bu anı hayal ettiğinizde bile, tuzlu deniz havasını ve ıslak toprağın kokusunu hissedebilir, dalgaların ve yağmurun sesini duyabilirsiniz. Bu dijital kıyı, size gerçek bir deniz kenarının sunabileceği o eşsiz sükuneti ve yenilenme hissini yaşatmak için tasarlandı. Kendinize bir iyilik yapın, durun, nefes alın ve bu anın tadını çıkarın. Bırakın gün batımının renkleri ruhunuzu ısıtsın, dalgaların sesi sizi rahatlatsın ve yağmurun bereketi sizi taze hissettirsin. Bu kıyı sizin sığınağınız, dijital dünyadaki huzur vahanız."
        },
        about: {
            title: "Dijital Tuvalde Bir An",
            text: "Bu web sayfası, modern teknolojinin sunduğu imkanlarla doğanın büyüleyici güzelliğini bir araya getirme arzusundan doğdu. Amacımız, sadece kod satırlarından ve piksellerden oluşan bir ekrana bakarken bile, gerçek bir deniz kenarında gün batımını izliyormuş hissini uyandırabilmekti. Hareketli bulutlar, sürekli dalgalanan deniz, cama vuran yağmur damlaları ve içeriğin bu atmosferle bütünleşmesi… Hepsi, bu dijital deneyimi olabildiğince canlı ve etkileyici kılmak için özenle tasarlandı. Arka plandaki gradyan renk geçişi, gün batımının o anlık ve geçici güzelliğini yakalamayı hedeflerken, mavi ve kırmızının tonları hem sakinliği hem de tutkuyu simgeliyor. Responsive tasarım ilkesi sayesinde, bu manzaranın keyfini ister geniş bir masaüstü ekranda ister avucunuzdaki mobil cihazda çıkarabilirsiniz; deneyimin her platformda tutarlı ve etkileyici olması bizim için önemliydi. İçeriklerin iki yana yaslı olması ve ekran boyutuna göre akıllıca ayarlanması, okunabilirliği artırırken modern bir estetik sunuyor. Menüdeki dinamik içerik değişimi, sayfa yenilemeye gerek kalmadan farklı anlatılara pürüzsüz bir geçiş sağlıyor. Bu proje, sadece bir web sitesi değil, aynı zamanda bir sanat eseri, bir meditasyon aracı ve yoğun hayat temposunda küçük bir kaçış noktası olarak düşünüldü. Teknolojinin soğuk yüzünü, doğanın sıcaklığıyla ısıtmayı hedefledik. Umarız bu dijital kıyıda geçirdiğiniz zaman, size ilham verir, sizi rahatlatır ve günün stresinden bir nebze olsun uzaklaştırır. Belki de bir sonraki gerçek deniz kenarı ziyaretiniz için size bir özlem veya motivasyon kaynağı olur. Bu platform sürekli gelişmeye açık; belki ileride farklı hava koşulları, gece manzarası veya interaktif öğeler de eklenebilir. Geri bildirimleriniz bu yolculukta bize ışık tutacaktır."
        },
        projects: {
            title: "Projelerden Kesitler",
            text: "Bu bölüm, hayata geçirilmiş veya üzerinde çalışılan dijital projeleri sergilemek için bir alan sunuyor. Tıpkı gün batımı gibi, her projenin kendine özgü bir hikayesi, renk paleti ve atmosferi vardır. Burada, farklı teknolojiler kullanılarak oluşturulmuş web uygulamaları, interaktif deneyimler veya görsel tasarımlar bulabilirsiniz. Her bir proje, belirli bir problemi çözme, bir fikri hayata geçirme veya sadece estetik bir ifade sunma amacı taşır. Örneğin, şu an içinde bulunduğunuz bu 'Yağmurlu Deniz Kenarı' sayfası da bir projedir; HTML, CSS ve JavaScript'in doğanın güzelliğini taklit etmek için nasıl kullanılabileceğine dair bir denemedir. Diğer projeler arasında, belki kullanıcıların etkileşimde bulunabileceği veri görselleştirmeleri, basit ama eğlenceli oyunlar veya belirli bir amaca hizmet eden kullanışlı web araçları yer alabilir. Bu galeri, zamanla yeni projeler eklendikçe genişleyecektir. Her projenin altında kullanılan teknolojiler, karşılaşılan zorluklar ve öğrenilen dersler hakkında kısa bilgiler de bulunabilir. Amaç, sadece bitmiş ürünü değil, aynı zamanda yaratım sürecinin kendisini de paylaşmaktır. Tıpkı dalgaların sürekli değişen formu gibi, projeler de sürekli gelişim ve iyileştirme potansiyeline sahiptir. Burası, dijital yaratıcılığın farklı yönlerini keşfetmek ve belki de kendi projeleriniz için ilham almak üzere ziyaret edebileceğiniz bir köşe olmayı hedefler."
        },
        contact: {
            title: "Kıyıdan Seslenin",
            text: "Bu dijital deniz kenarında, dalgaların ve yağmurun sesine kulak verirken aklınızdan geçenleri, hissettiklerinizi bizimle paylaşmak ister misiniz? Belki bu atmosfer size ilham verdi, belki bir anınızı hatırlattı, belki de sadece birkaç satırla selam vermek istediniz. İletişim sayfamız, sizinle aramızdaki köprüyü kurmak için burada. Geri bildirimleriniz, bu projenin gelişiminde bizim için çok değerli. Sayfayla ilgili teknik bir sorun mu fark ettiniz? Ya da eklenmesini istediğiniz bir özellik mi var? Belki de sadece bu deneyimi beğendiğinizi veya beğenmediğinizi, nedenleriyle birlikte belirtmek istersiniz. Her türlü yapıcı eleştiriye, öneriye ve düşünceye açığız. Amacımız, bu dijital sığınağı olabildiğince çok insan için anlamlı ve keyifli bir hale getirmek. Gelecekte buraya interaktif bir iletişim formu eklemeyi planlıyoruz, ancak o zamana kadar düşüncelerinizi zihninizde bizimle paylaştığınızı bilmek bile güzel. Bu sayfa, tek yönlü bir sunumdan ziyade, bir etkileşim alanı olmayı hedefliyor. Belki de ileride, ziyaretçilerin kendi kısa metinlerini veya duygularını anonim olarak paylaşabilecekleri bir bölüm oluşturabiliriz. Böylece bu kıyı, sadece bizim değil, hepimizin ortak bir ifadesine dönüşebilir. Teknolojinin bizi bir araya getirme gücünü, doğanın birleştirici ve sakinleştirici etkisiyle buluşturmak istiyoruz. Lütfen unutmayın, her bir ziyaretçi, bu dijital manzaranın bir parçasıdır. Varlığınız ve potansiyel geri bildirimleriniz, burayı daha canlı ve dinamik kılıyor. Şimdilik, bu satırlar aracılığıyla size ulaşıyor ve düşüncelerinizi duymayı umuyoruz. Bu kıyıdan tüm ziyaretçilere selamlar ve içten teşekkürler..."
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
});