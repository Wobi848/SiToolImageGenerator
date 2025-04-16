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
        .animated-background {
            position: relative;
            overflow: hidden;
        }
        
        .animated-background::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(125deg, #1a1a1a 0%, #2c2c2c 40%, #333333 60%, #2c2c2c 80%, #1a1a1a 100%);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
            z-index: -1;
        }
        
        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .login-container {
            max-width: 400px;
            margin: 80px auto;
            padding: 30px;
            background-color: rgba(51, 51, 51, 0.85);
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .login-header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: chocolate;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .login-header p {
            color: #ddd;
            font-size: 16px;
            margin-top: 0;
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #eee;
            font-weight: bold;
            font-size: 14px;
            letter-spacing: 0.5px;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            background-color: rgba(68, 68, 68, 0.8);
            color: #fff;
            font-size: 16px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        
        .form-group input:focus {
            border-color: chocolate;
            outline: none;
            box-shadow: 0 0 8px rgba(210, 105, 30, 0.4);
            background-color: rgba(75, 75, 75, 0.9);
        }
        
        .alert {
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 6px;
            color: #721c24;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            font-size: 14px;
        }
        
        .debug-info {
            margin-top: 25px;
            padding: 12px;
            background-color: rgba(51, 51, 51, 0.7);
            border: 1px solid #555;
            border-radius: 6px;
            color: #ff9800;
            font-family: monospace;
            font-size: 12px;
        }
        
        .submit-btn {
            padding: 12px 20px;
            background-color: chocolate;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            letter-spacing: 0.5px;
            margin-top: 5px;
        }
        
        .submit-btn:hover {
            background-color: #e07722;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        }
        
        .submit-btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        }
        
        /* Logo area */
        .logo {
            text-align: center;
            margin-bottom: 15px;
        }
        
        .logo img {
            max-width: 80px;
            height: auto;
        }
    </style>
</head>
<body class="animated-background">
    <div class="login-container">
        <div class="login-header">
            <div class="logo">
                <!-- You can add your logo here if available -->
                <!-- <img src="/assets/img/logo.png" alt="K&P Logo"> -->
            </div>
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