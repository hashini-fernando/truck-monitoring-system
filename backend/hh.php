<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stationId = isset($_GET['stationId']) ? $_GET['stationId'] : null;

    if (!$stationId) {
        echo json_encode(["status" => "error", "message" => "Station ID is required"]);
        exit();
    }
    
    // Determine table name based on the station ID
    $tableName = '';
    switch (strtolower(trim($stationId))) {
        case '1':
            $tableName = 'station_1_table';
            break;
        case '2':
            $tableName = 'station_2_table';
            break;
        case '3':
            $tableName = 'station_3_table';
            break;
        default:
            echo json_encode(["status" => "error", "message" => "Invalid station ID"]);
            exit();
    }

    // Check if table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE '$tableName'");
    if ($tableCheck->num_rows == 0) {
        echo json_encode(["status" => "error", "message" => "Station table not found"]);
        exit();
    }
    
    $vehicleNo = $_GET['vehicleNo'] ?? null;
    $firstScanTime = $_GET['firstScanTime'] ?? null;
    $lastScanTime = $_GET['lastScanTime'] ?? null;
    $duration = $_GET['duration'] ?? null;

    // Start building the query with prepared statement
    $query = "SELECT * FROM $tableName WHERE 1=1";
    $types = '';
    $params = [];

    if ($vehicleNo) {
        $query .= " AND vehicle_no = ?";
        $types .= 's';
        $params[] = $vehicleNo;
    }

    if ($firstScanTime) {
        $query .= " AND first_scan_time >= ?";
        $types .= 's';
        $params[] = $firstScanTime;
    }

    if ($lastScanTime) {
        $query .= " AND last_scan_time <= ?";
        $types .= 's';
        $params[] = $lastScanTime;
    }

    if ($duration) {
        $query .= " AND duration LIKE ?";
        $types .= 's';
        $params[] = "%$duration%";
    }

    // If no filters are applied, restrict to today
    if (!$vehicleNo && !$firstScanTime && !$lastScanTime && !$duration) {
        $query .= " AND DATE(first_scan_time) = CURDATE()";
    }

    $query .= " ORDER BY first_scan_time DESC";

    // Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        exit();
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Execute failed: " . $stmt->error]);
        exit();
    }

    $result = $stmt->get_result();
    $data = [];
    
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Always return an array, even if empty
    echo json_encode($data ?: []);
    
    $stmt->close();
}

$conn->close();
?>