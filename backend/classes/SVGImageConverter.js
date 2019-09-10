const EventEmitter = require('events');
const uuidv4 = require('uuidv4').default;
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const base64 = require('base64-js');
const mime = require('mime-types');

const TEMP_DIR_BASE_PATH = '/tmp';

const EVT_COMPLETE = 'complete';
const EVT_ERROR = 'error';

const _generateCSSString = (uuid, mappedBase64) => {
  const cssTemplateString = 
`
@font-face {
  font-family: "${uuid}";
  src: ${mappedBase64.map(mapped => `url("${mapped.base64FontString}") format("${mapped.cssFormat}")`).join(',\n')}
}

i[class^="${uuid}-"]:before, i[class*=" ${uuid}-"]:before {
  display: inline-block;
  line-height: inherit;
  vertical-align: middle;
  font-family: ${uuid} !important;
  font-style: normal;
  font-weight: normal !important;
  font-variant: normal;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.${uuid}-icon:before {
  content: "\\f101";
}
`;

 return cssTemplateString;
};

class SVGImageConverter extends EventEmitter {
  constructor(svgImageString, outputTypes) {
    super();

    this._svgImageString = svgImageString;
    this._inputSize = this._svgImageString.length;
    this._outputTypes = outputTypes || [];

    // Important!  It must begin with a character or it will not work!
    this._uuid = 'i' + uuidv4().split('-').join('');

    this._workingDirectoryPath = path.join(TEMP_DIR_BASE_PATH, `svg-font-converter-${this._uuid}`);
    this._compilationDirectoryPath = path.join(this._workingDirectoryPath, 'compiled');

    this._svgWriteFilePath = path.join(this._workingDirectoryPath, 'icon.svg');

    this._cssOutputString = null;
    
    this._inputSize = this._svgImageString.length;
    this._outputSize = null;

    (async () => {
      try {
        if (!this._outputTypes.length) {
          throw new Error('No output types!');
        }

        await this._createTempDirectories();

        await this._writeSVGImage();

        await this._processSVGImage();

        const iconFormatMap = [
          {
            fileName: `${this._uuid}.svg`,
            type: 'svg',
            cssFormat: 'svg'
          },
          {
            fileName: `${this._uuid}.ttf`,
            type: 'ttf',
            cssFormat: 'truetype'
          },
          {
            fileName: `${this._uuid}.woff`,
            type: 'woff',
            cssFormat: 'woff',
          },
          {
            fileName: `${this._uuid}.woff2`,
            type: 'woff2',
            cssFormat: 'woff2',
          },
          {
            fileName: `${this._uuid}.eot`,
            type: 'eot',
            cssFormat: 'embedded-opentype'
          }
        ];

        const base64ReadPromises = iconFormatMap.map(map => {
          const { fileName } = map;
          return this._readFileAsBase64(path.join(this._compilationDirectoryPath, fileName));
        });

        const base64Reads = await Promise.all(base64ReadPromises);

        const mappedBase64 = base64Reads.map((base64FontString, idx) => {
          const { cssFormat, type } = iconFormatMap[idx];

          return {
            base64FontString,
            type,
            cssFormat
          };
        });

        await this._writeCSSFileWithMappedBase64(mappedBase64);

        const deleteArtifactPromises = iconFormatMap.map(map => {
          const { fileName } = map;
          const filePath = path.join(this._compilationDirectoryPath, fileName);

          return this._deletePath(filePath);
        });

        await Promise.all(deleteArtifactPromises);

        await this._deleteTempDirectory();

        this.emit(EVT_COMPLETE, {
          uuid: this._uuid,
          cssTemplateString: this._cssOutputString,
          sizeIncrease: this._outputSize - this._inputSize,
        });

      } catch (exc) {
        console.error(exc);

        this.emit(EVT_ERROR, exc);
      }
    })();
  }

  /**
   * @return {Promise<void>}
   */
  _createDirectory(path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });
  }

  /**
   * Creates temp directory structures for processing.
   * 
   * @return {Promise<void>}
   */
  async _createTempDirectories() {
    try {
      await this._createDirectory(this._workingDirectoryPath);

      await this._createDirectory(this._compilationDirectoryPath);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Writes the svgImageString to the svgFilePath, for processing.
   * 
   * @return {Promise<void>}
   */
  _writeSVGImage() {
    return new Promise((resolve, reject) => {
      const svgImageString = this._svgImageString;

      const svgFilePath = this._svgWriteFilePath;

      fs.writeFile(svgFilePath, svgImageString, (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });
  }

  /**
   * @return {Promise<void>}
   */
  _processSVGImage() {
    return new Promise((resolve, reject) => {
      // @see https://www.npmjs.com/package/icon-font-generator
      const child = spawn('icon-font-generator', [
        `${this._workingDirectoryPath}/*.svg`,

        // Generate CSS file if true
        '-c',
        'false',

        // Generate JSON map file if true
        '-j',
        'false',

        // '-types',
        // `${this._outputTypes.join(', ')}`,

        // Name to use for generated fonts and files
        '-n',
        this._uuid,

        // CSS classname prefix for icons
        '-p',
        this._uuid,

        // Output icon font set files to <out> directory
        '-o',
        this._compilationDirectoryPath
      ]);

      child.stdout.on('data', function (data) {
        console.log('stdout', data);
      });

      child.stderr.on('data', function (error) {
        console.error('stderr', error);

        reject(error);
      });

      child.on('close', function (code) {
        console.log(`child process exited with code: ${code}`);

        if (code === 0) {
          resolve();
        } else {
          reject(`Unexpected exit code: ${code}`);
        }
      });
    });
  }

  /**
   * @param {string} path
   * @return {string} Base64 encoded path with format:
   * "data:${mimeType};base64,${base64String}"
   */
  _readFileAsBase64(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (error, buffer) => {
        if (error) {
          return reject(error);
        } else {
          try {
            const mimeType = mime.lookup(path);

            const base64String = base64.fromByteArray(buffer);

            return resolve(`data:${mimeType};base64,${base64String}`);
          } catch (exc) {
            return reject(exc);
          }
        }
      });
    });
  }

  /**
   * @param {Object} mappedBase64
   * @return {string} 
   */
  _generateCSSTemplateFromMappedBase64(mappedBase64) {
    mappedBase64 = mappedBase64.filter(mapped => {
      return this._outputTypes.includes(mapped.type);
    });

    const cssTemplateString = _generateCSSString(this._uuid, mappedBase64);

    this._cssOutputString = cssTemplateString;
    this._outputSize = cssTemplateString.length;

    return this._cssOutputString;
  }

  /**
   * 
   * @return {Promise<void>} 
   */
  _writeCSSFileWithMappedBase64(mappedBase64) {
    return new Promise((resolve, reject) => {
      try {
        const fileName = `${this._uuid}.css`;
        const filePath = path.join(this._compilationDirectoryPath, fileName);

        const templateString = this._generateCSSTemplateFromMappedBase64(mappedBase64);

        fs.writeFile(filePath, templateString, 'utf8', (error) => {
          if (error) {
            return reject(error);
          } else {
            return resolve();
          }
        });
      } catch (exc) {
        reject(exc);
      }
    });
  }

  _deletePath(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });
  }

  /**
   * @return {Promise<void>}
   */
  async _deleteTempDirectory() {
    try {
      await fsExtra.remove(this._workingDirectoryPath);
    } catch (exc) {
      throw exc;
    }
  }
}

module.exports = {
  SVGImageConverter,
  EVT_COMPLETE,
  EVT_ERROR
};