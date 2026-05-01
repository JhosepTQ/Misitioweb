<?php
// ========================================
// CHAT API SIMPLE - SIN DEPENDENCIAS
// ========================================
// Sistema de chat bidireccional usando solo PHP + JSON
// No requiere Firebase ni servicios externos

require_once __DIR__ . '/debug-log.php';
require_once __DIR__ . '/config-utils.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Archivo JSON donde se guardan los mensajes
$chatDataFile = __DIR__ . '/chat-data.json';

// Crear archivo si no existe
if (!file_exists($chatDataFile)) {
    file_put_contents($chatDataFile, json_encode(['sessions' => []]), LOCK_EX);
    chmod($chatDataFile, 0666);
}

// Función para leer datos
function readChatData($file) {
    if (!file_exists($file)) {
        return ['sessions' => []];
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: ['sessions' => []];
}

// Función para guardar datos
function saveChatData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}

// Función para verificar si la IA debe responder
function shouldAIRespond() {
    $configFile = __DIR__ . '/ai-config.json';
    $config = loadAIConfig($configFile);
    $ai_enabled = $config['ai_enabled'] ?? false;
    $has_api_key = !empty($config['api_key']);
    
    error_log("[shouldAIRespond] ai_enabled: " . ($ai_enabled ? 'SI' : 'NO'));
    error_log("[shouldAIRespond] has_api_key: " . ($has_api_key ? 'SI' : 'NO'));
    
    return $ai_enabled && $has_api_key;
}

// Función para verificar cooldown (evitar spam de requests)
function checkAICooldown($sessionId) {
    $cooldownFile = __DIR__ . '/ai-cooldown.json';
    $cooldownTime = 2; // 2 segundos entre respuestas de IA
    
    if (!file_exists($cooldownFile)) {
        file_put_contents($cooldownFile, json_encode([]));
    }
    
    $cooldowns = json_decode(file_get_contents($cooldownFile), true) ?? [];
    $now = time();
    
    // Limpiar cooldowns antiguos (más de 10 segundos)
    foreach ($cooldowns as $sid => $timestamp) {
        if ($now - $timestamp > 10) {
            unset($cooldowns[$sid]);
        }
    }
    
    // Verificar si esta sesión está en cooldown
    if (isset($cooldowns[$sessionId]) && ($now - $cooldowns[$sessionId]) < $cooldownTime) {
        $remaining = $cooldownTime - ($now - $cooldowns[$sessionId]);
        error_log("⚠️ COOLDOWN ACTIVO - Esperar {$remaining}s antes de generar otra respuesta");
        return false;
    }
    
    // Registrar nuevo cooldown
    $cooldowns[$sessionId] = $now;
    file_put_contents($cooldownFile, json_encode($cooldowns));
    
    return true;
}

