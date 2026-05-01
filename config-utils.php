<?php
/**
 * Utilidades de configuración para IA.
 * Evitan errores cuando ai-config.json no existe o está vacío/corrupto.
 */

function getDefaultAIConfig() {
    return [
        'ai_enabled' => false,
        'api_key' => '',
        'model' => 'gemini-2.5-flash',
        'temperature' => 0.7,
        'max_response_length' => 300,
        'empresa' => [
            'nombre' => 'J&G Web Studio',
            'ubicacion' => 'Lima, Perú',
            'horario' => 'Lunes a Viernes 9am - 6pm',
            'telefono' => '',
            'email' => '',
            'website' => ''
        ],
        'servicios' => [],
        'faq' => [],
        'prompt_system' => 'Eres un asistente virtual profesional de J&G Web Studio. Responde de forma clara, amable y útil. Si falta información concreta, invitar a contactar al equipo humano.',
        'documents' => []
    ];
}

function mergeAIConfig(array $config) {
    $defaults = getDefaultAIConfig();

    if (!isset($config['empresa']) || !is_array($config['empresa'])) {
        $config['empresa'] = [];
    }

    $config['empresa'] = array_merge($defaults['empresa'], $config['empresa']);

    // Mantener arrays válidos para evitar warnings en foreach.
    foreach (['servicios', 'faq', 'documents'] as $arrayKey) {
        if (!isset($config[$arrayKey]) || !is_array($config[$arrayKey])) {
            $config[$arrayKey] = $defaults[$arrayKey];
        }
    }

    return array_merge($defaults, $config);
}

function loadAIConfig(string $configFile) {
    $config = [];

    if (file_exists($configFile)) {
        $raw = @file_get_contents($configFile);
        if ($raw !== false && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $config = $decoded;
            }
        }
    }

    $normalized = mergeAIConfig($config);

    // Auto-reparar/crear archivo si falta, está vacío o incompleto.
    $encoded = json_encode($normalized, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (!file_exists($configFile) || filesize($configFile) === 0 || json_encode($config) !== json_encode($normalized)) {
        @file_put_contents($configFile, $encoded, LOCK_EX);
    }

    return $normalized;
}

function saveAIConfig(string $configFile, array $config) {
    $normalized = mergeAIConfig($config);
    return @file_put_contents(
        $configFile,
        json_encode($normalized, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}
