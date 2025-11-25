<?php
header("Content-Type: application/json");
require "connection.php";

// CEK JIKA PAKAI PARAMETER ?id=1
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $query = $conn->query("SELECT * FROM products WHERE id = $id");

    if ($query->num_rows > 0) {
        echo json_encode([
            "status" => true,
            "data" => $query->fetch_assoc()
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Produk tidak ditemukan"
        ]);
    }
    exit;
}

// GET ALL DATA
$query = $conn->query("SELECT * FROM products ORDER BY id DESC");

$data = [];
while ($row = $query->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "status" => true,
    "total" => count($data),
    "data" => $data
]);
