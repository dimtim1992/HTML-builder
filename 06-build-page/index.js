const fs = require('fs');
const path = require('path');

async function buildPage() {
  try {
    await fs.promises.access(path.join(__dirname, 'project-dist'), fs.constants.R_OK | fs.constants.W_OK);
    await fs.promises.rmdir(path.join(__dirname, 'project-dist'), { recursive: true });

    await fs.promises.mkdir(path.join(__dirname, 'project-dist'));

    let pattern = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8', () => {});
  
    const data = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    data.forEach(async (item) => {
      const component = await fs.promises.readFile(path.join(__dirname, 'components', item.name), 'utf-8', () => {});
      
      const re = new RegExp('{{' + item.name.split('.')[0] + '}}');
      pattern = pattern.replace(re, component);
    });
    
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), pattern, () => {});

  } catch (error) {
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'));

    let pattern = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8', () => {});


    const data = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    data.forEach(async (item) => {
      const component = await fs.promises.readFile(path.join(__dirname, 'components', item.name), 'utf-8', () => {});
    
      const re = new RegExp('{{' + item.name.split('.')[0] + '}}');
      pattern = pattern.replace(re, component);
    });
  
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), pattern, () => {});
  }
  
}

buildPage();

async function mainFile() {
  
  try {
    await fs.promises.access(path.join(__dirname, 'project-dist', 'style.css'), fs.constants.R_OK | fs.constants.W_OK);
    await fs.promises.unlink(path.join(__dirname, 'project-dist', 'style.css'));
      
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', () => {});
  
    const data = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    data.forEach((item) => {
      if(item.name.split('.')[1] === 'css' && item.isFile()) {
        const stream = fs.createReadStream(path.join(__dirname, 'styles', item.name), 'utf-8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, () => {});
        });
      } 
    });
  
  } catch (error) {
  
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', () => {});
      
    const data = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    data.forEach((item) => {
      if(item.name.split('.')[1] === 'css' && item.isFile()) {
        const stream = fs.createReadStream(path.join(__dirname, 'styles', item.name), 'utf-8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, () => {});
        });
      } 
    });
  }
}
  
mainFile();

async function copyDir() {
  try {
    await fs.promises.access(path.join(__dirname, 'project-dist', 'assets'), fs.constants.R_OK | fs.constants.W_OK);
    await fs.promises.rmdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });
  
    await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'));
    // пройти по элементам и каждый проверить на папку, если же это не папка, то копировать
    const data = await fs.promises.readdir(path.join(__dirname, 'assets'), {withFileTypes: true});
    data.forEach(async (item) => {
      if(item.isFile()) {
        await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'assets', item.name), '', () => {});
        await fs.promises.copyFile(path.join(__dirname, 'assets', item.name), path.join(__dirname, 'project-dist', 'assets', item.name));
      }

      if(item.isDirectory()) {
        const directoryData = await fs.promises.readdir(path.join(__dirname, 'assets', item.name), {withFileTypes: true});
        directoryData.forEach(async (el) => {
          if(el.isFile()) {
            await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'assets', item.name, el.name), '', () => {});
            await fs.promises.copyFile(path.join(__dirname, 'assets',  item.name, el.name), path.join(__dirname, 'project-dist', 'assets',  item.name, el.name));
          }
        });
      }
    });

    const files = await fs.promises.readdir(path.join(__dirname, 'assets'), {withFileTypes: true});
    files.forEach(async (item) => {
      await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'assets', item.name), '', () => {});
      await fs.promises.copyFile(path.join(__dirname, 'assets', item.name), path.join(__dirname, 'project-dist', 'assets', item.name));
    });
  } catch (error) {
    await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'));
    const files = await fs.promises.readdir(path.join(__dirname, 'assets'), {withFileTypes: true});
    files.forEach(async (item) => {
      await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'assets', item.name), '', () => {});
      await fs.promises.copyFile(path.join(__dirname, 'assets', item.name), path.join(__dirname, 'project-dist', 'assets', item.name));
    });
  }
}  
  
copyDir();
  