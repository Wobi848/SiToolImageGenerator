<?php
/**
 * Database Connection Handler
 */

// Include configuration
require_once 'config.php';

/**
 * Get database connection
 * @return PDO|null Database connection or null if connection failed
 */
function getDbConnection() {
    global $dbConfig;
    
    // Check if database configuration is available
    if (empty($dbConfig['host']) || empty($dbConfig['name']) || empty($dbConfig['user'])) {
        error_log("Database configuration is incomplete. Cannot establish connection.");
        return null;
    }
    
    try {
        $dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['name']};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        return new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], $options);
    } catch (PDOException $e) {
        // Log error (but don't display actual error message with credentials)
        $errorMessage = $e->getMessage();
        // Sanitize error message to remove potential credentials
        $sanitizedError = preg_replace('/user=\'[^\']*\'/', 'user=\'***\'', $errorMessage);
        $sanitizedError = preg_replace('/password=\'[^\']*\'/', 'password=\'***\'', $sanitizedError);
        
        error_log("Database connection failed: " . $sanitizedError);
        return null;
    }
}

/**
 * Initialize the database tables if they don't exist
 * @return bool Success status
 */
function initializeDatabase() {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    try {
        // Create users table
        $db->exec("CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL
        )");
        
        // Create files table
        $db->exec("CREATE TABLE IF NOT EXISTS xml_files (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            platform VARCHAR(50) NOT NULL,
            version VARCHAR(20) NOT NULL,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            description TEXT,
            uploaded_by VARCHAR(50) NOT NULL
        )");
        
        // Create initial admin user if none exists
        $stmt = $db->prepare("SELECT COUNT(*) FROM admin_users");
        $stmt->execute();
        if ($stmt->fetchColumn() == 0) {
            global $adminConfig;
            
            // Check if password is set
            if (empty($adminConfig['password'])) {
                error_log("Admin password not set in configuration. Using fallback password.");
                $adminConfig['password'] = 'K&PSiTool2025!'; // Fallback password
            }
            
            $hashedPassword = password_hash($adminConfig['password'], PASSWORD_DEFAULT);
            
            $stmt = $db->prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)");
            $stmt->execute([$adminConfig['username'], $hashedPassword]);
        }
        
        return true;
    } catch (PDOException $e) {
        error_log("Database initialization failed: " . $e->getMessage());
        return false;
    }
}

/**
 * Check if database connection is available and tables exist
 * @return array Status information
 */
function checkDatabaseStatus() {
    $status = [
        'connected' => false,
        'tables_exist' => false,
        'admin_exists' => false,
        'error' => null
    ];
    
    try {
        $db = getDbConnection();
        if (!$db) {
            $status['error'] = "Could not connect to database";
            return $status;
        }
        
        $status['connected'] = true;
        
        // Check if required tables exist
        $tables = ['admin_users', 'xml_files'];
        $missingTables = [];
        
        foreach ($tables as $table) {
            $stmt = $db->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() === 0) {
                $missingTables[] = $table;
            }
        }
        
        if (empty($missingTables)) {
            $status['tables_exist'] = true;
            
            // Check if admin user exists
            $stmt = $db->prepare("SELECT COUNT(*) FROM admin_users");
            $stmt->execute();
            $status['admin_exists'] = ($stmt->fetchColumn() > 0);
        } else {
            $status['error'] = "Missing tables: " . implode(', ', $missingTables);
        }
    } catch (PDOException $e) {
        $status['error'] = "Database error: " . $e->getMessage();
    }
    
    return $status;
}