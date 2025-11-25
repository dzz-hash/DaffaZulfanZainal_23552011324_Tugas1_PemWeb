<?php
header("Content-Type: application/json");
require "connection.php";

if (!isset($_GET['id'])) {
    echo json_encode([
        "status" => false,
        "message" => "Parameter id wajib"
    ]);
    exit;
}

$id = intval($_GET['id']);

$sql = "DELETE FROM products WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode([
        "status" => true,
        "message" => "Produk berhasil dihapus"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Gagal menghapus produk"
    ]);
}
