# 📤 Guía de Despliegue - J&G Web Studio

## 🌐 URLs Limpias (Sin .html)

Este sitio está configurado para usar **URLs limpias** sin extensiones .html:

### ✅ URLs Configuradas:
- `https://tudominio.com/` → página principal
- `https://tudominio.com/politica-privacidad` → política de privacidad
- `https://tudominio.com/terminos-servicio` → términos de servicio

### ❌ Redireccionado automáticamente:
- `https://tudominio.com/index.html` → redirige a `/`
- `https://tudominio.com/politica-privacidad.html` → redirige a `/politica-privacidad`
- `https://tudominio.com/terminos-servicio.html` → redirige a `/terminos-servicio`

## 🔧 Cómo funciona

El archivo `.htaccess` contiene reglas de Apache que:
1. **Ocultan** la extensión .html de las URLs
2. **Redirigen** automáticamente URLs con .html a las versiones limpias
3. **Mejoran** el rendimiento con compresión y caché

## 📋 Requisitos del Hosting

Para que las URLs limpias funcionen, tu hosting debe tener:

✅ **Apache** como servidor web  
✅ **mod_rewrite** habilitado (activado en la mayoría de hostings)  
✅ **Permitir .htaccess** (configuración estándar en cPanel)

**Hostings compatibles:** Hostinger, SiteGround, Bluehost, GoDaddy, InfinityFree, etc.

## 🚀 Pasos para Subir el Sitio

### Opción 1: Via FTP (FileZilla)

1. **Descargar FileZilla Client**
   - Sitio oficial: https://filezilla-project.org/

2. **Conectarse al hosting**
   - Host: ftp.tudominio.com (proporcionado por tu hosting)
   - Usuario: tu_usuario_ftp
   - Contraseña: tu_contraseña_ftp
   - Puerto: 21

3. **Subir archivos**
   - En el panel derecho (servidor remoto), navega a `/public_html/` o `/www/`
   - En el panel izquierdo (local), selecciona TODOS los archivos de tu proyecto:
     ```
     ├── index.html
     ├── politica-privacidad.html
     ├── terminos-servicio.html
     ├── styles.css
     ├── script.js
     ├── .htaccess  ⚠️ IMPORTANTE: No olvidar este archivo
     └── Public/
     ```
   - Arrastra los archivos al servidor remoto

4. **Verificar**
   - Visita `https://tudominio.com`
   - Prueba las URLs limpias: `/politica-privacidad` y `/terminos-servicio`

### Opción 2: Via cPanel (Administrador de Archivos)

1. **Acceder a cPanel**
   - Ingresa a: `https://tudominio.com/cpanel`
   - Usuario y contraseña proporcionados por tu hosting

2. **Abrir Administrador de Archivos**
   - En cPanel, busca "Administrador de archivos" (File Manager)
   - Navega a `/public_html/`

3. **Subir archivos**
   - Clic en botón "Subir" (Upload)
   - Selecciona TODOS los archivos del proyecto
   - También puedes crear un ZIP y subirlo, luego extraerlo en el servidor

4. **Verificar .htaccess está presente**
   - En el Administrador de archivos, activa "Mostrar archivos ocultos"
   - Verifica que `.htaccess` esté en `/public_html/`

5. **Visitar el sitio**
   - Abre `https://tudominio.com`

### Opción 3: Via GitHub Pages (GRATIS)

⚠️ **Nota:** GitHub Pages NO soporta .htaccess (usa Jekyll, no Apache)

Si subes a GitHub Pages, las URLs serán con .html:
- `https://tuusuario.github.io/proyecto/politica-privacidad.html`

Para usar GitHub Pages con URLs limpias, necesitarías crear carpetas:
```
politica-privacidad/
  └── index.html
terminos-servicio/
  └── index.html
```

Pero esto requiere reorganizar el proyecto.

## 🔍 Verificación Post-Despliegue

### Pruebas a realizar:

1. **Navegación**
   - ✅ Logo lleva a la página principal
   - ✅ Menú de navegación funciona
   - ✅ Enlaces del footer funcionan
   - ✅ Scroll suave a secciones (/#inicio, /#servicios, etc.)

2. **URLs Limpias**
   - ✅ `/politica-privacidad` carga correctamente
   - ✅ `/terminos-servicio` carga correctamente
   - ✅ `/politica-privacidad.html` redirige a `/politica-privacidad`

3. **Recursos**
   - ✅ Imágenes se cargan correctamente
   - ✅ CSS se aplica
   - ✅ JavaScript funciona (animaciones, hamburger menu)
   - ✅ Botón de WhatsApp funcional

4. **Responsive**
   - ✅ Desktop: layout completo
   - ✅ Tablet: adaptación correcta
   - ✅ Móvil: menú hamburguesa funciona

## 🐛 Solución de Problemas

### Problema: Las URLs limpias no funcionan (Error 404)

**Causa:** mod_rewrite no está habilitado o .htaccess no se subió

**Solución:**
1. Verificar que `.htaccess` esté en el servidor
2. Contactar soporte del hosting para habilitar mod_rewrite
3. Verificar que "AllowOverride" esté habilitado

### Problema: Imágenes no se cargan

**Causa:** Rutas incorrectas o permisos

**Solución:**
1. Verificar estructura de carpetas: `Public/img/` existe
2. Verificar permisos: carpetas 755, archivos 644
3. Revisar mayúsculas/minúsculas (Linux es case-sensitive)

### Problema: Redirige a error 500

**Causa:** Sintaxis incorrecta en .htaccess

**Solución:**
1. Revisar que no haya errores de sintaxis en `.htaccess`
2. Temporalmente renombrar `.htaccess` a `.htaccess.bak` para descartar el problema
3. Revisar logs del servidor en cPanel

### Problema: CSS o JS no se aplican

**Causa:** Rutas relativas o caché del navegador

**Solución:**
1. Hacer Ctrl+F5 o Cmd+Shift+R para limpiar caché
2. Verificar que `styles.css` y `script.js` estén en la raíz
3. Revisar la consola del navegador (F12) para errores

## 📊 Rendimiento y Optimización

El `.htaccess` incluye optimizaciones:

✅ **Compresión GZIP** - reduce tamaño de archivos en ~70%  
✅ **Caché del navegador** - mejora velocidad en visitas repetidas  
✅ **Redireciones 301** - mantiene SEO al cambiar URLs

## 🔒 HTTPS (Certificado SSL)

Una vez subido el sitio:

1. **Activar SSL en el hosting**
   - En cPanel → SSL/TLS Status → Activar AutoSSL (gratis)
   - O instalar Let's Encrypt (gratis)

2. **Descomentar líneas en .htaccess**
   ```apache
   # Forzar HTTPS
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

3. **Probar** `https://tudominio.com`

## 📝 Dominio Personalizado

Si tienes un dominio:

1. **Configurar DNS** en tu proveedor de dominio:
   ```
   Tipo: A
   Host: @
   Valor: [IP de tu hosting]
   
   Tipo: CNAME
   Host: www
   Valor: tudominio.com
   ```

2. **Agregar dominio en hosting** (cPanel → Dominios Addon)

3. **Esperar propagación DNS** (24-48 horas)

## 🎯 Próximos Pasos

Después del despliegue:

- [ ] Verificar funcionamiento en móvil
- [ ] Enviar formulario de contacto y verificar recepción
- [ ] Configurar Google Analytics (opcional)
- [ ] Enviar sitio a Google Search Console
- [ ] Crear sitemap.xml para SEO
- [ ] Probar velocidad en PageSpeed Insights

## 📞 Soporte

Si tienes problemas durante el despliegue:

📧 **Email:** jgwebstudio@gmail.com  
📱 **WhatsApp:** +51 992 514 222

---

**¡Éxito con tu lanzamiento! 🚀**
