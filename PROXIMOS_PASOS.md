# 📋 Próximos Pasos - J&G Web Studio

## 🚨 Acciones Prioritarias (Esta Semana)

### 1️⃣ Integrar Formulario de Contacto Real

**Estado Actual**: El formulario solo simula el envío

#### Opción A: FormSubmit (MÁS FÁCIL - 5 minutos)

**Pasos:**
1. Abre `index.html` línea 461
2. Cambia el `<form>` de:
```html
<form class="contact-form" id="contactForm">
```

A:
```html
<form action="https://formsubmit.co/jgwebstudio@gmail.com" method="POST" class="contact-form">
```

3. Agrega estos campos ocultos dentro del form:
```html
<input type="hidden" name="_subject" value="Nuevo contacto desde J&G Web Studio">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_template" value="table">
<input type="text" name="_honey" style="display:none">
```

4. En `script.js`, comenta o elimina las líneas 136-195 (la función de envío simulado)

5. **Primer envío**: FormSubmit enviará un email de confirmación a jgwebstudio@gmail.com. Debes hacer clic en el enlace para activar el servicio.

**Ventajas**: Gratuito, sin código, funciona inmediatamente
**Desventajas**: Redirección a página externa después del envío

---

#### Opción B: EmailJS (MÁS PROFESIONAL - 15 minutos)

**Pasos:**

1. Crea cuenta gratis en https://www.emailjs.com/
2. Conecta tu Gmail (jgwebstudio@gmail.com)
3. Crea un servicio de email
4. Crea una plantilla de email
5. Ve a "Account" > "API Keys" y copia tu Public Key

6. Agrega EmailJS SDK en `index.html` antes del cierre de `</body>`:
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script type="text/javascript">
    (function(){
        emailjs.init("TU_PUBLIC_KEY"); // Reemplaza con tu key
    })();
</script>
```

7. En `script.js`, reemplaza el bloque de código en la línea 151-179 (el try-catch) con:

```javascript
try {
    // Enviar con EmailJS
    const response = await emailjs.send(
        'TU_SERVICE_ID',  // De EmailJS dashboard
        'TU_TEMPLATE_ID', // De EmailJS dashboard
        {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            servicio: formData.servicio,
            mensaje: formData.mensaje
        }
    );
    
    console.log('Email enviado:', response);
    showFormMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
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
}
```

**Ventajas**: Sin redirección, personalizable, 200 emails gratis/mes
**Desventajas**: Requiere configuración inicial

---

### 2️⃣ Configurar Redes Sociales

**Estado Actual**: Todos los enlaces apuntan a `#`

**Acción Requerida:**

1. **Crear páginas en redes** (si aún no existen):
   - Facebook Business Page: https://facebook.com/create
   - Instagram Business: Crear desde la app
   - LinkedIn Company Page: https://linkedin.com/company/setup
   - Twitter/X Professional: https://twitter.com/signup

2. **Actualizar enlaces en `index.html` línea 496-501**:

```html
<div class="social-links">
    <a href="https://facebook.com/jgwebstudio" class="social-link" target="_blank"><i class="fab fa-facebook-f"></i></a>
    <a href="https://instagram.com/jgwebstudio" class="social-link" target="_blank"><i class="fab fa-instagram"></i></a>
    <a href="https://linkedin.com/company/jgwebstudio" class="social-link" target="_blank"><i class="fab fa-linkedin-in"></i></a>
    <a href="https://twitter.com/jgwebstudio" class="social-link" target="_blank"><i class="fab fa-twitter"></i></a>
</div>
```

**O, si NO quieren redes sociales todavía**, eliminar esa sección completa temporalmente.

---

### 3️⃣ Conseguir Hosting y Dominio

#### Opción A: Solo Hosting Gratuito (Para empezar)

**Netlify (RECOMENDADO)**
1. Crea cuenta en https://netlify.com
2. Arrastra la carpeta del proyecto a Netlify Drop
3. Se despliega automáticamente con URL: https://tu-sitio.netlify.app
4. Configura dominio personalizado después (opcional)

**Vercel**
1. Crea cuenta en https://vercel.com
2. Importa el proyecto desde GitHub
3. Deploy automático

**GitHub Pages**
1. Sube código a GitHub
2. Settings > Pages > Enable
3. URL: https://tuusuario.github.io/jgwebstudio

#### Opción B: Dominio Personalizado + Hosting

**Dominio**: Registrar en Namecheap, GoDaddy o Hostinger
- Sugerencias: jgwebstudio.com, jgwebstudio.pe
- Costo: ~$10-15 USD/año

