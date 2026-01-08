// Vent til DOM er lastet
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // FORBEDRET: Proff shimmer effekt for section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    const headerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Legg til shimmer effekt når section er synlig
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, 500);
            }
        });
    }, { threshold: 0.3 });
    
    sectionHeaders.forEach(header => {
        headerObserver.observe(header);
    });
    
    // Intersection Observer for animations - FORBEDRET
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Spesiell behandling for service-cards
                if (entry.target.classList.contains('service-card')) {
                    const cards = document.querySelectorAll('.service-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    const delay = index * 200; // Økt forsinkelse for bedre effekt
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, delay);
                } else {
                    // For andre elementer, animer umiddelbart
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .pricing-card, .about-text, .contact-info');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // FORBEDRET: Team medlemmer vertikal animasjon
    const teamMembers = document.querySelectorAll('.team-member');
    const teamObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const members = document.querySelectorAll('.team-member');
                members.forEach((member, index) => {
                    setTimeout(() => {
                        member.style.opacity = '1';
                        member.style.transform = 'translateY(0) translateX(0)';
                    }, index * 300); // Økt forsinkelse for dramatisk effekt
                });
                teamObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    if (teamMembers.length > 0) {
        teamMembers.forEach(member => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(50px) translateX(-30px)';
            member.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        teamObserver.observe(teamMembers[0].closest('.team-section'));
    }
    
    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();
            
            // Basic validation
            let errors = [];
            
            if (name.length < 2) {
                errors.push('Navn må være minst 2 tegn');
            }
            
            if (!validateEmail(email)) {
                errors.push('Vennligst oppgi en gyldig e-postadresse');
            }
            
            if (message.length < 10) {
                errors.push('Melding må være minst 10 tegn');
            }
            
            if (errors.length > 0) {
                showNotification(errors.join(', '), 'error');
                return;
            }
            
            // Show success message
            showNotification('Takk for din henvendelse! Vi kontakter deg snart.', 'success');
            contactForm.reset();
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', {
                name: name,
                company: formData.get('company').trim(),
                email: email,
                phone: formData.get('phone').trim(),
                message: message
            });
        });
    }
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.service-card, .pricing-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let charIndex = 0;
        
        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Active navigation highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinksHighlight = document.querySelectorAll('.nav-links a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksHighlight.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add loading animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't apply to form submit button
            if (this.classList.contains('submit-button')) return;
            
            const originalText = this.textContent;
            this.textContent = 'Laster...';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 1000);
        });
    });
    
    // Counter animation for pricing (if you want to add number animations)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString('no-NO') + ',-';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString('no-NO') + ',-';
            }
        }, 16);
    }
    
    // Observe pricing cards for counter animation
    const priceElements = document.querySelectorAll('.pricing-price');
    const priceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const priceText = entry.target.textContent;
                const price = parseInt(priceText.replace(/[^\d]/g, ''));
                if (!isNaN(price)) {
                    animateCounter(entry.target, price);
                    entry.target.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });
    
    priceElements.forEach(el => priceObserver.observe(el));
    
    console.log('ZapSite nettside med proff scroll-effekt lastet successfully! 🚀');
});

// Add CSS for active navigation link og shimmer effekt
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--primary-color) !important;
    }
    .nav-links a.active::after {
        width: 100% !important;
    }
    
    .service-card {
        transform: translateY(30px) scale(0.95);
    }
    
    .team-member {
        transform: translateY(50px) translateX(-30px);
    }
    
    /* Shimmer effekt for section headers */
    .section-header.animated {
        animation: shimmer 1s ease-out, float 6s ease-in-out infinite;
    }
    
    @keyframes shimmer {
        0% {
            transform: scale(1) translateY(0);
        }
        50% {
            transform: scale(1.01) translateY(-2px);
        }
        100% {
            transform: scale(1) translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-5px);
        }
    }
    
    /* Hover effekt for section headers */
    .section-header:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 30px 60px -15px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(102, 126, 234, 0.2);
    }
    
    .team-section .section-header:hover {
        box-shadow: 0 30px 60px -15px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.2);
    }
    
    /* Responsive for section headers */
    @media (max-width: 768px) {
        .section-header h2 {
            font-size: 2.2rem !important;
        }
        
        .section-header {
            padding: 2.5rem 1.5rem !important;
            border-radius: 20px !important;
        }
        
        .team-section .section-header h2 {
            font-size: 2.2rem !important;
        }
        
        .team-section .section-header {
            padding: 2.5rem 1.5rem !important;
            border-radius: 20px !important;
        }
        
        .section-header p {
            font-size: 1.1rem !important;
        }
    }
    
    @media (max-width: 480px) {
        .section-header h2 {
            font-size: 1.8rem !important;
        }
        
        .section-header {
            padding: 2rem 1rem !important;
            border-radius: 16px !important;
        }
        
        .team-section .section-header h2 {
            font-size: 1.8rem !important;
        }
        
        .team-section .section-header {
            padding: 2rem 1rem !important;
            border-radius: 16px !important;
        }
        
        .section-header p {
            font-size: 1rem !important;
        }
    }
