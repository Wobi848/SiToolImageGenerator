<?php
require_once 'auth.php';

// Require authentication, redirect to login if not logged in
requireAuth();

// Messages for user feedback
$successMessage = '';
$errorMessage = '';

// Process password change form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $currentPassword = $_POST['current_password'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    
    // Basic validation
    if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        $errorMessage = 'Bitte füllen Sie alle Felder aus.';
    } else if ($newPassword !== $confirmPassword) {
        $errorMessage = 'Die neuen Passwörter stimmen nicht überein.';
    } else if (strlen($newPassword) < 8) {
        $errorMessage = 'Das neue Passwort muss mindestens 8 Zeichen lang sein.';
    } else {
        // Attempt to change the password
        $userId = $_SESSION['user_id'];
        if (changePassword($userId, $currentPassword, $newPassword)) {
            $successMessage = 'Passwort wurde erfolgreich geändert.';
        } else {
            $errorMessage = 'Das aktuelle Passwort ist nicht korrekt.';
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
    <title>Passwort ändern | K&P Service-Tool Admin</title>
    <link rel="stylesheet" href="/src/global-styles/base.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        .admin-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
        }
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .admin-header h1 {
            margin: 0;
        }
        .admin-nav {
            display: flex;
            gap: 10px;
        }
        .admin-nav a {
            padding: 8px 15px;
            background-color: #555;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        .admin-nav a:hover {
            background-color: #666;
        }
        .card {
            background-color: #333;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card h2 {
            margin-top: 0;
            color: #fff;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .alert-success {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            color: #155724;
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
        }
        .alert-danger {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            color: #721c24;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
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
        .form-group input[type="password"] {
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
        .password-tips {
            margin-top: 20px;
            padding: 15px;
            background-color: #2d2d2d;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
        }
        .password-tips h3 {
            margin-top: 0;
            color: #ffc107;
        }
        .password-tips ul {
            margin-bottom: 0;
            padding-left: 20px;
        }
        .password-tips li {
            margin-bottom: 5px;
            color: #ccc;
        }
        .required:after {
            content: " *";
            color: #dc3545;
        }
        .submit-btn {
            padding: 10px 20px;
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
    <div class="admin-container">
        <div class="admin-header">
            <h1>Passwort ändern</h1>
            <div class="admin-nav">
                <a href="/admin"><i class="fas fa-arrow-left"></i> Zurück zum Dashboard</a>
            </div>
        </div>

        <?php if (!empty($successMessage)): ?>
            <div class="alert-success">
                <?php echo htmlspecialchars($successMessage); ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($errorMessage)): ?>
            <div class="alert-danger">
                <?php echo htmlspecialchars($errorMessage); ?>
            </div>
        <?php endif; ?>

        <div class="card">
            <h2><i class="fas fa-key"></i> Passwort ändern</h2>
            <form action="" method="post">
                <div class="form-group">
                    <label for="current_password" class="required">Aktuelles Passwort</label>
                    <input type="password" name="current_password" id="current_password" required>
                </div>
                
                <div class="form-group">
                    <label for="new_password" class="required">Neues Passwort</label>
                    <input type="password" name="new_password" id="new_password" required>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password" class="required">Neues Passwort bestätigen</label>
                    <input type="password" name="confirm_password" id="confirm_password" required>
                </div>
                
                <button type="submit" class="submit-btn">Passwort ändern</button>
            </form>
            
            <div class="password-tips">
                <h3>Tipps für ein sicheres Passwort</h3>
                <ul>
                    <li>Mindestens 8 Zeichen lang</li>
                    <li>Eine Kombination aus Groß- und Kleinbuchstaben</li>
                    <li>Mindestens eine Zahl</li>
                    <li>Mindestens ein Sonderzeichen</li>
                    <li>Kein leicht zu erratendes Wort oder Name</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>