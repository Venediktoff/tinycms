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

function getAllJsonFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllJsonFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.json')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function clearCache(dirPath) {
    const files = fs.readdirSync(dirPath);
  
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        clearCache(fullPath);
      } else if (file.endsWith('.json')) {
        fs.unlinkSync(fullPath);
      }
    });
  }
  
const dataDir = path.resolve(__dirname, 'data');
const cacheDir = path.resolve(__dirname, 'cache');

clearCache(cacheDir);
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

  const relativePath = path.relative(dataDir, file);
  const jsonPath = path.join(cacheDir, relativePath.replace(/\.tml$/, '.json'));


  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(obj, null, 2), 'utf8');
});

const jsonFiles = getAllJsonFiles(cacheDir);

jsonFiles.forEach(file => {
  const json = fs.readFileSync(file, 'utf8');
  const obj = JSON.parse(json);

  const dirPath = path.dirname(file);
  const allJsonPath = path.join(dirPath, '_all.json');

  let allData;
  try {
    const allJson = fs.readFileSync(allJsonPath, 'utf8');
    allData = JSON.parse(allJson);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    allData = [];
  }

  allData.push(obj);

  fs.writeFileSync(allJsonPath, JSON.stringify(allData, null, 2), 'utf8');
});
