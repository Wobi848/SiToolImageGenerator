<?php
// Simple script to initialize the database tables
// Loads configuration directly from .env file

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Database Initialization</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; line-height: 1.6; }
        .success { color: green; padding: 10px; background: #e8f5e9; border: 1px solid #a5d6a7; margin: 10px 0; }
        .error { color: #d32f2f; padding: 10px; background: #ffebee; border: 1px solid #ef9a9a; margin: 10px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }
        h1 { color: #333; }
        .container { margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Database Initialization</h1>
    <div class='container'>";

// --- Parse environment file ---
function parseEnv() {
    $envPath = __DIR__ . '/../../.env';
    
    if (!file_exists($envPath)) {
        return displayError(".env file not found at {$envPath}");
    }
    
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $env[trim($parts[0])] = trim($parts[1]);
        }
    }
    
    return $env;
}

// --- Helper functions ---
function displayError($message) {
    echo "<div class='error'>{$message}</div>";
    return false;
}

function displaySuccess($message) {
    echo "<div class='success'>{$message}</div>";
    return true;
}

// --- Load environment variables ---
$env = parseEnv();
if (!$env) {
    echo "</div></body></html>";
    exit;
}

// --- Check for required database config ---
$requiredVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
foreach ($requiredVars as $var) {
    if (!isset($env[$var]) || empty($env[$var])) {
        displayError("Missing required environment variable: {$var}");
        echo "</div></body></html>";
        exit;
    }
}

// --- Connect to the database ---
try {
    $dsn = "mysql:host={$env['DB_HOST']};port=" . ($env['DB_PORT'] ?? '3306') . ";dbname={$env['DB_NAME']};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $env['DB_USER'], $env['DB_PASSWORD'], $options);
    displaySuccess("Successfully connected to database '{$env['DB_NAME']}' on '{$env['DB_HOST']}'");
} catch (PDOException $e) {
    displayError("Database connection failed: " . $e->getMessage());
    echo "</div></body></html>";
    exit;
}

// --- Create tables ---
try {
    // Create admin_users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
    )");
    displaySuccess("admin_users table created or already exists");
    
    // Create xml_files table
    $pdo->exec("CREATE TABLE IF NOT EXISTS xml_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        version VARCHAR(20) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT,
        uploaded_by VARCHAR(50) NOT NULL
    )");
    displaySuccess("xml_files table created or already exists");
    
    // Create download directory if it doesn't exist
    $uploadDir = __DIR__ . '/../download/files';
    if (!is_dir($uploadDir)) {
        if (mkdir($uploadDir, 0755, true)) {
            displaySuccess("Upload directory created at {$uploadDir}");
        } else {
            displayError("Could not create upload directory at {$uploadDir}");
        }
    } else {
        displaySuccess("Upload directory already exists at {$uploadDir}");
    }
    
    // Check if admin user exists and create if needed
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        // Create default admin user
        $username = isset($env['ADMIN_USERNAME']) ? $env['ADMIN_USERNAME'] : 'admin';
        $password = isset($env['ADMIN_PASSWORD']) ? $env['ADMIN_PASSWORD'] : 'K&PSiTool2025!';
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)");
        $stmt->execute([$username, $hashedPassword]);
        
        displaySuccess("Created default admin user '{$username}'");
    } else {
        displaySuccess("Admin user already exists");
    }
    
    // Import existing files
    $files = glob($uploadDir . '/*.editor.xml');
    $importedCount = 0;
    
    if (!empty($files)) {
        foreach ($files as $file) {
            $filename = basename($file);
            
            // Check if file already exists in database
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM xml_files WHERE filename = ?");
            $stmt->execute([$filename]);
            
            if ($stmt->fetchColumn() == 0) {
                // Determine platform
                $platform = 'ALL';  // Default
                
                // Insert file info into database
                $stmt = $pdo->prepare(
                    "INSERT INTO xml_files (filename, platform, version, description, uploaded_by) 
                     VALUES (?, ?, ?, ?, ?)"
                );
                $stmt->execute([
                    $filename,
                    $platform,
                    '1.0',  // Default version
                    'Imported from existing files',
                    'system'
                ]);
                
                $importedCount++;
            }
        }
        
        if ($importedCount > 0) {
            displaySuccess("Imported {$importedCount} existing XML files into database");
        } else {
            displaySuccess("All existing files are already in the database");
        }
    }
    
    displaySuccess("<strong>Database initialization completed successfully!</strong>");
    echo "<p>You can now <a href='login.php'>login to the admin panel</a>.</p>";
    
} catch (PDOException $e) {
    displayError("Failed to initialize database: " . $e->getMessage());
}

echo "</div></body></html>";
?>