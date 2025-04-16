<?php
/**
 * Authentication Handler
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'db.php';

/**
 * Authenticate user
 * @param string $username Username
 * @param string $password Password
 * @return bool Authentication success
 */
function authenticateUser($username, $password) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    try {
        $stmt = $db->prepare("SELECT id, username, password FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            // Update last login time
            $updateStmt = $db->prepare("UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->execute([$user['id']]);
            
            // Store user in session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['authenticated'] = true;
            $_SESSION['auth_time'] = time();
            
            return true;
        }
        
        return false;
    } catch (PDOException $e) {
        error_log("Authentication error: " . $e->getMessage());
        return false;
    }
}

/**
 * Check if user is logged in
 * @return bool Login status
 */
function isLoggedIn() {
    // Check if authenticated session exists
    if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
        return false;
    }
    
    // Check session timeout (2 hours)
    $sessionTimeout = 2 * 60 * 60; // 2 hours in seconds
    if (time() - $_SESSION['auth_time'] > $sessionTimeout) {
        // Session expired, log out
        logout();
        return false;
    }
    
    // Refresh the session timeout
    $_SESSION['auth_time'] = time();
    return true;
}

/**
 * Log out current user
 */
function logout() {
    // Unset all session variables
    $_SESSION = [];
    
    // If it's desired to kill the session, also delete the session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destroy the session
    session_destroy();
}

/**
 * Require authentication
 * Redirects to login page if user is not authenticated
 * @param string $loginUrl Login page URL
 */
function requireAuth($loginUrl = 'login.php') {
    if (!isLoggedIn()) {
        header("Location: $loginUrl");
        exit;
    }
}

/**
 * Change password for a user
 * @param int $userId User ID
 * @param string $oldPassword Old password
 * @param string $newPassword New password
 * @return bool Success status
 */
function changePassword($userId, $oldPassword, $newPassword) {
    $db = getDbConnection();
    if (!$db) {
        return false;
    }
    
    try {
        // Verify old password
        $stmt = $db->prepare("SELECT password FROM admin_users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($oldPassword, $user['password'])) {
            return false;
        }
        
        // Update password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $db->prepare("UPDATE admin_users SET password = ? WHERE id = ?");
        $stmt->execute([$hashedPassword, $userId]);
        
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        error_log("Password change error: " . $e->getMessage());
        return false;
    }
}