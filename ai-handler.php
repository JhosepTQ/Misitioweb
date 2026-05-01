<?php
/**
 * AI Handler - Integración con Gemini API
 * Maneja las respuestas automáticas cuando el modo IA está activado
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cargar configuración
function loadConfig() {
    $configFile = __DIR__ . '/ai-config.json';
    if (!file_exists($configFile)) {
        return null;
    }
    return json_decode(file_get_contents($configFile), true);
}

// Guardar configuración
function saveConfig($config) {
    $configFile = __DIR__ . '/ai-config.json';
    return file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Obtener estado de la IA
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'status') {
    $config = loadConfig();
    echo json_encode([
        'success' => true,
        'ai_enabled' => $config['ai_enabled'] ?? false,
        'has_api_key' => !empty($config['api_key']),
        'documents_count' => count($config['documents'] ?? []),
        'model' => $config['model'] ?? 'gemini-1.5-flash'
    ]);
    exit;
}

// Activar/Desactivar IA
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'toggle') {
    $config = loadConfig();
    $data = json_decode(file_get_contents('php://input'), true);
    
    $config['ai_enabled'] = $data['enabled'] ?? false;
    
    if (saveConfig($config)) {
        echo json_encode([
            'success' => true,
            'ai_enabled' => $config['ai_enabled'],
            'message' => $config['ai_enabled'] ? 'Modo automático activado' : 'Modo manual activado'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar la configuración']);
    }
    exit;
}

// Configurar API Key
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'set_api_key') {
    $config = loadConfig();
    $data = json_decode(file_get_contents('php://input'), true);
    
    $config['api_key'] = trim($data['api_key'] ?? '');
    
    if (saveConfig($config)) {
        echo json_encode([
            'success' => true,
            'message' => 'API Key configurada correctamente'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar la API Key']);
    }
    exit;
}

// Borrar API Key
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete_api_key') {
    $config = loadConfig();
    
    $config['api_key'] = '';
    
    if (saveConfig($config)) {
        echo json_encode([
            'success' => true,
            'message' => 'API Key eliminada correctamente'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo eliminar la API Key']);
    }
    exit;
}

// Generar respuesta con IA
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'generate') {
    error_log("======================================");
    error_log("[ai-handler.php] Petición recibida para generar respuesta");
    
    $config = loadConfig();
    
    if (!$config['ai_enabled']) {
        error_log("[ai-handler.php] ❌ IA no está activada");
        echo json_encode(['success' => false, 'error' => 'IA no está activada']);
        exit;
    }
    
    if (empty($config['api_key'])) {
        error_log("[ai-handler.php] ❌ API Key no configurada");
        echo json_encode(['success' => false, 'error' => 'API Key no configurada']);
        exit;
    }
    
    error_log("[ai-handler.php] ✅ IA activada y API Key presente");
    
    $data = json_decode(file_get_contents('php://input'), true);
    $userMessage = $data['message'] ?? '';
    $conversationHistory = $data['history'] ?? [];
    
    error_log("[ai-handler.php] Mensaje del usuario: $userMessage");
    error_log("[ai-handler.php] Historial: " . count($conversationHistory) . " mensajes");
    
    // Construir contexto
    $context = buildContext($config);
    
    // Construir prompt
    $systemPrompt = $config['prompt_system'];
    $fullPrompt = $systemPrompt . "\n\n" . $context . "\n\nHistorial de conversación:\n";
    
    // Agregar historial reciente (últimos 5 mensajes)
    $recentHistory = array_slice($conversationHistory, -5);
    foreach ($recentHistory as $msg) {
        $sender = $msg['sender'] === 'client' ? 'Cliente' : 'Asistente';
        $fullPrompt .= "$sender: {$msg['text']}\n";
    }
    
    $fullPrompt .= "\nCliente: $userMessage\nAsistente:";
    
    error_log("[ai-handler.php] Llamando a Gemini API...");
    
    // Llamar a Gemini API
    $response = callGeminiAPI($config['api_key'], $fullPrompt, $config);
    
    if ($response['success']) {
        error_log("[ai-handler.php] ✅ Respuesta exitosa de Gemini");
        error_log("[ai-handler.php] Respuesta: " . substr($response['text'], 0, 100) . "...");
        echo json_encode([
            'success' => true,
            'response' => $response['text']
        ]);
    } else {
        error_log("[ai-handler.php] ❌ Error de Gemini: " . $response['error']);
        echo json_encode([
            'success' => false,
            'error' => $response['error']
        ]);
    }
    error_log("======================================");
    exit;
}

// Listar documentos
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'documents') {
    $config = loadConfig();
    echo json_encode([
        'success' => true,
        'documents' => $config['documents'] ?? []
    ]);
    exit;
}

// Construir contexto desde configuración
function buildContext($config) {
    $context = "INFORMACIÓN DE LA EMPRESA:\n";
    $context .= "Nombre: {$config['empresa']['nombre']}\n";
    $context .= "Ubicación: {$config['empresa']['ubicacion']}\n";
    $context .= "Horario: {$config['empresa']['horario']}\n\n";
    
    $context .= "SERVICIOS DISPONIBLES:\n";
    foreach ($config['servicios'] as $servicio) {
        $context .= "- {$servicio['nombre']}: {$servicio['precio']}\n";
        $context .= "  {$servicio['descripcion']}\n";
        $context .= "  Tiempo de entrega: {$servicio['tiempo_entrega']}\n\n";
    }
    
    $context .= "PREGUNTAS FRECUENTES:\n";
    foreach ($config['faq'] as $faq) {
        $context .= "P: {$faq['pregunta']}\n";
        $context .= "R: {$faq['respuesta']}\n\n";
    }
    
    // Agregar contenido de documentos si existen
    if (!empty($config['documents'])) {
        $context .= "DOCUMENTOS ADICIONALES:\n";
        foreach ($config['documents'] as $doc) {
            if (!empty($doc['content'])) {
                $context .= "Documento: {$doc['name']}\n";
                $context .= substr($doc['content'], 0, 2000) . "...\n\n";
            }
        }
    }
    
    return $context;
}

// Llamar a Gemini API
function callGeminiAPI($apiKey, $prompt, $config) {
    $url = "https://generativelanguage.googleapis.com/v1/models/{$config['model']}:generateContent?key=$apiKey";
    
    error_log("[callGeminiAPI] URL: $url");
    error_log("[callGeminiAPI] Modelo: {$config['model']}");
    
    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompt]
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
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    error_log("[callGeminiAPI] HTTP Code: $httpCode");
    if ($curlError) {
        error_log("[callGeminiAPI] CURL Error: $curlError");
    }
    
    if ($httpCode !== 200) {
        error_log("[callGeminiAPI] ❌ Error HTTP $httpCode: " . substr($response, 0, 500));
        return [
            'success' => false,
            'error' => "Error de API: HTTP $httpCode - $response"
        ];
    }
    
    $result = json_decode($response, true);
    
    if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        $aiText = trim($result['candidates'][0]['content']['parts'][0]['text']);
        error_log("[callGeminiAPI] ✅ Respuesta obtenida: " . substr($aiText, 0, 100) . "...");
        return [
            'success' => true,
            'text' => $aiText
        ];
    }
    
    error_log("[callGeminiAPI] ❌ No se encontró texto en respuesta");
    error_log("[callGeminiAPI] Respuesta completa: " . json_encode($result));
    
    return [
        'success' => false,
        'error' => 'No se pudo generar respuesta'
    ];
}

// Si no se reconoce la acción
echo json_encode(['success' => false, 'error' => 'Acción no válida']);
