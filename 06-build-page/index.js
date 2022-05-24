const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');

const stylesSourcesFolder = path.resolve(__dirname, 'styles');
const projectFolder = path.resolve(__dirname, 'project-dist');
const htmlSourcesFolder = path.resolve(__dirname, 'components');

fs.access(projectFolder, async (err) => {
  if (err) {
    await fsProm.mkdir(projectFolder);
    createProject();
  }
  else {
    await fsProm.rm(projectFolder, { recursive: true });
    await fsProm.mkdir(projectFolder, { recursive: true });
    createProject();
  }
});

function checkHTML(HTML) {
  if(HTML.indexOf('{{') !== -1) {
    const start = HTML.indexOf('{{');
    const end = HTML.indexOf('}}');
    const readStream = fs.createReadStream(path.resolve(htmlSourcesFolder, `${HTML.slice(start + 2, end)}.html`), 'utf-8');
    let component = '';
    readStream.on('data', (chunk) => component += chunk);
    readStream.on('end', () => {
      HTML = HTML.replace(HTML.slice(start - 4, end + 2), component);
      checkHTML(HTML);
    });
  } else {
    const writeStream = fs.createWriteStream(path.resolve(projectFolder, 'index.html'), 'utf-8');
    writeStream.write(HTML);
  }
}

function bundleHtml() {
  let readStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');
  let HTML = '';
  readStream.on('data', (chunk) => HTML += chunk);
  readStream.on('end', () => {
    checkHTML(HTML);
  });
}

function fileCopy (sourceFolder, projectFolder, file) {
  fs.copyFile( path.join(sourceFolder, file.name), path.join(projectFolder, file.name), err => {
    if (err) throw err;
  });
}

async function copying(sourceFolder, projectFolder) {
  try {
    await fs.promises.mkdir(projectFolder, { recursive: true });
    let files = await fsProm.readdir(sourceFolder, {withFileTypes: true});
    for (let file of files) {
      if (file.isFile()) {
        fileCopy(sourceFolder, projectFolder, file);
      } else {
        copying(path.join(sourceFolder, file.name), path.join(projectFolder, file.name));
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

async function bundleCss() {
  try {
    const writeStream = fs.createWriteStream(path.resolve(projectFolder, 'style.css'));
    let files = await fsProm.readdir(stylesSourcesFolder, {withFileTypes: true});
    files = files.reverse();
    files.forEach(file => {
      if(file.isFile()) {
        const filePath = path.resolve(stylesSourcesFolder, file.name);
        if (path.extname(filePath) === '.css') {
          const readStream = fs.createReadStream(filePath);
          readStream.pipe(writeStream, {
            end: false
          });
        }
      }
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

function createProject() {
  bundleCss();
  bundleHtml();
  copying(path.resolve(__dirname, 'assets'), path.resolve(projectFolder, 'assets'));  
}