# 💬 Sistema de Chat Simple - PHP + JSON

Sistema de chat bidireccional **100% sin dependencias externas**. No requiere Firebase, Node.js, ni servicios de terceros.

---

## ✅ ¿Qué se creó?

### 1. **chat-api.php**
API REST simple que gestiona todos los mensajes.

**Endpoints disponibles:**
- `POST /chat-api.php?action=send` - Cliente envía mensaje
- `GET /chat-api.php?action=get` - Cliente obtiene respuestas del admin
- `GET /chat-api.php?action=list` - Admin lista todas las conversaciones
- `GET /chat-api.php?action=session` - Admin ve conversación específica
- `POST /chat-api.php?action=reply` - Admin responde a un cliente
- `DELETE /chat-api.php?action=session` - Admin elimina conversación

### 2. **chat-data.json**
Base de datos en formato JSON donde se guardan todos los mensajes.

### 3. **admin-chat-simple.html**
Panel de administración profesional con:
- ✅ Lista de conversaciones en tiempo real
- ✅ Vista de mensajes por sesión
- ✅ Respuestas instantáneas
- ✅ Indicador de mensajes no leídos
- ✅ Actualización automática cada 3 segundos
- ✅ Eliminar conversaciones
- ✅ Diseño responsive y moderno

### 4. **script.js (modificado)**
Se eliminó completamente Firebase y se reemplazó con:
- ✅ Sistema de polling cada 3 segundos
- ✅ Comunicación con API PHP usando `fetch()`
- ✅ Gestión de sesiones con localStorage
- ✅ Sin dependencias externas

---

## 🚀 Cómo usar

### **Paso 1: Requisitos del servidor**
Tu hosting debe tener:
- ✅ PHP 7.0 o superior (cualquier hosting básico lo tiene)
- ✅ Permisos de escritura en la carpeta del sitio

**NO necesitas:**
- ❌ Node.js
- ❌ Firebase
- ❌ Base de datos MySQL
- ❌ APIs externas

### **Paso 2: Subir archivos**
Sube estos archivos a tu servidor:
```
SitioWeb/
├── index.html
├── script.js              (modificado)
├── styles.css
├── chat-api.php          (NUEVO)
├── chat-data.json        (NUEVO)
└── admin-chat-simple.html (NUEVO)
```

### **Paso 3: Configurar permisos**
Dale permisos de escritura al archivo JSON:
```bash
chmod 666 chat-data.json
```

O desde cPanel/FileManager:
- Click derecho en `chat-data.json` → Permisos → `666` (lectura y escritura)

### **Paso 4: Acceder al panel admin**
Abre en tu navegador:
```
https://tu-sitio.com/admin-chat-simple.html
```

---

## 📱 Cómo funciona

### **Para los visitantes:**
1. Abren el chatbot en tu sitio web
2. Escriben un mensaje
3. El mensaje se guarda en `chat-data.json`
4. Cada 3 segundos consulta si el admin respondió
5. Si hay respuesta, aparece instantáneamente

### **Para el admin:**
1. Abre `admin-chat-simple.html`
2. Ve todas las conversaciones activas
3. Click en una conversación para ver mensajes
4. Responde y el cliente lo ve en 3 segundos
5. Actualización automática cada 3 segundos

---

## 🔒 Seguridad

### **Recomendaciones:**

1. **Proteger el panel admin:**
   - Renombra `admin-chat-simple.html` a algo secreto como `admin-xyz123.html`
   - O usa `.htaccess` para protegerlo con contraseña

2. **Proteger con contraseña (opcional):**
Crea un archivo `.htaccess` en tu carpeta:
```apache
<Files "admin-chat-simple.html">
    AuthType Basic
    AuthName "Área Restringida"
    AuthUserFile /ruta/completa/.htpasswd
    Require valid-user
</Files>
```

3. **Límite de mensajes (opcional):**
Edita `chat-api.php` y agrega límite de caracteres o anti-spam.

---

## 🧪 Probar en local

Si quieres probar en tu PC antes de subir a producción:

### **Opción 1: PHP Built-in Server**
```bash
cd c:\Proyectos\SitioWeb
php -S localhost:8000
```
Luego abre: `http://localhost:8000`

### **Opción 2: XAMPP/WAMP**
Copia la carpeta a `htdocs` y accede vía `http://localhost/SitioWeb`

---

## 🐛 Solución de problemas

### **"Error al enviar mensaje"**
- Verifica que `chat-data.json` tenga permisos de escritura (666)
- Revisa que PHP esté habilitado en tu hosting

### **"Los mensajes no se actualizan"**
- Abre la consola del navegador (F12) y busca errores
- Verifica que `chat-api.php` esté en la misma carpeta que `index.html`

### **"No se guardan los mensajes"**
- Verifica permisos del archivo `chat-data.json`
- Asegúrate de que la carpeta permita escritura

---

## 📊 Ventajas vs Firebase

| Característica | Firebase | PHP + JSON |
|---|---|---|
| Costo | Gratis hasta 1GB | 100% Gratis |
| Configuración | Compleja | Simple |
| Dependencias | Sí (SDK) | No |
| Tiempo real | Instantáneo | 3 segundos |
| Control de datos | Google | Tú |
| Requiere cuenta | Sí | No |

---

## 🎨 Personalización

### **Cambiar intervalo de actualización:**
Edita en `admin-chat-simple.html` línea ~260:
```javascript
}, 3000);  // Cambiar 3000 por los milisegundos que quieras
```

Y en `script.js` línea ~470:
```javascript
}, 3000);  // Cambiar 3000 por los milisegundos que quieras
```

### **Cambiar colores del panel admin:**
Edita los colores en `admin-chat-simple.html` línea ~20-30

---

## 💡 Siguiente paso recomendado

**Protege tu panel admin** renombrándolo:
```bash
mv admin-chat-simple.html admin-secreto-xyz123.html
```

Y accede vía: `https://tu-sitio.com/admin-secreto-xyz123.html`

---

## ✅ Resumen

- ✅ **Sin Firebase** - No necesitas cuenta ni configuración
- ✅ **Sin Node.js** - Solo PHP básico
- ✅ **Sin instalaciones** - Sube y funciona
- ✅ **100% Funcional** - Cliente y admin se comunican
- ✅ **Gratis total** - Sin costos ocultos
- ✅ **Control total** - Tus datos en tu servidor

---

**¡Listo para usar! 🚀**
