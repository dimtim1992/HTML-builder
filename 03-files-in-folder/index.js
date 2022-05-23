const fs = require('fs');
const path = require('path');

async function readFiles() {
  const data = await fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});

  data.forEach((item, index) => {
    if(!item.isFile()) {
      data.splice(index, 1);
    }
  });

  data.forEach(async (item) => {
    const name = item.name.split('.').splice(0, 1)[0];
    const extName = item.name.split('.').splice(1, 1)[0];
    const stat = await fs.promises.stat(path.join(__dirname, 'secret-folder', item.name));
    const res = `${name}-${extName}-${stat.size}b`;
    console.log(res);  
  });
}

readFiles();


