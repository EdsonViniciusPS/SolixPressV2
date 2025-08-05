document.addEventListener('DOMContentLoaded', function() {
    // MENU MOBILE - Implementação Robusta
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    let isMenuOpen = false;

    // Função para abrir menu
    function openMenu() {
        navMenu.classList.add('active');
        body.classList.add('nav-open');
        isMenuOpen = true;
        animateHamburger(true);
        // Prevenir scroll do body quando menu aberto
        body.style.overflow = 'hidden';
    }

    // Função para fechar menu
    function closeMenu() {
        navMenu.classList.remove('active');
        body.classList.remove('nav-open');
        isMenuOpen = false;
        animateHamburger(false);
        // Restaurar scroll do body
        body.style.overflow = '';
    }

    // Animação do hamburger
    function animateHamburger(isOpen) {
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (isOpen) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    }

    // Toggle menu no clique
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            isMenuOpen ? closeMenu() : openMenu();
        });

        // Fechar menu quando clicar nos links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        // Fechar menu quando clicar fora (apenas mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && isMenuOpen) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    closeMenu();
                }
            }
        });

        // Touch gestures para mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (window.innerWidth <= 768) {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const verticalSwipeThreshold = 100;
            const horizontalDistance = Math.abs(touchEndX - touchStartX);
            const verticalDistance = Math.abs(touchEndY - touchStartY);

            // Evitar conflito com scroll vertical
            if (verticalDistance > verticalSwipeThreshold) return;

            // Swipe left para fechar menu
            if (touchEndX < touchStartX - swipeThreshold && isMenuOpen) {
                closeMenu();
            }
            // Swipe right para abrir menu (apenas da borda esquerda)
            else if (touchEndX > touchStartX + swipeThreshold && 
                     !isMenuOpen && 
                     touchStartX < 50) {
                openMenu();
            }
        }
    }

    // Fechar menu automaticamente no resize para desktop
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
            adjustHeaderForMobile();
        }, 150);
    });

    // Ajuste responsivo do header
    function adjustHeaderForMobile() {
        const header = document.querySelector('.header');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            header.style.padding = '0';
        } else {
            header.style.padding = '';
            // Garantir que menu esteja visível no desktop
            if (navMenu) navMenu.style.display = '';
        }
    }

    // Inicialização
    adjustHeaderForMobile();

    // Header scroll effect - Melhorado
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const header = document.querySelector('.header');
        if (header) {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
                header.style.backdropFilter = 'blur(10px)';
            }
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Smooth scrolling otimizado
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                // Fechar menu mobile se estiver aberto
                if (isMenuOpen) closeMenu();
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        // Simple validation
        if (name && email && message) {
            // Show success message
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset();
        } else {
            showNotification('Por favor, preencha todos os campos.', 'error');
        }
    });

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + (counter.textContent.includes('%') ? '%' : '+');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : '+');
                }
            }, 20);
        });
    }

    // Performance otimizada para intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    let isObserverActive = true;
    const observer = new IntersectionObserver((entries) => {
        if (!isObserverActive) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Evitar re-animação
                if (element.classList.contains('animated')) return;
                element.classList.add('animated');
                
                element.style.animation = 'fadeInUp 0.6s ease forwards';
                
                // Animate counters when stats section is visible
                if (element.classList.contains('stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .portfolio-item, .stats, .about-text, .partner-item').forEach(el => {
        observer.observe(el);
    });

    // Desativar observer em dispositivos de baixa performance
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        isObserverActive = false;
    }

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText.replace(/<[^>]*>/g, ''), 50);
    }, 1000);

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Portfolio filter functionality (if needed in future)
    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.6s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    // Image lazy loading
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Initialize lazy loading
    lazyLoadImages();

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove any loading spinner if exists
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    });
});
