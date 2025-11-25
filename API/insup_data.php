<?php
header("Content-Type: application/json");
require "connection.php";

$input = json_decode(file_get_contents("php://input"), true);

$name  = $input["name"] ?? null;
$price = $input["price"] ?? null;
$id    = $input["id"] ?? null;

if (!$name || !$price) {
    echo json_encode([
        "status" => false,
        "message" => "name dan price wajib diisi"
    ]);
    exit;
}

// === UPDATE ===
if ($id) {
    $sql = "UPDATE products SET name='$name', price='$price' WHERE id=$id";
    if ($conn->query($sql)) {
        echo json_encode([
            "status" => true,
            "message" => "Produk berhasil diperbarui"
        ]);
    }
    exit;
}

// === INSERT ===
$sql = "INSERT INTO products (name, price) VALUES ('$name', $price)";
if ($conn->query($sql)) {
    echo json_encode([
        "status" => true,
        "message" => "Produk berhasil ditambahkan"
    ]);
}
