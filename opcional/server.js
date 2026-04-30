const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CONFIGURACIÓN - EDITA ESTOS VALORES
// ============================================

// Evolution API (si usas Railway)
const EVOLUTION_API_URL = 'https://tu-app.railway.app';
const EVOLUTION_API_KEY = 'tu_api_key_aqui';
const INSTANCE_NAME = 'jgwebstudio';

// Tu número de WhatsApp (con código de país, sin + ni espacios)
const YOUR_WHATSAPP_NUMBER = '51992514222';

// Firebase Admin (para acceder a la base de datos)
const FIREBASE_CONFIG = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN.firebaseapp.com",
    databaseURL: "https://TU_PROJECT_ID.firebaseio.com",
    projectId: "TU_PROJECT_ID"
};

// ============================================
// INICIALIZAR FIREBASE ADMIN
// ============================================

admin.initializeApp({
    credential: admin.credential.cert({
        // Descarga tu service account key desde Firebase Console
        // y pega los valores aquí
        projectId: FIREBASE_CONFIG.projectId,
        privateKey: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com"
    }),
    databaseURL: FIREBASE_CONFIG.databaseURL
});

const db = admin.database();

// ============================================
// ALMACENAR MAPEO DE SESIONES
// ============================================

// Mapeo: número de WhatsApp → sessionId del chat
const sessionMap = new Map();

// ============================================
// ENDPOINT 1: Recibir mensaje del sitio web
// ============================================

app.post('/api/send-to-whatsapp', async (req, res) => {
    try {
        const { message, sessionId, page } = req.body;
        
        console.log(`📨 Nuevo mensaje del sitio web`);
        console.log(`   Sesión: ${sessionId}`);
        console.log(`   Mensaje: ${message}`);
        
        // Formatear mensaje para WhatsApp
        const whatsappMessage = `
🌐 *MENSAJE DEL SITIO WEB*

💬 ${message}

---
📋 Sesión: ${sessionId.substring(0, 20)}
🌐 Página: ${page || 'index.html'}
⏰ ${new Date().toLocaleString('es-PE')}

💡 Responde este mensaje para que el cliente vea tu respuesta en el sitio web.
        `.trim();
        
        // Enviar a WhatsApp usando Evolution API
        const response = await axios.post(
            `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
            {
                number: YOUR_WHATSAPP_NUMBER,
                text: whatsappMessage
            },
            {
                headers: {
                    'apikey': EVOLUTION_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Guardar mapeo para saber a qué sesión pertenece
        sessionMap.set(response.data.key.id, sessionId);
        
        console.log('✅ Mensaje enviado a WhatsApp');
        res.json({ success: true, messageId: response.data.key.id });
        
    } catch (error) {
        console.error('❌ Error al enviar a WhatsApp:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ENDPOINT 2: Webhook para respuestas de WhatsApp
// ============================================

app.post('/webhook/evolution', async (req, res) => {
    try {
        const { event, instance, data } = req.body;
        
        // Filtrar solo mensajes recibidos
        if (event !== 'messages.upsert') {
            return res.json({ received: true });
        }
        
        // Verificar que el mensaje es tuyo (que estás respondiendo)
        if (!data.key.fromMe) {
            return res.json({ received: true });
        }
        
        const message = data.message?.conversation || 
                       data.message?.extendedTextMessage?.text || '';
        
        if (!message) {
            return res.json({ received: true });
        }
        
        console.log(`📱 Respuesta de WhatsApp recibida: ${message}`);
        
        // Intentar identificar a qué sesión responder
        // Si es una respuesta a un mensaje anterior
        const contextInfo = data.message?.extendedTextMessage?.contextInfo;
        let sessionId = null;
        
        if (contextInfo && contextInfo.stanzaId) {
            sessionId = sessionMap.get(contextInfo.stanzaId);
        }
        
        // Si no encontramos sesión, buscar la más reciente activa
        if (!sessionId) {
            const chatsSnapshot = await db.ref('chats').once('value');
            const chats = chatsSnapshot.val();
            
            // Buscar chat más reciente con status 'active'
            let latestTime = 0;
            Object.keys(chats || {}).forEach(chatId => {
                const chat = chats[chatId];
                if (chat.info?.status === 'active' || chat.info?.status === 'waiting_response') {
                    const lastActivity = chat.info.lastActivity || 0;
                    if (lastActivity > latestTime) {
                        latestTime = lastActivity;
                        sessionId = chatId;
                    }
                }
            });
        }
        
        if (!sessionId) {
            console.log('⚠️ No se encontró sesión activa para la respuesta');
            return res.json({ received: true, warning: 'No active session found' });
        }
        
        console.log(`🎯 Enviando respuesta a sesión: ${sessionId}`);
        
        // Guardar respuesta en Firebase
        await db.ref(`chats/${sessionId}/messages`).push({
            text: message,
            isBot: true,
            fromAdmin: true,
            fromWhatsApp: true,
            timestamp: Date.now(),
            read: false
        });
        
        // Actualizar info del chat
        await db.ref(`chats/${sessionId}/info`).update({
            lastActivity: Date.now(),
            lastMessage: message,
            status: 'responded'
        });
        
        console.log('✅ Respuesta guardada en Firebase');
        res.json({ success: true, sessionId });
        
    } catch (error) {
        console.error('❌ Error en webhook:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ENDPOINT 3: Health check
// ============================================

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        config: {
            evolutionApiConfigured: !!EVOLUTION_API_URL && !!EVOLUTION_API_KEY,
            firebaseConfigured: !!FIREBASE_CONFIG.projectId,
            whatsappNumber: YOUR_WHATSAPP_NUMBER
        }
    });
});

// ============================================
// ENDPOINT 4: Configurar webhook en Evolution API
// ============================================

app.post('/setup-webhook', async (req, res) => {
    try {
        const { serverUrl } = req.body;
        
        const response = await axios.post(
            `${EVOLUTION_API_URL}/webhook/set/${INSTANCE_NAME}`,
            {
                url: `${serverUrl}/webhook/evolution`,
                webhook_by_events: false,
                webhook_base64: false,
                events: [
                    'messages.upsert'
                ]
            },
            {
                headers: {
                    'apikey': EVOLUTION_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ Webhook configurado en Evolution API');
        res.json({ success: true, data: response.data });
        
    } catch (error) {
        console.error('❌ Error al configurar webhook:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 SERVIDOR WHATSAPP-CHAT INICIADO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`📱 WhatsApp: ${YOUR_WHATSAPP_NUMBER}`);
    console.log(`🔥 Firebase: ${FIREBASE_CONFIG.projectId || 'No configurado'}`);
    console.log(`🌐 Evolution API: ${EVOLUTION_API_URL}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('💡 Endpoints disponibles:');
    console.log(`   POST /api/send-to-whatsapp - Enviar mensaje a WhatsApp`);
    console.log(`   POST /webhook/evolution - Recibir mensajes de WhatsApp`);
    console.log(`   POST /setup-webhook - Configurar webhook automáticamente`);
    console.log(`   GET  /health - Estado del servidor`);
    console.log('');
    console.log('✅ Servidor listo para recibir mensajes');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Manejar errores no capturados
process.on('unhandledRejection', (error) => {
    console.error('❌ Error no manejado:', error);
});
