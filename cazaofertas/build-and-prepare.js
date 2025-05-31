const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to your React build
const buildDir = path.join(__dirname, 'dist');
const tempDir = path.join(__dirname, 'dist-temp');

// Function to copy directory recursively
function copyRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Get all files and directories in the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy directories
      copyRecursive(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main execution
try {
  console.log('Building React application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully.');
  
  // Ensure the temp directory exists
  if (fs.existsSync(tempDir)) {
    console.log('Removing old temporary directory...');
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Copy the build files to the temp directory
  console.log('Copying build files to temporary directory...');
  copyRecursive(buildDir, tempDir);
  
  console.log('Successfully copied build files to', tempDir);
  console.log('Now you can generate the APK with Capacitor');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
