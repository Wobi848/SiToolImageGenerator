<?php
require_once 'auth.php';
require_once 'db.php';

// Initialize database if needed
initializeDatabase();

// Require authentication, redirect to login if not logged in
requireAuth();

// Handle logout request
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    logout();
    header('Location: login.php');
    exit;
}

// Get uploaded files from database
$files = [];
$db = getDbConnection();
if ($db) {
    try {
        $stmt = $db->query("SELECT * FROM xml_files ORDER BY upload_date DESC");
        $files = $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log("Error fetching files: " . $e->getMessage());
    }
}

// Messages for user feedback
$successMessage = '';
$errorMessage = '';

// Handle file delete
if (isset($_POST['delete_file']) && isset($_POST['file_id'])) {
    $fileId = (int)$_POST['file_id'];
    
    try {
        // First get the filename to delete the actual file
        $stmt = $db->prepare("SELECT filename FROM xml_files WHERE id = ?");
        $stmt->execute([$fileId]);
        $file = $stmt->fetch();
        
        if ($file) {
            $filePath = '../download/files/' . $file['filename'];
            
            // Delete from database
            $deleteStmt = $db->prepare("DELETE FROM xml_files WHERE id = ?");
            $result = $deleteStmt->execute([$fileId]);
            
            if ($result) {
                // Try to delete the physical file
                if (file_exists($filePath)) {
                    if (unlink($filePath)) {
                        $successMessage = 'Datei erfolgreich gelöscht.';
                    } else {
                        $successMessage = 'Datei aus Datenbank gelöscht, aber die physische Datei konnte nicht entfernt werden.';
                    }
                } else {
                    $successMessage = 'Datei aus Datenbank gelöscht. Physische Datei nicht gefunden.';
                }
                
                // Refresh file list
                $stmt = $db->query("SELECT * FROM xml_files ORDER BY upload_date DESC");
                $files = $stmt->fetchAll();
            } else {
                $errorMessage = 'Fehler beim Löschen der Datei.';
            }
        } else {
            $errorMessage = 'Datei nicht gefunden.';
        }
    } catch (PDOException $e) {
        error_log("Error deleting file: " . $e->getMessage());
        $errorMessage = 'Datenbankfehler beim Löschen der Datei.';
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>K&P Service-Tool Admin Dashboard</title>
    <link rel="stylesheet" href="/src/global-styles/base.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        .admin-container {
            max-width: 1200px;
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
        .admin-nav a.logout {
            background-color: #d9534f;
        }
        .admin-nav a.logout:hover {
            background-color: #c9302c;
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
        .file-table {
            width: 100%;
            border-collapse: collapse;
        }
        .file-table th, .file-table td {
            padding: 10px;
            border-bottom: 1px solid #444;
            text-align: left;
        }
        .file-table th {
            background-color: #444;
            color: #fff;
        }
        .file-table tr:hover {
            background-color: #3a3a3a;
        }
        .platform-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
        }
        .platform-ddc {
            background-color: rgba(0, 123, 255, 0.2);
            color: #0d6efd;
        }
        .platform-bmr {
            background-color: rgba(40, 167, 69, 0.2);
            color: #28a745;
        }
        .platform-all {
            background-color: rgba(255, 193, 7, 0.2);
            color: #ffc107;
        }
        .actions {
            display: flex;
            gap: 5px;
        }
        .btn {
            padding: 5px 10px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        .btn-danger {
            background-color: #d9534f;
            color: white;
        }
        .btn-danger:hover {
            background-color: #c9302c;
        }
        .btn-primary {
            background-color: chocolate;
            color: white;
        }
        .btn-primary:hover {
            background-color: #d2691e;
        }
    </style>
</head>
<body class="animated-background">
    <div class="admin-container">
        <div class="admin-header">
            <h1>K&P Service-Tool Administration</h1>
            <div class="admin-nav">
                <a href="upload.php" class="btn-primary"><i class="fas fa-upload"></i> XML-Datei hochladen</a>
                <a href="password.php"><i class="fas fa-key"></i> Passwort ändern</a>
                <a href="?action=logout" class="logout"><i class="fas fa-sign-out-alt"></i> Abmelden</a>
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
            <h2><i class="fas fa-file-code"></i> XML Dateien Verwalten</h2>
            
            <?php if (empty($files)): ?>
                <p>Keine XML-Dateien gefunden. Laden Sie neue Dateien hoch, um sie hier zu sehen.</p>
            <?php else: ?>
                <table class="file-table">
                    <thead>
                        <tr>
                            <th>Dateiname</th>
                            <th>Plattform</th>
                            <th>Version</th>
                            <th>Hochgeladen am</th>
                            <th>Hochgeladen von</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($files as $file): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($file['filename']); ?></td>
                                <td>
                                    <?php 
                                        $platformClass = '';
                                        switch ($file['platform']) {
                                            case 'DDC4000':
                                                $platformClass = 'platform-ddc';
                                                break;
                                            case 'BMR':
                                                $platformClass = 'platform-bmr';
                                                break;
                                            default:
                                                $platformClass = 'platform-all';
                                        }
                                    ?>
                                    <span class="platform-badge <?php echo $platformClass; ?>">
                                        <?php echo htmlspecialchars($file['platform']); ?>
                                    </span>
                                </td>
                                <td><?php echo htmlspecialchars($file['version']); ?></td>
                                <td><?php echo htmlspecialchars(date('d.m.Y H:i', strtotime($file['upload_date']))); ?></td>
                                <td><?php echo htmlspecialchars($file['uploaded_by']); ?></td>
                                <td class="actions">
                                    <form method="post" onsubmit="return confirm('Sind Sie sicher, dass Sie diese Datei löschen möchten?');">
                                        <input type="hidden" name="file_id" value="<?php echo $file['id']; ?>">
                                        <button type="submit" name="delete_file" class="btn btn-danger">
                                            <i class="fas fa-trash-alt"></i> Löschen
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>