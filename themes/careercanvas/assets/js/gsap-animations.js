// GSAP Animations System - Hero Section Only

// Configuration object for hero animations
const ANIMATION_CONFIG = {
    hero: {
        diagonalLines: { count: 4, opacity: 0.4, scaleX: 4.0 }
    }
};

// Common animation properties for hero
const COMMON_ANIMATIONS = {
    fadeIn: { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power2.out" },
    scrollEnter: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
};

// Central animation registry to prevent duplicates
const ANIMATION_REGISTRY = {
    registeredElements: new Set(),
    
    // Register an element to prevent duplicate animations
    registerElement: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        if (ANIMATION_REGISTRY.registeredElements.has(key)) {
            return false; // Already registered
        }
        ANIMATION_REGISTRY.registeredElements.add(key);
        return true;
    },
    
    // Check if element is already animated
    isElementAnimated: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        return ANIMATION_REGISTRY.registeredElements.has(key);
    }
};

// Utility functions for hero animations
const Utils = {
    // Create container with fallback
    createContainer: (parent, className, fallback) => {
        return parent.querySelector(className) || (() => {
            const container = document.createElement('div');
            container.className = fallback;
            parent.appendChild(container);
            return container;
        })();
    },

    // Random position generator
    randomPosition: (min = 10, max = 90) => ({
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
    })
};

// Mouse tracking for quick fact lighting effects
function initQuickFactLighting() {
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    
    if (quickFactCards.length === 0) return;
    
    quickFactCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading from CDN...');
        loadGSAP();
        return;
    }
    
    initializeHeroAnimations();
});


