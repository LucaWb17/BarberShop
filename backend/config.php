<?php
// Dati del database di Netsons (puoi prenderli dal loro pannello)
$host = 'localhost';
$dbname = '';
$user = '';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Errore di connessione al database.']);
    exit;
}
?>
