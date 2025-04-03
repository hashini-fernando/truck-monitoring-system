<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tableName = "station_table";

    $stationNo = $_GET['stationNo'] ?? null;
    $vehicleNo = $_GET['vehicleNo'] ?? null;
    $firstScanTime = $_GET['firstScanTime'] ?? null;
    $lastScanTime = $_GET['lastScanTime'] ?? null;
    $duration = $_GET['duration'] ?? null;

    // Start building the query
    $query = "SELECT * FROM $tableName WHERE 1=1";

    if ($stationNo) {
        $stationNo = $conn->real_escape_string($stationNo);
        $query .= " AND station_no = '$stationNo'";
    }

    if ($vehicleNo) {
        $vehicleNo = $conn->real_escape_string($vehicleNo);
        $query .= " AND vehicle_no = '$vehicleNo'";
    }

    if ($firstScanTime) {
        $firstScanTime = $conn->real_escape_string($firstScanTime);
        $query .= " AND first_scan_time >= '$firstScanTime'";
    }

    if ($lastScanTime) {
        $lastScanTime = $conn->real_escape_string($lastScanTime);
        $query .= " AND last_scan_time <= '$lastScanTime'";
    }

    if ($duration) {
        $duration = $conn->real_escape_string($duration);
        $query .= " AND duration LIKE '%$duration%'";
    }

    // If no filters are applied, restrict to today
    if (!$stationNo && !$vehicleNo && !$firstScanTime && !$lastScanTime && !$duration) {
        $query .= " AND DATE(first_scan_time) = CURDATE()";
    }

    $query .= " ORDER BY first_scan_time DESC";

    $result = $conn->query($query);

    if ($result) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode(["status" => "error", "message" => "Query failed"]);
    }
}
?>