const fs = require('fs');
const path = require('path');


async function buildPage() {
  try {
    await fs.promises.access(path.join(__dirname, 'project-dist'), fs.constants.R_OK | fs.constants.W_OK);
    await fs.promises.rmdir(path.join(__dirname, 'project-dist'), { recursive: true });
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'));

    let pattern = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8', () => {});
    const componentsData = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    const changedComponentsData = componentsData.filter(item => item.isFile() && item.name.split('.')[1] === 'html');

    for (const item of changedComponentsData) {
      const name = item.name.split('.')[0];
      const component = await fs.promises.readFile(path.join(__dirname, 'components', item.name), 'utf-8', () => {});
      pattern = pattern.replace(`{{${name}}}`, component);
    }
    
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), pattern, () => {});

    copyDirectory(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    uniteCSS();

  } catch (error) {
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'));

    let pattern = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8', () => {});
    const componentsData = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    const changedComponentsData = componentsData.filter(item => item.isFile() && item.name.split('.')[1] === 'html');

    for (const item of changedComponentsData) {
      const name = item.name.split('.')[0];
      const component = await fs.promises.readFile(path.join(__dirname, 'components', item.name), 'utf-8', () => {});
      pattern = pattern.replace(`{{${name}}}`, component);
    }
    
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), pattern, () => {});

    copyDirectory(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    uniteCSS();
  }
}


async function copyDirectory(src, dist) {
  await fs.promises.mkdir(dist, {
    recursive: true,
  });
  const data = await fs.promises.readdir(src, {withFileTypes: true});

  for (const item of data) {
    let curSrc = path.join(src, item.name);
    let curDist = path.join(dist, item.name);

    if(item.isDirectory()) {
      await fs.promises.mkdir(curDist, { recursive: true });
      copyDirectory(curSrc, curDist);
    } else if(item.isFile()) { 
      await fs.promises.copyFile(curSrc, curDist);
    }  
  }
}

async function uniteCSS() {
  await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', () => {});
  const data = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
  data.forEach((item) => {
    if(item.name.split('.')[1] === 'css' && item.isFile()) {
      const stream = fs.createReadStream(path.join(__dirname, 'styles', item.name), 'utf-8');
      let data = '';
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => {
        fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), `\n ${data}`, () => {});
      });
    } 
  });



  // await fs.promises.mkdir(dist, {
  //   recursive: true,
  // });
  // const data = await fs.promises.readdir(src, {withFileTypes: true});

  // for (const item of data) {
  //   let curSrc = path.join(src, item.name);
  //   let curDist = path.join(dist, item.name);

  //   if(item.isDirectory()) {
  //     await fs.promises.mkdir(curDist, { recursive: true });
  //     copyDirectory(curSrc, curDist);
  //   } else if(item.isFile()) { 
  //     await fs.promises.copyFile(curSrc, curDist);
  //   }  
  // }
}

buildPage();