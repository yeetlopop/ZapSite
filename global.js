// ===================================
// ZAPSITE UB - GLOBAL JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileMenu();
    initNavbarScroll();
    initActiveNavigation();
    initSmoothScroll();
    initAnimatedStatistics();
    initScrollAnimations();
    initFormValidation();
    initFAQAccordion();
    initTeamCardHover();
    initTutorialSystem();
    initScrollProgress();
});

// ===================================
// MOBILE MENU
// ===================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ===================================
// ACTIVE NAVIGATION
// ===================================
function initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===================================
// SMOOTH SCROLLING
// ===================================
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// ANIMATED STATISTICS
// ===================================
function initAnimatedStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateNumber(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateNumber() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        }
        
        updateNumber();
    }
    
    function checkStatsVisibility() {
        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection || hasAnimated) return;
        
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            hasAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateNumber(stat, target);
            });
        }
    }
    
    window.addEventListener('scroll', checkStatsVisibility);
    checkStatsVisibility();
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-delay-1, .fade-in-delay-2, .fade-in-delay-3');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// ===================================
// FORM VALIDATION
// ===================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                showFormSuccess(form);
                form.reset();
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const name = input.name.toLowerCase();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (input.required && value === '') {
        isValid = false;
        errorMessage = 'Dette feltet er påkrevd';
    }
    
    // Email validation
    if (name.includes('email') && value !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst skriv inn en gyldig e-postadresse';
        }
    }
    
    // Phone validation
    if (name.includes('phone') || name.includes('telefon')) {
        const phonePattern = /^[\d\s\+\-\(\)]{8,}$/;
        if (value !== '' && !phonePattern.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst skriv inn et gyldig telefonnummer';
        }
    }
    
    // Minimum length validation
    if (input.minLength && value.length < input.minLength) {
        isValid = false;
        errorMessage = `Må være minst ${input.minLength} tegn`;
    }
    
    // Show or hide error
    if (!isValid) {
        showError(input, errorMessage);
    } else {
        clearError(input);
    }
    
    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = 'var(--accent-error)';
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = '';
}

function showFormSuccess(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div style="background: var(--accent-success); color: white; padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem; text-align: center;">
            ✓ Takk! Vi har mottatt meldingen din og vil svare så snart som mulig.
        </div>
    `;
    
    form.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// ===================================
// FAQ ACCORDION
// ===================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.padding = '0 2rem';
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    // Set max-height to actual content height
                    answer.style.maxHeight = (answer.scrollHeight + 100) + 'px';
                    answer.style.padding = '0 2rem 2rem 2rem';
                    
                    // Scroll to make sure the FAQ item is visible
                    setTimeout(() => {
                        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                        const itemTop = item.getBoundingClientRect().top + window.pageYOffset;
                        const scrollPosition = itemTop - navbarHeight - 20;
                        
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            });
        }
    });
}

// ===================================
// TEAM CARD HOVER
// ===================================
function initTeamCardHover() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const regularImage = card.querySelector('.team-image-regular');
        const hoverImage = card.querySelector('.team-image-hover');
        
        if (regularImage && hoverImage) {
            card.addEventListener('mouseenter', function() {
                regularImage.style.opacity = '0';
                hoverImage.style.opacity = '1';
            });
            
            card.addEventListener('mouseleave', function() {
                regularImage.style.opacity = '1';
                hoverImage.style.opacity = '0';
            });
        }
    });
}

// ===================================
// TUTORIAL SYSTEM
// ===================================
function initTutorialSystem() {
    const courseCards = document.querySelectorAll('.course-card');
    const lessonNavigation = document.querySelectorAll('.lesson-nav button');
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    // Course selection
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            selectCourse(courseId);
        });
    });
    
    // Lesson navigation
    lessonNavigation.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.getAttribute('data-direction');
            navigateLesson(direction);
        });
    });
    
    // Quiz functionality
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            checkAnswer(this);
        });
    });
}

function selectCourse(courseId) {
    // Store selected course
    localStorage.setItem('selectedCourse', courseId);
    
    // Navigate to lessons
    const coursesContainer = document.querySelector('.courses-container');
    const lessonsContainer = document.querySelector('.lessons-container');
    
    if (coursesContainer && lessonsContainer) {
        coursesContainer.style.display = 'none';
        lessonsContainer.style.display = 'block';
        loadLesson(courseId, 1);
    }
}

function navigateLesson(direction) {
    const courseId = localStorage.getItem('selectedCourse');
    const currentLesson = parseInt(localStorage.getItem('currentLesson') || '1');
    
    let newLesson = currentLesson;
    if (direction === 'prev' && currentLesson > 1) {
        newLesson = currentLesson - 1;
    } else if (direction === 'next') {
        newLesson = currentLesson + 1;
    }
    
    loadLesson(courseId, newLesson);
}

function loadLesson(courseId, lessonNumber) {
    localStorage.setItem('currentLesson', lessonNumber);
    
    // Update UI
    const lessons = document.querySelectorAll('.lesson');
    lessons.forEach(lesson => {
        lesson.style.display = 'none';
    });
    
    const currentLessonElement = document.querySelector(`.lesson[data-course="${courseId}"][data-lesson="${lessonNumber}"]`);
    if (currentLessonElement) {
        currentLessonElement.style.display = 'block';
    }
    
    // Update navigation buttons
    updateLessonNavigation(courseId, lessonNumber);
    
    // Update progress
    updateProgress(courseId, lessonNumber);
}

function updateLessonNavigation(courseId, lessonNumber) {
    const totalLessons = courseId === '1' ? 14 : 5;
    const prevButton = document.querySelector('.lesson-nav button[data-direction="prev"]');
    const nextButton = document.querySelector('.lesson-nav button[data-direction="next"]');
    
    if (prevButton) {
        prevButton.disabled = lessonNumber <= 1;
        prevButton.style.opacity = lessonNumber <= 1 ? '0.5' : '1';
    }
    
    if (nextButton) {
        nextButton.textContent = lessonNumber >= totalLessons ? 'Fullfør kurs' : 'Neste';
    }
}

function updateProgress(courseId, lessonNumber) {
    const totalLessons = courseId === '1' ? 14 : 5;
    const progressPercent = (lessonNumber / totalLessons) * 100;
    
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar) {
        progressBar.style.width = progressPercent + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${lessonNumber} av ${totalLessons}`;
    }
}

