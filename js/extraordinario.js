 document.addEventListener('DOMContentLoaded', function() {
            // Smooth scroll for navigation
            const navLinks = document.querySelectorAll('#youth-nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    navLinks.forEach(l => l.classList.remove('active'));
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    // Get target section
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        // Calculate offset for sticky nav
                        const navHeight = document.querySelector('.nav-section').offsetHeight;
                        const targetPosition = targetSection.offsetTop - navHeight - 20;
                        
                        // Smooth scroll to target
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Intersection Observer for active nav highlight
            const sections = document.querySelectorAll('section[id]');
            const observerOptions = {
                rootMargin: '-100px 0px -80% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.getAttribute('id');
                        const correspondingNavLink = document.querySelector(`#youth-nav a[href="#${currentId}"]`);
                        
                        if (correspondingNavLink) {
                            // Remove active class from all nav links
                            navLinks.forEach(link => link.classList.remove('active'));
                            // Add active class to current section's nav link
                            correspondingNavLink.classList.add('active');
                        }
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                observer.observe(section);
            });

            // Animation on scroll
            const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) translateX(0)';
                    }
                });
            }, { rootMargin: '0px 0px -100px 0px' });

            animatedElements.forEach(element => {
                // Set initial state for animations
                element.style.opacity = '0';
                if (element.classList.contains('slide-in-left')) {
                    element.style.transform = 'translateX(-50px)';
                } else if (element.classList.contains('slide-in-right')) {
                    element.style.transform = 'translateX(50px)';
                } else {
                    element.style.transform = 'translateY(30px)';
                }
                element.style.transition = 'all 0.8s ease';
                
                animationObserver.observe(element);
            });

            // Hover effects for cards
            const cards = document.querySelectorAll('.event-card, .leader-card, .social-post');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });

            // Gallery hover effects
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    const overlay = this.querySelector('.gallery-overlay');
                    if (overlay) {
                        overlay.style.transform = 'translateY(0)';
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    const overlay = this.querySelector('.gallery-overlay');
                    if (overlay) {
                        overlay.style.transform = 'translateY(100%)';
                    }
                });
            });

            // Social media interactions (simulation)
            const socialPosts = document.querySelectorAll('.social-post');
            socialPosts.forEach(post => {
                const hearts = post.querySelectorAll('.fa-heart');
                hearts.forEach(heart => {
                    heart.addEventListener('click', function(e) {
                        e.preventDefault();
                        this.style.color = this.style.color === 'red' ? '' : 'red';
                        this.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 200);
                    });
                });
            });

            // CTA button effects
            const ctaButtons = document.querySelectorAll('.cta-button');
            ctaButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Create ripple effect
                    const ripple = document.createElement('span');
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(255,255,255,0.6)';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple 0.6s linear';
                    ripple.style.left = '50%';
                    ripple.style.top = '50%';
                    ripple.style.width = '20px';
                    ripple.style.height = '20px';
                    ripple.style.marginLeft = '-10px';
                    ripple.style.marginTop = '-10px';
                    
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                    
                    // Simulate action
                    const originalText = this.textContent;
                    this.textContent = 'Processando...';
                    this.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.opacity = '1';
                    }, 2000);
                });
            });

            // Contact icons hover effect
            const contactIcons = document.querySelectorAll('.contact-icon');
            contactIcons.forEach(icon => {
                icon.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.15) rotate(5deg)';
                });
                
                icon.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) rotate(0deg)';
                });
            });

            // Featured event parallax effect on scroll
            const featuredEvent = document.querySelector('.featured-event');
            if (featuredEvent) {
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.5;
                    
                    if (scrolled < featuredEvent.offsetTop + featuredEvent.offsetHeight) {
                        featuredEvent.style.transform = `translateY(${rate}px)`;
                    }
                });
            }

            // Add CSS for ripple animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            // Initialize tooltips if needed
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            console.log('Ministério Jovem - Página carregada com sucesso! 🙏');
        });