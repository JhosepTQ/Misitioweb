<?php
/**
 * Upload Document - Sistema de subida y gestión de documentos para la IA
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$documentsDir = __DIR__ . '/ai-documents';
$configFile = __DIR__ . '/ai-config.json';

// Crear directorio si no existe
if (!file_exists($documentsDir)) {
    mkdir($documentsDir, 0777, true);
}

// Cargar configuración
function loadConfig() {
    global $configFile;
    if (!file_exists($configFile)) {
        return ['documents' => []];
    }
    return json_decode(file_get_contents($configFile), true);
}

// Guardar configuración
function saveConfig($config) {
    global $configFile;
    return file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Extraer texto de PDF (simple)
function extractTextFromPDF($filePath) {
    // Para PDFs simples, usamos una extracción básica
    // En producción, usar librería como smalot/pdfparser
    $content = @file_get_contents($filePath);
    
    // Extracción muy básica de texto de PDF
    if (preg_match_all('/\((.*?)\)/s', $content, $matches)) {
        return implode(' ', $matches[1]);
    }
    
    return "Contenido del PDF (requiere procesamiento adicional)";
}

// Extraer texto según tipo de archivo
function extractContent($filePath, $mimeType) {
    switch ($mimeType) {
        case 'text/plain':
            return file_get_contents($filePath);
        
        case 'application/pdf':
            return extractTextFromPDF($filePath);
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            // Para DOCX, necesitaría librería adicional
            return "Documento Word (requiere procesamiento)";
        
        default:
            return "Tipo de archivo no soportado para extracción automática";
    }
}

// SUBIR DOCUMENTO
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['document'])) {
    $file = $_FILES['document'];
    
    // Validar archivo
    $allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];
    
    $maxSize = 10 * 1024 * 1024; // 10 MB
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'error' => 'Error al subir archivo']);
        exit;
    }
    
    if ($file['size'] > $maxSize) {
        echo json_encode(['success' => false, 'error' => 'Archivo muy grande (máx 10 MB)']);
        exit;
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Tipo de archivo no permitido. Use PDF, TXT o DOCX']);
        exit;
    }
    
    // Generar nombre único
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $uniqueName = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file['name']);
    $filePath = $documentsDir . '/' . $uniqueName;
    
    // Mover archivo
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar el archivo']);
        exit;
    }
    
    // Extraer contenido
    $content = extractContent($filePath, $mimeType);
    
    // Guardar en configuración
    $config = loadConfig();
    
    $document = [
        'id' => uniqid(),
        'name' => $file['name'],
        'filename' => $uniqueName,
        'path' => $filePath,
        'size' => $file['size'],
        'type' => $mimeType,
        'uploaded' => time(),
        'content' => substr($content, 0, 50000) // Limitar a 50KB de texto
    ];
    
    $config['documents'][] = $document;
    
    if (saveConfig($config)) {
        echo json_encode([
            'success' => true,
            'message' => 'Documento subido correctamente',
            'document' => [
                'id' => $document['id'],
                'name' => $document['name'],
                'size' => $document['size'],
                'uploaded' => $document['uploaded']
            ]
        ]);
    } else {
        unlink($filePath);
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar la configuración']);
    }
    exit;
}

// LISTAR DOCUMENTOS
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'list') {
    $config = loadConfig();
    $documents = [];
    
    foreach ($config['documents'] ?? [] as $doc) {
        $documents[] = [
            'id' => $doc['id'],
            'name' => $doc['name'],
            'size' => $doc['size'],
            'type' => $doc['type'],
            'uploaded' => $doc['uploaded']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'documents' => $documents,
        'total_size' => array_sum(array_column($documents, 'size'))
    ]);
    exit;
}

// ELIMINAR DOCUMENTO
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || (isset($_GET['action']) && $_GET['action'] === 'delete')) {
    $data = json_decode(file_get_contents('php://input'), true);
    $documentId = $data['id'] ?? $_GET['id'] ?? null;
    
    if (!$documentId) {
        echo json_encode(['success' => false, 'error' => 'ID de documento no proporcionado']);
        exit;
    }
    
    $config = loadConfig();
    $found = false;
    
    foreach ($config['documents'] ?? [] as $key => $doc) {
        if ($doc['id'] === $documentId) {
            // Eliminar archivo físico
            if (file_exists($doc['path'])) {
                unlink($doc['path']);
            }
            
            // Eliminar de configuración
            unset($config['documents'][$key]);
            $config['documents'] = array_values($config['documents']);
            $found = true;
            break;
        }
    }
    
    if ($found && saveConfig($config)) {
        echo json_encode([
            'success' => true,
            'message' => 'Documento eliminado correctamente'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo eliminar el documento']);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Acción no válida']);