`;
document.head.appendChild(style);
// Tutorial System
class TutorialSystem {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 5;
        this.completedLevels = new Set();
        
        this.levels = {
            1: {
                title: 'Nivå 1: Din første heading',
                description: 'Lær hvordan du lager en overskrift med HTML. Bruk <h1> taggen!',
                hint: 'Skriv <h1>Hei Verden!</h1> i kodeboksen',
                validator: (code) => {
                    const cleanCode = code.trim().toLowerCase();
                    return cleanCode.includes('<h1>') && cleanCode.includes('</h1>') && cleanCode.includes('hei verden');
                },
                successMessage: 'Gratulerer! Du har laget din første heading!'
            },
            2: {
                title: 'Nivå 2: Legg til tekst',
                description: 'Nå skal du legge til et avsnitt under headingen din. Bruk <p> taggen!',
                hint: 'Skriv <p>Dette er mitt første avsnitt!</p> under h1-elementet',
                validator: (code) => {
                    const cleanCode = code.trim().toLowerCase();
                    return cleanCode.includes('<h1>') && cleanCode.includes('</h1>') && 
                           cleanCode.includes('<p>') && cleanCode.includes('</p>');
                },
                successMessage: 'Fantastisk! Nå har du både en heading og et avsnitt!'
            },
            3: {
                title: 'Nivå 3: Farger og stil',
                description: 'Legg til en farge på headingen din med style-attributtet. Bruk "color: blue;"!',
                hint: 'Endre h1-taggen til: <h1 style="color: blue;">Hei Verden!</h1>',
                validator: (code) => {
                    const cleanCode = code.toLowerCase();
                    return cleanCode.includes('<h1') && cleanCode.includes('style=') && cleanCode.includes('color:');
                },
                successMessage: 'Bra jobba! Du har brukt inline CSS for å endre farge!'
            },
            4: {
                title: 'Nivå 4: Bakgrunnsfarge',
                description: 'Legg til bakgrunnsfarge på avsnittet ditt. Bruk "background-color: lightgray;"!',
                hint: 'Legg til style på p-taggen: <p style="background-color: lightgray;">',
                validator: (code) => {
                    const cleanCode = code.toLowerCase();
                    return cleanCode.includes('<p') && cleanCode.includes('style=') && cleanCode.includes('background-color:');
                },
                successMessage: 'Utmerket! Nå har du styling på flere elementer!'
            },
            5: {
                title: 'Nivå 5: Knapper',
                description: 'Lag din første knapp med <button> taggen. Gi den en farge med style!',
                hint: 'Skriv <button style="background-color: green; color: white;">Klikk meg!</button>',
                validator: (code) => {
                    const cleanCode = code.toLowerCase();
                    return cleanCode.includes('<button') && cleanCode.includes('</button>') && 
                           cleanCode.includes('style=') && cleanCode.includes('background-color:');
                },
                successMessage: 'Fantastisk! Du er nå en HTML-mester! 🎉'
            }
        };
        
        this.init();
    }
    
    init() {
        this.codeEditor = document.getElementById('codeEditor');
        this.previewArea = document.getElementById('previewArea');
        this.levelTitle = document.getElementById('levelTitle');
        this.levelDescription = document.getElementById('levelDescription');
        this.hintText = document.getElementById('hintText');
        this.hintToggle = document.getElementById('hintToggle');
        this.checkButton = document.getElementById('checkButton');
        this.nextButton = document.getElementById('nextButton');
        this.resetButton = document.getElementById('resetButton');
        this.feedbackMessage = document.getElementById('feedbackMessage');
        
        if (!this.codeEditor) return;
        
        this.setupEventListeners();
        this.loadLevel(1);
    }
    
    setupEventListeners() {
        this.codeEditor.addEventListener('input', () => this.updatePreview());
        
        this.checkButton.addEventListener('click', () => this.checkCode());
        
        this.nextButton.addEventListener('click', () => {
            if (this.currentLevel < this.maxLevel) {
                this.loadLevel(this.currentLevel + 1);
            }
        });
        
        this.resetButton.addEventListener('click', () => this.resetLevel());
        
        this.hintToggle.addEventListener('click', () => {
            this.hintText.classList.toggle('show');
            this.hintToggle.textContent = this.hintText.classList.contains('show') ? '✓ Hint' : '💡 Hint';
        });
        
        // Level selection
        document.querySelectorAll('.level-item').forEach(item => {
            item.addEventListener('click', () => {
                const level = parseInt(item.dataset.level);
                if (!item.classList.contains('locked')) {
                    this.loadLevel(level);
                }
            });
        });
    }
    
    loadLevel(levelNum) {
        this.currentLevel = levelNum;
        const level = this.levels[levelNum];
        
        // Update UI
        this.levelTitle.textContent = level.title;
        this.levelDescription.textContent = level.description;
        this.hintText.textContent = level.hint;
        this.codeEditor.value = '';
        this.previewArea.innerHTML = '';
        this.feedbackMessage.classList.remove('show');
        this.hintText.classList.remove('show');
        this.hintToggle.textContent = '💡 Hint';
        
        // Update button states
        this.checkButton.classList.remove('hidden');
        this.nextButton.classList.add('hidden');
        
        // Update level indicators
        this.updateLevelIndicators();
    }
    
    updateLevelIndicators() {
        document.querySelectorAll('.level-item').forEach(item => {
            const level = parseInt(item.dataset.level);
            const levelStatus = item.querySelector('.level-status');
            
            item.classList.remove('active', 'completed');
            
            if (level === this.currentLevel) {
                item.classList.add('active');
                levelStatus.textContent = 'Aktiv';
            } else if (this.completedLevels.has(level)) {
                item.classList.add('completed');
                levelStatus.textContent = 'Fullført ✓';
            } else if (level > this.currentLevel) {
                item.classList.add('locked');
                levelStatus.textContent = 'Låst';
            } else {
                levelStatus.textContent = 'Klar';
            }
        });
    }
    
    updatePreview() {
        const code = this.codeEditor.value;
        this.previewArea.innerHTML = code;
    }
    
    checkCode() {
        const code = this.codeEditor.value.trim();
        const level = this.levels[this.currentLevel];
        
        if (!code) {
            this.showFeedback('Vennligst skriv noe i kodeboksen!', 'error');
            return;
        }
        
        if (level.validator(code)) {
            this.completedLevels.add(this.currentLevel);
            this.showFeedback(level.successMessage, 'success');
            this.checkButton.classList.add('hidden');
            
            if (this.currentLevel < this.maxLevel) {
                this.nextButton.classList.remove('hidden');
            }
            
            this.updateLevelIndicators();
            this.updatePreview();
        } else {
            this.showFeedback('Ikke helt riktig. Prøv igjen eller bruk hintet!', 'error');
        }
    }
    
    resetLevel() {
        this.codeEditor.value = '';
        this.previewArea.innerHTML = '';
        this.feedbackMessage.classList.remove('show');
        this.checkButton.classList.remove('hidden');
        this.nextButton.classList.add('hidden');
    }
    
    showFeedback(message, type) {
        this.feedbackMessage.textContent = message;
        this.feedbackMessage.className = `feedback-message show ${type}`;
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.feedbackMessage.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize tutorial when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are loaded
    setTimeout(() => {
        window.tutorialSystem = new TutorialSystem();
    }, 500);
});
