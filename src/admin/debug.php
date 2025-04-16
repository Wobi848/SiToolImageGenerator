<?php
// Turn on error reporting for this debug script only
ini_set('display_errors', 1);
error_reporting(E_ALL);

/**
 * Debug script to identify server-side issues
 * This file displays important server configuration and database connection information
 * to help diagnose issues with the admin panel.
 */

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Admin Panel Debug</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
        h1 { color: #444; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        h2 { color: #555; margin-top: 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 3px; overflow: auto; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        .debug-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .debug-table th, .debug-table td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        .debug-table th { background-color: #f2f2f2; }
        .code { font-family: monospace; background-color: #f8f8f8; padding: 2px 4px; }
        button { padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #45a049; }
        .path { word-break: break-all; font-family: monospace; }
    </style>
</head>
<body>
    <h1>Admin Panel Debug Information</h1>
    <p>This page displays diagnostic information to help resolve server-side issues with the admin panel.</p>";

// ---- SECTION: File System Check ----
echo "<div class='section'>
    <h2>File System Information</h2>";

// Check important directories and files
$rootPath = dirname(dirname(__DIR__)); // Move up two levels to project root
$files = [
    'Root directory' => $rootPath,
    'Admin directory' => __DIR__,
    '.env file' => $rootPath . '/.env',
    'Config file' => __DIR__ . '/config.php',
    'Database file' => __DIR__ . '/db.php',
    'Upload directory' => dirname(__DIR__) . '/download/files'
];

echo "<table class='debug-table'>
    <tr>
        <th>Item</th>
        <th>Path</th>
        <th>Exists</th>
        <th>Readable</th>
        <th>Writable</th>
    </tr>";

foreach ($files as $name => $path) {
    $exists = file_exists($path);
    $readable = is_readable($path);
    $writable = is_writable($path);
    
    $existsClass = $exists ? 'success' : 'error';
    $readableClass = $readable ? 'success' : 'error';
    $writableClass = $writable ? 'success' : 'error';
    
    echo "<tr>
        <td>{$name}</td>
        <td class='path'>{$path}</td>
        <td class='$existsClass'>" . ($exists ? '✓' : '✗') . "</td>
        <td class='$readableClass'>" . ($readable ? '✓' : '✗') . "</td>
        <td class='$writableClass'>" . ($writable ? '✓' : '✗') . "</td>
    </tr>";
}

echo "</table>";

// If .env exists, check it
$envFile = $rootPath . '/.env';
if (file_exists($envFile) && is_readable($envFile)) {
    $envContent = file_get_contents($envFile);
    $requiredVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
    $missingVars = [];
    
    foreach ($requiredVars as $var) {
        if (strpos($envContent, "$var=") === false) {
            $missingVars[] = $var;
        }
    }
    
    if (empty($missingVars)) {
        echo "<p class='success'>All required environment variables are defined in .env file.</p>";
    } else {
        echo "<p class='error'>Missing environment variables: " . implode(', ', $missingVars) . "</p>";
        echo "<p>Make sure your .env file contains all these variables with appropriate values.</p>";
    }
} else if (file_exists($envFile)) {
    echo "<p class='error'>The .env file exists but is not readable. Check file permissions.</p>";
} else {
    echo "<p class='error'>The .env file does not exist at the expected location.</p>";
}

echo "</div>";

// ---- SECTION: PHP Configuration ----
echo "<div class='section'>
    <h2>PHP Configuration</h2>
    <table class='debug-table'>
        <tr><th>Setting</th><th>Value</th></tr>
        <tr><td>PHP Version</td><td>" . phpversion() . "</td></tr>
        <tr><td>Display Errors</td><td>" . ini_get('display_errors') . "</td></tr>
        <tr><td>Error Reporting</td><td>" . error_reporting() . "</td></tr>
        <tr><td>PDO Extension</td><td>" . (extension_loaded('pdo') ? '<span class="success">Loaded ✓</span>' : '<span class="error">Not Loaded ✗</span>') . "</td></tr>
        <tr><td>PDO MySQL Driver</td><td>" . (extension_loaded('pdo_mysql') ? '<span class="success">Loaded ✓</span>' : '<span class="error">Not Loaded ✗</span>') . "</td></tr>
        <tr><td>Session Support</td><td>" . (function_exists('session_start') ? '<span class="success">Available ✓</span>' : '<span class="error">Not Available ✗</span>') . "</td></tr>
    </table>
</div>";

// ---- SECTION: Environment Variables ----
echo "<div class='section'>
    <h2>Environment Variables</h2>";

// Function to safely get env vars
function getEnvSafe($key, $default = 'not set') {
    $value = getenv($key);
    if ($value === false) {
        return $default;
    }
    
    // Mask password values
    if (stripos($key, 'password') !== false || stripos($key, 'pass') !== false) {
        return '********';
    }
    
    return $value;
}

// Check environment vars manually (don't rely on config.php)
$envVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
echo "<table class='debug-table'>
    <tr><th>Variable</th><th>Value</th></tr>";

foreach ($envVars as $var) {
    $value = getEnvSafe($var);
    $class = ($value === 'not set') ? 'error' : 'success';
    echo "<tr><td>{$var}</td><td class='{$class}'>{$value}</td></tr>";
}

echo "</table>";

// Manual environment loading (bypass config.php)
echo "<h3>Testing Manual Environment Loading</h3>";

$manualEnvFile = $rootPath . '/.env';
if (file_exists($manualEnvFile) && is_readable($manualEnvFile)) {
    echo "<p>Attempting to manually parse .env file...</p>";
    
    $lines = file($manualEnvFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $loadedVars = [];
    
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $name = trim($parts[0]);
            $loadedVars[] = $name;
        }
    }
    
    echo "<p>Successfully parsed variables: " . implode(', ', $loadedVars) . "</p>";
} else {
    echo "<p class='error'>Could not manually load .env file.</p>";
}

echo "</div>";

// ---- SECTION: Database Connection Testing ----
echo "<div class='section'>
    <h2>Database Connection Test</h2>";

// Test database connection with plain PDO (not using our functions)
function testDbConnection($host, $port, $dbname, $user, $pass) {
    try {
        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
        $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
        
        $startTime = microtime(true);
        $pdo = new PDO($dsn, $user, $pass, $options);
        $endTime = microtime(true);
        
        $connectionTime = round(($endTime - $startTime) * 1000, 2);
        
        return [
            'success' => true,
            'connection_time' => $connectionTime,
            'error' => null
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'connection_time' => 0,
            'error' => $e->getMessage()
        ];
    }
}

// Try to connect using direct environment variables
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: '';
$dbUser = getenv('DB_USER') ?: '';
$dbPass = getenv('DB_PASSWORD') ?: '';

echo "<h3>Direct Connection Test (Using getenv())</h3>";

if (empty($dbName) || empty($dbUser)) {
    echo "<p class='error'>Missing required database credentials from environment variables.</p>";
} else {
    $result = testDbConnection($dbHost, $dbPort, $dbName, $dbUser, $dbPass);
    
    if ($result['success']) {
        echo "<p class='success'>Successfully connected to database '{$dbName}' on '{$dbHost}' in {$result['connection_time']}ms.</p>";
        
        // Test if tables exist
        try {
            $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $tables = ['admin_users', 'xml_files'];
            $missingTables = [];
            
            foreach ($tables as $table) {
                $stmt = $pdo->query("SHOW TABLES LIKE '{$table}'");
                if ($stmt->rowCount() === 0) {
                    $missingTables[] = $table;
                }
            }
            
            if (empty($missingTables)) {
                echo "<p class='success'>All required tables exist in the database.</p>";
                
                // Check if admin user exists
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users");
                $stmt->execute();
                $userCount = $stmt->fetchColumn();
                
                if ($userCount > 0) {
                    echo "<p class='success'>Admin user exists in the database.</p>";
                } else {
                    echo "<p class='warning'>No admin user found in the database. You may need to run the initialization script.</p>";
                }
            } else {
                echo "<p class='error'>Missing required tables: " . implode(', ', $missingTables) . "</p>";
                echo "<p>You need to run the initialization script (init-database.php) to create these tables.</p>";
            }
        } catch (PDOException $e) {
            echo "<p class='error'>Error checking tables: " . htmlspecialchars($e->getMessage()) . "</p>";
        }
    } else {
        // Sanitize error message to remove credentials
        $errorMsg = $result['error'];
        $sanitizedError = preg_replace('/user=\'[^\']*\'/', 'user=\'***\'', $errorMsg);
        $sanitizedError = preg_replace('/password=\'[^\']*\'/', 'password=\'***\'', $sanitizedError);
        
        echo "<p class='error'>Failed to connect: " . htmlspecialchars($sanitizedError) . "</p>";
    }
}

// Now try using our function via config.php and db.php
echo "<h3>Connection Test (Using our functions)</h3>";

try {
    require_once 'config.php';
    require_once 'db.php';
    
    $dbStatus = checkDatabaseStatus();
    
    if ($dbStatus['connected']) {
        echo "<p class='success'>Successfully connected to database using our functions.</p>";
        
        if ($dbStatus['tables_exist']) {
            echo "<p class='success'>All required tables exist in the database.</p>";
        } else {
            echo "<p class='error'>Missing required tables: " . $dbStatus['error'] . "</p>";
        }
        
        if ($dbStatus['admin_exists']) {
            echo "<p class='success'>Admin user exists in the database.</p>";
        } else {
            echo "<p class='warning'>No admin user found in the database.</p>";
        }
    } else {
        echo "<p class='error'>Failed to connect using our functions: " . $dbStatus['error'] . "</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>Exception while testing our database functions: " . $e->getMessage() . "</p>";
}

echo "</div>";

// ---- SECTION: Session Test ----
echo "<div class='section'>
    <h2>Session Test</h2>";

$sessionWorks = false;
try {
    session_start();
    $_SESSION['test_key'] = 'test_value_' . time();
    session_write_close();
    
    // Verify session storage works
    session_start();
    $sessionWorks = (isset($_SESSION['test_key']) && strpos($_SESSION['test_key'], 'test_value_') === 0);
    
    if ($sessionWorks) {
        echo "<p class='success'>Session storage is working properly.</p>";
    } else {
        echo "<p class='error'>Session storage test failed. Sessions may not be configured correctly.</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>Error testing sessions: " . $e->getMessage() . "</p>";
}

echo "</div>";

// ---- SECTION: Actions ----
echo "<div class='section'>
    <h2>Actions</h2>
    <p>The following actions can help resolve issues:</p>
    <ul>
        <li>Check the <code>.env</code> file exists in the project root directory and has all required variables.</li>
        <li>Run the <a href='init-database.php'>database initialization script</a> to create tables and default admin user.</li>
        <li>Make sure PHP has the PDO and PDO MySQL extensions enabled.</li>
        <li>Verify database credentials are correct and the database exists.</li>
        <li>Check that PHP has write permissions to the session directory.</li>
    </ul>
    <p>Once all issues are fixed, try <a href='login.php'>logging in</a> again.</p>
</div>";

echo "</body></html>";
?>