const express = require('express');
const fs = require('fs');
const { routes } = require('./routes');

const port = process.env.PORT || 3000;

const app = express();

const returnCache = (location, res) => {

const path = './cache'+location;
console.log(path+'.json')

if (fs.existsSync(path)) {
    const stats = fs.statSync(path);

    if (stats.isDirectory()) {
        fs.readFile(path+'/_all.json', 'utf8', (err, data) => {
            if (err) {
              return;
            }
    
            const response = JSON.parse(data);
            res.status(200).json(response)
        })
    } else {
        fs.readFile(path+'.json', 'utf8', (err, data) => {
            if (err) {
              return;
            }
    
            const response = JSON.parse(data);
            res.status(200).json(response)
        })
    }
    
    } else {
        console.log('The file or directory does not exist');
        res.status(200).json({});

    }

   
}


app.route('*')
    .get((req, res) => {
        console.log(req.originalUrl)
       returnCache(req.originalUrl, res)
    })

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
