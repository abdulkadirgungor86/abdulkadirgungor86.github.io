document.addEventListener('DOMContentLoaded', () => {
    const rainContainer = document.querySelector('.rain'); // Yağmur alanı
    const wave = document.querySelector('.wave'); // Su alanı
    const links = document.querySelectorAll('.footer-links a'); // Menü bağlantıları
    const bubbleTitle = document.querySelector('.bubble-title'); // Dinamik başlık
    const bubbleText = document.querySelector('.bubble'); // Dinamik metin

    // Menü bağlantılarına tıklandığında başlık ve metin güncellemesi
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Sayfa yenilemeyi engeller
            const newTitle = link.getAttribute('data-title'); // Yeni başlığı al
            const newContent = link.getAttribute('data-content'); // Yeni içeriği al
            
            if (newTitle) {
                bubbleTitle.textContent = newTitle; // Başlık güncellemesi
            }
            if (newContent) {
                bubbleText.textContent = newContent; // Metin güncellemesi
            }
        });
    });

    // Yağmur damlalarını oluştur
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.classList.add('drop'); // Damla sınıfı ekle
        drop.style.left = `${Math.random() * 100}%`; // Rastgele pozisyon
        drop.style.animationDuration = `${Math.random() * 2 + 1}s`; // Rastgele hız
        drop.style.animationDelay = `${Math.random() * 2}s`; // Rastgele başlangıç

        // Damla suya ulaştığında hareketi tetikle
        drop.addEventListener('animationend', () => {
            wave.style.animation = 'waveSplash 0.5s ease-in-out'; // Sıçrama animasyonu başlat
            setTimeout(() => {
                wave.style.animation = 'waveIdle 4s infinite ease-in-out'; // Dalga normal hareketine geri döner
            }, 500); // Sıçrama efekti sonrası bekleme
        });

        rainContainer.appendChild(drop); // Damlayı yağmur alanına ekle
    }
});

