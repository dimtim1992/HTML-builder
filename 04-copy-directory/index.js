const fs = require('fs');
const path = require('path');

async function copyDir() {
  try {
    await fs.promises.access(path.join(__dirname, 'files-copy'), fs.constants.R_OK | fs.constants.W_OK);
    await fs.promises.rmdir(path.join(__dirname, 'files-copy'), { recursive: true });

    await fs.promises.mkdir(path.join(__dirname, 'files-copy'));
    const files = await fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
    files.forEach(async (item) => {
      await fs.promises.writeFile(path.join(__dirname, 'files-copy', item.name), '', () => {});
      await fs.promises.copyFile(path.join(__dirname, 'files', item.name), path.join(__dirname, 'files-copy', item.name));
    });
  } catch (error) {
    await fs.promises.mkdir(path.join(__dirname, 'files-copy'));
    const files = await fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
    files.forEach(async (item) => {
      await fs.promises.writeFile(path.join(__dirname, 'files-copy', item.name), '', () => {});
      await fs.promises.copyFile(path.join(__dirname, 'files', item.name), path.join(__dirname, 'files-copy', item.name));
    });
  }
}  

copyDir();
