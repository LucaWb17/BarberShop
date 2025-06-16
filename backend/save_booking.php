<?php
header('Content-Type: application/json');
require_once('config.php');

// Log degli errori per debug
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log("Inizio elaborazione prenotazione " . date('Y-m-d H:i:s'));

// Verifica metodo
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo non consentito', 'code' => 'METHOD_NOT_ALLOWED']);
    exit;
}

// Ottieni e decodifica JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato JSON non valido', 'code' => 'INVALID_JSON']);
    exit;
}

// Funzione di sanificazione
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Estrai e normalizza
$name    = isset($data['name']) ? sanitizeInput($data['name']) : '';
$email   = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$phone   = isset($data['phone']) ? preg_replace('/[^0-9+\s]/', '', trim($data['phone'])) : '';
$date    = isset($data['date']) ? sanitizeInput($data['date']) : '';

// Normalizza l'orario nel formato HH:MM con lo zero iniziale
$time = '';
if (isset($data['time'])) {
    $timeObj = new DateTime($data['time']);
    $hours = (int)$timeObj->format('G'); // Ore senza zero iniziale
    $minutes = $timeObj->format('i');    // Minuti con zero iniziale
    $time = sprintf("%02d:%02d", $hours, $minutes); // Forza il formato 09:00
}

$service = isset($data['service']) ? sanitizeInput($data['service']) : '';

// Validazione
$errors = [];
if (empty($name))    $errors[] = 'Il nome è obbligatorio';
if (empty($email))   $errors[] = 'L\'email è obbligatoria';
if (empty($phone))   $errors[] = 'Il telefono è obbligatorio';
if (empty($date))    $errors[] = 'La data è obbligatoria';
if (empty($time))    $errors[] = 'L\'ora è obbligatoria';
if (empty($service)) $errors[] = 'Il servizio è obbligatorio';

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Formato email non valido';
}

if (!empty($date) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    $errors[] = 'Formato data non valido (usa yyyy-mm-dd)';
}

if (!empty($time) && !preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $time)) {
    $errors[] = 'Formato ora non valido (usa HH:MM)';
}

$validServices = ['haircut', 'haircut-beard', 'beard', 'shave', 'kids', 'senior'];
if (!empty($service) && !in_array($service, $validServices)) {
    $errors[] = 'Servizio non valido';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Errori di validazione',
        'details' => $errors,
        'code' => 'VALIDATION_ERROR',
        'inputValues' => compact('name', 'email', 'phone', 'date', 'time', 'service')
    ]);
    exit;
}

try {
    // Controlla doppie prenotazioni
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM prenotazioni WHERE data = ? AND ora = ?");
    $stmt->execute([$date, $time]);
    if ($stmt->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'error' => 'Orario non più disponibile',
            'details' => ['L\'orario selezionato è già stato prenotato. Scegli un altro.'],
            'code' => 'TIME_SLOT_TAKEN'
        ]);
        exit;
    }

    // Inserimento prenotazione
    $stmt = $pdo->prepare("INSERT INTO prenotazioni (nome, email, telefono, data, ora, servizio) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $date, $time, $service]);
    $booking_id = $pdo->lastInsertId();

    // Mappa nomi servizi
    $serviceNames = [
        'haircut' => 'Taglio Capelli',
        'haircut-beard' => 'Taglio Capelli e Barba',
        'beard' => 'Taglio Barba',
        'shave' => 'Rasatura',
        'kids' => 'Taglio Bambino',
        'senior' => 'Taglio Senior'
    ];
    $serviceName = $serviceNames[$service] ?? $service;

    // ✅ Risposta immediata
    echo json_encode([
        'success' => true,
        'message' => 'Prenotazione inviata con successo.',
        'data' => [
            'id' => $booking_id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'date' => $date,
            'time' => $time,
            'service' => $serviceName
        ]
    ]);

    // Inizia output buffering e invia la risposta immediatamente
    ob_start();
    header('Connection: close');
    header('Content-Length: ' . ob_get_length());
    ob_end_flush();
    flush();

    // ✉️ Configura mail destinatario
    $mail_admin = 'pippo@gmail.com'; // Sostituire con la tua email reale
    $salonName = 'Il Tuo Barbiere'; // Nome del salone
    $adminSubject = "Nuova Prenotazione #$booking_id"; 

    // Formatta la data per mostrare in formato italiano
    $dateObj = new DateTime($date);
    $formattedDate = $dateObj->format('d/m/Y'); // Giorno/Mese/Anno

    // Prepara il messaggio per il salone
    $adminMessage = <<<EOT
Hai ricevuto una nuova prenotazione (#$booking_id):

Nome: $name
Email: $email
Telefono: $phone
Data: $formattedDate
Ora: $time
Servizio: $serviceName

Questa prenotazione è stata ricevuta automaticamente dal sistema.
EOT;

    // Intestazioni email per il salone
    $adminHeaders = [
        'From' => 'Sistema Prenotazioni <noreply@' . $_SERVER['HTTP_HOST'] . '>',
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8'
    ];

    // Prepara il messaggio per il cliente
    $clientSubject = "Conferma Prenotazione - $salonName";
    $clientMessage = <<<EOT
Gentile $name,

Grazie per la tua prenotazione!

DETTAGLI PRENOTAZIONE:
- Servizio: $serviceName
- Data: $formattedDate
- Ora: $time

Ti aspettiamo presso il nostro salone!

Per eventuali modifiche o cancellazioni, contattaci al più presto.

Cordiali saluti,
$salonName
EOT;

    // Intestazioni email per il cliente
    $clientHeaders = [
        'From' => "$salonName <noreply@" . $_SERVER['HTTP_HOST'] . ">",
        'Reply-To' => $mail_admin,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8'
    ];

    // Converti gli array di header in stringhe
    $adminHeadersStr = '';
    foreach ($adminHeaders as $key => $value) {
        $adminHeadersStr .= "$key: $value\r\n";
    }

    $clientHeadersStr = '';
    foreach ($clientHeaders as $key => $value) {
        $clientHeadersStr .= "$key: $value\r\n";
    }

    // Log per debug
    error_log("Tentativo invio email al salone: $mail_admin");
    
    // Invia email al salone
    $adminMailSent = mail($mail_admin, $adminSubject, $adminMessage, $adminHeadersStr);
    error_log("Email al salone " . ($adminMailSent ? "inviata" : "fallita"));
    
    // Invia email al cliente
    $clientMailSent = mail($email, $clientSubject, $clientMessage, $clientHeadersStr);
    error_log("Email al cliente " . ($clientMailSent ? "inviata" : "fallita"));

    // Termina il processo
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    }

} catch (PDOException $e) {
    error_log("Errore database: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Errore durante la prenotazione',
        'code' => 'DATABASE_ERROR'
    ]);
}
