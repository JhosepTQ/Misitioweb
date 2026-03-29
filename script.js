// ========================================
// CONFIGURACIÓN Y VARIABLES
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');

// ========================================
// NAVEGACIÓN Y SCROLL
// ========================================

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Mostrar/ocultar botón scroll to top
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Menú hamburguesa
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animación del hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Smooth scroll y active link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Cerrar menú móvil si está abierto
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                
                // Scroll suave
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Actualizar link activo
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// Detectar sección activa al hacer scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll to top
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// ANIMACIONES AL SCROLL
// ========================================

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInElements = document.querySelectorAll('.service-card, .portfolio-item, .benefit-card, .testimonial-card, .about-content, .contact-content');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
            }, index * 100);
            
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeInElements.forEach(el => {
    fadeInObserver.observe(el);
});

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formMessage = document.getElementById('formMessage');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Obtener datos del formulario
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        servicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value
    };
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.servicio || !formData.mensaje) {
        showFormMessage('Por favor, completa todos los campos requeridos.', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Por favor, ingresa un email válido.', 'error');
        return;
    }
    
    // Cambiar estado del botón
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simular envío (aquí deberías integrar con tu backend o servicio de email)
    try {
        // Simulación de delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // IMPORTANTE: Aquí debes integrar tu servicio de email real
        // Ejemplos: EmailJS, Formspree, tu propio backend, etc.
        
        console.log('Datos del formulario:', formData);
        
        // Mostrar mensaje de éxito
        showFormMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
        
        // Limpiar formulario
        contactForm.reset();
        
        // Opcional: redirigir a WhatsApp
        setTimeout(() => {
            const whatsappMessage = `Hola, soy ${formData.nombre}. Estoy interesado en: ${formData.servicio}`;
            const whatsappUrl = `https://wa.me/51992514222?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }, 2000);
        
    } catch (error) {
        console.error('Error al enviar:', error);
        showFormMessage('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ========================================
// ANIMACIONES DE NÚMEROS (CONTADOR)
// ========================================

const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
};

// Observar stats del hero
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                // Ignorar elementos que contengan íconos
                if (stat.querySelector('i')) {
                    return; // Saltar este elemento
                }
                
                const text = stat.textContent;
                const hasPlus = text.includes('+');
                const hasPercent = text.includes('%');
                const number = parseInt(text.replace(/\D/g, ''));
                
                // Solo animar si es un número válido
                if (!isNaN(number)) {
                    stat.textContent = '0' + (hasPercent ? '%' : hasPlus ? '+' : '');
                    animateCounter(stat, number, 2000);
                    
                    // Restaurar el formato original
                    setTimeout(() => {
                        stat.textContent = number + (hasPercent ? '%' : hasPlus ? '+' : '');
                    }, 2100);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ========================================
// EFECTOS ADICIONALES
// ========================================

// Parallax suave en el hero
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const scrolled = window.scrollY;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Hover effect en cards de servicios
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ========================================
// PERFORMANCE Y OPTIMIZACIÓN
// ========================================

// Lazy loading para imágenes (si decides agregar imágenes reales)
document.addEventListener('DOMContentLoaded', () => {
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
});

// Prevenir submit del newsletter en el footer
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            // Aquí integrarías con tu servicio de newsletter (MailChimp, etc.)
            alert('¡Gracias por suscribirte! Te mantendremos informado.');
            newsletterForm.reset();
        }
    });
}

// ========================================
// CONSOLA DE DESARROLLO
// ========================================

console.log('%c¡Sitio Web Profesional Cargado! ', 'background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%cSi estás viendo esto, eres un desarrollador curioso 👨‍💻', 'color: #10b981; font-size: 12px;');
console.log('%cEste sitio fue creado con HTML, CSS y JavaScript puro.', 'color: #6366f1; font-size: 12px;');