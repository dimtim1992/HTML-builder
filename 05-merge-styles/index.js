const fs = require('fs');
const path = require('path');

// async function mainFile() {
//   const first = await fs.promises.readFile(path.join(__dirname, 'styles', 'style-1.css'), 'utf-8', () => {});
//   const second = await fs.promises.readFile(path.join(__dirname, 'styles', 'style-2.css'), 'utf-8', () => {});
//   const third = await fs.promises.readFile(path.join(__dirname, 'styles', 'style-3.css'), 'utf-8', () => {});

//   await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), first, () => {});
//   await fs.promises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), second, () => {});
//   await fs.promises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), third, () => {});
// }

async function mainFile() {
  
  try {
    await fs.promises.access(path.join(__dirname, 'project-dist', 'bundle.css'), fs.constants.R_OK | fs.constants.W_OK);
    await fs.promises.unlink(path.join(__dirname, 'project-dist', 'bundle.css'));
    
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', () => {});

    const data = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    data.forEach((item) => {
      if(item.name.split('.')[1] === 'css' && item.isFile()) {
        const stream = fs.createReadStream(path.join(__dirname, 'styles', item.name), 'utf-8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, () => {});
        });
        // const cssStyles = await fs.promises.readFile(path.join(__dirname, 'styles', item.name), 'utf-8', () => {});
        // await fs.promises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), cssStyles, () => {});
      } 
    });

  } catch (error) {

    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', () => {});
    
    const data = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    data.forEach((item) => {
      if(item.name.split('.')[1] === 'css' && item.isFile()) {
        const stream = fs.createReadStream(path.join(__dirname, 'styles', item.name), 'utf-8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, () => {});
        });
        // const cssStyles = await fs.promises.readFile(path.join(__dirname, 'styles', item.name), 'utf-8', () => {});
        // await fs.promises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), cssStyles, () => {});
      } 
    });
  }
}

mainFile();