# 🤖 Sistema de Respuesta Automática con IA - Guía Completa

## 📋 Descripción

Sistema de inteligencia artificial integrado que permite respuestas automáticas a clientes cuando no estás disponible. Utiliza **Google Gemini API** (gratis) y aprende de tus documentos.

---

## ⚙️ Configuración Inicial

### 1️⃣ Obtener API Key de Gemini (GRATIS)

1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la API Key generada

**Límites gratuitos:**
- ✅ 60 solicitudes por minuto
- ✅ 1,500 solicitudes por día
- ✅ Completamente gratis

### 2️⃣ Configurar en el Panel

1. Abre el panel de administración: `http://localhost:8000/admin-chat-simple.html`
2. Haz clic en **"Configurar IA"**
3. Pega tu API Key
4. Haz clic en **"Guardar"**

---

## 🎯 Cómo Funciona

### Modo Manual (Predeterminado)
- ❌ IA desactivada
- 👤 Tú respondes manualmente
- Cliente espera tu respuesta

### Modo Automático (IA Activada)
- ✅ IA activada
- 🤖 IA responde automáticamente
- ⚡ Respuesta instantánea al cliente

---

## 📚 Subir Documentos para que la IA Aprenda

### Tipos de Archivos Soportados:
- ✅ PDF (.pdf)
- ✅ Texto plano (.txt)
- ✅ Word (.docx)

### Cómo Subir:

1. En el panel admin, busca la sección **"📚 Base de Conocimiento"**
2. Haz clic en **"Subir"**
3. Selecciona uno o varios archivos
4. Los documentos se procesarán automáticamente

### Ejemplos de Documentos Útiles:

```
✅ Lista de precios y servicios (PDF)
✅ Catálogo de productos (PDF)
✅ Preguntas frecuentes (TXT)
✅ Términos y condiciones (PDF)
✅ Políticas de la empresa (DOCX)
✅ Guía de servicios (PDF)
```

**Límite:** 10 MB por archivo

---

## 🔄 Activar/Desactivar Modo Automático

### Activar IA:
1. En el panel admin, busca el toggle **"Modo Manual"**
2. Haz clic en el switch
3. Verá **"🤖 Modo Automático (IA Activa)"**
4. Indicador verde = IA activa

### Desactivar IA:
1. Haz clic nuevamente en el toggle
2. Verá **"👤 Modo Manual"**
3. Indicador rojo = Tú respondes manualmente

---

## 💬 Qué Responde la IA

La IA tiene acceso a:

1. **Información de tu empresa** (ai-config.json):
   - Nombre
   - Ubicación
   - Horario
   - Contacto

2. **Servicios configurados**:
   - Nombres de servicios
   - Precios
   - Descripciones
   - Tiempos de entrega

3. **Preguntas frecuentes** (FAQ)

4. **Contenido de documentos subidos**:
   - PDFs con precios
   - Catálogos
   - Información adicional

---

## 🎨 Personalizar Respuestas de la IA

Edita el archivo `ai-config.json`:

```json
{
  "prompt_system": "Eres un asistente de J&G Web Studio...",
  "temperatura": 0.7,
  "max_response_length": 300
}
```

### Parámetros:

- **prompt_system**: Instrucciones de cómo debe comportarse la IA
- **temperature**: Creatividad (0.1 = conservadora, 0.9 = creativa)
- **max_response_length**: Longitud máxima de respuesta (tokens)

---

## 📊 Monitoreo

### Ver Conversaciones Atendidas por IA:

En el panel de conversaciones, los mensajes de la IA aparecen como si fueran tuyos, pero internamente tienen la etiqueta `is_ai: true`.

### Estadísticas:

El header muestra:
- 📈 Total de conversaciones
- 💬 Total de mensajes
- 🟢 Estado del sistema

---

## 🔧 Solución de Problemas

### La IA no responde:

✅ **Verifica:**
1. API Key configurada correctamente
2. Modo automático activado (toggle en verde)
3. Conexión a internet activa
4. Límites de API no excedidos

### Error de API Key:

❌ **"API Key no configurada"**
- Solución: Configurar API Key en "Configurar IA"

### Documento no se sube:

❌ **"Archivo muy grande"**
- Solución: Reducir tamaño a menos de 10 MB

❌ **"Tipo no permitido"**
- Solución: Solo PDF, TXT, DOCX

---

## 📁 Archivos del Sistema

```
SitioWeb/
├── ai-config.json          # Configuración de IA
├── ai-handler.php          # Manejador de IA
├── upload-document.php     # Subida de documentos
├── chat-api.php            # API principal (modificado)
├── admin-chat-simple.html  # Panel admin (actualizado)
└── ai-documents/           # Carpeta de documentos
    ├── documento1.pdf
    ├── documento2.pdf
    └── ...
```

---

## 🚀 Caso de Uso Típico

### Escenario: Agencia Web

**Horario de atención:** 9am - 6pm

#### Durante horario laboral (9am-6pm):
```
1. Toggle: Modo Manual (❌ IA desactivada)
2. Tú respondes personalmente
3. Conversaciones más personalizadas
```

#### Fuera de horario (6pm-9am):
```
1. Toggle: Modo Automático (✅ IA activada)
2. IA responde automáticamente
3. Cliente recibe respuesta inmediata
4. Al día siguiente, revisas y continúas tú
```

---

## 🎯 Mejores Prácticas

### 1. Base de Conocimiento Actualizada
- ✅ Sube lista de precios actualizada
- ✅ Actualiza documentos regularmente
- ✅ Incluye FAQs completas

### 2. Configuración del Prompt
- ✅ Sé específico en las instrucciones
- ✅ Define el tono (formal, amigable, etc.)
- ✅ Indica cuándo derivar a humano

### 3. Monitoreo
- ✅ Revisa conversaciones atendidas por IA
- ✅ Mejora las respuestas según feedback
- ✅ Actualiza la base de conocimiento

---

## 🔐 Seguridad

### API Key:
- ❌ NO compartas tu API Key
- ✅ Mantén `ai-config.json` fuera del repositorio público
- ✅ Añade `ai-config.json` a `.gitignore`

### Archivos `.gitignore`:
```
ai-config.json
ai-documents/
chat-data.json
```

---

## 📈 Límites y Escalabilidad

### Plan Gratuito de Gemini:
- **60 requests/minuto** → ~3,600 por hora
- **1,500 requests/día**

### Si necesitas más:
- Considera plan de pago de Gemini
- O implementar caché de respuestas

---

## 🆘 Soporte

### Problemas comunes:

1. **"IA no responde"**
   - Verifica API Key
   - Revisa modo automático activado

2. **"Error 429"**
   - Límite de API excedido
   - Espera 1 minuto o actualiza plan

3. **"Respuestas genéricas"**
   - Sube más documentos específicos
   - Mejora el prompt del sistema

---

## 🎉 ¡Listo!

Tu sistema de IA está configurado y listo para usar. 

**Flujo completo:**
1. ✅ Configurar API Key
2. ✅ Subir documentos
3. ✅ Activar modo automático
4. ✅ La IA responde automáticamente

**¡Disfruta de respuestas automáticas 24/7!** 🚀🤖
