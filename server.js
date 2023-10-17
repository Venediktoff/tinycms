const express = require('express');
const router = express.Router();
const {routes} = require('./routes');
// user env variable for heroku etc
const port = 3000;

const app = express();

routes.map(route => {
app.route(route)
    .get((req, res) => {
    res.status(200).json({message: route})
    })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
