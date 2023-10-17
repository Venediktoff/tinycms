const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
}

const dataDir = path.resolve(__dirname, 'data');
const files = getAllFiles(dataDir);

files.forEach(file => {
  const markup = fs.readFileSync(file, 'utf8');

  const regex = /<(\w+)>([^<]+)<\/\1>/g;
  let match;
  const obj = {};

  while ((match = regex.exec(markup)) !== null) {
    const tag = match[1];
    const text = match[2];
    obj[tag] = text;
  }

  const cacheDir = path.resolve(__dirname, 'cache');
  const relativePath = path.relative(dataDir, file);
  const jsonPath = path.join(cacheDir, relativePath.replace(/\.tml$/, '.json'));

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(obj, null, 2), 'utf8');
});
