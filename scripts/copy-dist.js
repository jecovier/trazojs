import fs from "fs";

console.log("Copying JS files...");
// Source and destination paths
const sourceFilePattern = "index-";
const distributionFile = "dist/papel.js";
const downloadFile = "pages/assets/papel.js";

// Get the source file
const sourceFile = fs
  .readdirSync("pages/assets")
  .find(
    (file) => file.startsWith(sourceFilePattern) && file.slice(-3) === ".js"
  );

// Copy the file to the distribution folder
fs.copyFile("pages/assets/" + sourceFile, distributionFile, (err) => {
  if (err) {
    console.error("Error copying file:", err);
  } else {
    console.log("File copied successfully:", distributionFile);
  }
});

// Copy the file to the download folder
fs.copyFile("pages/assets/" + sourceFile, downloadFile, (err) => {
  if (err) {
    console.error("Error copying file:", err);
  } else {
    console.log("File copied successfully:", downloadFile);
  }
});
