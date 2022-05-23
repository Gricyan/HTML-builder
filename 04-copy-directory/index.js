const fs = require('fs/promises');
const path = require('path');

async function copyFolder(sourceFolder, copiedFolder) {
  try {
    await fs.rm(copiedFolder, { recursive: true, force: true });
    await fs.mkdir(copiedFolder, { recursive: true });

    const files = await fs.readdir(sourceFolder, { withFileTypes: true });

    for (let file of files) {
      let sourceFile = path.join(sourceFolder, `./${file.name}`);
      let copiedFile = path.join(copiedFolder, `./${file.name}`);
      if (file.isDirectory()) {
        copyFolder(sourceFile, copiedFile);
      } else {
        await fs.copyFile(sourceFile, copiedFile);
      }
    }
  } 
    catch (err) {
    console.error(err.message);
  }
}

copyFolder(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));