const { ManufacturedReactComponent,
  EVT_ERROR,
  EVT_COMPLETE
} = require('../classes/ManufacturedReactComponent');

/**
 * @param {string} cssTemplateString 
 * @param {string} uuid
 * @return {Promise<ManufacturedReactComponent}
 */
const createReactComponent = (cssTemplateString, uuid) => {
  return new Promise((resolve, reject) => {
    const manufacturedReactComponent = new ManufacturedReactComponent(cssTemplateString, uuid);

    manufacturedReactComponent.on(EVT_ERROR, (error) => {
      reject(error);
    });

    manufacturedReactComponent.on(EVT_COMPLETE, (data) => {
      const { zipFilePath } = data;

      resolve({
        zipFilePath,
        deleteZipFile: async () => {
          try {
            await manufacturedReactComponent.deleteZippedReactComponent();
          } catch (exc) {
            throw exc;
          }
        }
      });
    });
  });
};

module.exports = createReactComponent;