// GSAP loader with fallback
function loadGSAP() {
    const loadScript = (src, fallback, onLoad) => {
        console.log(`Loading GSAP from: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onerror = (error) => {
            console.warn(`Failed to load GSAP from ${src}, trying fallback: ${fallback}`);
            const fallbackScript = document.createElement('script');
            fallbackScript.src = fallback;
            fallbackScript.onload = () => {
                console.log('GSAP loaded from fallback successfully');
                onLoad();
            };
            fallbackScript.onerror = (fallbackError) => {
                console.error('Both GSAP sources failed to load:', error, fallbackError);
            };
            document.head.appendChild(fallbackScript);
        };
        script.onload = () => {
            console.log('GSAP loaded successfully from primary source');
            onLoad();
        };
        document.head.appendChild(script);
    };

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js', 
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js',
        () => {
            initializeHeroAnimations();
        });
}

// Main initialization function - Hero only (optimized)
function initializeHeroAnimations() {
    console.log('Initializing hero animation system...');
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    console.log('🎯 Initializing hero animations...');
    
    // Set initial states for all animated elements
    // tagline hariç: typewriter kendi içinde başlatılıyor, opacity:0 layout shift yaratır
    const animatedElements = heroSection.querySelectorAll('[data-animation]:not([data-animation="tagline"])');
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    // Only animate elements that exist — opacity-only fade (no y/rotate; matches hero portrait timing)
    if (animatedElements.length > 0) {
        gsap.set(animatedElements, { opacity: 0 });
    }
    if (bgDecorations.length > 0) {
        gsap.set(bgDecorations, { opacity: 0, scale: 0.5, rotation: -180 });
    }
    if (quickFactCards.length > 0) {
        gsap.set(quickFactCards, { opacity: 0, y: 20, scale: 0.95 });
    }
    // Initialize floating background animations
    bgDecorations.forEach((circle, index) => {
        const delay = index * 0.5;
        const floatX = (Math.random() - 0.5) * 40;
        const floatY = (Math.random() - 0.5) * 30;
        const floatDuration = 3 + Math.random() * 2;
        
        gsap.timeline({ repeat: -1, yoyo: true, delay })
            .to(circle, { x: floatX, y: floatY, duration: floatDuration, ease: "power1.inOut" });
        
        gsap.to(circle, { rotation: 360, duration: 8 + Math.random() * 4, ease: "none", repeat: -1, delay });
        circle.setAttribute('data-natural-animation', 'true');
    });
    
    // Initialize mouse tracking
    initMouseTracking(heroSection);
    
    // Initialize background shapes
    initSectionBackgroundAnimations('.hero-section', ANIMATION_CONFIG.hero);
    
    // Initialize typewriter effect
    initTypingEffect();
    
    // Initialize quick fact lighting effects
    initQuickFactLighting();
    
    // Play hero entrance animation
    const tl = gsap.timeline();
    
    // Only animate elements that exist
    if (animatedElements.length > 0) {
        tl.to(animatedElements, {
            opacity: 1,
            duration: 2,
            stagger: 0.12,
            ease: "power2.inOut",
        });
    }

    // tagline h2'yi ayrıca fade-in et (typewriter başlamadan önce görünür olsun)
    const taglineEl = heroSection.querySelector('[data-animation="tagline"]');
    if (taglineEl) {
        gsap.set(taglineEl, { opacity: 1 });
    }
    
    if (bgDecorations.length > 0) {
        tl.to(bgDecorations, { 
            opacity: 0.1, 
            scale: 1, 
            rotation: 0, 
            duration: 1, 
            stagger: 0.1 
        }, "-=0.6");
    }
    
    if (quickFactCards.length > 0) {
        tl.to(quickFactCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4");
    }
    
}

// Enhanced typewriter effect: cycles concepts split on ". "
let typingEffectInitialized = false;

function initTypewriterForElement(typewriterElement, startDelayMs) {
    const originalText = typewriterElement.getAttribute('data-original-text') || typewriterElement.textContent.trim();
    const concepts = originalText.split('. ').map(c => c.trim()).filter(c => c.length > 0);
    let currentConceptIndex = 0;

    // textNode: sadece bu değişir — cursor ve DOM yapısı hiç bozulmaz
    const textNode = document.createTextNode('');

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    Object.assign(cursor.style, {
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'var(--color-primary-light)',
        marginLeft: '2px',
        verticalAlign: 'text-bottom'
    });

    typewriterElement.textContent = '';
    typewriterElement.style.color = 'inherit';
    typewriterElement.appendChild(textNode);
    typewriterElement.appendChild(cursor);

    gsap.to(cursor, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
    });

    function typeConcept(concept, onComplete) {
        const chars = concept.split('');
        let charIndex = 0;

        function typeNext() {
            if (charIndex >= chars.length) {
                setTimeout(eraseText, 1500);
                return;
            }
            charIndex++;
            textNode.nodeValue = chars.slice(0, charIndex).join('');
            setTimeout(typeNext, 80);
        }

        function eraseText() {
            if (charIndex <= 0) {
                setTimeout(onComplete, 200);
                return;
            }
            charIndex--;
            textNode.nodeValue = chars.slice(0, charIndex).join('');
            setTimeout(eraseText, 40);
        }

        typeNext();
    }

    let isPaused = false;
    let pendingResume = null;

    function startTypingLoop() {
        if (isPaused) {
            pendingResume = startTypingLoop;
            return;
        }
        if (currentConceptIndex >= concepts.length) {
            currentConceptIndex = 0;
        }
        typeConcept(concepts[currentConceptIndex], () => {
            currentConceptIndex++;
            startTypingLoop();
        });
    }

    setTimeout(startTypingLoop, startDelayMs);

    // Dışarıdan durdur/devam ettir
    typewriterElement._typewriterPause = function() {
        isPaused = true;
    };
    typewriterElement._typewriterResume = function() {
        isPaused = false;
        if (pendingResume) {
            const fn = pendingResume;
            pendingResume = null;
            fn();
        }
    };
}

// Typewriter h2 pairs tracked for resize recalculation
const _typewriterPairs = [];

function measureAndLockH2(el, h2) {
    const originalText = el.getAttribute('data-original-text') || el.textContent.trim();
    if (!originalText) return;

    // Gizli bir ölçüm kopyası yap — asıl span'a hiç dokunma
    const probe = document.createElement('span');
    probe.className = el.className;
    probe.textContent = originalText;
    Object.assign(probe.style, {
        position: 'static',
        display: 'block',
        visibility: 'hidden',
        pointerEvents: 'none',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        width: '100%'
    });

    // h2'nin height kilidini geçici kaldır, probe'u ekle, ölç, temizle
    const prevHeight   = h2.style.height;
    const prevOverflow = h2.style.overflow;
    h2.style.height   = '';
    h2.style.overflow = '';
    h2.appendChild(probe);
    void probe.offsetHeight; // layout flush
    const fullHeight = probe.offsetHeight;
    h2.removeChild(probe);

    if (fullHeight > 0) {
        h2.style.height   = fullHeight + 'px';
        h2.style.overflow = 'hidden';
        h2.style.position = 'relative';
    } else {
        // Ölçüm başarısız — önceki değerleri geri yükle
        h2.style.height   = prevHeight;
        h2.style.overflow = prevOverflow;
    }
}

function initTypingEffect() {
    if (typingEffectInitialized) return;

    const typewriterElements = document.querySelectorAll('.typewriter');
    if (!typewriterElements.length) return;

    typewriterElements.forEach((el) => {
        // h2'nin yüksekliğini tam metin render edilmişken ölç ve kilitle
        const h2 = el.closest('h2');
        if (h2) {
            measureAndLockH2(el, h2);
            _typewriterPairs.push({ el, h2 });
        }
        initTypewriterForElement(el, 1000);
    });

    typingEffectInitialized = true;
}

function initMouseTracking(heroSection) {
    let mouseX = 0, mouseY = 0, isInHero = false;
    let updateTimeout = null;
    const throttleDelay = 16;

    const events = {
        mouseenter: () => { 
            isInHero = true; 
            updateMouseEffects(); 
        },
        mouseleave: () => { 
            isInHero = false; 
            resetMouseEffects(); 
        },
        mousemove: (e) => {
            if (!isInHero) return;
            const rect = heroSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            if (!updateTimeout) {
                updateTimeout = setTimeout(() => {
                    updateMouseEffects();
                    updateTimeout = null;
                }, throttleDelay);
            }
        }
    };

    Object.entries(events).forEach(([event, handler]) => {
        heroSection.addEventListener(event, handler);
    });

    function updateMouseEffects() {
        if (!isInHero) return;
        
        const normalizedX = (mouseX - 0.5) * 2;
        const normalizedY = (mouseY - 0.5) * 2;
        
        const elementTypes = [
            { selector: '.morphing-shape', sensitivity: { x: 40, y: 30, rotate: 25, scale: 0.2 } },
            { selector: '.diagonal-line', sensitivity: { x: 25, y: 20, rotate: 15, scale: 0.1 } },
            { selector: '.spline-curve', sensitivity: { x: 15, y: 12, rotate: 8, scale: 0.05 } }
        ];

        elementTypes.forEach(({ selector, sensitivity }) => {
            const elements = heroSection.querySelectorAll(selector);
            elements.forEach((el, index) => {
                if (el.hasAttribute('data-natural-animation')) return;
                
                const multiplier = index + 1;
                gsap.to(el, {
                    x: normalizedX * (sensitivity.x + index * 8),
                    y: normalizedY * (sensitivity.y + index * 6),
                    rotation: normalizedX * (sensitivity.rotate + index * 5),
                    scale: 1 + Math.abs(normalizedX + normalizedY) * (sensitivity.scale + index * 0.05),
                    duration: 1.2 + index * 0.3,
                    ease: "power2.out"
                });
            });
        });

        const glowIntensity = Math.abs(normalizedX + normalizedY) * 0.3;
        gsap.to(heroSection, {
            boxShadow: `0 0 ${20 + glowIntensity * 50}px var(--color-primary-light)`,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function resetMouseEffects() {
        const elementsToReset = heroSection.querySelectorAll('.morphing-shape, .diagonal-line, .spline-curve');
        const resetElements = Array.from(elementsToReset).filter(el => !el.hasAttribute('data-natural-animation'));
        
        gsap.to(resetElements, {
            x: 0, y: 0, rotation: 0, scale: 1,
            duration: 0.8, ease: "power2.out"
        });
        
        gsap.to(heroSection, { boxShadow: 'none', duration: 0.5, ease: "power2.out" });
    }
}

// Background animations system for hero
function createAndAnimateDiagonalLines(container, options = {}) {
    const config = { count: 4, background: 'linear-gradient(45deg, transparent, var(--color-primary-light), transparent)', height: 3, width: 1200, opacity: 0.4, scaleX: 4.0, duration: 4, rotationDuration: 8, ...options };
    
    const lines = Array.from({ length: config.count }, (_, i) => {
        const line = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(line.style, {
            position: 'absolute',
            background: config.background,
            height: config.height + 'px',
            width: config.width + 'px',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: `rotate(${Math.random() * 360}deg)`,
            transformOrigin: 'center center'
        });
        line.className = 'diagonal-line';
        container.appendChild(line);
        return line;
    });

    lines.forEach((line, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(line, { opacity: config.opacity, scaleX: config.scaleX, duration: config.duration, delay: index * 0.8, ease: "power2.inOut" })
            .to(line, { rotation: '+=180', duration: config.rotationDuration, ease: "none" }, 0);
    });

    return lines;
}

function createAndAnimateSplineCurves(container, options = {}) {
    const config = { count: 3, size: 180, border: '3px solid var(--color-primary)', opacity: 0.6, scale: 1.2, duration: 6, rotationDuration: 10, ...options };
    
    const curves = Array.from({ length: config.count }, (_, i) => {
        const curve = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(curve.style, {
            position: 'absolute',
            width: config.size + 'px',
            height: config.size + 'px',
            border: config.border,
            borderRadius: '50%',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%'
        });
        curve.className = 'spline-curve';
        container.appendChild(curve);
        return curve;
    });

    curves.forEach((curve, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(curve, { opacity: config.opacity, scale: config.scale, borderRadius: '0%', duration: config.duration, delay: index * 1.2, ease: "power2.inOut" })
            .to(curve, { rotation: 360, duration: config.rotationDuration, ease: "none" }, 0);
    });

    return curves;
}

function initSectionBackgroundAnimations(sectionSelector, options = {}) {
    const section = document.querySelector(sectionSelector);
    if (!section) {
        console.warn(`Section with selector "${sectionSelector}" not found. Skipping background animations.`);
        return;
    }

    const shapesContainer = Utils.createContainer(section, '.morphing-shapes', 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden');

    // Create background animations immediately for hero section
    shapesContainer.innerHTML = '';
    createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
    createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
}

// Performance optimizations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

let _resizeTimer = null;
window.addEventListener('resize', function() {
    // Refresh any GSAP animations if needed
    if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.invalidate();
    }

    // Recalculate locked h2 heights on orientation change / resize
    // Debounced to avoid measuring mid-transition
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(function() {
        _typewriterPairs.forEach(function({ el, h2 }) {
            measureAndLockH2(el, h2);
        });
    }, 200);
});