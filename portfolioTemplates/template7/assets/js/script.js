document.addEventListener('DOMContentLoaded', () => {
    const mapAreas = document.querySelectorAll('.map-area');
    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoText = document.getElementById('info-text');
    const closeButton = document.getElementById('close-button');

    const areaData = {
        'area-1': {
            title: 'Tarihi Yarımada',
            text: 'İstanbul\'un kalbi olan Tarihi Yarımada, binlerce yıllık medeniyetlere ev sahipliği yapmış büyüleyici bir bölgedir. Bizans İmparatorluğu\'nun Konstantinopolis\'i ve Osmanlı İmparatorluğu nun İstanbul\'u olarak tarihin en önemli merkezlerinden biri olmuştur. Sultanahmet Meydanı etrafında kümelenen Ayasofya\'nın mimari dehası, Sultanahmet Camii\'nin zarif minareleri, Topkapı Sarayı\'nın görkemi ve Hipodrom\'un antik kalıntıları, ziyaretçileri adeta bir zaman yolculuğuna çıkarır. Burası, dar sokakları, tarihi hamamları, Kapalıçarşı\'nın hareketli atmosferi ve Mısır Çarşısı\'nın baharat kokularıyla yaşayan bir açık hava müzesi gibidir. UNESCO Dünya Mirası Listesi\'nde yer alan bu eşsiz bölge, her köşesinde farklı bir hikaye anlatır ve İstanbul\'un zengin kültürel mirasını gözler önüne serer. Tarihi Yarımada\'da gezinmek, farklı kültürlerin ve imparatorlukların izlerini bir arada sürmek demektir; şehrin ruhunu hissetmek için eşsiz bir fırsattır.'
        },
        'area-2': {
            title: 'Galata Kulesi',
            text: 'İstanbul\'un Beyoğlu yakasında, Haliç\'e hakim bir tepede konumlanan tarihi ve bohem bir semttir Galata. Semtin kalbinde, Cenevizlilerden miras kalan ve İstanbul\'un nefes kesen 360 derecelik manzarasını sunan ikonik Galata Kulesi yükselir. Kulenin etrafında dolanan dar, arnavut kaldırımlı sokaklar, tarihi taş binalar, bağımsız tasarımcı dükkanları, sanat atölyeleri ve şık kafelerle bezenmiştir. Galata, özellikle sanatçılar ve yaratıcı ruhlar için bir çekim merkezi olup, canlı ama aynı zamanda rahatlatıcı bir atmosfere sahiptir. Akşamları sokak müzisyenlerinin ezgileri ve küçük mekanlardan taşan sohbet sesleri bölgeye ayrı bir karakter katar. Galata Köprüsü üzerinden Tarihi Yarımada\'ya kolayca bağlanan bu semt, tarih, sanat ve modern kent yaşamının büyüleyici bir karışımını sunarak ziyaretçilerine unutulmaz anlar yaşatır. Burası, İstanbul\'un dinamizmini farklı bir perspektiften deneyimlemek için idealdir.'

        },
        'area-3': {
            title: 'Eminönü',
            text: 'İstanbul\'un en ikonik ve canlı semtlerinden biri olan Eminönü, Tarihi Yarımada\'nın Haliç kıyısında yer alır. Asırlardır ticaretin ve ulaşımın merkezi olmuş bu bölge, günün her saati bitmek bilmeyen bir enerjiye sahiptir. Tarihi Mısır Çarşısı\'nın baharat ve lokum kokuları, Yeni Cami\'nin heybetli silüeti ve Galata Köprüsü\'ne uzanan kalabalık meydanıyla ziyaretçilerini karşılar. Vapur iskeleleri, şehrin farklı yakalarına uzanan bir köprü görevi görürken, balık ekmek tekneleri Haliç\'in kendine özgü lezzetini sunar. Dar ara sokaklarında kaybolup asırlık hanları keşfetmek, Kapalıçarşı\'ya doğru yürümek veya sadece meydanda oturup insan selini izlemek bile başlı başına bir deneyimdir. Eminönü, İstanbul\'un ticari ruhunu, tarihi dokusunu ve gündelik yaşamının koşuşturmasını bir arada sunan, şehrin atan kalbi gibidir. Burası, İstanbul\'u gerçekten hissetmek isteyenler için vazgeçilmez bir duraktır.'
        },
        'area-4': {
            title: 'Üsküdar',
            text: 'İstanbul\'un Anadolu yakasının en eski ve köklü semtlerinden biri olan Üsküdar, Boğaz\'ın Avrupa yakasına bakan sakin ve tarihi bir limanıdır. Kız Kulesi\'nin zarif silüetine ev sahipliği yapan bu semt, asırlar boyunca önemli bir yerleşim ve geçiş noktası olmuştur. Mimar Sinan\'ın eseri olan Mihrimah Sultan ve Şemsi Paşa (Kuşkonmaz) Camii gibi tarihi yapılar, semtin zengin geçmişini yansıtır. Sahil boyunca uzanan yürüyüş yolu, boğazın eşsiz manzarasını sunarken, Fethi Paşa Korusu gibi yeşil alanlar şehrin karmaşasından kaçış imkanı sağlar. Geleneksel çarşısı, tarihi hamamları ve sakin atmosferiyle Üsküdar, İstanbul\'un daha dingin ve otantik yüzünü temsil eder. Vapur iskeleleri sayesinde şehrin diğer bölgelerine kolay ulaşım sağlayan semt, tarih, doğa ve huzuru bir arada arayanlar için eşsiz bir deneyim sunar.'
        },
        'area-5': {
            title: '15 Temmuz Şehitler Köprüsü',
            text: 'Eski adıyla Boğaziçi Köprüsü olan 15 Temmuz Şehitler Köprüsü, İstanbul Boğazı üzerinde Asya ve Avrupa kıtalarını birbirine bağlayan ilk asma köprüdür. 1973 yılında hizmete açıldığından beri şehrin en önemli simgelerinden biri ve silüetinin ayrılmaz bir parçası olmuştur. Sadece İstanbul için değil, Türkiye için de stratejik bir ulaşım arteridir ve her gün yüz binlerce araca ev sahipliği yapar. 2016 yılındaki hain darbe girişimi sırasında, köprüyü kapatmaya çalışan darbecilere karşı direnen ve hayatını kaybeden sivil kahramanların anısına ismi 15 Temmuz Şehitler Köprüsü olarak değiştirilmiştir. Bu olay, köprünün sadece fiziksel bir bağlantı noktası değil, aynı zamanda milli iradenin ve demokrasinin savunulduğu sembolik bir mekan olmasına neden olmuştur. Geceleri ışıklandırmasıyla büyüleyici bir manzara sunan köprü, iki kıtayı birleştirmenin ötesinde, tarihi bir direnişin de şahididir.'
        },
        'area-6': {
            title: 'Taksim',
            text: 'İstanbul\'un Beyoğlu ilçesinde yer alan Taksim, şehrin en ünlü meydanı ve modern yüzünün merkezidir. Cumhuriyet Anıtı\'nın bulunduğu geniş meydan, hem yerel halk hem de turistler için popüler bir buluşma noktası ve çeşitli etkinliklere ev sahipliği yapan canlı bir alandır. Taksim Meydanı\'ndan başlayıp Tünel\'e kadar uzanan, trafiğe kapalı İstiklal Caddesi, tarihi binaları, nostaljik tramvayı, mağazaları, sinemaları, sanat galerileri, kafe ve restoranlarıyla şehrin kültürel ve sosyal yaşamının nabzını tutar. Önemli bir ulaşım merkezi olan Taksim, metro, otobüs ve dolmuş hatlarıyla İstanbul\'un dört bir yanına kolay erişim sağlar. Gündüzleri alışveriş ve kültür turları, geceleri ise hareketli eğlence hayatıyla Taksim, 7/24 yaşayan, dinamik ve kozmopolit bir atmosfere sahip, İstanbul\'un enerjisini en yoğun hissedebileceğiniz yerlerden biridir.'
        }
    };

    mapAreas.forEach(area => {
        area.addEventListener('click', () => {
            const areaId = area.id;
            if (areaData[areaId]) {
                infoTitle.textContent = areaData[areaId].title;
                infoText.textContent = areaData[areaId].text;
                infoBox.classList.add('visible');
            }
        });
    });

    closeButton.addEventListener('click', () => {
        infoBox.classList.remove('visible');
    });

    infoBox.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
        if (infoBox.classList.contains('visible') && !infoBox.contains(event.target)) {
           let isMapArea = false;
           mapAreas.forEach(area => {
               if (area.contains(event.target)) {
                   isMapArea = true;
               }
           });
           if (!isMapArea) {
                infoBox.classList.remove('visible');
           }
        }
    });
});