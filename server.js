const express = require('express');
const fs = require('fs');
const { routes } = require('./routes');

// to-do user env variable for heroku etc
const port = 3000;

const app = express();

const returnCache = (location, res) => {
   fs.readFile('./cache'+location+'.json', 'utf8', (err, data) => {
        if (err) {
          return;
        }

        const response = JSON.parse(data);
        res.status(200).json(response)
    })
}

routes.map(r => {
app.route(r.route)
    .get((req, res) => {
       returnCache(r.route, res)
    })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
