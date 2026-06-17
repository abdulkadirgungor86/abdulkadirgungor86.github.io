// Mobile menu toggle
document.getElementById('menu-btn').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Section fade-in system
function initializeSectionFadeIn() {
    const sections = document.querySelectorAll('section[data-animate]');
    if (sections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize section fade-in when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSectionFadeIn();
});

;
document.addEventListener('DOMContentLoaded', function () {
  var icons = document.querySelectorAll('[data-devicon-name]');
  if (!icons.length) return;

  icons.forEach(function (el) {
    var name = el.getAttribute('data-devicon-name');
    if (!name) return;

    var style = el.getAttribute('data-devicon-style') || 'plain';
    var faIcon = el.getAttribute('data-fa-icon');

    var tryStyles = [];
    if (style) tryStyles.push(style);
    if (style !== 'original') tryStyles.push('original');
    if (style !== 'plain') tryStyles.push('plain');
    if (style !== 'line') tryStyles.push('line');

    function iconUrl(iconStyle) {
      return (
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/' +
        name +
        '/' +
        name +
        '-' +
        iconStyle +
        '.svg'
      );
    }

    function replaceWithFontAwesome() {
      if (!faIcon) return;

      var fa = document.createElement('i');
      fa.className = 'fas fa-' + faIcon + ' text-5xl';
      var animation = el.getAttribute('data-animation');
      if (animation) {
        fa.setAttribute('data-animation', animation);
      }
      fa.setAttribute('aria-hidden', 'true');

      if (el.parentNode) {
        el.parentNode.replaceChild(fa, el);
      }
    }

    function setImgSrcSequentially(idx) {
      if (el.tagName !== 'IMG') {
        // If this isn't an <img>, we can't set src; fall back.
        replaceWithFontAwesome();
        return;
      }

      if (idx >= tryStyles.length) {
        replaceWithFontAwesome();
        return;
      }

      var test = new Image();
      var url = iconUrl(tryStyles[idx]);

      test.onload = function () {
        el.src = url;
      };

      test.onerror = function () {
        setImgSrcSequentially(idx + 1);
      };

      test.src = url;
    }

    setImgSrcSequentially(0);
  });
});


;
// Dynamic Color System
// Randomly selects color palettes and applies them to the website
// Similar to how Pexels background images work

// Color palettes configuration
// These are fallback palettes - will be overridden by Hugo config if available
let COLOR_PALETTES = [
    {
        name: "professional",
        main_color: "#474A51",    // Graphite Gray
        second_color: "#E52521",  // Mario Red
        third_color: "#3CB043"    // Luigi Green
    },
    {
        name: "ocean",
        main_color: "#1E40AF",    // Vibrant Blue
        second_color: "#06B6D4",  // Cyan
        third_color: "#10B981"    // Emerald
    },
    {
        name: "sunset",
        main_color: "#DC2626",    // Vibrant Red
        second_color: "#F59E0B",  // Amber
        third_color: "#EF4444"    // Red Orange
    },
    {
        name: "forest",
        main_color: "#059669",    // Deep Emerald
        second_color: "#10B981",  // Green
        third_color: "#F59E0B"    // Golden Yellow
    },
    {
        name: "fire",
        main_color: "#EA580C",    // Orange
        second_color: "#DC2626",  // Red
        third_color: "#F59E0B"    // Amber
    },
    {
        name: "steel",
        main_color: "#374151",    // Steel Gray
        second_color: "#6B7280",  // Medium Gray
        third_color: "#10B981"    // Emerald
    },
    {
        name: "navy",
        main_color: "#1E3A8A",    // Navy Blue
        second_color: "#3B82F6",  // Bright Blue
        third_color: "#F59E0B"    // Amber
    },
    {
        name: "charcoal",
        main_color: "#1F2937",    // Charcoal
        second_color: "#EF4444",  // Red
        third_color: "#22C55E"    // Green
    },
    {
        name: "slate",
        main_color: "#475569",    // Slate Blue
        second_color: "#0EA5E9",  // Sky Blue
        third_color: "#F97316"    // Orange
    },
    {
        name: "midnight",
        main_color: "#0F172A",    // Midnight Blue
        second_color: "#8B5CF6",  // Purple
        third_color: "#06B6D4"    // Cyan
    },
];

