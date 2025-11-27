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