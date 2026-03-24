# 📡 Documentación API - Sistema TUBRICA

## 🎯 Descripción

API REST para la gestión de elementos geográficos (rutas y marcadores) del sistema TUBRICA.

## 🔗 Endpoints

### Versión JavaScript (Node.js)

**Base URL**: `http://localhost:3000`

#### Obtener Todos los Elementos
```http
GET /api/elements
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Ruta Centro",
    "type": "route",
    "geometry": [[10.096, -69.358], [10.100, -69.360]],
    "color": "#e74c3c",
    "created_at": "2024-03-12 10:30:00"
  }
]
```

#### Crear Elemento
```http
POST /api/elements
Content-Type: application/json

{
  "name": "Nueva Ruta",
  "type": "route",
  "geometry": [[10.096, -69.358], [10.100, -69.360]],
  "color": "#3498db"
}
```

**Respuesta:**
```json
{
  "id": 2
}
```

#### Actualizar Elemento
```http
PUT /api/elements/:id
Content-Type: application/json

{
  "geometry": [[10.096, -69.358], [10.101, -69.361]],
  "color": "#2ecc71"
}
```

**Respuesta:**
```json
{
  "status": "ok"
}
```

#### Eliminar Elemento
```http
DELETE /api/elements/:id
```

**Respuesta:**
```json
{
  "status": "ok"
}
```

---

### Versión PHP

**Base URL**: `http://localhost:8000`

#### Obtener Todos los Elementos
```http
GET /api.php
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Ruta Centro",
    "type": "route",
    "geometry": [[10.096, -69.358], [10.100, -69.360]],
    "color": "#e74c3c",
    "created_at": "2024-03-12 10:30:00"
  }
]
```

#### Crear Elemento
```http
POST /api.php
Content-Type: application/json

{
  "name": "Nueva Ruta",
  "type": "route",
  "geometry": [[10.096, -69.358], [10.100, -69.360]],
  "color": "#3498db"
}
```

**Respuesta:**
```json
{
  "id": 2
}
```

#### Actualizar Elemento
```http
PUT /api.php?id=2
Content-Type: application/json

{
  "geometry": [[10.096, -69.358], [10.101, -69.361]],
  "color": "#2ecc71"
}
```

**Respuesta:**
```json
{
  "status": "ok"
}
```

#### Eliminar Elemento
```http
DELETE /api.php?id=2
```

**Respuesta:**
```json
{
  "status": "ok"
}
```

## 📋 Modelos de Datos

### Elemento (Element)

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| id | INTEGER | Identificador único | Auto |
| name | TEXT | Nombre del elemento | Sí |
| type | TEXT | Tipo: "route" o "marker" | Sí |
| geometry | TEXT | Coordenadas en JSON | Sí |
| color | TEXT | Color hexadecimal | Sí |
| passengers | INTEGER | Conteo de pasajeros (para rutas) | No |
| created_at | DATETIME | Fecha de creación | Auto |

### Tipos de Geometría

#### Ruta (route)
```json
{
  "type": "route",
  "geometry": [
    [10.096739, -69.358461],
    [10.097000, -69.359000],
    [10.098000, -69.360000]
  ]
}
```

#### Marcador (marker)
```json
{
  "type": "marker",
  "geometry": {
    "lat": 10.096739,
    "lng": -69.358461
  }
}
```

## 🔐 Autenticación (Futuro)

Actualmente no hay autenticación. Para producción, considera implementar:

### JWT (JavaScript)
```javascript
const jwt = require('jsonwebtoken');

app.use('/api', (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
});
```

### Session (PHP)
```php
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
```

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Elemento creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Elemento no encontrado |
| 500 | Internal Server Error - Error del servidor |

## 🧪 Ejemplos de Uso

### JavaScript (fetch)

```javascript
// Obtener elementos
const response = await fetch('/api/elements');
const elements = await response.json();

// Crear ruta
const newRoute = await fetch('/api/elements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Ruta Norte',
    type: 'route',
    geometry: [[10.096, -69.358], [10.100, -69.360]],
    color: '#e74c3c'
  })
});

// Actualizar
await fetch('/api/elements/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    geometry: [[10.096, -69.358], [10.101, -69.361]],
    color: '#2ecc71'
  })
});

// Eliminar
await fetch('/api/elements/1', { method: 'DELETE' });
```

### PHP (cURL)

```php
// Obtener elementos
$ch = curl_init('http://localhost:8000/api.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$elements = json_decode($response, true);

// Crear ruta
$data = [
    'name' => 'Ruta Norte',
    'type' => 'route',
    'geometry' => [[10.096, -69.358], [10.100, -69.360]],
    'color' => '#e74c3c'
];

$ch = curl_init('http://localhost:8000/api.php');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
```

## 🔄 Rate Limiting (Recomendado)

### JavaScript (express-rate-limit)
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests
});

app.use('/api/', limiter);
```

### PHP (Simple)
```php
session_start();
$key = 'api_calls_' . $_SERVER['REMOTE_ADDR'];
$calls = $_SESSION[$key] ?? 0;
$time = $_SESSION[$key . '_time'] ?? time();

if (time() - $time > 900) { // 15 minutos
    $_SESSION[$key] = 0;
    $_SESSION[$key . '_time'] = time();
}

if ($calls > 100) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many requests']);
    exit;
}

$_SESSION[$key]++;
```

## 📝 Validación de Datos

### Campos Requeridos

```javascript
// Validación básica
function validateElement(data) {
  if (!data.name || !data.type || !data.geometry) {
    throw new Error('Campos requeridos: name, type, geometry');
  }
  
  if (!['route', 'marker'].includes(data.type)) {
    throw new Error('Tipo debe ser "route" o "marker"');
  }
  
  if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
    throw new Error('Color debe ser hexadecimal válido');
  }
  
  return true;
}
```

## 🎯 CORS (Cross-Origin Resource Sharing)

### JavaScript
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://tubrica.example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

### PHP
```php
header('Access-Control-Allow-Origin: https://tubrica.example.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
```

## 📈 Optimización

### Índices de Base de Datos

```sql
CREATE INDEX idx_type ON elements(type);
CREATE INDEX idx_created_at ON elements(created_at);
```

### Caché (PHP)

```php
// Caché simple con APCu
$cache_key = 'elements_all';
$elements = apcu_fetch($cache_key);

if ($elements === false) {
    $stmt = $pdo->query("SELECT * FROM elements");
    $elements = $stmt->fetchAll(PDO::FETCH_ASSOC);
    apcu_store($cache_key, $elements, 300); // 5 minutos
}
```

---

*Para más información, consulta `docs/GUIA_COMPLETA.md`*