**Conectar dominio a Netlify/Vercel**:
- En el panel del hosting > Settings > Domain
- Agregar DNS records que te proporcione la plataforma

---

## 📅 Próximas 2 Semanas

### 4️⃣ Conseguir Proyectos Reales

**Estrategias:**

**A. Clientes Iniciales con Descuento**
- Ofrecer 40-50% descuento a primeros 5 clientes
- A cambio: testimonial + permiso para mostrar en portafolio
- Publicar en grupos de Facebook, LinkedIn

**B. Amigos y Familia**
- Hacer sitios gratis/baratos para conocidos con negocios
- Solicitar referencia y testimonio

**C. Fiverr/Freelancer**
- Crear perfil profesional
- Ofrecer paquetes de landing pages desde $50-100
- Construir reputación

**D. Redes Sociales**
- Publicar "antes y después" de diseños
- Mostrar proceso de trabajo
- Tips gratuitos de diseño web

---

### 5️⃣ Solicitar Testimonios Reales

**Para los 2 proyectos actuales (gym.jpg y landing.jpg)**:

Enviar este mensaje a los clientes:

```
Hola [Nombre],

Esperamos que estés disfrutando de tu sitio web. Como estamos 
construyendo nuestro portafolio, nos encantaría que compartieras 
tu experiencia trabajando con nosotros.

¿Podrías responder estas 3 preguntas breves?

1. ¿Qué problema resolvimos con tu sitio web?
2. ¿Cómo fue el proceso de trabajo con nosotros?
3. ¿Recomendarías nuestros servicios? ¿Por qué?

Tu testimonio nos ayudará mucho ❤️

Gracias,
J&G Web Studio
```

Después actualizar `index.html` con testimonios reales.

---

## 📊 Mes 1-2: Optimización

### 6️⃣ Google Analytics

**Agregar antes del `</head>` en index.html:**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Pasos:**
1. Ir a https://analytics.google.com
2. Crear propiedad
3. Copiar ID de medición (G-XXXXXXXXXX)
4. Reemplazar en el código

---

### 7️⃣ Google Search Console

1. Ir a https://search.google.com/search-console
2. Agregar propiedad con tu dominio
3. Verificar propiedad
4. Enviar sitemap.xml (crear después)

---

### 8️⃣ Crear Sitemap y Robots.txt

**sitemap.xml** (en la raíz del proyecto):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tudominio.com/</loc>
    <lastmod>2026-03-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**robots.txt** (en la raíz del proyecto):
```
User-agent: *
Allow: /
Sitemap: https://tudominio.com/sitemap.xml
```

---

## 🎯 Mes 3+: Crecimiento

### 9️⃣ Crear Blog para SEO

- Agregar sección de blog en el sitio
- Publicar 1-2 artículos por semana
- Temas: "Cómo crear una landing page", "SEO para pequeñas empresas", etc.
- Mejora ranking en Google

### 🔟 Estrategia de Contenido

**Instagram/Facebook**:
- Tips de diseño web (carruseles)
- Proceso de proyectos (stories)
- Testimonios de clientes
- Antes/después de diseños

**LinkedIn**:
- Artículos profesionales
- Networking con empresarios
- Compartir casos de estudio

---

## ✅ Checklist de Verificación

Antes de considerar el sitio "listo para clientes":

- [ ] Formulario envía emails realmente
- [ ] Email jgwebstudio@gmail.com configurado y monitoreado
- [ ] WhatsApp responde (o tiene respuestas automáticas)
- [ ] Redes sociales configuradas o eliminadas del sitio
- [ ] Sitio desplegado en hosting (Netlify/Vercel)
- [ ] Dominio personalizado (opcional pero recomendado)
- [ ] Google Analytics instalado
- [ ] Al menos 3 proyectos reales en portafolio
- [ ] Al menos 1 testimonio real
- [ ] Probado en móvil, tablet y desktop
- [ ] Velocidad de carga óptima (PageSpeed Insights)

---

## 📞 ¿Necesitas Ayuda?

Si te atascas en algún paso:
1. Revisa la documentación en README.md
2. Busca tutoriales en YouTube
3. Pregunta en comunidades: Stack Overflow, Reddit (r/webdev)

---

## 💡 Consejo Final

**No esperes a que todo sea perfecto.** Lanza el sitio cuando tengas:
- Formulario funcionando ✅
- Al menos 2 proyectos reales ✅
- Hosting configurado ✅

Puedes mejorar y agregar contenido gradualmente. Lo importante es EMPEZAR.

¡Mucho éxito con J&G Web Studio! 🚀
