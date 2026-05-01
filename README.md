# 🌐 J&G Web Studio - Sitio Web Profesional

Sitio web corporativo para J&G Web Studio con sistema de chat bidireccional integrado.

## ✨ Características

- 🎨 Diseño moderno y responsive
- 💬 Chat bidireccional en tiempo real
- 👨‍💼 Panel de administración para gestionar conversaciones
- 📱 Compatible con dispositivos móviles
- ⚡ Sistema simple con PHP + JSON (sin dependencias externas)
- 🔔 Notificaciones de sonido para el admin
- 🚀 Fácil de desplegar en cualquier hosting con PHP

## 📁 Estructura del Proyecto

```
SitioWeb/
├── index.html                  # Página principal
├── admin-chat-simple.html      # Panel de administración del chat
├── chat-api.php                # API REST para el chat
├── chat-data.json              # Base de datos en JSON
├── script.js                   # Funcionalidad del chat y sitio
├── styles.css                  # Estilos del sitio
├── CHAT-SETUP.md               # Documentación del sistema de chat
├── politica-privacidad.html
├── terminos-servicio.html
└── Public/
    └── img/                    # Imágenes del sitio
```

## 🚀 Configuración Rápida

### 1. Requisitos

- ✅ Servidor con PHP 7.0 o superior
- ✅ Permisos de escritura en la carpeta del proyecto
- ❌ NO requiere Node.js
- ❌ NO requiere Firebase
- ❌ NO requiere base de datos MySQL

### 2. Instalación

1. **Subir archivos al servidor:**
   ```bash
   # Sube todos los archivos a tu hosting
   ```

2. **Dar permisos al archivo JSON:**
   ```bash
   chmod 666 chat-data.json
   ```

3. **Acceder al sitio:**
   ```
   https://tu-dominio.com
   ```

### 3. Probar Localmente

Abre una terminal en la carpeta del proyecto:

```powershell
# Iniciar servidor PHP local
php -S localhost:8000
```

Abre dos ventanas del navegador:
- **Cliente:** http://localhost:8000
- **Admin:** http://localhost:8000/admin-chat-simple.html

**Prueba:**
1. Escribe un mensaje en el chat del sitio web
2. Verás aparecer el mensaje en el panel admin (máximo 3 segundos)
3. Responde desde el panel admin
4. La respuesta aparecerá en el chat del cliente (máximo 3 segundos)

## 💬 Sistema de Chat

### Funcionamiento:
- **Polling:** El sistema consulta cada 3 segundos si hay mensajes nuevos
- **Sesiones:** Cada visitante tiene un ID único almacenado en localStorage
- **Persistencia:** Los mensajes se guardan en `chat-data.json`
- **Tiempo real:** Respuestas visibles en máximo 3 segundos

### Características del Panel Admin:
- ✅ Lista de conversaciones activas
- 🔔 Notificaciones de sonido cuando llegan mensajes
- 💬 Respuestas en tiempo real
- 📊 Historial completo de mensajes
- 🗑️ Eliminar conversaciones
- ⏱️ Actualización automática cada 3 segundos

## 🔐 Seguridad

### Proteger el Panel Admin:

**Opción 1: Renombrar el archivo**
```bash
mv admin-chat-simple.html admin-secreto-xyz123.html
```

**Opción 2: Proteger con contraseña (.htaccess)**
```apache
<Files "admin-chat-simple.html">
    AuthType Basic
    AuthName "Área Restringida"
    AuthUserFile /ruta/completa/.htpasswd
    Require valid-user
</Files>
```

## 📖 Documentación Completa

Para más detalles sobre el sistema de chat, lee [CHAT-SETUP.md](CHAT-SETUP.md)
```

⚠️ **Para producción**, actualiza las reglas para mayor seguridad:
```json
{
  "rules": {
    "chats": {
      "$chatId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

## 🌐 Despliegue

### Opciones de Hosting Gratuito:

1. **Netlify** (Recomendado)
   - Arrastra la carpeta del proyecto
   - Configuración automática
   - SSL gratis

2. **Vercel**
   - Conecta con GitHub
   - Deploy automático
   - Dominio personalizado gratis

3. **GitHub Pages**
   - Sube el proyecto a GitHub
   - Activa Pages en Settings
   - Dominio: `usuario.github.io`

## 🛠️ Archivos Importantes

### Para el Sitio Web:
- `index.html` - Página principal con chat integrado
- `styles.css` - Todos los estilos
- `script.js` - Funcionalidad del chat y Firebase
- `Public/img/` - Imágenes y recursos

### Para Administración:
- `admin-chat.html` - Panel completo para responder chats

**Nota:** El archivo `admin-chat.html` **NO debe ser accesible públicamente**. Súbelo en una carpeta protegida o úsalo solo localmente.

## 📞 Soporte

Si tienes dudas sobre la configuración:
1. Revisa que las credenciales de Firebase sean correctas
2. Verifica que Realtime Database esté activa
3. Asegúrate de que las reglas permitan lectura/escritura
4. Abre la consola del navegador (F12) para ver errores

## 📄 Licencia

© 2026 J&G Web Studio. Todos los derechos reservados.

---

**Desarrollado con ❤️ por J&G Web Studio**
