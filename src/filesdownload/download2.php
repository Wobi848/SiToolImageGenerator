<?php
// Connect to database and retrieve data
$conn = mysqli_connect("localhost", "rappo_dev", ",.-Anabelis132,.-", "trappo_kp_rappo_dev");
$result = mysqli_query($conn, "SELECT * FROM files");

// Generate HTML table
echo "<table>";
echo "<tr><th>ID</th><th>Filename</th><th>Filepath</th><th>Download Count</th></tr>";
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>";
    echo "<td>". $row["id"]. "</td>";
    echo "<td>". $row["filename"]. "</td>";
    echo "<td>". $row["filepath"]. "</td>";
    echo "<td>". $row["download_count"]. "</td>";
    echo "</tr>";
}
echo "</table>";

// Close database connection
mysqli_close($conn);
?>