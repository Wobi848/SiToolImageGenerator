<?php
// Enable detailed error logging during development
ini_set('display_errors', 0); // Keep this 0 for production, change to 1 for debugging
error_reporting(E_ALL);

// Custom error handler to log details
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    error_log("PHP Error [$errno]: $errstr in $errfile on line $errline");
    return false; // Continue with PHP's internal error handler
}
set_error_handler("customErrorHandler");

// Track any errors that occur
$debug_errors = [];
try {
    require_once 'auth.php';
} catch (Exception $e) {
    $debug_errors[] = "Exception loading auth.php: " . $e->getMessage();
}

$error = '';

// Process login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Bitte geben Sie Ihren Benutzernamen und Ihr Passwort ein.';
    } else {
        try {
            if (authenticateUser($username, $password)) {
                // Redirect to admin dashboard
                header('Location: index.php');
                exit;
            } else {
                $error = 'Ungültiger Benutzername oder Passwort.';
            }
        } catch (Exception $e) {
            $debug_errors[] = "Authentication exception: " . $e->getMessage();
            $error = 'Ein Systemfehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>K&P Service-Tool Admin Login</title>
    <link rel="stylesheet" href="/src/global-styles/base.css">
    <style>
        .login-container {
            max-width: 400px;
            margin: 80px auto;
            padding: 20px;
            background-color: #333;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .login-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .login-header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .login-form {
            display: flex;
            flex-direction: column;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #ddd;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #555;
            border-radius: 4px;
            background-color: #444;
            color: #fff;
            font-size: 16px;
        }
        .form-group input:focus {
            border-color: #777;
            outline: none;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
        }
        .alert {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            color: #721c24;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
        }
        .debug-info {
            margin-top: 20px;
            padding: 10px;
            background-color: #333;
            border: 1px solid #555;
            border-radius: 4px;
            color: #ff9800;
            font-family: monospace;
            font-size: 12px;
        }
        .submit-btn {
            padding: 10px 15px;
            background-color: chocolate;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .submit-btn:hover {
            background-color: #d2691e;
        }
    </style>
</head>
<body class="animated-background">
    <div class="login-container">
        <div class="login-header">
            <h1>K&P Service-Tool Admin</h1>
            <p>Bitte melden Sie sich an, um fortzufahren</p>
        </div>
        
        <?php if (!empty($error)): ?>
            <div class="alert"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <form class="login-form" method="post" action="">
            <div class="form-group">
                <label for="username">Benutzername</label>
                <input type="text" id="username" name="username" required autofocus>
            </div>
            
            <div class="form-group">
                <label for="password">Passwort</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="submit-btn">Anmelden</button>
        </form>
        
        <?php if (!empty($debug_errors) && ini_get('display_errors')): ?>
            <div class="debug-info">
                <strong>Debug Information:</strong>
                <ul>
                    <?php foreach($debug_errors as $debug_error): ?>
                        <li><?php echo htmlspecialchars($debug_error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>