function checkAnswer(option) {
    const isCorrect = option.getAttribute('data-correct') === 'true';
    const quizContainer = option.closest('.quiz-container');
    const feedbackElement = quizContainer.querySelector('.quiz-feedback');
    
    // Disable all options
    const allOptions = quizContainer.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt.getAttribute('data-correct') === 'true') {
            opt.style.backgroundColor = 'var(--accent-success)';
            opt.style.color = 'white';
        }
    });
    
    if (isCorrect) {
        option.style.backgroundColor = 'var(--accent-success)';
        option.style.color = 'white';
        feedbackElement.textContent = '✓ Riktig svar!';
        feedbackElement.style.color = 'var(--accent-success)';
        
        // Update progress
        const courseId = localStorage.getItem('selectedCourse');
        const currentLesson = parseInt(localStorage.getItem('currentLesson'));
        const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
        if (!completedLessons[courseId]) {
            completedLessons[courseId] = [];
        }
        if (!completedLessons[courseId].includes(currentLesson)) {
            completedLessons[courseId].push(currentLesson);
            localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        }
    } else {
        option.style.backgroundColor = 'var(--accent-error)';
        option.style.color = 'white';
        feedbackElement.textContent = '✗ Feil svar. Prøv igjen!';
        feedbackElement.style.color = 'var(--accent-error)';
        
        // Re-enable options after delay
        setTimeout(() => {
            allOptions.forEach(opt => {
                opt.style.pointerEvents = 'auto';
                opt.style.backgroundColor = '';
                opt.style.color = '';
            });
            feedbackElement.textContent = '';
        }, 2000);
    }
    
    feedbackElement.style.display = 'block';
}

// ===================================
// HELPER FUNCTIONS
// ===================================

// Get current page filename
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Scroll to element
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = element.offsetTop - navbarHeight - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// FLOATING BACK TO TOP BUTTON
// ===================================
function initFloatingBackToTop() {
    // Create floating back to top button
    const floatingBtn = document.createElement('button');
    floatingBtn.className = 'floating-back-to-top';
    floatingBtn.innerHTML = '↑';
    floatingBtn.setAttribute('aria-label', 'Tilbake til toppen');
    floatingBtn.setAttribute('title', 'Tilbake til toppen');
    document.body.appendChild(floatingBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            floatingBtn.classList.add('visible');
        } else {
            floatingBtn.classList.remove('visible');
        }
    }, 100));
    
    // Scroll to top on click
    floatingBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// SCROLL PROGRESS BAR
// ===================================
function initScrollProgress() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Export functions for use in other files
window.ZapSite = {
    scrollToElement,
    debounce,
    loadLesson,
    navigateLesson
};