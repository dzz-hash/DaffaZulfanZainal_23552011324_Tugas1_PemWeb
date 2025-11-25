<?php
header("Content-Type: application/json; charset=UTF-8");

// === KONFIGURASI DATABASE ===
$host = "localhost";
$user = "root";
$pass = "";
$db   = "project2_api"; 

$conn = new mysqli($host, $user, $pass, $db);

// Cek error
if ($conn->connect_error) {
    echo json_encode([
        "status" => false,
        "message" => "Connection failed",
        "error" => $conn->connect_error
    ]);
    exit;
}

// Jika berhasil
echo json_encode([
    "status" => true,
    "message" => "Connection successful",
    "database" => $db
]);
