document.addEventListener('DOMContentLoaded', function() {

    /**
     * SSS (FAQ) bölümündeki akordeon işlevselliğini ayarlar.
     * Sorulara tıklandığında cevapların görünmesini/gizlenmesini sağlar.
     */
    function setupFaqAccordion() {
        const listContainer = document.querySelector('.faq-list');
        if (!listContainer) return;

        const handleFaqClick = (questionElement) => {
            if (!questionElement) return;

            const parentItem = questionElement.parentElement;
            const answerElement = parentItem.querySelector('.faq-answer');
            const isExpanded = parentItem.classList.toggle('active');

            questionElement.setAttribute('aria-expanded', String(isExpanded));

            if (isExpanded) {
                answerElement.style.maxHeight = answerElement.scrollHeight + "px";
                answerElement.style.paddingTop = "1.5rem";
                answerElement.style.paddingBottom = "1.8rem";
            } else {
                answerElement.style.maxHeight = null;
                answerElement.style.paddingTop = "0";
                answerElement.style.paddingBottom = "0";
            }
        };

        listContainer.addEventListener('click', (event) => {
            handleFaqClick(event.target.closest('.faq-question'));
        });

        listContainer.addEventListener('keydown', (event) => {
             if (event.key === 'Enter' || event.key === ' ') {
                 const questionElement = event.target.closest('.faq-question');
                 if (questionElement) {
                    event.preventDefault();
                    handleFaqClick(questionElement);
                 }
             }
        });
    }

    /**
     * Footer'daki telif hakkı metninde geçen yılı güncel yıl ile değiştirir.
     */
    function updateFooterYear() {
        const footerTextEl = document.getElementById('footerTextContent');
        if (footerTextEl) {
            const currentYear = new Date().getFullYear();
            footerTextEl.textContent = footerTextEl.textContent.replace('{YEAR}', currentYear);
        }
    }

    /**
     * Mobil ve tabletler için hamburger menü işlevselliğini ayarlar.
     */
    function setupHamburgerMenu() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('#mainHeader .nav-links');
        const header = document.getElementById('mainHeader');

        if (!hamburgerMenu || !navLinks || !header) {
            console.warn("Hamburger menu, navigation links, or header element not found.");
            return;
        }

        const toggleMenu = (expand) => {
             navLinks.classList.toggle('active', expand);
             hamburgerMenu.setAttribute('aria-expanded', String(expand));
             const icon = hamburgerMenu.querySelector('i');
             icon.classList.toggle('fa-bars', !expand);
             icon.classList.toggle('fa-times', expand);
        };

        hamburgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(!navLinks.classList.contains('active'));
        });

        navLinks.addEventListener('click', (event) => {
             if (event.target.tagName === 'A' && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        document.addEventListener('click', (event) => {
            if (!header.contains(event.target) && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    /**
     * Sayfa kaydırıldığında, görünürdeki bölüme göre navigasyon linkini aktif hale getirir (scrollspy).
     */
    function setActiveNavLinkOnScroll() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinksList = document.querySelectorAll('.nav-links a');
        const header = document.getElementById('mainHeader');
        
        if (sections.length === 0 || navLinksList.length === 0 || !header) return;
        
        const headerHeight = header.offsetHeight;

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (navLink) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        document.querySelector('.nav-links a.active')?.classList.remove('active');
                        navLink.classList.add('active');
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: `-${headerHeight}px 0px 0px 0px`,
            threshold: 0.5
        });

        sections.forEach(section => observer.observe(section));
        
        // Sayfanın en üstü için özel kontrol
        const topObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                document.querySelector('.nav-links a.active')?.classList.remove('active');
                document.querySelector('.nav-links a[href="#giris"]')?.classList.add('active');
            }
        }, { threshold: 0.8 });
        
        const heroSection = document.getElementById('giris');
        if (heroSection) {
            topObserver.observe(heroSection);
        }
    }


    // --- Fonksiyonların Çağrılması ---
    setupFaqAccordion();
    updateFooterYear();
    setupHamburgerMenu();
    setActiveNavLinkOnScroll();
});