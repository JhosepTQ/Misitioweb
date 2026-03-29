# J&G Web Studio - Sitio Web Corporativo

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-blue)

## 📝 Descripción

Sitio web corporativo de **J&G Web Studio**, un equipo de desarrollo web enfocado en crear páginas profesionales para emprendedores y pequeñas empresas. Este proyecto presenta nuestros servicios, portafolio y valores como empresa emergente en el mercado digital.

## 🚀 Características

- ✅ Diseño moderno y profesional
- ✅ 100% responsive (móvil, tablet, desktop)
- ✅ Animaciones suaves con Intersection Observer
- ✅ Formulario de contacto con validación
- ✅ Navegación smooth scroll
- ✅ Menú hamburguesa para móviles
- ✅ Botón flotante de WhatsApp
- ✅ Optimización SEO básica
- ✅ Efectos parallax y hover 3D

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS y grid/flexbox
- **JavaScript vanilla** - Interactividad y animaciones
- **Font Awesome 6.4** - Iconografía
- **Google Fonts** - Tipografías Heebo, Nunito, Pacifico, Poppins

## 📂 Estructura del Proyecto

```
SitioWeb/
│
├── index.html          # Página principal
├── styles.css          # Estilos globales
├── script.js           # Lógica JavaScript
├── README.md          # Documentación
│
└── Public/
    └── img/
        ├── logo.png
        ├── logoblanco.png
        ├── ico12.ico
        ├── gym.jpg
        └── landing.jpg
```

## 🎨 Secciones del Sitio

1. **Hero** - Presentación principal con llamados a la acción
2. **Nosotros** - Información sobre el equipo y enfoque
3. **Servicios** - Landing pages, sitios corporativos, rediseño, hosting
4. **Portafolio** - Proyectos realizados y ejemplos
5. **Beneficios** - Ventajas de trabajar con nosotros
6. **Testimonios** - Nuestro compromiso y valores
7. **Contacto** - Formulario y métodos de contacto

## 📦 Instalación y Uso

### Desarrollo Local

1. Clona este repositorio:
```bash
git clone https://github.com/tuusuario/jg-web-studio.git
```

2. Navega a la carpeta del proyecto:
```bash
cd jg-web-studio
```

3. Abre `index.html` en tu navegador favorito o usa un servidor local:
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

4. Visita `http://localhost:8000` en tu navegador

## 🌐 Despliegue

### Opciones Gratuitas Recomendadas:

**Netlify (Recomendado)**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Desplegar
netlify deploy --prod
```

**Vercel**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
```

**GitHub Pages**
1. Crea un repositorio en GitHub
2. Sube los archivos
3. Ve a Settings > Pages
4. Selecciona la rama main y guarda

## ✉️ Configuración del Formulario

Actualmente el formulario está en modo simulación. Para hacerlo funcional:

### Opción 1: FormSubmit (Gratis, sin código)
```html
<form action="https://formsubmit.co/jgwebstudio@gmail.com" method="POST">
    <!-- Tus campos del formulario -->
</form>
```

### Opción 2: EmailJS (Gratis, 200 emails/mes)
1. Crea cuenta en [emailjs.com](https://www.emailjs.com/)
2. Configura un servicio de email
3. Copia las credenciales y actualiza `script.js`

### Opción 3: Backend propio
- Node.js + Express + Nodemailer
- PHP con PHPMailer
- Python con Flask + SMTP

## 📱 Contacto

- **WhatsApp**: [+51 992 514 222](https://wa.me/51992514222)
- **Email**: jgwebstudio@gmail.com
- **Ubicación**: Lima, Perú

## 🔄 Próximas Mejoras

- [ ] Integración real del formulario de contacto
- [ ] Agregar Google Analytics
- [ ] Configurar dominio personalizado
- [ ] Crear perfiles en redes sociales
- [ ] Implementar blog para SEO
- [ ] Agregar más proyectos al portafolio
- [ ] Sistema de CMS para actualizaciones fáciles
- [ ] Modo oscuro/claro

## 📄 Licencia

Este proyecto es propiedad de **J&G Web Studio** © 2026. Todos los derechos reservados.

## 👥 Autores

**J&G Web Studio Team**
- Equipo de desarrollo web enfocado en soluciones accesibles y de calidad

---

⭐ **¿Te gustó nuestro trabajo?** ¡Contáctanos para crear tu próximo proyecto web!