<?php
require_once 'auth.php';
require_once 'db.php';

// Require authentication, redirect to login if not logged in
requireAuth();

// Messages for user feedback
$successMessage = '';
$errorMessage = '';

// Process file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate form data
    $platform = $_POST['platform'] ?? '';
    $version = $_POST['version'] ?? '';
    $description = $_POST['description'] ?? '';
    
    // Basic validation
    if (empty($platform) || empty($version)) {
        $errorMessage = 'Bitte füllen Sie alle erforderlichen Felder aus.';
    } else if (!isset($_FILES['xml_file']) || $_FILES['xml_file']['error'] !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'Die hochgeladene Datei überschreitet die Größenbeschränkung.',
            UPLOAD_ERR_FORM_SIZE => 'Die hochgeladene Datei überschreitet die Größenbeschränkung.',
            UPLOAD_ERR_PARTIAL => 'Die Datei wurde nur teilweise hochgeladen.',
            UPLOAD_ERR_NO_FILE => 'Es wurde keine Datei hochgeladen.',
            UPLOAD_ERR_NO_TMP_DIR => 'Temporäres Verzeichnis fehlt.',
            UPLOAD_ERR_CANT_WRITE => 'Fehler beim Schreiben der Datei auf die Festplatte.',
            UPLOAD_ERR_EXTENSION => 'Eine PHP-Erweiterung hat den Upload gestoppt.'
        ];
        $errorCode = $_FILES['xml_file']['error'];
        $errorMessage = $errorMessages[$errorCode] ?? 'Unbekannter Upload-Fehler.';
    } else {
        $file = $_FILES['xml_file'];
        $fileName = $file['name'];
        
        // Check file extension
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if ($fileExtension !== 'xml') {
            $errorMessage = 'Es sind nur XML-Dateien erlaubt.';
        } else {
            // Check if file already exists
            $targetDirectory = '../download/files/';
            $targetFile = $targetDirectory . $fileName;
            
            if (file_exists($targetFile)) {
                $errorMessage = 'Eine Datei mit diesem Namen existiert bereits.';
            } else {
                // Attempt to save the file
                if (move_uploaded_file($file['tmp_name'], $targetFile)) {
                    // File uploaded successfully, now add to database
                    $db = getDbConnection();
                    if ($db) {
                        try {
                            $stmt = $db->prepare("INSERT INTO xml_files (filename, platform, version, description, uploaded_by) VALUES (?, ?, ?, ?, ?)");
                            $result = $stmt->execute([
                                $fileName,
                                $platform,
                                $version,
                                $description,
                                $_SESSION['username']
                            ]);
                            
                            if ($result) {
                                $_SESSION['success_message'] = 'Datei wurde erfolgreich hochgeladen.';
                                // Redirect to index page after successful upload
                                header('Location: index.php');
                                exit;
                            } else {
                                $errorMessage = 'Fehler beim Speichern der Dateiinformationen in der Datenbank.';
                                // Delete the uploaded file since we couldn't add it to the database
                                unlink($targetFile);
                            }
                        } catch (PDOException $e) {
                            error_log("Error adding file to database: " . $e->getMessage());
                            $errorMessage = 'Datenbankfehler beim Speichern der Dateiinformationen.';
                            // Delete the uploaded file since we couldn't add it to the database
                            unlink($targetFile);
                        }
                    } else {
                        $errorMessage = 'Fehler bei der Datenbankverbindung.';
                        // Delete the uploaded file since we couldn't add it to the database
                        unlink($targetFile);
                    }
                } else {
                    $errorMessage = 'Fehler beim Hochladen der Datei.';
                }
            }
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
    <title>XML-Datei hochladen | K&P Service-Tool Admin</title>
    <link rel="stylesheet" href="/src/global-styles/base.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        .admin-container {
            max-width: 800px;
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
        .form-group input[type="text"],
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #555;
            border-radius: 4px;
            background-color: #444;
            color: #fff;
            font-size: 16px;
        }
        .form-group textarea {
            height: 100px;
            resize: vertical;
        }
        .form-group input[type="file"] {
            padding: 10px;
            border: 1px dashed #555;
            border-radius: 4px;
            background-color: #3a3a3a;
            width: 100%;
            cursor: pointer;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            border-color: #777;
            outline: none;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
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
        .file-info {
            margin-top: 10px;
            color: #aaa;
            font-size: 14px;
        }
    </style>
</head>
<body class="animated-background">
    <div class="admin-container">
        <div class="admin-header">
            <h1>XML-Datei hochladen</h1>
            <div class="admin-nav">
                <a href="index.php"><i class="fas fa-arrow-left"></i> Zurück zum Dashboard</a>
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
            <h2><i class="fas fa-upload"></i> XML-Datei hochladen</h2>
            <form action="" method="post" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="xml_file" class="required">XML-Datei auswählen</label>
                    <input type="file" name="xml_file" id="xml_file" accept=".xml" required>
                    <div class="file-info">
                        Maximale Dateigröße: 5MB. Nur .xml Dateien sind erlaubt.
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="platform" class="required">Plattform</label>
                    <select name="platform" id="platform" required>
                        <option value="">-- Plattform wählen --</option>
                        <option value="DDC4000">DDC4000</option>
                        <option value="BMR">DDC420 (BMR)</option>
                        <option value="ALL">Beide Plattformen</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="version" class="required">Version</label>
                    <input type="text" name="version" id="version" placeholder="z.B. 1.7.1" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Beschreibung</label>
                    <textarea name="description" id="description" placeholder="Optionale Beschreibung der Datei"></textarea>
                </div>
                
                <button type="submit" class="submit-btn">Datei hochladen</button>
            </form>
        </div>
    </div>
</body>
</html>