document.addEventListener('DOMContentLoaded', function() {
    const siteDataElement = document.getElementById('siteData');
    let DATA = {};

    // 1. Load and Parse LD+JSON Data
    if (!siteDataElement || !siteDataElement.textContent.trim()) {
        console.error("LD+JSON script tag (#siteData) not found or empty!");
        displayError("Site configuration data could not be loaded! Please check the console.");
        return;
    }

    try {
        DATA = JSON.parse(siteDataElement.textContent);
    } catch (error) {
        console.error("Error parsing LD+JSON data:", error);
        console.error("Faulty JSON content:", siteDataElement.textContent);
        displayError(`Site configuration error: ${error.message}. Check the console.`);
        return;
    }

    // --- Content Loading Functions ---

    function loadPageInfo() {
        // Set page title
        document.getElementById('siteTitle').textContent = DATA.name || "Abdulkadir Güngör | Web Design & Developer";

        // Set header logo text
        const headerLogoTextContainer = document.getElementById('headerLogoTextContainer');
        if (headerLogoTextContainer) {
            let logoText = "Abdulkadir Güngör"; // Default
            if (DATA.author && DATA.author.name) {
                logoText = DATA.author.name;
            } else if (DATA.name) {
                const nameParts = DATA.name.split('|');
                if (nameParts.length > 0 && nameParts[0].trim()) {
                     logoText = nameParts[0].trim();
                }
            }
            headerLogoTextContainer.textContent = logoText;
            headerLogoTextContainer.classList.add('logo-text-style');
        } else {
            console.warn("Header logo text container (#headerLogoTextContainer) not found.");
        }
    }

    function loadNavigation() {
        const navLinksContainer = document.getElementById('navLinksContainer');
        if (!navLinksContainer) {
            console.warn("Navigation links container (#navLinksContainer) not found.");
            return;
        }
        navLinksContainer.innerHTML = ''; // Clear existing links

        if (DATA.navigation && Array.isArray(DATA.navigation)) {
            DATA.navigation.forEach(item => {
                if (item.name && item.url) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = item.url;
                    a.textContent = item.name;
                    li.appendChild(a);
                    navLinksContainer.appendChild(li);
                } else {
                     console.warn("Skipping navigation item due to missing name or url:", item);
                }
            });
        } else {
             console.warn("Navigation data (DATA.navigation) not found or is not an array.");
        }
    }

    function loadHeroSection() {
        const heroData = DATA.heroSection;
        const heroSectionElement = document.getElementById('giris');
        const heroTitleEl = document.getElementById('heroTitle');
        const heroSubtitleEl = document.getElementById('heroSubtitle');
        const heroButtonEl = document.getElementById('heroButton');

        if (!heroSectionElement || !heroTitleEl || !heroSubtitleEl || !heroButtonEl) {
            console.warn("One or more Hero section HTML elements (#giris, #heroTitle, #heroSubtitle, #heroButton) are missing.");
            return;
        }

        if (heroData) {
            if (heroData.backgroundImage) {
                heroSectionElement.style.backgroundImage = `url('${heroData.backgroundImage}')`;
            } else {
                 heroSectionElement.style.backgroundImage = '';
            }
            heroTitleEl.textContent = heroData.title || 'Welcome';
            heroSubtitleEl.innerHTML = heroData.subtitle ? heroData.subtitle.replace(/\n/g, '<br>') : 'Subtitle text goes here.';
            heroButtonEl.textContent = heroData.buttonText || 'Learn More';
            heroButtonEl.href = heroData.buttonLink || '#';
             if (heroButtonEl.href && !heroButtonEl.href.startsWith('#') && !heroButtonEl.href.startsWith('/')) {
                 heroButtonEl.target = "_blank";
                 heroButtonEl.rel = "noopener noreferrer";
             } else {
                 heroButtonEl.target = "";
                 heroButtonEl.rel = "";
             }
        } else {
            console.warn("Hero section data (DATA.heroSection) not found in LD+JSON.");
            heroTitleEl.textContent = 'Title Unavailable';
            heroSubtitleEl.textContent = 'Content loading error.';
            heroButtonEl.textContent = 'Link N/A';
            heroButtonEl.href = '#';
            heroButtonEl.style.display = 'none';
        }
    }

    function loadAboutSection() {
        const aboutData = DATA.aboutSection;
        const aboutTitleEl = document.getElementById('aboutTitle');
        const aboutTextEl = document.getElementById('aboutText');
        const aboutImageEl = document.getElementById('aboutImage');
        const aboutButtonEl = document.getElementById('aboutButton');

        if (!aboutTitleEl || !aboutTextEl || !aboutImageEl || !aboutButtonEl) {
             console.warn("One or more About section HTML elements (#aboutTitle, #aboutText, #aboutImage, #aboutButton) are missing.");
             return;
        }

        if (aboutData) {
            aboutTitleEl.textContent = aboutData.title || 'About Me';
            aboutTextEl.innerHTML = aboutData.content ? aboutData.content.replace(/\n/g, '<br><br>') : 'About information is currently unavailable.';
            aboutImageEl.src = aboutData.image || 'https://via.placeholder.com/280x280?text=Profile';
            aboutImageEl.alt = aboutData.imageAlt || aboutData.title || 'About section image';
            aboutButtonEl.textContent = aboutData.buttonText || 'Read More';
            aboutButtonEl.href = aboutData.buttonLink || '#';
             if (aboutButtonEl.href && !aboutButtonEl.href.startsWith('#') && !aboutButtonEl.href.startsWith('/')) {
                aboutButtonEl.target = "_blank";
                aboutButtonEl.rel = "noopener noreferrer";
            } else {
                 aboutButtonEl.target = "";
                 aboutButtonEl.rel = "";
            }
        } else {
            console.warn("About section data (DATA.aboutSection) not found in LD+JSON.");
            aboutTitleEl.textContent = 'About Section';
            aboutTextEl.textContent = 'Content failed to load.';
            aboutImageEl.src = 'https://via.placeholder.com/280x280?text=Error';
            aboutImageEl.alt = 'Image loading error';
            aboutButtonEl.style.display = 'none';
        }
    }

    function loadPortfolioSection() {
        const portfolioData = DATA.portfolioSection;
        const portfolioTitleEl = document.getElementById('portfolioTitle');
        const portfolioIntroEl = document.getElementById('portfolioIntro');
        const gridContainer = document.getElementById('portfolioGridContainer');

        if (!portfolioTitleEl || !portfolioIntroEl || !gridContainer) {
            console.warn("One or more Portfolio section HTML elements (#portfolioTitle, #portfolioIntro, #portfolioGridContainer) are missing.");
            return;
        }

        if (portfolioData) {
            portfolioTitleEl.textContent = portfolioData.title || 'My Portfolio';
            portfolioIntroEl.innerHTML = portfolioData.introText ? portfolioData.introText.replace(/\n/g, '<br>') : '';

            if (portfolioData.items && Array.isArray(portfolioData.items)) {
                gridContainer.innerHTML = '';
                portfolioData.items.forEach(item => {
                    const portfolioItemDiv = document.createElement('div');
                    portfolioItemDiv.className = 'portfolio-item';
                    let buttonHtml = '';
                    if (item.url && item.url !== "#") {
                        buttonHtml = `<a href="${item.url}" class="btn btn-small" target="_blank" rel="noopener noreferrer">GÖRÜNTÜLE</a>`;
                    }
                    portfolioItemDiv.innerHTML = `
                        <div class="portfolio-item-image-wrapper">
                            <img src="${item.image || 'https://via.placeholder.com/400x300?text=Portfolio+Item'}" alt="${item.name || 'Portfolio Item'}">
                        </div>
                        <div class="portfolio-item-content">
                            ${item.category ? `<span class="category">${item.category}</span>` : ''}
                            <h3>${item.name || 'Untitled Project'}</h3>
                            <p>${item.description || 'No description available.'}</p>
                            ${buttonHtml}
                        </div>
                    `;
                    gridContainer.appendChild(portfolioItemDiv);
                });
            } else {
                 gridContainer.innerHTML = '<p class="text-center">No portfolio items found.</p>';
                 console.warn("Portfolio items data (DATA.portfolioSection.items) not found or is not an array.");
            }
        } else {
            console.warn("Portfolio section data (DATA.portfolioSection) not found in LD+JSON.");
            portfolioTitleEl.textContent = 'Portfolio';
            portfolioIntroEl.textContent = 'Portfolio content could not be loaded.';
            gridContainer.innerHTML = '<p class="text-center">Error loading portfolio items.</p>';
        }
    }

     function loadProjectsSection() {
        const projectsData = DATA.projectsSection;
        const projectsTitleEl = document.getElementById('projectsTitle');
        const projectsIntroEl = document.getElementById('projectsIntro');
        const listContainer = document.getElementById('projectsListContainer');

        if (!projectsTitleEl || !projectsIntroEl || !listContainer) {
            console.warn("One or more Projects section HTML elements (#projectsTitle, #projectsIntro, #projectsListContainer) are missing.");
            return;
        }

        if (projectsData) {
            projectsTitleEl.textContent = projectsData.title || 'Featured Projects';
            projectsIntroEl.innerHTML = projectsData.introText ? projectsData.introText.replace(/\n/g, '<br>') : '';

            if (projectsData.items && Array.isArray(projectsData.items)) {
                listContainer.innerHTML = '';
                projectsData.items.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    let technologiesHtml = '';
                    if (project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0) {
                        technologiesHtml = `
                            <h4 class="technologies-title">Technologies Used:</h4>
                            <div class="technologies-list">
                                ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                            </div>`;
                    }
                    let buttonHtml = '';
                    if (project.url && project.url !== "#") {
                        buttonHtml = `<a href="${project.url}" class="btn" target="_blank" rel="noopener noreferrer">Proje Detayları / Github'da Görüntüle</a>`;
                    }
                    projectCard.innerHTML = `
                        <div class="project-card-image-wrapper">
                            <img src="${project.image || 'https://via.placeholder.com/600x400?text=Project+Image'}" alt="${project.imageAlt || project.name || 'Project Image'}">
                        </div>
                        <div class="project-card-content">
                            <h3>${project.name || 'Untitled Project'}</h3>
                            ${project.client ? `<p class="client-info">Type: ${project.client}</p>` : ''}
                            <p class="description">${project.description ? project.description.replace(/\n/g, '<br><br>') : 'No project description available.'}</p>
                            ${technologiesHtml}
                            ${buttonHtml}
                        </div>
                    `;
                    listContainer.appendChild(projectCard);
                });
            } else {
                listContainer.innerHTML = '<p class="text-center">No projects found.</p>';
                console.warn("Projects items data (DATA.projectsSection.items) not found or is not an array.");
            }
        } else {
             console.warn("Projects section data (DATA.projectsSection) not found in LD+JSON.");
             projectsTitleEl.textContent = 'Projects';
             projectsIntroEl.textContent = 'Project details could not be loaded.';
             listContainer.innerHTML = '<p class="text-center">Error loading projects.</p>';
        }
    }

    function loadBlogSection() {
        const blogData = DATA.blogSection;
        const blogTitleEl = document.getElementById('blogTitle');
        const blogContainerEl = document.getElementById('blog')?.querySelector('.container');
        const blogContentPlaceholderEl = document.getElementById('blogContentPlaceholder');

        if (!blogTitleEl || !blogContentPlaceholderEl || !blogContainerEl) {
            console.warn("One or more Blog section HTML elements (#blogTitle, #blogContentPlaceholder, #blog .container) are missing.");
            return;
        }

        if (blogData) {
            blogTitleEl.textContent = blogData.title || 'From the Blog';
            blogContentPlaceholderEl.innerHTML = blogData.placeholderText ? blogData.placeholderText.replace(/\n/g, '<br>') : '<p>Blog posts coming soon!</p>';
            const existingButton = blogContainerEl.querySelector('a.btn');
            if (existingButton && existingButton.parentElement === blogContainerEl) {
                 blogContainerEl.removeChild(existingButton);
            }
            if (blogData.buttonText && blogData.buttonLink) {
                const button = document.createElement('a');
                button.href = blogData.buttonLink;
                button.textContent = blogData.buttonText;
                button.className = 'btn';
                 if (blogData.buttonLink && !blogData.buttonLink.startsWith('#') && !blogData.buttonLink.startsWith('/')) {
                    button.target = "_blank";
                    button.rel = "noopener noreferrer";
                }
                blogContainerEl.appendChild(button);
            }
        } else {
            console.warn("Blog section data (DATA.blogSection) not found in LD+JSON.");
            blogTitleEl.textContent = 'Blog';
            blogContentPlaceholderEl.innerHTML = '<p>Error loading blog content.</p>';
        }
    }

    function loadContactSection() {
        const contactData = DATA.contactSection;
        const contactTitleEl = document.getElementById('contactTitle');
        const contactIntroEl = document.getElementById('contactIntro');
        const detailsContainer = document.getElementById('contactDetailsContainer');
        const formEl = document.getElementById('contactForm');
        const submitButton = document.getElementById('contactSubmitButton');

        if (!contactTitleEl || !contactIntroEl || !detailsContainer || !formEl || !submitButton) {
            console.error("Essential Contact section HTML elements are missing. Cannot load contact section.");
             const contactSection = document.getElementById('iletisim');
             if (contactSection) contactSection.style.display = 'none';
            return;
        }

        if (contactData) {
            contactTitleEl.textContent = contactData.title || 'Get In Touch';
            contactIntroEl.innerHTML = contactData.introText ? contactData.introText.replace(/\n/g, '<br>') : '';
            detailsContainer.innerHTML = '';
            if (contactData.details && Array.isArray(contactData.details)) {
                contactData.details.forEach(detail => {
                    if (detail.value) {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'contact-detail-item';
                        let iconHtml = `<i class="${detail.iconClass || 'fas fa-info-circle'}"></i>`;
                        let valueHtml = '';
                        const linkText = detail.label || detail.value.split('/').filter(Boolean).pop() || detail.value;
                        if (detail.type === 'email') {
                            valueHtml = `<a href="mailto:${detail.value}">${detail.value}</a>`;
                        } else if (detail.type === 'phone') {
                            valueHtml = `<a href="tel:${detail.value.replace(/\s/g, '')}">${detail.value}</a>`;
                        } else if (detail.type === 'linkedin' || detail.type === 'github') {
                            valueHtml = `<a href="${detail.value}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
                        } else {
                            valueHtml = `<span>${detail.value}</span>`;
                        }
                        itemDiv.innerHTML = `
                            ${iconHtml}
                            <div>
                                <strong>${detail.label || 'Info'}:</strong>
                                ${valueHtml}
                            </div>
                        `;
                        detailsContainer.appendChild(itemDiv);
                    }
                });
            } else {
                detailsContainer.innerHTML = '<p>Contact details are unavailable.</p>';
                console.warn("Contact details data (DATA.contactSection.details) not found or not an array.");
            }

            const dynamicFields = formEl.querySelectorAll('input:not([type="hidden"]), textarea, label:not([for="bot-field"])');
            dynamicFields.forEach(el => el.parentElement.removeChild(el));

            if (contactData.form && contactData.form.fields && Array.isArray(contactData.form.fields)) {
                const reversedFields = [...contactData.form.fields].reverse();
                reversedFields.forEach(field => {
                    if (field.type && field.name) {
                        const label = document.createElement('label');
                        label.htmlFor = `form-${field.name}`;
                        label.textContent = field.placeholder || field.name;
                        label.classList.add('sr-only');
                        let inputElement;
                        if (field.type === 'textarea') {
                            inputElement = document.createElement('textarea');
                            inputElement.rows = field.rows || 5;
                        } else {
                            inputElement = document.createElement('input');
                            inputElement.type = field.type;
                        }
                        inputElement.id = `form-${field.name}`;
                        inputElement.placeholder = field.placeholder || '';
                        inputElement.name = field.name;
                        if (field.required) inputElement.required = true;
                        const h3 = formEl.querySelector('h3');
                        if (h3 && h3.nextSibling) {
                             formEl.insertBefore(label, h3.nextSibling);
                             formEl.insertBefore(inputElement, label.nextSibling);
                        } else {
                             formEl.insertBefore(label, submitButton);
                             formEl.insertBefore(inputElement, submitButton);
                        }
                    }
                });
            } else {
                console.warn("Contact form fields data (DATA.contactSection.form.fields) not found or not an array.");
                 const h3 = formEl.querySelector('h3');
                 if (h3) {
                     const p = document.createElement('p');
                     p.textContent = "The contact form is currently unavailable.";
                     formEl.insertBefore(p, submitButton);
                 }
            }
            submitButton.textContent = (contactData.form && contactData.form.submitButtonText) ? contactData.form.submitButtonText : 'Send Message';

        } else {
            console.warn("Contact section data (DATA.contactSection) not found in LD+JSON.");
            contactTitleEl.textContent = 'Contact';
            contactIntroEl.textContent = 'Contact information could not be loaded.';
            detailsContainer.innerHTML = '<p>Details unavailable.</p>';
            const dynamicFields = formEl.querySelectorAll('input:not([type="hidden"]), textarea, label:not([for="bot-field"])');
            dynamicFields.forEach(el => el.parentElement.removeChild(el));
            submitButton.textContent = 'Submit';
            submitButton.disabled = true;
        }
    }

    function loadFaqSection() {
        const faqData = DATA.faqSection;
        const faqTitleEl = document.getElementById('faqTitle');
        const listContainer = document.getElementById('faqListContainer');

        if (!faqTitleEl || !listContainer) {
             console.warn("One or more FAQ section HTML elements (#faqTitle, #faqListContainer) are missing.");
             return;
        }

        if (faqData && faqData.mainEntity && Array.isArray(faqData.mainEntity)) {
            faqTitleEl.textContent = faqData.title || 'Frequently Asked Questions';
            listContainer.innerHTML = '';

            faqData.mainEntity.forEach((qaPair, index) => {
                if (qaPair && qaPair["@type"] === "Question" && qaPair.name && qaPair.acceptedAnswer && qaPair.acceptedAnswer.text) {
                    const faqItem = document.createElement('div');
                    faqItem.className = 'faq-item';
                    const questionId = `faq-question-${index}`;
                    const answerId = `faq-answer-${index}`;
                    faqItem.innerHTML = `
                        <div class="faq-question" role="button" tabindex="0" aria-expanded="false" aria-controls="${answerId}" id="${questionId}">
                            ${qaPair.name}
                        </div>
                        <div class="faq-answer" role="region" id="${answerId}" aria-labelledby="${questionId}">
                            <p>${qaPair.acceptedAnswer.text.replace(/\n/g, '<br><br>')}</p>
                        </div>
                    `;
                    listContainer.appendChild(faqItem);
                } else {
                     console.warn(`FAQ item at index ${index} is invalid or missing required fields.`);
                }
            });
            setupFaqAccordion();
        } else {
            console.warn("FAQ section data (DATA.faqSection.mainEntity) not found or not an array.");
            faqTitleEl.textContent = 'FAQ';
            listContainer.innerHTML = '<p class="text-center">FAQ content could not be loaded.</p>';
        }
    }

    function setupFaqAccordion() {
        const listContainer = document.getElementById('faqListContainer');
        if (!listContainer) return;

        listContainer.addEventListener('click', (event) => {
            const questionElement = event.target.closest('.faq-question');
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
        });

         listContainer.addEventListener('keydown', (event) => {
             if (event.key === 'Enter' || event.key === ' ') {
                 const questionElement = event.target.closest('.faq-question');
                 if (questionElement) {
                    event.preventDefault();
                    questionElement.click();
                 }
             }
         });
    }


    function loadFooter() {
        const footerTextEl = document.getElementById('footerTextContent');
        if (footerTextEl) {
            const currentYear = new Date().getFullYear();
            const defaultText = `© ${currentYear} Abdulkadir Güngör. All Rights Reserved.`;
            let footerHtml = defaultText;

            if (DATA && DATA.footerText) {
                 footerHtml = DATA.footerText.replace(/{YEAR}/g, currentYear);
            } else {
                 console.warn("Footer text (DATA.footerText) not found in LD+JSON. Using default.");
            }
            footerTextEl.innerHTML = footerHtml;
        } else {
            console.error("Footer text container (#footerTextContent) not found.");
        }
    }

    // --- Helper Functions ---

    function displayError(message) {
        const errorDiv = document.createElement('p');
        errorDiv.style.backgroundColor = 'red';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '0';
        errorDiv.style.left = '0';
        errorDiv.style.width = '100%';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = message;
        if (!document.body.querySelector('.error-message')) {
             errorDiv.classList.add('error-message');
             document.body.insertAdjacentElement('afterbegin', errorDiv);
        }
    }

    function setupHamburgerMenu() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('#mainHeader .nav-links');
        const header = document.getElementById('mainHeader');

        if (!hamburgerMenu || !navLinks || !header) {
            console.warn("Hamburger menu, navigation links, or header element not found. Menu functionality disabled.");
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
            const isExpanded = navLinks.classList.contains('active');
            toggleMenu(!isExpanded);
        });

        navLinks.addEventListener('click', function(event) {
             if (event.target.tagName === 'A' && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        document.addEventListener('click', function(event) {
            if (!header.contains(event.target) && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });

         document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
         });
    }


    function setActiveNavLinkOnScroll() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinksList = document.querySelectorAll('#navLinksContainer a');
        const header = document.getElementById('mainHeader');
        const headerHeight = header ? header.offsetHeight : 70;
        // Trigger when the section top is between headerHeight and 70% viewport height from top
        const topOffset = headerHeight;
        const bottomOffset = window.innerHeight * 0.7;

        if (sections.length === 0 || navLinksList.length === 0) {
             console.warn("Cannot set up active link on scroll: sections or nav links not found.");
             return;
        }
        if (!('IntersectionObserver' in window)) {
            console.warn("IntersectionObserver not supported. Active link on scroll might not work accurately.");
            return;
        }

        const observerCallback = (entries) => {
             let activeSectionId = null;
             let maxVisibleRatio = 0; // Track which section is 'most' visible in the zone

             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                      // Basic assignment if intersecting
                      activeSectionId = entry.target.getAttribute('id');
                      // You could add more complex logic here to find the 'most visible'
                      // e.g., if (entry.intersectionRatio > maxVisibleRatio) { ... }
                 }
             });

             // Force 'giris' if scrolled near the top, overriding intersection logic
             const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
             if (scrollPosition < headerHeight + 50) {
                  activeSectionId = 'giris';
              }

             // Update all links
             navLinksList.forEach(link => {
                 const linkHref = link.getAttribute('href');
                 link.classList.toggle('active', linkHref === `#${activeSectionId}`);
             });
        };

        const observerOptions = {
            rootMargin: `-${topOffset}px 0px -${bottomOffset}px 0px`,
            threshold: 0 // Trigger immediately when entering/leaving the zone
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    }


    function setInitialActiveNavLink() {
        const hash = window.location.hash;
        const navLinksList = document.querySelectorAll('#navLinksContainer a');
        if (navLinksList.length === 0) return;

        navLinksList.forEach(link => link.classList.remove('active'));

        let activeLinkFound = false;
        if (hash && hash !== "#") {
            try {
                const activeLink = document.querySelector(`#navLinksContainer a[href="${hash}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLinkFound = true;
                }
            } catch (e) {
                 console.error(`Error finding element with hash ${hash}:`, e);
            }
        }

        if (!activeLinkFound) {
            const homeLink = document.querySelector('#navLinksContainer a[href="#giris"]');
            if (homeLink) {
                homeLink.classList.add('active');
            } else if (navLinksList.length > 0) {
                navLinksList[0].classList.add('active');
            }
        }
    }

    // --- Execution Order ---
    loadPageInfo();
    loadNavigation();
    loadHeroSection();
    loadAboutSection();
    loadPortfolioSection();
    loadProjectsSection();
    loadBlogSection();
    loadContactSection();
    loadFaqSection();
    loadFooter();
    setupHamburgerMenu();
    setInitialActiveNavLink();
    setActiveNavLinkOnScroll();

});