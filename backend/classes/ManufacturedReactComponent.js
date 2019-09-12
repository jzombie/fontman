const EventEmitter = require('events');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const zip = require('cross-zip');

const TEMP_DIR_BASE_PATH = '/tmp';

const EVT_COMPLETE = 'complete';
const EVT_ERROR = 'error';

const _getReactComponentString = (uuid) => {
  return (
`import React from 'react';
import './style.css';

/**
 * Dynamically generated ReactComponent.
 */ 
const DynamicIcon = (props) => {
  const { className, ...propsRest } = props;

  return (
    <i
      {...propsRest}
      className={\`${uuid}-icon\${className ? \` \${className}\` : ''}\`}
    />
  );
};

export default DynamicIcon;
`
  );
};

const _getIndexString = () => {
  return (
`
import DynamicIcon from './DynamicIcon';

export default DynamicIcon;
`
  );
};

class ManufacturedReactComponent extends EventEmitter {
  constructor(cssTemplateString, uuid) {
    super();

    this._uuid = uuid;

    this._workingDirectoryPath = path.join(TEMP_DIR_BASE_PATH, `manufactured-react-component-${this._uuid}`);
    this._zipFilePath = path.join(TEMP_DIR_BASE_PATH, `zip-file-${this._uuid}.zip`);
  
    this._cssFilePath = path.join(this._workingDirectoryPath, 'style.css');
    this._cssTemplateString = cssTemplateString;

    this._indexFilePath = path.join(this._workingDirectoryPath, 'index.jsx');
    this._indexString = null;
    
    this._reactComponentFilePath = path.join(this._workingDirectoryPath, 'DynamicIcon.jsx');
    this._reactComponentString = null;

    (async () => {
      try {
        this._indexString = _getIndexString();
        console.log(this._indexString);

        this._reactComponentString = _getReactComponentString(this._uuid);
        console.log(this._reactComponentString);

        await this._createTempDirectory();

        await this._writeFile(this._cssFilePath, this._cssTemplateString);
        await this._writeFile(this._reactComponentFilePath, this._reactComponentString);
        await this._writeFile(this._indexFilePath, this._indexString);

        await this._zipReactComponent();

        await this._deleteTempDirectory();

        // await this._writeReactComponentFile();

        // 

        this.emit(EVT_COMPLETE, {
          zipFilePath: this._zipFilePath
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

  _writeFile(path, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, content, (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });
  }

  _zipReactComponent() {
    return new Promise((resolve, reject) => {
      zip.zip(this._workingDirectoryPath, this._zipFilePath, (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      })
    });  
  }

  /**
   * @return {Promise<void>}
   */
  async deleteZippedReactComponent() {
    return new Promise((resolve, reject) => {
      fs.unlink(this._zipFilePath, (error) => {
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
  async _createTempDirectory() {
    try {
      await this._createDirectory(this._workingDirectoryPath);
    } catch (exc) {
      throw exc;
    }
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
  ManufacturedReactComponent,
  EVT_COMPLETE,
  EVT_ERROR
};