const express = require('express');
const bodyParser = require('body-parser');
const processSVGString = require('./utils/processSVGString');
const createReactComponent = require('./utils/createReactComponent');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post('/api/svg', async (req, res) => {
  try {
    const { svgData, outputTypes } = req.body;

    const resolvedData = await processSVGString(svgData, outputTypes );
    
    // TODO: Update accordingly
    res.json(resolvedData);
  } catch (exc) {
    console.error(exc);

    // TODO: Send res error!
  }
});

app.post('/api/react-component-download-request', async (req, res) => {
  try {
    const { cssTemplateString, uuid } = req.body;

    const zipFilePath = await createReactComponent(cssTemplateString, uuid);

    await new Promise((resolve, reject) => {
      res.sendFile(zipFilePath, (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });

  } catch (exc) {
    console.error(exc);

    // TODO: Send res error!
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));