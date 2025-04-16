<?php
// Require authentication
require_once 'auth.php';
requireAuth();

// Basic PHP info for diagnostics
echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>PHP Diagnostics</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .section { margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        h2 { color: #333; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 3px; overflow: auto; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>PHP Diagnostics Page</h1>";

// Check PHP version
echo "<div class='section'>
    <h2>PHP Version</h2>
    <p>Running PHP version: " . phpversion() . "</p>
</div>";

// Check for PDO extension
echo "<div class='section'>
    <h2>Required Extensions</h2>";
if (extension_loaded('pdo')) {
    echo "<p class='success'>PDO extension is loaded ✓</p>";
    
    // Check PDO MySQL driver
    if (extension_loaded('pdo_mysql')) {
        echo "<p class='success'>PDO MySQL driver is loaded ✓</p>";
    } else {
        echo "<p class='error'>PDO MySQL driver is NOT loaded ✗</p>";
    }
} else {
    echo "<p class='error'>PDO extension is NOT loaded ✗</p>";
}
echo "</div>";

// Check for .env file
$envFile = __DIR__ . '/../../.env';
echo "<div class='section'>
    <h2>Environment File</h2>";
if (file_exists($envFile)) {
    echo "<p class='success'>.env file exists at the expected path ✓</p>";
    
    // Try to read the file but only show if it's readable, not the contents
    if (is_readable($envFile)) {
        echo "<p class='success'>.env file is readable ✓</p>";
        
        // Check if it contains necessary keys (without showing values)
        $envContent = file_get_contents($envFile);
        $requiredKeys = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
        $missingKeys = [];
        
        foreach ($requiredKeys as $key) {
            if (strpos($envContent, $key . '=') === false) {
                $missingKeys[] = $key;
            }
        }
        
        if (empty($missingKeys)) {
            echo "<p class='success'>All required environment variables appear to be defined ✓</p>";
        } else {
            echo "<p class='error'>Missing required environment variables: " . implode(', ', $missingKeys) . " ✗</p>";
        }
    } else {
        echo "<p class='error'>.env file exists but is not readable ✗</p>";
    }
} else {
    echo "<p class='error'>.env file does not exist at " . htmlspecialchars($envFile) . " ✗</p>";
    echo "<p>Note: The .env file should be placed in the project root directory.</p>";
}
echo "</div>";

// Test database connection (without showing credentials)
echo "<div class='section'>
    <h2>Database Connection Test</h2>";

// Simple .env parser to avoid loading the entire config system
function parseEnvFile($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $vars = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $vars[trim($parts[0])] = trim($parts[1]);
        }
    }
    
    return $vars;
}

$env = parseEnvFile($envFile);

if ($env && isset($env['DB_HOST'], $env['DB_NAME'], $env['DB_USER'], $env['DB_PASSWORD'])) {
    try {
        $dsn = "mysql:host={$env['DB_HOST']};port=" . ($env['DB_PORT'] ?? '3306') . ";dbname={$env['DB_NAME']};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5
        ];
        
        $startTime = microtime(true);
        $pdo = new PDO($dsn, $env['DB_USER'], $env['DB_PASSWORD'], $options);
        $endTime = microtime(true);
        
        echo "<p class='success'>Successfully connected to database '{$env['DB_NAME']}' on '{$env['DB_HOST']}' ✓</p>";
        echo "<p>Connection time: " . round(($endTime - $startTime) * 1000, 2) . "ms</p>";
        
        // Test if tables exist
        $requiredTables = ['admin_users', 'xml_files'];
        $missingTables = [];
        
        foreach ($requiredTables as $table) {
            $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() === 0) {
                $missingTables[] = $table;
            }
        }
        
        if (empty($missingTables)) {
            echo "<p class='success'>All required tables exist ✓</p>";
        } else {
            echo "<p class='error'>Missing required tables: " . implode(', ', $missingTables) . " ✗</p>";
            echo "<p>The database tables need to be created. Try visiting index.php which should initialize the database.</p>";
        }
    } catch (PDOException $e) {
        echo "<p class='error'>Database connection failed: " . htmlspecialchars($e->getMessage()) . " ✗</p>";
        echo "<p>Please check your database credentials in the .env file.</p>";
    }
} else {
    echo "<p class='error'>Could not read database credentials from .env file ✗</p>";
}
echo "</div>";

// Check for error log
echo "<div class='section'>
    <h2>Error Logging</h2>";
$errorLog = error_get_last();
if ($errorLog) {
    echo "<p class='error'>Last PHP error: " . htmlspecialchars($errorLog['message']) . " in " . 
         htmlspecialchars($errorLog['file']) . " on line " . $errorLog['line'] . "</p>";
} else {
    echo "<p class='success'>No PHP errors detected ✓</p>";
}

// Show path information
echo "<p>Script path: " . htmlspecialchars(__FILE__) . "</p>";
echo "<p>Document root: " . htmlspecialchars($_SERVER['DOCUMENT_ROOT']) . "</p>";
echo "</div>";

echo "</body></html>";
?>