// Función para generar respuesta con IA
function generateAIResponse($sessionId, $message, $conversationHistory) {
    // En lugar de hacer cURL a localhost (que bloquea el servidor de desarrollo),
    // llamamos directamente a las funciones de ai-handler.php
    
    error_log("[generateAIResponse] Generando respuesta directamente");
    error_log("[generateAIResponse] Mensaje: $message");
    
    // Cargar configuración de IA
    $configFile = __DIR__ . '/ai-config.json';
    $config = loadAIConfig($configFile);
    
    if (!$config['ai_enabled']) {
        error_log("[generateAIResponse] ❌ IA no está activada");
        return null;
    }
    
    if (empty($config['api_key'])) {
        error_log("[generateAIResponse] ❌ API Key no configurada");
        return null;
    }
    
    // Construir contexto
    $systemPrompt = $config['prompt_system'];
    $context = "\n\nEMPRESA: {$config['empresa']['nombre']} en {$config['empresa']['ubicacion']}\n";
    $context .= "Horario: {$config['empresa']['horario']}\n\n";
    $context .= "SERVICIOS DISPONIBLES:\n";
    foreach (($config['servicios'] ?? []) as $servicio) {
        if (!is_array($servicio)) {
            continue;
        }
        $context .= "- {$servicio['nombre']}: {$servicio['precio']}\n";
        $context .= "  {$servicio['descripcion']}\n\n";
    }
    
    $fullPrompt = $systemPrompt . $context . "\n\nHistorial de conversación:\n";
    
    // Agregar historial reciente (últimos 5 mensajes)
    $recentHistory = array_slice($conversationHistory, -5);
    foreach ($recentHistory as $msg) {
        $sender = $msg['sender'] === 'client' ? 'Cliente' : 'Asistente';
        $fullPrompt .= "$sender: {$msg['text']}\n";
    }
    
    $fullPrompt .= "\nCliente: $message\nAsistente:";
    
    error_log("[generateAIResponse] Llamando a Gemini API...");
    
    // Llamar a Gemini API
    $url = "https://generativelanguage.googleapis.com/v1/models/{$config['model']}:generateContent?key={$config['api_key']}";
    
    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $fullPrompt]
                ]
            ]
        ],
        'generationConfig' => [
            'temperature' => $config['temperature'] ?? 0.7,
            'maxOutputTokens' => $config['max_response_length'] ?? 300,
            'topP' => 0.8,
            'topK' => 10
        ]
    ];
    
    if (!function_exists('curl_init')) {
        error_log("[generateAIResponse] ❌ cURL no está disponible en este hosting");
        return null;
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    error_log("[generateAIResponse] HTTP Code: $httpCode");
    if ($curlError) {
        error_log("[generateAIResponse] CURL Error: $curlError");
    }
    
    if ($httpCode === 200) {
        $result = json_decode($response, true);
        
        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            $aiText = trim($result['candidates'][0]['content']['parts'][0]['text']);
            error_log("[generateAIResponse] ✅ Respuesta obtenida: " . substr($aiText, 0, 100) . "...");
            return $aiText;
        } else {
            error_log("[generateAIResponse] ❌ No se encontró texto en respuesta");
        }
    } else {
        error_log("[generateAIResponse] ❌ Error HTTP $httpCode: " . substr($response, 0, 200));
    }
    
    return null;
}

// Obtener método y acción
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ========================================
// RUTAS DEL API
// ========================================

