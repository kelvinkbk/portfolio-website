// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 30, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 30, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    }
});

// Skill Progress Animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.skill-progress');
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.width = progress + '%';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach(card => {
    skillObserver.observe(card);
});

// Simple AOS Animation on Scroll
const aosElements = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

aosElements.forEach(element => {
    aosObserver.observe(element);
});

// Form Submission - Let Netlify handle everything
// No JavaScript interference needed for Netlify Forms

// Typing Effect for Role Text (Optional Enhancement)
const roleText = document.querySelector('.role-text');
if (roleText) {
    const roles = ['Student & Developer', 'AI Enthusiast', 'Tech Innovator', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeRole() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            roleText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            roleText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeRole, typingSpeed);
    }

    // Start typing effect after page load
    setTimeout(() => {
        typeRole();
    }, 1000);
}

// Cursor Follow Effect (Optional - creates a custom cursor)
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid #6C63FF;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, background 0.2s ease;
        transform: translate(-50%, -50%);
        display: none;
    }
    
    @media (min-width: 769px) {
        .custom-cursor {
            display: block;
        }
    }
    
    .custom-cursor.hover {
        transform: translate(-50%, -50%) scale(1.5);
        background: rgba(108, 99, 255, 0.2);
    }
`;
document.head.appendChild(cursorStyle);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .social-icon, .project-card');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Parallax Effect for Shapes (Optimized with requestAnimationFrame)
let lastY = 0, ticking = false;
const shapes = document.querySelectorAll('.shape');
const onScroll = () => {
    lastY = window.pageYOffset;
    if (!ticking) {
        requestAnimationFrame(() => {
            shapes.forEach((shape, i) => {
                const speed = 0.5 + i * 0.1;
                shape.style.transform = `translateY(${lastY * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
};
window.addEventListener('scroll', onScroll, { passive: true });

// Add scroll reveal animation for stats (Fixed for non-numeric values)
const stats = document.querySelectorAll('.stat-item h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const targetRaw = el.getAttribute('data-target');
        const target = targetRaw === 'Infinity' ? Infinity : Number(targetRaw);
        
        if (!Number.isFinite(target)) { 
            el.textContent = '∞'; 
            statsObserver.unobserve(el);
            return; 
        }

        let current = 0;
        const duration = 1000; // ms
        const start = performance.now();
        const hasPlus = el.textContent.includes('+');
        
        const step = (t) => {
            const p = Math.min((t - start) / duration, 1);
            current = Math.floor(p * target);
            el.textContent = current + (hasPlus ? '+' : '');
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        statsObserver.unobserve(el);
    });
}, { threshold: 0.5 });

stats.forEach(s => statsObserver.observe(s));

// Add active state to navigation based on scroll position (with aria-current)
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            });
            if (navLink) {
                navLink.classList.add('active');
                navLink.setAttribute('aria-current', 'page');
            }
        }
    });
});

// Add entrance animation to hero section
window.addEventListener('load', () => {
    document.querySelector('.hero').style.opacity = '1';
});

console.log('Portfolio website loaded successfully! 🚀');
