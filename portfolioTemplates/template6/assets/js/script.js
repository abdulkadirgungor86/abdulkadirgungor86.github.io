document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('circle-container');
    const svg = document.getElementById('lines-svg');
    const modal = document.getElementById('content-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeButton = document.querySelector('.close-button');
    const circleElements = document.querySelectorAll('.circle');
    const circlesData = [];
    const lines = []; // Çizgi elementlerini ve bağlantılarını tutmak için

    // Sürükleme değişkenleri
    let isDragging = false;
    let draggedCircleData = null;
    let offsetX = 0;
    let offsetY = 0;

    const contentData = {
        'daire1': { title: 'Html', text: 'HTML (HyperText Markup Language), web sayfalarının iskeletini oluşturan standart işaretleme dilidir. Tarayıcılara metin, görsel ve bağlantı gibi içeriklerin nasıl yapılandırılacağını ve gösterileceğini söyler. Başlıklar, paragraflar ve listeler gibi elemanları tanımlamak için etiketler kullanır. Web in temel taşıdır.' }, // Metinler önceki gibi uzun
        'daire2': { title: 'CSS', text: 'CSS (Cascading Style Sheets), HTML ile yapısı oluşturulan web sayfalarının görsel sunumunu kontrol eden bir stil dilidir. Renkler, yazı tipleri, kenar boşlukları, arka planlar ve sayfa düzeni gibi estetik öğeleri tanımlar. CSS, web sitelerine tutarlı ve çekici bir görünüm kazandırmanın anahtarıdır.' },
        'daire3': { title: 'JavaScript', text: 'JavaScript, web sayfalarını etkileşimli kılarken CSS stillerini de dinamik olarak yönetebilir. Kullanıcı eylemlerine yanıt olarak HTML elementlerinin CSS sınıflarını ekleyip çıkarabilir veya doğrudan style özelliklerini değiştirerek sayfanın görünümünü anında güncelleyebilir. Bu, interaktif ve görsel olarak tepki veren arayüzler oluşturmayı sağlar.' },
        'daire4': { title: 'C#', text: 'C# (C Sharp), Microsoft tarafından .NET platformu için geliştirilmiş modern, nesne yönelimli bir programlama dilidir. Windows uygulamaları, web servisleri (ASP.NET) ve özellikle Unity ile oyun geliştirme gibi alanlarda yaygın olarak kullanılır. Güçlü ve çok yönlü yapısıyla öne çıkar.' },
        'daire5': { title: 'Python', text: 'Python, basit ve okunabilir söz dizimiyle bilinen, yüksek seviyeli, çok yönlü bir programlama dilidir. Öğrenmesi kolaydır ve web geliştirme, veri bilimi, yapay zeka ve otomasyon gibi birçok alanda yaygın olarak kullanılır. Geniş kütüphane desteğiyle güçlü projeler geliştirmeye olanak tanır.' }
    };
    // Metinlerin tam halini önceki yanıttan kopyalayıp yapıştırın.


    function initializeCircles() {
        const containerRect = container.getBoundingClientRect();

        circleElements.forEach(el => {
            const id = el.getAttribute('data-id');
            const titleSpan = el.querySelector('.circle-title');
            const data = contentData[id];
            const size = el.offsetWidth; // Dairenin gerçek genişliği (CSS'ten)
            const radius = size / 2;

             // Rastgele konum ata (piksel cinsinden, kenarlardan biraz boşluk bırakarak)
             const maxX = containerRect.width - size;
             const maxY = containerRect.height - size;
             const randomX = Math.random() * maxX;
             const randomY = Math.random() * maxY;

             el.style.left = `${randomX}px`;
             el.style.top = `${randomY}px`;


            if (data && titleSpan) {
                titleSpan.textContent = data.title;
            }

            const circleInfo = {
                element: el,
                id: id,
                x: randomX,
                y: randomY,
                size: size,
                radius: radius
            };
            circlesData.push(circleInfo);

            // Modal açma olayı (sürükleme değilse)
            let clickTimeout = null;
            el.addEventListener('mousedown', (e) => {
                 // Sadece sol tıklama ile sürükleme başlasın
                 if (e.button !== 0) return;

                 isDragging = true;
                 draggedCircleData = circleInfo;
                 // Mouse pozisyonunu konteynere göre al
                 const mouseX = e.clientX - containerRect.left;
                 const mouseY = e.clientY - containerRect.top;
                 // Tıklama noktası ile dairenin sol üst köşesi arasındaki fark
                 offsetX = mouseX - draggedCircleData.x;
                 offsetY = mouseY - draggedCircleData.y;
                 el.classList.add('dragging');

                 // Kısa tıklamada modal açılmasını engellemek için timeout başlat
                 clickTimeout = setTimeout(() => {
                    clickTimeout = null; // Sürükleme başladıysa timeout'u temizle
                 }, 200); // 200ms içinde mouseup olmazsa sürükleme varsay

                 e.preventDefault(); // Tarayıcının varsayılan sürükleme davranışını engelle
            });

             el.addEventListener('mouseup', (e) => {
                 if (e.button !== 0) return;
                 // Eğer kısa süre içinde mouseup olduysa (sürükleme başlamadıysa) ve modal verisi varsa
                 if (clickTimeout && data) {
                     clearTimeout(clickTimeout);
                     clickTimeout = null;
                     // Modal aç
                     modalTitle.textContent = data.title + " Hakkında";
                     modalText.textContent = data.text;
                     modal.style.display = 'flex';
                 }
             });


        });
        createLines(); // Çizgileri ilk defa oluştur
    }

     function handleMouseMove(e) {
         if (!isDragging || !draggedCircleData) return;

         // Mouse pozisyonunu konteynere göre al
         const containerRect = container.getBoundingClientRect();
         const mouseX = e.clientX - containerRect.left;
         const mouseY = e.clientY - containerRect.top;

         // Yeni daire konumunu hesapla (mouse pozisyonu - ofset)
         let newX = mouseX - offsetX;
         let newY = mouseY - offsetY;

         // Dairenin konteyner sınırları içinde kalmasını sağla
         const maxX = containerRect.width - draggedCircleData.size;
         const maxY = containerRect.height - draggedCircleData.size;
         newX = Math.max(0, Math.min(newX, maxX));
         newY = Math.max(0, Math.min(newY, maxY));

         // Daire verisini ve stilini güncelle
         draggedCircleData.x = newX;
         draggedCircleData.y = newY;
         draggedCircleData.element.style.left = `${newX}px`;
         draggedCircleData.element.style.top = `${newY}px`;

         // Çizgileri anlık olarak güncelle
         updateLines();

         // Sürükleme devam ederken click timeout'unu iptal et
         if (clickTimeout) {
             clearTimeout(clickTimeout);
             clickTimeout = null;
         }
     }

     function handleMouseUp(e) {
         if (e.button !== 0) return; // Sadece sol tıklama bırakıldığında
         if (isDragging) {
             draggedCircleData.element.classList.remove('dragging');
             isDragging = false;
             draggedCircleData = null;
         }
     }

    function getCircleCenter(circleData) {
        // Saklanan x, y değerlerini kullan
        const x = circleData.x + circleData.radius;
        const y = circleData.y + circleData.radius;
        return { x, y };
    }

    function createLines() {
        svg.innerHTML = '';
        lines.length = 0; // lines dizisini temizle

        if (circlesData.length < 2) return;

        for (let i = 0; i < circlesData.length; i++) {
            const nextIndex = (i + 1) % circlesData.length;
            const startCircle = circlesData[i];
            const endCircle = circlesData[nextIndex];
            const startCenter = getCircleCenter(startCircle);
            const endCenter = getCircleCenter(endCircle);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startCenter.x);
            line.setAttribute('y1', startCenter.y);
            line.setAttribute('x2', endCenter.x);
            line.setAttribute('y2', endCenter.y);
            svg.appendChild(line);
            // Çizgi elementini ve bağlı daire indekslerini sakla
            lines.push({ lineElement: line, startIndex: i, endIndex: nextIndex });
        }
        // İsteğe bağlı tüm çiftleri bağlama kodu buraya eklenebilir.
    }

     function updateLines() {
         lines.forEach(lineInfo => {
             const startCircle = circlesData[lineInfo.startIndex];
             const endCircle = circlesData[lineInfo.endIndex];
             const startCenter = getCircleCenter(startCircle);
             const endCenter = getCircleCenter(endCircle);

             lineInfo.lineElement.setAttribute('x1', startCenter.x);
             lineInfo.lineElement.setAttribute('y1', startCenter.y);
             lineInfo.lineElement.setAttribute('x2', endCenter.x);
             lineInfo.lineElement.setAttribute('y2', endCenter.y);
         });
     }

    // Modal kapatma işlevleri
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Genel olay dinleyicileri (sürükleme için document üzerinde)
     document.addEventListener('mousemove', handleMouseMove);
     document.addEventListener('mouseup', handleMouseUp);


    // Başlatma
    initializeCircles(); // Daireleri rastgele konumlandır ve olayları ekle

    // Pencere yeniden boyutlandırıldığında
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
             // Konteyner boyutlarını al
            const containerRect = container.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const containerHeight = containerRect.height;

             // Dairelerin boyutunu ve yarıçapını güncelle
            circlesData.forEach(circle => {
                 circle.size = circle.element.offsetWidth;
                 circle.radius = circle.size / 2;
                 // Dairenin yeni sınırlar içinde kalmasını sağla
                 const maxX = containerWidth - circle.size;
                 const maxY = containerHeight - circle.size;
                 circle.x = Math.max(0, Math.min(circle.x, maxX));
                 circle.y = Math.max(0, Math.min(circle.y, maxY));
                 circle.element.style.left = `${circle.x}px`;
                 circle.element.style.top = `${circle.y}px`;
            });

            updateLines(); // Çizgileri yeni konumlara göre güncelle
        }, 100);
    });

});