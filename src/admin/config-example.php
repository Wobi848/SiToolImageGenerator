<?php
/**
 * Example Configuration file for the admin panel
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to "config.php" in the same directory
 * 2. Update the values with your actual database credentials and settings
 * 3. Make sure the .env file exists in the project root with the required variables
 */

// Enable error reporting during development
ini_set('display_errors', 0); // Set to 1 only during development
error_reporting(E_ALL);

// Function to get environment variables with default fallbacks
function getEnv($key, $default = null) {
    if (isset($_ENV[$key]) && !empty($_ENV[$key])) {
        return $_ENV[$key];
    }
    
    $env = getenv($key);
    if ($env !== false && !empty($env)) {
        return $env;
    }
    
    return $default;
}

// Load environment variables from .env file
function loadEnv() {
    $envFile = __DIR__ . '/../../.env';
    
    if (!file_exists($envFile)) {
        error_log("Error: .env file not found at {$envFile}");
        return false;
    }
    
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        error_log("Error: Could not read .env file at {$envFile}");
        return false;
    }
    
    foreach ($lines as $line) {
        // Skip comments and empty lines
        if (empty(trim($line)) || strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse the environment variable
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            
            // Set as environment variable if not empty
            if (!empty($name)) {
                putenv("{$name}={$value}");
                $_ENV[$name] = $value;
            }
        }
    }
    
    return true;
}

// Initialize the environment
$envLoaded = loadEnv();

// Database configuration
$dbConfig = [
    'host' => getEnv('DB_HOST', 'localhost'),
    'port' => getEnv('DB_PORT', '3306'),
    'name' => getEnv('DB_NAME', 'sitool_db'),         // Your database name
    'user' => getEnv('DB_USER', 'database_user'),     // Your database username
    'pass' => getEnv('DB_PASSWORD', 'password_here')  // Your database password
];

// Check if required database config is available
if (empty($dbConfig['name']) || empty($dbConfig['user'])) {
    error_log("Database configuration is incomplete. Check your .env file.");
}

// Admin credentials
$adminConfig = [
    'username' => getEnv('ADMIN_USERNAME', 'admin'),
    'password' => getEnv('ADMIN_PASSWORD', 'change_this_password')
];

// Upload directory configuration
$uploadConfig = [
    'dir' => __DIR__ . '/../download/files/',
    'allowedExtensions' => ['xml']
];

// Example .env file content:
/*
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sitool_db
DB_USER=database_user
DB_PASSWORD=password_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password_here
*/
?>