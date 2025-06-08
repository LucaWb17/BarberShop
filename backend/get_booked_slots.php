<?php
/**
 * API per ottenere gli orari già prenotati per una data specifica
 * 
 * Input:
 * - POST JSON: { "date": "YYYY-MM-DD" }
 * 
 * Output:
 * - JSON: ["09:00", "10:00", "16:00", ...]
 */

// Header per CORS e JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");

// Funzione per rispondere con errore
function returnError($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode(["error" => $message]);
    exit();
}

// Ottieni data da POST o GET
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $date = $data['date'] ?? null;
} else {
    $date = $_GET['date'] ?? null;
}

// Validazione data
if (!$date) {
    returnError("Parametro 'date' mancante");
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    returnError("Formato data non valido. Usa YYYY-MM-DD");
}

try {
    // Connessione al DB (usa il tuo config.php)
    require_once 'config.php'; // contiene $pdo
    $conn = $pdo;

    $query = "SELECT ora FROM prenotazioni WHERE data = :date";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':date', $date);
    $stmt->execute();

    $bookedSlots = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Normalizza in formato HH:MM con zero iniziale per le ore
        $time = trim($row['ora']);
        $timeObj = DateTime::createFromFormat('H:i', $time) ?: 
                  DateTime::createFromFormat('g:i A', $time) ?:
                  DateTime::createFromFormat('H:i:s', $time) ?:
                  new DateTime($time);
        
        $orario = $timeObj->format('H:i');
        
        // Assicurati che le ore abbiano lo zero iniziale
        $parts = explode(':', $orario);
        if (count($parts) >= 2) {
            $hours = str_pad($parts[0], 2, '0', STR_PAD_LEFT);
            $minutes = $parts[1];
            $orario = "$hours:$minutes";
        }
        
        $bookedSlots[] = $orario;
    }

    http_response_code(200);
    echo json_encode($bookedSlots);
    exit;

} catch (PDOException $e) {
    returnError("Errore di database: " . $e->getMessage(), 500);
} catch (Exception $e) {
    returnError("Errore generico: " . $e->getMessage(), 500);
}
