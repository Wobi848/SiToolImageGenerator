<?php
// Configuration
$db_host = 'localhost';
$db_username = 'rappo_dev';
$db_password = ',.-Anabelis132,.-';
$db_name = 'trappo_kp_rappo_dev';

// Connect to the MariaDB database
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn = new mysqli($db_host, $db_username, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: ". $conn->connect_error);
}

// Function to update the download count for a file
function updateDownloadCount($fileId) {
    $sql = "UPDATE files SET download_count = download_count + 1 WHERE id =?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $fileId);
    $stmt->execute();
    $stmt->close();
}

// Function to retrieve a file for download
function getFile($fileId) {
    $sql = "SELECT filepath, filename FROM files WHERE id =?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $fileId);
    $stmt->execute();
    $result = $stmt->get_result();
    $file = $result->fetch_assoc();
    $stmt->close();
    return $file;
}

// Handle download request
if (isset($_GET['fileId'])) {
    $fileId = $_GET['fileId'];
    $file = getFile($fileId);
    if ($file) {
        updateDownloadCount($fileId);
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'. $file['filename']. '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        readfile($file['filepath']);
        exit;
    } else {
        echo "File not found";
    }
}

// Close database connection
$conn->close();
?>