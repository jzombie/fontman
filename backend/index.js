const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/svg', (req, res) => {
  // Raw file string
  const keys = Object.keys(req.body);
  console.log(req.body[keys[0]]);

  // Write to temp directory w/ uuidv4 name

  // Pass to icon-font-generator
  
  // TODO: Update accordingly
  res.send('Received!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));