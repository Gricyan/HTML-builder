const fs = require('fs');
const path = require('path');

const showFilesList = (folderPath)=>{

fs.readdir(folderPath, {withFileTypes: true}, (err, files)=>{

  if(err) return console.log(err);

  files.forEach(item => {

    if (item.isFile()) {
      let listItem = '';
      let fileName = item.name.split('.')[0];
      let fileExtensions = path.extname(item.name).split('.').join('');

      fs.stat(path.join(folderPath, item.name), true, (err, data) => {

        if(err) return console.log(err);

        let fileSize = (data.size / 1024).toFixed(3);
        listItem = `${fileName} - ${fileExtensions} - ${fileSize}kb`;
        return console.log(listItem);
      });    
    }
  });
});
};

showFilesList(path.join(__dirname, 'secret-folder'));