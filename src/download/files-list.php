<?php
// List all files in the files directory
$directory = __DIR__ . '/files/';
$files = scandir($directory);

// Filter out . and .. directories and only include .editor.xml files
$editorFiles = array_filter($files, function($file) {
    return strpos($file, '.editor.xml') !== false;
});

// Convert indexed array to sequential array
$editorFiles = array_values($editorFiles);

// Return as JSON
header('Content-Type: application/json');
echo json_encode($editorFiles);