# J&G Web Studio - Chat con IA

Sitio web corporativo con chat en tiempo real, panel admin y respuestas automáticas con Gemini.

## Requisitos de hosting

- PHP 7.4 o superior
- Extensión cURL habilitada
- Extensión fileinfo habilitada
- Permisos de escritura en la carpeta del proyecto

No funciona en GitHub Pages, Netlify o Vercel estático porque este proyecto usa PHP.

## Archivos principales

- index.html
- admin-chat-simple.html
- script.js
- styles.css
- chat-api.php
- ai-handler.php
- upload-document.php
- config-utils.php

## Instalación en hosting

1. Sube todos los archivos al hosting.
2. Verifica que exista la carpeta ai-documents con permisos de escritura.
3. Entra al panel admin y configura la API Key de Gemini desde la interfaz.
4. Prueba el chat cliente y la respuesta automática.

El sistema ya se auto-inicializa:
- Si ai-config.json no existe o está vacío, se crea automáticamente con valores por defecto.
- Si chat-data.json no existe, se crea automáticamente.

## Seguridad recomendada

- No subas ai-config.json al repositorio público.
- No subas chat-data.json al repositorio público.
- Protege admin-chat-simple.html con contraseña en tu hosting (.htaccess o panel del proveedor).
- El proyecto incluye .htaccess para bloquear acceso directo a archivos sensibles.

## Variables y persistencia

- Mensajes: chat-data.json
- Configuración IA: ai-config.json
- Control de cooldown: ai-cooldown.json
- Documentos subidos: ai-documents/

## Prueba local

Desde la carpeta del proyecto:

php -S localhost:8000

Luego abre:
- http://localhost:8000/index.html
- http://localhost:8000/admin-chat-simple.html

## Solución rápida de errores comunes

- Error al responder IA: revisa cURL habilitado y API Key correcta.
- Error al subir PDF: revisa fileinfo y permisos de escritura.
- No guarda mensajes: revisa permisos de chat-data.json y carpeta del proyecto.
