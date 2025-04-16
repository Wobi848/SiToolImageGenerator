<?php
/**
 * Database Connection Handler
 */

// Include configuration
require_once 'config.php';

/**
 * Get database connection
 * @return PDO Database connection
 */
function getDbConnection() {
    global $dbConfig;
    
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
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

/**
 * Initialize the database tables if they don't exist
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