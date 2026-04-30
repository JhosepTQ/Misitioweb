# 📦 Archivos Opcionales

Esta carpeta contiene archivos para funcionalidades avanzadas que **no son necesarias** para el funcionamiento básico del sitio web con chat.

## 📄 Contenido

### `server.js` - Servidor Node.js para WhatsApp Bidireccional
Middleware para integración con WhatsApp mediante WPPConnect o Evolution API.

**Úsalo solo si necesitas:**
- Recibir notificaciones de chat en WhatsApp
- Responder desde WhatsApp y que se refleje en el sitio web
- Integración bidireccional completa

### `package.json` - Dependencias del Servidor
Archivo de configuración de Node.js con las dependencias necesarias para `server.js`.

## 🚀 Cómo Usar (Solo si lo necesitas)

### 1. Instalar Dependencias
```powershell
cd opcional
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en esta carpeta:
```env
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
WHATSAPP_API_URL=http://localhost:21465
WHATSAPP_SESSION=mysession
```

### 3. Ejecutar el Servidor
```powershell
node server.js
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Documentación Adicional

Para más información sobre la integración con WhatsApp:
- [WPPConnect](https://github.com/wppconnect-team/wppconnect)
- [Evolution API](https://github.com/EvolutionAPI/evolution-api)

## ⚠️ Nota Importante

**El sitio web funciona perfectamente SIN estos archivos.** Solo úsalos si necesitas la funcionalidad adicional de WhatsApp.

El chat en tiempo real ya funciona con Firebase + Panel Admin (`admin-chat.html`).
