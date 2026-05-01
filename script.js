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
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Mostrar/ocultar botón scroll to top
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// Menú hamburguesa
if (hamburger && navMenu) {
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
}

// Smooth scroll y active link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetHref = link.getAttribute('href');
        
        // Solo prevenir default si es un hash en la misma página (sin archivo)
        if (targetHref.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetHref);
            
            if (targetSection) {
                // Cerrar menú móvil si está abierto
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
                
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
        // Si tiene archivo (index.html#inicio), dejar que navegue normalmente
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
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

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

if (contactForm) {
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
}

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

// ========================================
// SCROLL AUTOMÁTICO EN PÁGINAS LEGALES
// ========================================

// Detectar si estamos en política de privacidad o términos de servicio
const currentPath = window.location.pathname;
const isLegalPage = currentPath.includes('politica-privacidad') || currentPath.includes('terminos-servicio');

console.log('%cRuta actual: ' + currentPath, 'color: #6366f1; font-size: 12px;');
console.log('%c¿Es página legal?: ' + isLegalPage, 'color: #6366f1; font-size: 12px;');

if (isLegalPage) {
    let autoScrollInterval;
    const scrollAmount = 70; // Píxeles por scroll
    const scrollDelay = 1000; // 1 segundo entre scrolls
    
    // Función para hacer scroll automático
    const autoScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        
        console.log(`Scroll actual: ${currentScroll}px de ${maxScroll}px`);
        
        // Si no hemos llegado al final, continuar scrolling
        if (currentScroll < maxScroll - 10) { // Margen de 10px por si acaso
            window.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            // Al llegar al final, detener el scroll automático
            clearInterval(autoScrollInterval);
            console.log('%cScroll automático completado ✓', 'color: #10b981; font-size: 14px; font-weight: bold;');
        }
    };
    
    // Iniciar scroll automático después de 2 segundos
    setTimeout(() => {
        console.log('%cIniciando scroll automático...', 'color: #10b981; font-size: 14px; font-weight: bold;');
        autoScrollInterval = setInterval(autoScroll, scrollDelay);
    }, 2000);
    
    // Detener el scroll automático si el usuario interactúa con la página
    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            console.log('%cScroll automático detenido por interacción del usuario ⏸', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
            // Remover los event listeners para no seguir detectando
            window.removeEventListener('wheel', stopAutoScroll);
            window.removeEventListener('touchstart', stopAutoScroll);
            window.removeEventListener('keydown', stopAutoScroll);
        }
    };
    
    // Eventos para detectar interacción del usuario
    window.addEventListener('wheel', stopAutoScroll, { once: true });
    window.addEventListener('touchstart', stopAutoScroll, { once: true });
    window.addEventListener('keydown', stopAutoScroll, { once: true });
}

// ========================================
// CHATBOT FUNCTIONALITY - SISTEMA SIMPLE PHP + JSON
// ========================================

// Configuración del API
const CHAT_API_URL = 'chat-api.php';

// Generar ID único de sesión para cada visitante
function generateSessionId() {
    const stored = localStorage.getItem('chatSessionId');
    if (stored) {
        return stored;
    }
    const newId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatSessionId', newId);
    return newId;
}

const chatSessionId = generateSessionId();
let lastMessageTimestamp = 0;
let pollingInterval = null;

const chatbotButton = document.getElementById('chatbotButton');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');
const quickOptions = document.querySelectorAll('.quick-option');

// Abrir/cerrar chatbot
if (chatbotButton) {
    chatbotButton.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            // Iniciar polling cuando se abre el chat
            startPolling();
        } else {
            // Detener polling cuando se cierra
            stopPolling();
        }
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        stopPolling();
    });
}