// Utility functions
const ColorUtils = {
    // Get a random palette
    getRandomPalette: () => {
        const randomIndex = Math.floor(Math.random() * COLOR_PALETTES.length);
        return COLOR_PALETTES[randomIndex];
    },

    // Get a specific palette by name
    getPaletteByName: (name) => {
        return COLOR_PALETTES.find(palette => palette.name === name);
    },

    // Apply colors to CSS custom properties
    applyColors: (palette) => {
        const root = document.documentElement;
        
        console.log(`🎨 Applying palette: ${palette.name}`, palette);
        
        // Set CSS custom properties - use the same names as in CSS
        root.style.setProperty('--color-primary', palette.main_color);
        root.style.setProperty('--color-second', palette.second_color);
        root.style.setProperty('--color-third', palette.third_color);
        
        // Also set legacy property names for backward compatibility
        root.style.setProperty('--main-color', palette.main_color);
        root.style.setProperty('--second-color', palette.second_color);
        root.style.setProperty('--third-color', palette.third_color);
        
        // Add a data attribute to track current palette
        root.setAttribute('data-color-palette', palette.name);
        
        // Verify the colors were applied
        const appliedPrimary = getComputedStyle(root).getPropertyValue('--color-primary').trim();
        console.log(`🎨 Primary color applied: ${appliedPrimary} (expected: ${palette.main_color})`);
        
        console.log(`🎨 Applied color palette: ${palette.name}`);
    },

    // Generate complementary colors (for future use)
    generateComplementary: (baseColor) => {
        // This could be expanded to generate complementary colors
        // For now, we'll use predefined palettes
        return baseColor;
    },

    // Smooth transition between color palettes
    transitionToPalette: (palette, duration = 1000) => {
        const root = document.documentElement;
        
        // Add transition class
        root.classList.add('color-transition');
        
        // Apply new colors
        ColorUtils.applyColors(palette);
        
        // Remove transition class after animation
        setTimeout(() => {
            root.classList.remove('color-transition');
        }, duration);
    }
};

// Main initialization function
function initializeDynamicColors() {
    console.log('🎨 Initializing dynamic color system...');
    
    // Use Hugo config palettes if available, otherwise use fallback palettes
    if (window.HUGO_COLOR_PALETTES && window.HUGO_COLOR_PALETTES.length > 0) {
        COLOR_PALETTES = window.HUGO_COLOR_PALETTES;
        console.log('🎨 Using Hugo config color palettes:', COLOR_PALETTES.length, 'palettes');
    } else {
        console.log('🎨 Using fallback color palettes:', COLOR_PALETTES.length, 'palettes');
    }
    
    // Check if we should use a specific palette from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const requestedPalette = urlParams.get('palette');
    
    let selectedPalette;
    
    if (requestedPalette) {
        // Use requested palette if valid
        selectedPalette = ColorUtils.getPaletteByName(requestedPalette);
        if (!selectedPalette) {
            console.warn(`Requested palette "${requestedPalette}" not found, using random palette`);
            selectedPalette = ColorUtils.getRandomPalette();
        }
    } else {
        // Use random palette
        selectedPalette = ColorUtils.getRandomPalette();
    }
    
    // Apply the selected palette
    ColorUtils.applyColors(selectedPalette);
    
    // Store current palette for potential use by other scripts
    window.currentColorPalette = selectedPalette;
    
    return selectedPalette;
}

// Color palette cycling (for testing or user interaction)
function cycleColorPalette() {
    const currentPaletteName = document.documentElement.getAttribute('data-color-palette');
    const currentIndex = COLOR_PALETTES.findIndex(p => p.name === currentPaletteName);
    const nextIndex = (currentIndex + 1) % COLOR_PALETTES.length;
    
    ColorUtils.transitionToPalette(COLOR_PALETTES[nextIndex]);
    window.currentColorPalette = COLOR_PALETTES[nextIndex];
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts have loaded
    setTimeout(initializeDynamicColors, 100);
});

