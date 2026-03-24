<?php
// ================================================
// CABECERAS ANTI-CACHÉ (muy importante en desarrollo)
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

$db_file = "routes.db";

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
        color TEXT,
        passengers INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Intentar añadir la columna passengers si no existe (para DBs existentes)
    try {
        $pdo->exec(
            "ALTER TABLE elements ADD COLUMN passengers INTEGER DEFAULT 0",
        );
    } catch (PDOException $e) {
        // La columna probablemente ya existe
    }

    $method = $_SERVER["REQUEST_METHOD"];

    switch ($method) {
        case "GET":
            $stmt = $pdo->query("SELECT * FROM elements");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as &$row) {
                $row["geometry"] = json_decode($row["geometry"]);
            }
            echo json_encode($rows);
            break;

        case "POST":
            $input = json_decode(file_get_contents("php://input"), true);
            if (
                !$input ||
                !isset($input["name"]) ||
                !isset($input["type"]) ||
                !isset($input["geometry"])
            ) {
                http_response_code(400);
                echo json_encode(["error" => "Datos incompletos"]);
                break;
            }
            $color = $input["color"] ?? null;
            $passengers = $input["passengers"] ?? 0;
            $stmt = $pdo->prepare(
                "INSERT INTO elements (name, type, geometry, color, passengers) VALUES (?, ?, ?, ?, ?)",
            );
            $stmt->execute([
                $input["name"],
                $input["type"],
                json_encode($input["geometry"]),
                $color,
                $passengers,
            ]);
            echo json_encode(["id" => $pdo->lastInsertId()]);
            break;

        case "PUT":
            $id = $_GET["id"] ?? null;
            $input = json_decode(file_get_contents("php://input"), true);
            if ($id && isset($input["geometry"])) {
                $color = $input["color"] ?? null;
                $passengers = $input["passengers"] ?? null;

                $sql = "UPDATE elements SET geometry = ?";
                $params = [json_encode($input["geometry"])];

                if ($color !== null) {
                    $sql .= ", color = ?";
                    $params[] = $color;
                }
                if ($passengers !== null) {
                    $sql .= ", passengers = ?";
                    $params[] = $passengers;
                }

                $sql .= " WHERE id = ?";
                $params[] = $id;

                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                echo json_encode(["status" => "ok"]);
            }
            break;

        case "DELETE":
            $id = $_GET["id"] ?? null;
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
