// Portfolio JavaScript - Interactive functionality

class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupContactForm();
        this.setupScrollEffects();
        this.setupActiveNavigation();
        this.setupKeyboardNavigation();
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const lightIcon = document.querySelector('.theme-icon-light');
        const darkIcon = document.querySelector('.theme-icon-dark');
        
        if (!themeToggle) return;
        
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        localStorage.setItem('theme', theme);
        
        const lightIcon = document.querySelector('.theme-icon-light');
        const darkIcon = document.querySelector('.theme-icon-dark');
        
        if (lightIcon && darkIcon) {
            if (theme === 'dark') {
                lightIcon.classList.add('hidden');
                darkIcon.classList.remove('hidden');
            } else {
                lightIcon.classList.remove('hidden');
                darkIcon.classList.add('hidden');
            }
        }
    }

    // Mobile Menu Toggle
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!mobileMenuToggle || !navMenu) return;
        
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling for Navigation
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link, .footer-link');
        const ctaButton = document.querySelector('.cta-button');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.nav-header')?.offsetHeight || 0;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // CTA button smooth scroll
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = document.querySelector('#projects');
                if (targetSection) {
                    const headerHeight = document.querySelector('.nav-header')?.offsetHeight || 0;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    // Active Navigation Highlighting
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!sections.length || !navLinks.length) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeSection = entry.target.getAttribute('id');
                    
                    // Remove active class from all nav links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to corresponding nav link
                    const activeNavLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
                    if (activeNavLink) {
                        activeNavLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Contact Form Handling
    setupContactForm() {
        const form = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');
        
        if (!form || !formSuccess) return;

        // Ensure form starts in normal state and success message is hidden
        form.style.display = 'block';
        formSuccess.classList.add('hidden');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear any previous errors
            this.clearAllErrors();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    clearAllErrors() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
            const fieldName = input.getAttribute('name');
            const errorElement = document.getElementById(`${fieldName}Error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }

    validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Validate name
        if (!this.validateField(name)) {
            isValid = false;
        }
        
        // Validate email
        if (!this.validateField(email)) {
            isValid = false;
        }
        
        // Validate message
        if (!this.validateField(message)) {
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        const fieldName = field.getAttribute('name');
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (!errorElement) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Check if field is empty
        if (!value) {
            isValid = false;
            errorMessage = `${this.capitalizeFirst(fieldName)} is required.`;
        } else {
            // Specific validation rules
            switch (fieldName) {
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long.';
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                    
                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters long.';
                    }
                    break;
            }
        }
        
        // Update field appearance and error message
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
            errorElement.textContent = '';
        } else {
            field.classList.remove('success');
            field.classList.add('error');
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }

    clearFieldError(field) {
        const fieldName = field.getAttribute('name');
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (errorElement) {
            field.classList.remove('error');
            errorElement.textContent = '';
        }
    }

    submitForm() {
        const form = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!form || !formSuccess || !submitButton) return;
        
        // Show loading state
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission delay
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            formSuccess.classList.remove('hidden');
            
            // Reset form after showing success
            setTimeout(() => {
                this.resetForm();
            }, 3000);
            
        }, 1000);
    }

    resetForm() {
        const form = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!form || !formSuccess || !submitButton) return;
        
        // Reset form display
        form.reset();
        form.style.display = 'block';
        formSuccess.classList.add('hidden');
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
        
        // Clear validation classes
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.classList.remove('success', 'error');
        });
        
        // Clear error messages
        this.clearAllErrors();
    }

    // Scroll Effects
    setupScrollEffects() {
        // Check if IntersectionObserver is supported
        if (!window.IntersectionObserver) {
            // Fallback: Add classes immediately
            const animatedElements = document.querySelectorAll(
                '.project-card, .timeline-item, .about-content, .hero-content'
            );
            
            animatedElements.forEach(el => {
                el.classList.add('fade-in-up');
            });
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.project-card, .timeline-item, .about-content, .hero-content'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for hero background
        this.setupParallaxEffect();
    }

    setupParallaxEffect() {
        const heroBackground = document.querySelector('.hero-background');
        
        if (!heroBackground) return;
        
        const handleScroll = this.debounce(() => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled <= window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                const navMenu = document.getElementById('navMenu');
                
                if (mobileMenuToggle && navMenu && navMenu.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    }

    // Utility Functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Performance Optimization
    debounce(func, wait) {
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
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Handle page load performance
window.addEventListener('load', () => {
    // Hide loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
    
    // Add loaded class to body for any load-dependent styles
    document.body.classList.add('loaded');
});

// Handle resize events
window.addEventListener('resize', this.debounce(() => {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Close mobile menu on resize if window becomes larger
    if (window.innerWidth > 768 && mobileMenuToggle && navMenu) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
}, 250));

// Add smooth hover effects for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Ensure external links work properly
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for external links to ensure they work
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ensure the link opens in a new tab
            const href = this.getAttribute('href');
            if (href && href.startsWith('http')) {
                window.open(href, '_blank', 'noopener,noreferrer');
                e.preventDefault();
            }
        });
    });
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.warn('Portfolio: Non-critical error occurred:', e.error);
});

// Add typing effect for hero title (optional enhancement)
class TypingEffect {
    constructor(element, texts, typeSpeed = 100, deleteSpeed = 50, delayBetweenTexts = 2000) {
        if (!element || !texts || !texts.length) return;
        
        this.element = element;
        this.texts = texts;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetweenTexts = delayBetweenTexts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.delayBetweenTexts;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}