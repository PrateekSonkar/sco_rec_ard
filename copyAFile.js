const fs = require("fs");
const path = require("path");

function copyAFile(sourcePath, destinationPath) {
  // Ensure the destination directory exists
  const destinationDir = path.dirname(destinationPath);
  fs.mkdirSync(destinationDir, { recursive: true });

  // Append the source file name to the destination path if it's not included
  if (!path.extname(destinationPath)) {
    destinationPath = path.join(destinationPath, path.basename(sourcePath));
  }

  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error("Error occurred:", err);
      return;
    }
    console.log("File copied successfully.");

    // Delete the source file after successful copy
    fs.unlink(sourcePath, (err) => {
      if (err) {
        console.error("Error deleting the source file:", err);
        return;
      }
      console.log("Source file deleted successfully.");
    });
  });
}

copyAFile(
  "1st-match-23-May-2024-west-indies-vs-south-africa.json",
  "./2024/May/South Africa tour of West Indies 2024/1st-match-23-May-2024-west-indies-vs-south-africa"
);
