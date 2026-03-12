<?php
// Archivo de verificación de salud
header('Content-Type: application/json');

$status = [
    'status' => 'ok',
    'php_version' => phpversion(),
    'sqlite_available' => extension_loaded('pdo_sqlite'),
    'timestamp' => date('Y-m-d H:i:s')
];

// Verificar acceso a la base de datos
try {
    $db_file = __DIR__ . '/routes.db';
    $pdo = new PDO("sqlite:$db_file");
    $status['database'] = 'connected';
    $status['db_file'] = $db_file;
    $status['db_writable'] = is_writable(dirname($db_file));
} catch (Exception $e) {
    $status['database'] = 'error';
    $status['error'] = $e->getMessage();
}

echo json_encode($status, JSON_PRETTY_PRINT);
