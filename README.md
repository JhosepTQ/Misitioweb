# 🌐 J&G Web Studio - Sitio Web Profesional

Sitio web corporativo para J&G Web Studio con sistema de chat en tiempo real integrado.

## ✨ Características

- 🎨 Diseño moderno y responsive
- 💬 Chat en tiempo real con Firebase
- 👨‍💼 Panel de administración para gestionar conversaciones
- 📱 Compatible con dispositivos móviles
- ⚡ Carga rápida y optimizada

## 📁 Estructura del Proyecto

```
SitioWeb/
├── index.html              # Página principal
├── admin-chat.html         # Panel de administración del chat
├── script.js               # Funcionalidad del chat y sitio
├── styles.css              # Estilos del sitio
├── politica-privacidad.html
├── terminos-servicio.html
└── Public/
    └── img/                # Imágenes del sitio
```

## 🚀 Configuración Rápida

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto o selecciona uno existente
3. Activa **Realtime Database** en modo de prueba
4. Obtén las credenciales de configuración

### 2. Actualizar Credenciales

Edita las credenciales de Firebase en **dos archivos**:

#### En `script.js` (línea ~445):
```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

#### En `admin-chat.html` (línea ~637):
```javascript
// Usa las mismas credenciales
```

### 3. Probar Localmente

Abre dos ventanas del navegador:

```powershell
# Ventana 1: Sitio web (cliente)
start index.html

# Ventana 2: Panel admin
start admin-chat.html
```

**Prueba:**
1. Escribe un mensaje en el chat de `index.html`
2. Verás aparecer el mensaje en `admin-chat.html`
3. Responde desde el panel admin
4. La respuesta aparecerá instantáneamente en el chat del cliente

## 📱 Uso del Panel Admin

### Características del Panel:
- ✅ Lista de conversaciones activas
- 🔔 Notificaciones de sonido
- 💬 Respuestas en tiempo real
- 🔍 Búsqueda de conversaciones
- 📊 Historial completo de mensajes

### Respuestas Rápidas:
- 👋 Saludo
- ⏱️ En un momento
- ❓ Más preguntas
- ✅ Perfecto

## 🔐 Seguridad

### Reglas de Firebase (Modo Desarrollo):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
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
