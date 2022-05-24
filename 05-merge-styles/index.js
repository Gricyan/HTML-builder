const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');

const sourceFolder = path.resolve(__dirname, 'styles');
const projectFolder = path.resolve(__dirname, 'project-dist');
const createBundleCss = fs.createWriteStream(path.resolve(projectFolder, 'bundle.css'));

async function createBundle() {
  const cssFiles = await fsProm.readdir(sourceFolder, {withFileTypes: true});
  cssFiles.forEach(cssFile => {

    if (cssFile.isFile()) {
      const filePath = path.resolve(sourceFolder, cssFile.name);

      if (path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(createBundleCss, {
          end: false
        });
      }
    }
  });
}

createBundle();