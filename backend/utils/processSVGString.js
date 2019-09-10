const {
  SVGImageConverter,
  EVT_ERROR,
  EVT_COMPLETE
} = require('../classes/SVGImageConverter');

/**
 * @param {string} svgImageString
 * @return {Promise<void>}
 */
const processSVGString = (svgImageString, outputTypes) => {
  return new Promise((resolve, reject) => {
    const converter = new SVGImageConverter(svgImageString, outputTypes);

    converter.on(EVT_ERROR, (error) => {
      reject(error);
    });

    converter.on(EVT_COMPLETE, (data) => {
      resolve(data);
    });
  });
};

module.exports = processSVGString;