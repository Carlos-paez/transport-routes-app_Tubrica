<?php
header("Content-Type: application/json");
$db_file = 'routes.db';

try {
    $pdo = new PDO("sqlite:" . __DIR__ . "/$db_file");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("PRAGMA journal_mode = WAL"); // Optimización de escritura

    $pdo->exec("CREATE TABLE IF NOT EXISTS elements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        geometry TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT * FROM elements ORDER BY created_at DESC");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as &$row) {
                $row['geometry'] = json_decode($row['geometry']);
            }
            echo json_encode($rows);
            break;

        case 'POST':
            if (!isset($input['geometry'])) throw new Exception("Datos insuficientes");
            $stmt = $pdo->prepare("INSERT INTO elements (name, type, geometry, color) VALUES (?, ?, ?, ?)");
            $stmt->execute([$input['name'] ?? 'Sin nombre', $input['type'], json_encode($input['geometry']), $input['color']]);
            echo json_encode(["id" => $pdo->lastInsertId(), "status" => "saved"]);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM elements WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(["status" => "deleted"]);
            }
            break;

        case 'PUT':
            $id = $_GET['id'] ?? null;
            if ($id && isset($input['geometry'])) {
                $stmt = $pdo->prepare("UPDATE elements SET geometry = ?, color = ? WHERE id = ?");
                $stmt->execute([json_encode($input['geometry']), $input['color'], $id]);
                echo json_encode(["status" => "updated"]);
            }
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}