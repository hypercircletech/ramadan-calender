<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Load the ramadan.json file
$ramadanData = file_get_contents('ramadan.json');
$data = json_decode($ramadanData, true);

// Get the selected division (default to Dhaka)
$division = isset($_GET['division']) ? $_GET['division'] : "Dhaka";

// Check if the division exists in the JSON data
if (!isset($data[$division])) {
    echo json_encode(["error" => "Division not found"]);
    exit;
}

// Get the timetable for the selected division
$timetable = $data[$division];

// Convert Salat times to 12-hour format
function convertTo12Hour($time) {
    return date("h:i A", strtotime($time));
}

// Add 12-hour format Salat times to the response
foreach ($timetable as &$day) {
    $day['sehri_12hr'] = convertTo12Hour($day['sehri']);
    $day['iftar_12hr'] = convertTo12Hour($day['iftar']);
}

// Return the data as JSON
echo json_encode($timetable);
?>