switch ($method . ':' . $action) {
    
    // POST: Enviar nuevo mensaje del cliente
    case 'POST:send':
        error_log("========== POST:send EJECUTÁNDOSE ==========");
        error_log("Método: $method, Acción: $action");
        
        $input = json_decode(file_get_contents('php://input'), true);
        $sessionId = $input['sessionId'] ?? '';
        $message = $input['message'] ?? '';
        $userAgent = $input['userAgent'] ?? '';
        $page = $input['page'] ?? '';
        
        error_log("SessionID: $sessionId");
        error_log("Mensaje: $message");
        
        if (empty($sessionId) || empty($message)) {
            error_log("ERROR: sessionId o message vacíos");
            http_response_code(400);
            echo json_encode(['error' => 'sessionId y message son requeridos']);
            exit;
        }
        
        $data = readChatData($chatDataFile);
        
        // Crear sesión si no existe
        if (!isset($data['sessions'][$sessionId])) {
            $data['sessions'][$sessionId] = [
                'info' => [
                    'startTime' => time(),
                    'status' => 'active',
                    'userAgent' => $userAgent,
                    'page' => $page,
                    'hasUnreadMessages' => true
                ],
                'messages' => []
            ];
        }
        
        // Agregar mensaje
        $newMessage = [
            'id' => uniqid(),
            'text' => $message,
            'sender' => 'client',
            'timestamp' => time(),
            'read' => false,
            'ai_processed' => false  // Flag para evitar respuestas duplicadas
        ];
        
        $data['sessions'][$sessionId]['messages'][] = $newMessage;
        $data['sessions'][$sessionId]['info']['lastActivity'] = time();
        $data['sessions'][$sessionId]['info']['lastMessage'] = substr($message, 0, 100);
        $data['sessions'][$sessionId]['info']['hasUnreadMessages'] = true;
        $data['sessions'][$sessionId]['info']['status'] = 'waiting_response';
        
        saveChatData($chatDataFile, $data);
        
        // VERIFICAR SI LA IA DEBE RESPONDER AUTOMÁTICAMENTE
        $aiResponse = null;
        if (shouldAIRespond() && !$newMessage['ai_processed'] && checkAICooldown($sessionId)) {
            // Log para debug
            error_log("IA ACTIVADA - Intentando generar respuesta...");
            error_log("DEBUG: Mensaje ID: " . $newMessage['id'] . " - Primera vez procesando");
            
            // Marcar como procesado INMEDIATAMENTE para evitar duplicados
            $messageIndex = count($data['sessions'][$sessionId]['messages']) - 1;
            $data['sessions'][$sessionId]['messages'][$messageIndex]['ai_processed'] = true;
            saveChatData($chatDataFile, $data);
            
            // Generar respuesta automática con IA
            $conversationHistory = $data['sessions'][$sessionId]['messages'];
            $aiResponse = generateAIResponse($sessionId, $message, $conversationHistory);
            
            error_log("DEBUG: generateAIResponse devolvió: " . ($aiResponse ? substr($aiResponse, 0, 100) : 'NULL/FALSE/EMPTY'));
            error_log("DEBUG: Tipo de dato: " . gettype($aiResponse));
            error_log("DEBUG: Es vacío: " . (empty($aiResponse) ? 'SI' : 'NO'));
            
            if ($aiResponse) {
                error_log("IA RESPONDIÓ: " . substr($aiResponse, 0, 50) . "...");
                
                // Agregar respuesta de IA
                $aiMessage = [
                    'id' => uniqid(),
                    'text' => $aiResponse,
                    'sender' => 'admin',
                    'timestamp' => time(),
                    'read' => false,
                    'is_ai' => true
                ];
                
                error_log("DEBUG: Antes de agregar mensaje IA, total mensajes: " . count($data['sessions'][$sessionId]['messages']));
                
                $data['sessions'][$sessionId]['messages'][] = $aiMessage;
                $data['sessions'][$sessionId]['info']['lastActivity'] = time();
                $data['sessions'][$sessionId]['info']['status'] = 'responded';
                
                error_log("DEBUG: Después de agregar mensaje IA, total mensajes: " . count($data['sessions'][$sessionId]['messages']));
                
                $saved = saveChatData($chatDataFile, $data);
                error_log("DEBUG: saveChatData devolvió: " . ($saved ? "true ($saved bytes)" : "false"));
                
                // Verificar que se guardó correctamente
                $verifyData = readChatData($chatDataFile);
                $verifyCount = count($verifyData['sessions'][$sessionId]['messages']);
                error_log("DEBUG: Verificación - Mensajes en archivo después de guardar: $verifyCount");
            } else {
                error_log("IA NO RESPONDIÓ - Error al generar respuesta");
            }
        } else {
            if ($newMessage['ai_processed']) {
                error_log("⚠️ Mensaje ya procesado - Evitando llamada duplicada a IA");
            } else {
                error_log("IA DESACTIVADA - No se generará respuesta automática");
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => $newMessage,
            'ai_response' => $aiResponse
        ]);
        break;
    
    // GET: Obtener mensajes nuevos del cliente
    case 'GET:get':
        $sessionId = $_GET['sessionId'] ?? '';
        $lastTimestamp = isset($_GET['lastTimestamp']) ? (int)$_GET['lastTimestamp'] : 0;
        
        if (empty($sessionId)) {
            http_response_code(400);
            echo json_encode(['error' => 'sessionId es requerido']);
            exit;
        }
        
        $data = readChatData($chatDataFile);
        
        // Si no existe la sesión, retornar vacío
        if (!isset($data['sessions'][$sessionId])) {
            echo json_encode([
                'success' => true,
                'messages' => [],
                'hasNew' => false
            ]);
            exit;
        }
        
        // Obtener solo mensajes del admin que sean más recientes
        $messages = $data['sessions'][$sessionId]['messages'] ?? [];
        $newMessages = array_filter($messages, function($msg) use ($lastTimestamp) {
            return $msg['sender'] === 'admin' && $msg['timestamp'] > $lastTimestamp;
        });
        
        echo json_encode([
            'success' => true,
            'messages' => array_values($newMessages),
            'hasNew' => count($newMessages) > 0
        ]);
        break;
    
    // GET: Listar todas las sesiones (para el admin)
    case 'GET:list':
        $data = readChatData($chatDataFile);
        $sessions = [];
        
        foreach ($data['sessions'] as $sessionId => $session) {
            $sessions[] = [
                'sessionId' => $sessionId,
                'info' => $session['info'],
                'messageCount' => count($session['messages']),
                'lastMessage' => end($session['messages'])
            ];
        }
        
        // Ordenar por última actividad
        usort($sessions, function($a, $b) {
            return ($b['info']['lastActivity'] ?? 0) - ($a['info']['lastActivity'] ?? 0);
        });
        
        echo json_encode([
            'success' => true,
            'sessions' => $sessions
        ]);
        break;
    
    // GET: Obtener mensajes de una sesión específica (para el admin)
    case 'GET:session':
        $sessionId = $_GET['sessionId'] ?? '';
        
        if (empty($sessionId)) {
            http_response_code(400);
            echo json_encode(['error' => 'sessionId es requerido']);
            exit;
        }
        
        $data = readChatData($chatDataFile);
        
        if (!isset($data['sessions'][$sessionId])) {
            http_response_code(404);
            echo json_encode(['error' => 'Sesión no encontrada']);
            exit;
        }
        
        // Marcar mensajes como leídos por el admin
        foreach ($data['sessions'][$sessionId]['messages'] as &$msg) {
            if ($msg['sender'] === 'client' && !$msg['read']) {
                $msg['read'] = true;
            }
        }
        $data['sessions'][$sessionId]['info']['hasUnreadMessages'] = false;
        saveChatData($chatDataFile, $data);
        
        echo json_encode([
            'success' => true,
            'session' => $data['sessions'][$sessionId]
        ]);
        break;
    
    // POST: Admin responde a un cliente
    case 'POST:reply':
        $input = json_decode(file_get_contents('php://input'), true);
        $sessionId = $input['sessionId'] ?? '';
        $message = $input['message'] ?? '';
        
        if (empty($sessionId) || empty($message)) {
            http_response_code(400);
            echo json_encode(['error' => 'sessionId y message son requeridos']);
            exit;
        }
        
        $data = readChatData($chatDataFile);
        
        if (!isset($data['sessions'][$sessionId])) {
            http_response_code(404);
            echo json_encode(['error' => 'Sesión no encontrada']);
            exit;
        }
        
        // Agregar respuesta del admin
        $newMessage = [
            'id' => uniqid(),
            'text' => $message,
            'sender' => 'admin',
            'timestamp' => time(),
            'read' => false
        ];
        
        $data['sessions'][$sessionId]['messages'][] = $newMessage;
        $data['sessions'][$sessionId]['info']['lastActivity'] = time();
        $data['sessions'][$sessionId]['info']['status'] = 'responded';
        
        saveChatData($chatDataFile, $data);
        
        echo json_encode([
            'success' => true,
            'message' => $newMessage
        ]);
        break;
    
    // DELETE: Eliminar una sesión
    case 'DELETE:session':
        $sessionId = $_GET['sessionId'] ?? '';
        
        if (empty($sessionId)) {
            http_response_code(400);
            echo json_encode(['error' => 'sessionId es requerido']);
            exit;
        }
        
        $data = readChatData($chatDataFile);
        
        if (!isset($data['sessions'][$sessionId])) {
            http_response_code(404);
            echo json_encode(['error' => 'Sesión no encontrada']);
            exit;
        }
        
        unset($data['sessions'][$sessionId]);
        saveChatData($chatDataFile, $data);
        
        echo json_encode([
            'success' => true,
            'message' => 'Sesión eliminada'
        ]);
        break;
    
    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'Ruta no encontrada',
            'availableActions' => [
                'POST /chat-api.php?action=send' => 'Enviar mensaje del cliente',
                'GET /chat-api.php?action=get' => 'Obtener mensajes nuevos',
                'GET /chat-api.php?action=list' => 'Listar sesiones (admin)',
                'GET /chat-api.php?action=session' => 'Obtener sesión específica (admin)',
                'POST /chat-api.php?action=reply' => 'Admin responde',
                'DELETE /chat-api.php?action=session' => 'Eliminar sesión'
            ]
        ]);
        break;
}
