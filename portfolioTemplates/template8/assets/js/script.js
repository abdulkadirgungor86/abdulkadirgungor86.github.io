document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#BA55D3', '#00CED1', '#FFA07A', '#98FB98', '#DDA0DD'];
    const maxBalloons = 15;
    let activeBalloons = 0;
    let balloonInterval;

    const menuLinks = document.querySelectorAll('#main-menu a');
    const contentTitle = document.getElementById('content-title');
    const contentText = document.getElementById('content-text');

    const contentData = {
        anasayfa: {
            title: "Hoş Geldiniz!",
            text: "Bu sayfada renkli balonların gökyüzünde süzülüşünü izleyebilir ve fare imlecinizle onları patlatabilirsiniz. Balonlar neşeyi, hafifliği ve uçup giden anları temsil eder. Aşağıdan yukarıya doğru yükselirken onlara eşlik edin. Menüyü kullanarak  gökyüzü hakkında metini okuyabilirsiniz. Her bir dokunuşta farklı deneyimler keşfedin. Bu interaktif deneyim, hem görsel bir şölen sunar hem de sizi farklı düşüncelere sevk edebilir. Şimdi arkanıza yaslanın, rahatlayın ve balonların dansına katılın. Unutmayın, bazen en basit şeyler en büyük mutluluğu getirebilir. İyi eğlenceler dileriz! Umarız bu küçük kaçamak size keyif verir ve gününüze renk katar. Haydi, ilk balonu patlatarak başlayın!"
        },
        gokyuzu: {
            title: "Sonsuz Mavilik: Gökyüzü",
            text: "Başımızı kaldırdığımızda bizi karşılayan o sonsuz mavilik, gökyüzü... Gündüz güneşin parlaklığıyla aydınlanan, gece yıldızların pırıltısıyla süslenen bu devasa boşluk, her zaman ilham kaynağı olmuştur. Bulutların sürekli değişen şekilleri, pamuk tarlalarını andıran beyazlıkları veya fırtına habercisi koyu grilikleri, gökyüzünün dinamik doğasını gösterir. Gün batımı ve gün doğumu saatlerinde ise adeta bir renk cümbüşü yaşanır; turuncular, pembeler, morlar birbirine karışarak unutulmaz manzaralar yaratır. Kuşların özgürce kanat çırptığı, uçakların iz bıraktığı, balonların süzüldüğü bu alan, yeryüzündeki yaşamın atmosferle buluştuğu yerdir. Gökyüzüne bakmak, bazen dertleri unutmak, bazen hayallere dalmak, bazen de evrenin büyüklüğü karşısında küçüklüğümüzü hissetmek demektir. O, hem sakinleştirici hem de düşündürücüdür."
        },
        hakkinda: {
            title: "Hakkında",
            text: "Ben bir yaratıcı, bir inşa eden ve bir yenilikçiyim. Bir geliştirici olarak yolculuğum, fikirleri etkileyici dijital deneyimlere dönüştürme tutkusuyla şekilleniyor. Kodlama benim için sadece bir yetenek değil; hayalleri gerçeğe dönüştüren, görünmezi görünür kılan bir ifade biçimi.  Her projem, yaratıcılığı, hassasiyeti ve amacı birleştiren bir çalışma. Duyarlı tasarımlardan, cihazlara uygun arayüzlere kadar estetik ve işlevselliği bir arada sunmaya olan bağlılığımı yansıtıyor. Animasyonlar sayesinde arayüzlere hayat katarken, kullanıcı ihtiyaçlarına tam anlamıyla hitap eden çözümler tasarlıyorum.  Felsefemin merkezinde insanlar var. İhtiyaçlarını anlamak, deneyimlerini geliştirmek ve teknoloji ile insan arasında köprüler kurmak. Tasarımın, ilham veren, problemleri çözen ve hikaye anlatan gücüne inanıyorum. Birlikte, kalıcı bir iz bırakan dijital dünyayı keşfedelim ve bir kod satırıyla hayallerimizi gerçeğe dönüştürelim."
        },
        iletisim: {
            title: "İletişim",
            text: "Bana ulaşmak isterseniz, aşağıdaki email üzerinden kullanabilirsiniz. Her türlü soru, iş birliği veya proje fikri için benimle iletişime geçmekten çekinmeyin. İşinizi bir adım öteye taşıyacak yenilikçi çözümler ve yaratıcı fikirler üretmek için sabırsızlanıyorum. Email:abdulkadirgungor.86@outlook.com"
        }
    };

    function createBalloon() {
        if (!gameArea || activeBalloons >= maxBalloons) {
            return;
        }
        activeBalloons++;

        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.backgroundColor = randomColor;
        balloon.style.borderColor = randomColor;

        const randomLeft = Math.random() * 95;
        balloon.style.left = `${randomLeft}vw`;

        const randomDuration = Math.random() * 7 + 6;
        balloon.style.animationDuration = `${randomDuration}s`;

        const randomDrift = (Math.random() - 0.5) * 15;
        balloon.style.setProperty('--drift', randomDrift);


        balloon.addEventListener('mouseover', popBalloon);
        balloon.addEventListener('animationend', removeBalloon);

        gameArea.appendChild(balloon);
    }

     function popBalloon(event) {
        const balloon = event.target;
        if(!balloon || !balloon.parentNode) return;

        balloon.removeEventListener('mouseover', popBalloon);
        balloon.removeEventListener('animationend', removeBalloon);

        balloon.classList.add('pop');

        balloon.addEventListener('animationend', () => {
             if (balloon.parentNode) {
                balloon.remove();
                activeBalloons--;
             }
        }, { once: true });
    }

    function removeBalloon(event) {
        const balloon = event.target;
         if (balloon && balloon.parentNode && !balloon.classList.contains('pop')) {
            balloon.remove();
            activeBalloons--;
        }
    }

    function updateContent(key) {
        const data = contentData[key];
        if (data && contentTitle && contentText) {
            contentTitle.textContent = data.title;
            contentText.textContent = data.text;
        }

        menuLinks.forEach(link => {
            if (link.dataset.contentKey === key) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const key = event.target.dataset.contentKey;
            updateContent(key);
        });
    });

    updateContent('anasayfa');
    balloonInterval = setInterval(createBalloon, 1000);

});