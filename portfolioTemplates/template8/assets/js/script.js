document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("game-area"),a=["#FF6347","#4682B4","#32CD32","#FFD700","#BA55D3","#00CED1","#FFA07A","#98FB98","#DDA0DD"],i=0,n,r=document.querySelectorAll("#main-menu a"),l=document.getElementById("content-title"),t=document.getElementById("content-text"),d={anasayfa:{title:"Hoş Geldiniz!",text:"Bu sayfada renkli balonların g\xf6ky\xfcz\xfcnde s\xfcz\xfcl\xfcş\xfcn\xfc izleyebilir ve fare imlecinizle onları patlatabilirsiniz. Balonlar neşeyi, hafifliği ve u\xe7up giden anları temsil eder. Aşağıdan yukarıya doğru y\xfckselirken onlara eşlik edin. Men\xfcy\xfc kullanarak  g\xf6ky\xfcz\xfc hakkında metini okuyabilirsiniz. Her bir dokunuşta farklı deneyimler keşfedin. Bu interaktif deneyim, hem g\xf6rsel bir ş\xf6len sunar hem de sizi farklı d\xfcş\xfcncelere sevk edebilir. Şimdi arkanıza yaslanın, rahatlayın ve balonların dansına katılın. Unutmayın, bazen en basit şeyler en b\xfcy\xfck mutluluğu getirebilir. İyi eğlenceler dileriz! Umarız bu k\xfc\xe7\xfck ka\xe7amak size keyif verir ve g\xfcn\xfcn\xfcze renk katar. Haydi, ilk balonu patlatarak başlayın!"},gokyuzu:{title:"Sonsuz Mavilik: G\xf6ky\xfcz\xfc",text:"Başımızı kaldırdığımızda bizi karşılayan o sonsuz mavilik, g\xf6ky\xfcz\xfc... G\xfcnd\xfcz g\xfcneşin parlaklığıyla aydınlanan, gece yıldızların pırıltısıyla s\xfcslenen bu devasa boşluk, her zaman ilham kaynağı olmuştur. Bulutların s\xfcrekli değişen şekilleri, pamuk tarlalarını andıran beyazlıkları veya fırtına habercisi koyu grilikleri, g\xf6ky\xfcz\xfcn\xfcn dinamik doğasını g\xf6sterir. G\xfcn batımı ve g\xfcn doğumu saatlerinde ise adeta bir renk c\xfcmb\xfcş\xfc yaşanır; turuncular, pembeler, morlar birbirine karışarak unutulmaz manzaralar yaratır. Kuşların \xf6zg\xfcrce kanat \xe7ırptığı, u\xe7akların iz bıraktığı, balonların s\xfcz\xfcld\xfcğ\xfc bu alan, yery\xfcz\xfcndeki yaşamın atmosferle buluştuğu yerdir. G\xf6ky\xfcz\xfcne bakmak, bazen dertleri unutmak, bazen hayallere dalmak, bazen de evrenin b\xfcy\xfckl\xfcğ\xfc karşısında k\xfc\xe7\xfckl\xfcğ\xfcm\xfcz\xfc hissetmek demektir. O, hem sakinleştirici hem de d\xfcş\xfcnd\xfcr\xfcc\xfcd\xfcr."},hakkinda:{title:"Hakkında",text:"Ben bir yaratıcı, bir inşa eden ve bir yenilik\xe7iyim. Bir geliştirici olarak yolculuğum, fikirleri etkileyici dijital deneyimlere d\xf6n\xfcşt\xfcrme tutkusuyla şekilleniyor. Kodlama benim i\xe7in sadece bir yetenek değil; hayalleri ger\xe7eğe d\xf6n\xfcşt\xfcren, g\xf6r\xfcnmezi g\xf6r\xfcn\xfcr kılan bir ifade bi\xe7imi.  Her projem, yaratıcılığı, hassasiyeti ve amacı birleştiren bir \xe7alışma. Duyarlı tasarımlardan, cihazlara uygun aray\xfczlere kadar estetik ve işlevselliği bir arada sunmaya olan bağlılığımı yansıtıyor. Animasyonlar sayesinde aray\xfczlere hayat katarken, kullanıcı ihtiya\xe7larına tam anlamıyla hitap eden \xe7\xf6z\xfcmler tasarlıyorum.  Felsefemin merkezinde insanlar var. İhtiya\xe7larını anlamak, deneyimlerini geliştirmek ve teknoloji ile insan arasında k\xf6pr\xfcler kurmak. Tasarımın, ilham veren, problemleri \xe7\xf6zen ve hikaye anlatan g\xfcc\xfcne inanıyorum. Birlikte, kalıcı bir iz bırakan dijital d\xfcnyayı keşfedelim ve bir kod satırıyla hayallerimizi ger\xe7eğe d\xf6n\xfcşt\xfcrelim."},iletisim:{title:"İletişim",text:"Bana ulaşmak isterseniz, aşağıdaki email \xfczerinden kullanabilirsiniz. Her t\xfcrl\xfc soru, iş birliği veya proje fikri i\xe7in benimle iletişime ge\xe7mekten \xe7ekinmeyin. İşinizi bir adım \xf6teye taşıyacak yenilik\xe7i \xe7\xf6z\xfcmler ve yaratıcı fikirler \xfcretmek i\xe7in sabırsızlanıyorum. Email:abdulkadirgungor.86@outlook.com"}};function k(){if(!e||i>=15)return;i++;let n=document.createElement("div");n.classList.add("balloon");let r=a[Math.floor(Math.random()*a.length)];n.style.backgroundColor=r,n.style.borderColor=r,n.style.left=`${95*Math.random()}vw`,n.style.animationDuration=`${7*Math.random()+6}s`,n.style.setProperty("--drift",(Math.random()-.5)*15),n.addEventListener("mouseover",m),n.addEventListener("animationend",y),e.appendChild(n)}function m(e){let a=e.target;a&&a.parentNode&&(a.removeEventListener("mouseover",m),a.removeEventListener("animationend",y),a.classList.add("pop"),a.addEventListener("animationend",()=>{a.parentNode&&(a.remove(),i--)},{once:!0}))}function y(e){let a=e.target;a&&a.parentNode&&!a.classList.contains("pop")&&(a.remove(),i--)}function s(e){let a=d[e];a&&l&&t&&(l.textContent=a.title,t.textContent=a.text),r.forEach(a=>{a.dataset.contentKey===e?a.classList.add("active"):a.classList.remove("active")})}r.forEach(e=>{e.addEventListener("click",e=>{e.preventDefault();let a=e.target.dataset.contentKey;s(a)})}),s("anasayfa"),n=setInterval(k,1e3)});