// Función para agregar mensaje en la interfaz
function addMessage(text, isBot = true, timestamp = null) {
    // Evitar duplicados: verificar si ya existe un mensaje con este timestamp y texto
    if (timestamp) {
        const existingMessages = chatbotMessages.querySelectorAll('.message');
        for (const existingMsg of existingMessages) {
            const existingTimestamp = existingMsg.getAttribute('data-timestamp');
            const existingText = existingMsg.querySelector('p')?.textContent;
            
            if (existingTimestamp === String(timestamp) && existingText === text) {
                console.log('%c⚠️ Mensaje duplicado detectado y evitado', 'color: #f59e0b; font-size: 11px;');
                return; // No agregar el mensaje duplicado
            }
        }
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    messageDiv.setAttribute('data-timestamp', timestamp || Date.now());
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = text;
    messageContent.appendChild(messageParagraph);
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = timestamp ? formatTime(timestamp) : 'Ahora';
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Formatear timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convertir de segundos a milisegundos
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Iniciar polling para obtener mensajes nuevos del admin
function startPolling() {
    if (pollingInterval) return; // Ya está activo
    
    // Consultar cada 3 segundos
    pollingInterval = setInterval(async () => {
        await checkForNewMessages();
    }, 3000);
    
    console.log('%c📡 Polling iniciado - consultando cada 3 segundos', 'color: #3b82f6; font-size: 11px;');
}

// Detener polling
function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log('%c📡 Polling detenido', 'color: #999; font-size: 11px;');
    }
}

// Verificar si hay mensajes nuevos del admin
async function checkForNewMessages() {
    try {
        const response = await fetch(`${CHAT_API_URL}?action=get&sessionId=${chatSessionId}&lastTimestamp=${lastMessageTimestamp}`);
        const data = await response.json();
        
        if (data.success && data.hasNew && data.messages.length > 0) {
            // Agregar nuevos mensajes
            data.messages.forEach(msg => {
                addMessage(msg.text, true, msg.timestamp);
                lastMessageTimestamp = Math.max(lastMessageTimestamp, msg.timestamp);
                
                // Sonido de notificación
                playNotificationSound();
            });
        }
    } catch (error) {
        console.error('Error al verificar mensajes:', error);
    }
}

// Función para mostrar indicador de escritura
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingDiv;
}

// Función para enviar mensaje al servidor
async function saveMessageToServer(text) {
    try {
        const response = await fetch(`${CHAT_API_URL}?action=send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: chatSessionId,
                message: text,
                userAgent: navigator.userAgent,
                page: window.location.href
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('%c✅ Mensaje enviado al servidor', 'color: #10b981; font-size: 11px;');
            // Actualizar timestamp para evitar obtener nuestro propio mensaje
            if (data.message && data.message.timestamp) {
                lastMessageTimestamp = data.message.timestamp;
            }
        } else {
            console.error('Error al enviar mensaje:', data.error);
        }
        
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

// ========================================
// GESTIÓN DE MENSAJES
// ========================================

// Flag para evitar envíos duplicados
let isSendingMessage = false;

// Función para enviar mensaje
function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    
    if (userMessage === '' || isSendingMessage) return;
    
    // Bloquear envíos mientras se procesa
    isSendingMessage = true;
    if (chatbotSend) chatbotSend.disabled = true;
    
    // Agregar mensaje del usuario en la interfaz
    addMessage(userMessage, false);
    chatbotInput.value = '';
    
    // Guardar en el servidor
    saveMessageToServer(userMessage).finally(() => {
        // Desbloquear después de enviar
        isSendingMessage = false;
        if (chatbotSend) chatbotSend.disabled = false;
    });
    
    // Ocultar opciones rápidas después del primer mensaje
    const quickOptionsContainer = document.getElementById('quickOptions');
    if (quickOptionsContainer && quickOptionsContainer.style.display !== 'none') {
        quickOptionsContainer.style.display = 'none';
    }
}

// Event listeners para enviar mensaje
if (chatbotSend) {
    chatbotSend.addEventListener('click', sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Opciones rápidas
quickOptions.forEach(option => {
    option.addEventListener('click', () => {
        const message = option.dataset.message;
        chatbotInput.value = message;
        sendMessage();
    });
});

// Cerrar chatbot al hacer clic fuera
document.addEventListener('click', (e) => {
    if (chatbotWindow && chatbotButton) {
        const isClickInside = chatbotWindow.contains(e.target) || chatbotButton.contains(e.target);
        if (!isClickInside && chatbotWindow.classList.contains('active')) {
            chatbotWindow.classList.remove('active');
        }
    }
});

// Sonido de notificación
function playNotificationSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWm98OScTgwOUKjj8LVjHAU7k9nyy3k=');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('No se pudo reproducir el sonido'));
}

console.log('%c💬 Chatbot simple cargado - PHP + JSON', 'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; font-size: 14px; padding: 8px; border-radius: 5px;');
console.log('%cID de sesión: ' + chatSessionId, 'color: #6366f1; font-size: 12px;');
console.log('%cSistema: PHP + JSON (sin Firebase)', 'color: #10b981; font-size: 12px;');