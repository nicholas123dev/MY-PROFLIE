// ==========================================
//   LINK IN BIO - MAIN JAVASCRIPT
// ==========================================

class LinkInBio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateElements();
        this.setupThemeToggle();
        this.setupStats();
        this.setupForms();
        this.setupScrollAnimations();
        this.loadUserData();
    }

    // ==========================================
    //   EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Contact form modal
        window.openContactForm = () => this.openContactForm();
        window.closeContactForm = () => this.closeContactForm();

        // Close modal on overlay click
        const modal = document.getElementById('contactModal');
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeContactForm();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeContactForm();
            }
        });

        // Profile image click animation
        const profileImage = document.getElementById('profileImage');
        profileImage?.addEventListener('click', () => this.profileImageAnimation());

        // Link tracking
        this.setupLinkTracking();

        // Scroll to top on logo click
        const profileSection = document.querySelector('.profile-section');
        profileSection?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    //   THEME MANAGEMENT
    // ==========================================
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme');
        
        // Apply saved theme or default to light
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const isDark = body.classList.contains('dark-theme');

        if (isDark) {
            body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }

        // Animate theme change
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    // ==========================================
    //   ANIMATIONS
    // ==========================================
    animateElements() {
        // Animate elements on page load
        const elements = document.querySelectorAll('.header, .stats-section, .social-links, .featured-section, .contact-section, .newsletter-section');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150);
        });

        // Animate social links
        const socialLinks = document.querySelectorAll('.link-item');
        socialLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.6s ease-out';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 800 + (index * 100));
        });
    }

    profileImageAnimation() {
        const profileImage = document.getElementById('profileImage');
        const border = document.querySelector('.profile-border');
        
        // Trigger pulse animation
        border.style.opacity = '0.5';
        profileImage.style.transform = 'scale(1.1) rotate(5deg)';
        
        setTimeout(() => {
            border.style.opacity = '0';
            profileImage.style.transform = 'scale(1) rotate(0deg)';
        }, 300);

        // Add some fun effects
        this.createConfetti(profileImage);
    }

    createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            document.body.appendChild(confetti);

            const angle = (i / 12) * 2 * Math.PI;
            const velocity = 100 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let x = centerX;
            let y = centerY;
            let opacity = 1;

            const animate = () => {
                x += vx * 0.02;
                y += vy * 0.02 + 2; // gravity
                opacity -= 0.02;

                confetti.style.left = x + 'px';
                confetti.style.top = y + 'px';
                confetti.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(confetti);
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // ==========================================
    //   STATISTICS ANIMATION
    // ==========================================
    setupStats() {
        const statsSection = document.querySelector('.stats-section');
        const statNumbers = document.querySelectorAll('.stat-number');
        let animated = false;

        const animateStats = () => {
            if (animated) return;
            animated = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                const increment = target / 60; // 60 frames for 1 second at 60fps
                let current = 0;

                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        stat.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target.toLocaleString();
                    }
                };

                updateCount();
            });
        };

        // Trigger animation when stats section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateStats, 300);
                }
            });
        }, { threshold: 0.5 });

        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // ==========================================
    //   SCROLL ANIMATIONS
    // ==========================================
    setupScrollAnimations() {
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

        // Observe featured items and contact items
        const elementsToAnimate = document.querySelectorAll('.featured-item, .contact-item');
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    // ==========================================
    //   MODAL MANAGEMENT
    // ==========================================
    openContactForm() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            setTimeout(() => firstInput?.focus(), 100);
        }
    }

    closeContactForm() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ==========================================
    //   FORM HANDLING
    // ==========================================
    setupForms() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        newsletterForm?.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));

        // Contact form
        const contactForm = document.getElementById('contactForm');
        contactForm?.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('.newsletter-btn');

        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        button.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateAPICall();
            
            // Success feedback
            this.showNotification('🎉 Successfully subscribed to newsletter!', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('❌ Subscription failed. Please try again.', 'error');
        } finally {
            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const button = form.querySelector('.form-submit-btn');

        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateAPICall();
            
            // Success feedback
            this.showNotification('✅ Message sent successfully!', 'success');
            form.reset();
            this.closeContactForm();
        } catch (error) {
            this.showNotification('❌ Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    // ==========================================
    //   NOTIFICATIONS
    // ==========================================
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ==========================================
    //   LINK TRACKING
    // ==========================================
    setupLinkTracking() {
        const socialLinks = document.querySelectorAll('.link-item');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = link.classList[1]; // Get platform class name
                this.trackLinkClick(platform);
                
                // Add click animation
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);
            });
        });
    }

    trackLinkClick(platform) {
        // Store click data in localStorage
        const clicks = JSON.parse(localStorage.getItem('linkClicks') || '{}');
        clicks[platform] = (clicks[platform] || 0) + 1;
        localStorage.setItem('linkClicks', JSON.stringify(clicks));

        // You can also send this data to analytics services
        console.log(`Link clicked: ${platform}`);
        
        // Example: Google Analytics (if implemented)
        // gtag('event', 'click', {
        //     event_category: 'social_link',
        //     event_label: platform
        // });
    }

    // ==========================================
    //   USER DATA MANAGEMENT
    // ==========================================
    loadUserData() {
        // Load user data from localStorage or API
        const userData = this.getUserData();
        
        if (userData) {
            this.populateUserData(userData);
        }
    }

    getUserData() {
        // Try to get user data from localStorage first
        const localData = localStorage.getItem('linkInBioData');
        
        if (localData) {
            return JSON.parse(localData);
        }

        // Default data structure
        return {
            name: 'Your Name',
            title: 'Digital Creator & Entrepreneur',
            bio: 'Welcome to my digital space! I\'m passionate about creating amazing content and connecting with like-minded individuals. Follow my journey across these platforms and let\'s build something awesome together! ✨',
            profileImage: 'https://via.placeholder.com/150x150/667eea/ffffff?text=YOU',
            socialLinks: {
                instagram: 'https://www.instagram.com/imnicholassasraku?igsh=cDkzYmo5NGltd3hi',
                twitter: 'https://twitter.com/yourusername',
                linkedin: 'https://linkedin.com/in/yourusername',
                tiktok: 'https://tiktok.com/@yourusername',
                youtube: 'https://youtube.com/@yourusername',
                github: 'https://github.com/yourusername'
            },
            contact: {
                email: 'sasrakunicholas2@gmail.com',
                phone: ''
            },
            
        }
    }

    populateUserData(data) {
        // Update name
        const nameElement = document.getElementById('userName');
        if (nameElement && data.name) {
            nameElement.textContent = data.name;
        }

        // Update title
        const titleElement = document.getElementById('userTitle');
        if (titleElement && data.title) {
            titleElement.textContent = data.title;
        }

        // Update bio
        const bioElement = document.getElementById('userBio');
        if (bioElement && data.bio) {
            bioElement.textContent = data.bio;
        }

        // Update profile image
        const profileImageElement = document.getElementById('profileImage');
        if (profileImageElement && data.profileImage) {
            profileImageElement.src = data.profileImage;
            profileImageElement.alt = `${data.name} Profile Photo`;
        }

        // Update social links
        if (data.socialLinks) {
            Object.keys(data.socialLinks).forEach(platform => {
                const linkElement = document.querySelector(`.${platform}[href]`);
                if (linkElement && data.socialLinks[platform]) {
                    linkElement.href = data.socialLinks[platform];
                }
            });
        }

        // Update contact info
        if (data.contact) {
            const emailLink = document.querySelector('a[href^="mailto:"]');
            if (emailLink && data.contact.email) {
                emailLink.href = `mailto:${data.contact.email}`;
                const emailText = emailLink.querySelector('.contact-subtitle');
                if (emailText) emailText.textContent = data.contact.email;
            }

            const phoneLink = document.querySelector('a[href^="tel:"]');
            if (phoneLink && data.contact.phone) {
                phoneLink.href = `tel:${data.contact.phone}`;
                const phoneText = phoneLink.querySelector('.contact-subtitle');
                if (phoneText) phoneText.textContent = data.contact.phone;
            }
        }

    }

    saveUserData(data) {
        localStorage.setItem('linkInBioData', JSON.stringify(data));
    }

    // ==========================================
    //   UTILITY FUNCTIONS
    // ==========================================
    async simulateAPICall(delay = 1500) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve('Success');
                } else {
                    reject(new Error('API Error'));
                }
            }, delay);
        });
    }

    // Copy link functionality
    copyLink() {
        const url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('🔗 Link copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('🔗 Link copied to clipboard!', 'success');
        }
    }

    // Share functionality
    async shareProfile() {
        const shareData = {
            title: document.querySelector('.name').textContent,
            text: document.querySelector('.bio p').textContent,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback - copy to clipboard
                this.copyLink();
            }
        } catch (error) {
            console.log('Error sharing:', error);
            this.copyLink();
        }
    }

    // Get analytics data
    getAnalytics() {
        const clicks = JSON.parse(localStorage.getItem('linkClicks') || '{}');
        const totalClicks = Object.values(clicks).reduce((sum, count) => sum + count, 0);
        
        return {
            totalClicks,
            clicksByPlatform: clicks,
            visits: parseInt(localStorage.getItem('pageViews') || '0')
        };
    }
}

// ==========================================
//   INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Track page view
    const pageViews = parseInt(localStorage.getItem('pageViews') || '0') + 1;
    localStorage.setItem('pageViews', pageViews.toString());

    // Initialize the Link in Bio application
    window.linkInBio = new LinkInBio();

    // Add some global utility functions
    window.copyProfileLink = () => window.linkInBio.copyLink();
    window.shareProfile = () => window.linkInBio.shareProfile();
    window.getAnalytics = () => window.linkInBio.getAnalytics();

    // Console welcome message
    console.log(`
    🔗 Link in Bio - Ready!
    
    Available commands:
    - copyProfileLink() - Copy profile URL
    - shareProfile() - Share profile  
    - getAnalytics() - View click analytics
    
    Customize your data by editing the getUserData() method or 
    saving data with linkInBio.saveUserData(data)
    `);
});

// ==========================================
//   PERFORMANCE MONITORING
// ==========================================
window.addEventListener('load', () => {
    // Log performance metrics
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }

    // Lazy load images if needed
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinkInBio;
}