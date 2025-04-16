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
            margin: 10px auto;
            padding: 10px;
            width: 100%;
            box-sizing: border-box;
        }
        .admin-header {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
        }
        .admin-header h1 {
            margin: 0;
            font-size: 1.8rem;
            text-align: center;
        }
        .admin-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }
        .admin-nav a {
            padding: 8px 15px;
            background-color: #555;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
            text-align: center;
            flex: 1 1 auto;
            min-width: 120px;
            max-width: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
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
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow-x: auto; /* Allow horizontal scrolling if needed */
        }
        .card h2 {
            margin-top: 0;
            color: #fff;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 1.5rem;
            text-align: center;
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
        .file-table-container {
            overflow-x: auto;
            width: 100%;
        }
        .file-table {
            width: 100%;
            border-collapse: collapse;
            color: #fff; /* Adding white text color for better visibility */
            min-width: 600px; /* Ensure minimum width for scrolling on small devices */
        }
        .file-table th, .file-table td {
            padding: 8px;
            border-bottom: 1px solid #444;
            text-align: left;
            color: #fff; /* Explicitly setting text color for all cells */
            word-break: break-word;
        }
        .file-table th {
            background-color: #444;
            color: #fff;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .file-table tr:hover {
            background-color: #3a3a3a;
        }
        /* Ensure all text inside table is visible */
        .file-table a {
            color: #4dabf7; /* Light blue color for links in the table */
        }
        .file-table form {
            color: #fff; /* Ensure form elements inside table are visible */
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
            white-space: nowrap; /* Prevent button text from wrapping */
        }
        .btn {
            padding: 5px 10px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
            white-space: nowrap;
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
        
        /* Media queries for responsive design */
        @media (min-width: 768px) {
            .admin-header {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
            .admin-header h1 {
                text-align: left;
                font-size: 2rem;
            }
            .admin-nav {
                justify-content: flex-end;
            }
            .admin-nav a {
                flex: 0 1 auto;
            }
            .admin-container {
                padding: 20px;
                margin: 20px auto;
            }
            .card h2 {
                text-align: left;
                font-size: 1.8rem;
            }
        }
        
        /* Enhanced mobile responsiveness for tables */
        @media (max-width: 767px) {
            .file-table {
                font-size: 0.9rem; /* Slightly smaller font on mobile */
            }
            
            .btn {
                padding: 4px 8px; /* Smaller padding for buttons on mobile */
                font-size: 13px;
            }
            
            .file-table th, .file-table td {
                padding: 6px 4px; /* Reduce cell padding on mobile */
            }
            
            /* Force table to not be like a table on mobile */
            @media (max-width: 480px) {
                .file-table, .file-table thead, .file-table tbody, .file-table th, .file-table td, .file-table tr {
                    display: block;
                }
                
                /* Hide table headers */
                .file-table thead tr {
                    position: absolute;
                    top: -9999px;
                    left: -9999px;
                }
                
                .file-table tr {
                    margin-bottom: 15px;
                    border: 1px solid #444;
                    border-radius: 4px;
                }
                
                .file-table td {
                    /* Make like a row */
                    border: none;
                    border-bottom: 1px solid #444;
                    position: relative;
                    padding-left: 50%;
                    text-align: right;
                }
                
                .file-table td:before {
                    /* Add labels for each cell */
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    width: 45%;
                    padding-right: 10px;
                    white-space: nowrap;
                    text-align: left;
                    font-weight: bold;
                    content: attr(data-label);
                }
                
                /* Label each cell */
                .file-table td:nth-of-type(1):before { content: "Dateiname"; }
                .file-table td:nth-of-type(2):before { content: "Plattform"; }
                .file-table td:nth-of-type(3):before { content: "Version"; }
                .file-table td:nth-of-type(4):before { content: "Hochgeladen am"; }
                .file-table td:nth-of-type(5):before { content: "Hochgeladen von"; }
                .file-table td:nth-of-type(6):before { content: "Aktionen"; }
                
                /* Actions column needs special treatment */
                .file-table td.actions {
                    text-align: center;
                    padding: 10px;
                }
                
                .file-table td.actions:before {
                    display: none; /* No label for actions */
                }
                
                .file-table td.actions form {
                    width: 100%;
                }
                
                .file-table td.actions .btn {
                    width: 100%;
                    padding: 8px;
                    font-size: 14px;
                }
            }
        }
        
        /* For very small screens */
        @media (max-width: 480px) {
            .admin-nav a {
                min-width: 100%;
                margin-bottom: 5px;
            }
            .card {
                padding: 10px;
            }
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
                <div class="file-table-container">
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
                                    <td data-label="Dateiname"><?php echo htmlspecialchars($file['filename']); ?></td>
                                    <td data-label="Plattform">
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
                                    <td data-label="Version"><?php echo htmlspecialchars($file['version']); ?></td>
                                    <td data-label="Hochgeladen am"><?php echo htmlspecialchars(date('d.m.Y H:i', strtotime($file['upload_date']))); ?></td>
                                    <td data-label="Hochgeladen von"><?php echo htmlspecialchars($file['uploaded_by']); ?></td>
                                    <td data-label="Aktionen" class="actions">
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
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>