// Also initialize on window load as backup
window.addEventListener('load', function() {
    // Check if colors were already initialized
    if (!document.documentElement.getAttribute('data-color-palette')) {
        console.log('🎨 Colors not initialized on DOMContentLoaded, initializing on window load');
        initializeDynamicColors();
    }
});

// Export for potential use by other scripts
window.DynamicColors = {
    initialize: initializeDynamicColors,
    cycle: cycleColorPalette,
    apply: ColorUtils.applyColors,
    getRandom: ColorUtils.getRandomPalette,
    getByName: ColorUtils.getPaletteByName,
    palettes: COLOR_PALETTES
};

// Debug function (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugColors = {
        list: () => console.table(COLOR_PALETTES),
        current: () => console.log(window.currentColorPalette),
        cycle: cycleColorPalette,
        apply: (name) => {
            const palette = ColorUtils.getPaletteByName(name);
            if (palette) {
                ColorUtils.applyColors(palette);
                window.currentColorPalette = palette;
            } else {
                console.error(`Palette "${name}" not found`);
            }
        },
        test: () => {
            console.log('🎨 Testing color system...');
            console.log('Available palettes:', COLOR_PALETTES.map(p => p.name));
            console.log('Current palette:', document.documentElement.getAttribute('data-color-palette'));
            console.log('Current primary color:', getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
            console.log('Hugo palettes available:', window.HUGO_COLOR_PALETTES ? window.HUGO_COLOR_PALETTES.length : 'No');
        },
        forceRandom: () => {
            const randomPalette = ColorUtils.getRandomPalette();
            console.log('🎨 Forcing random palette:', randomPalette.name);
            ColorUtils.applyColors(randomPalette);
            window.currentColorPalette = randomPalette;
        }
    };
    console.log('🎨 Dynamic Colors loaded! Use window.debugColors for testing');
    console.log('🎨 Try: window.debugColors.test() or window.debugColors.forceRandom()');
}

;
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
    const animatedElements = heroSection.querySelectorAll('[data-animation]');
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
    const originalText = typewriterElement.getAttribute('data-original-text') || typewriterElement.textContent;
    const concepts = originalText.split('. ').map(concept => concept.trim()).filter(concept => concept.length > 0);
    let currentConceptIndex = 0;

    typewriterElement.textContent = '';
    typewriterElement.style.color = 'transparent';

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
        const timeline = gsap.timeline();

        chars.forEach((char, index) => {
            timeline.to(typewriterElement, {
                duration: 0.08,
                onUpdate: function() {
                    const textContent = chars.slice(0, index + 1).join('');
                    typewriterElement.textContent = textContent;
                    typewriterElement.appendChild(cursor);
                    typewriterElement.style.color = 'inherit';
                }
            });
        });

        timeline.to(typewriterElement, { duration: 1.5 });

        const reversedChars = [...chars].reverse();
        reversedChars.forEach((char, index) => {
            timeline.to(typewriterElement, {
                duration: 0.04,
                onUpdate: function() {
                    const textContent = reversedChars.slice(index + 1).reverse().join('');
                    typewriterElement.textContent = textContent;
                    typewriterElement.appendChild(cursor);
                }
            });
        });

        timeline.to(typewriterElement, { duration: 0.5 });

        timeline.call(onComplete);
    }

    function startTypingLoop() {
        if (currentConceptIndex >= concepts.length) {
            currentConceptIndex = 0;
        }

        typeConcept(concepts[currentConceptIndex], () => {
            currentConceptIndex++;
            setTimeout(startTypingLoop, 200);
        });
    }

    setTimeout(startTypingLoop, startDelayMs);
}

function initTypingEffect() {
    if (typingEffectInitialized) return;

    const typewriterElements = document.querySelectorAll('.typewriter');
    if (!typewriterElements.length) return;

    typewriterElements.forEach((el) => {
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

window.addEventListener('resize', function() {
    // Refresh any GSAP animations if needed
    if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.invalidate();
    }
});