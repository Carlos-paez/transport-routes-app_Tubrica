<?php
header("Content-Type: application/json");
$db_file = 'routes.db';

try {
    $pdo = new PDO("sqlite:" . __DIR__ . "/$db_file");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Optimización de rendimiento
    $pdo->exec("PRAGMA journal_mode = WAL");

    // Crear tabla si no existe
    $pdo->exec("CREATE TABLE IF NOT EXISTS elements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        geometry TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT * FROM elements");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as &$row) {
                $row['geometry'] = json_decode($row['geometry']);
            }
            echo json_encode($rows);
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO elements (name, type, geometry) VALUES (?, ?, ?)");
            $stmt->execute([$input['name'], $input['type'], json_encode($input['geometry'])]);
            echo json_encode(["id" => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            $id = $_GET['id'] ?? null;
            $input = json_decode(file_get_contents('php://input'), true);
            if ($id && isset($input['geometry'])) {
                $stmt = $pdo->prepare("UPDATE elements SET geometry = ? WHERE id = ?");
                $stmt->execute([json_encode($input['geometry']), $id]);
                echo json_encode(["status" => "ok"]);
            }
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM elements WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(["status" => "ok"]);
            }
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}