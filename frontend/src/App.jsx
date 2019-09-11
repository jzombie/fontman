import React, { useCallback, useState } from 'react';
import axios from 'axios';
import './App.css';
import Preview from './components/Preview';
import Footer from './components/Footer';
import FontIcon from './components/FontIcon';
import { useDropzone } from 'react-dropzone';

const initialFontFormats = [
  {
    name: 'WOFF2',
    type: 'woff2',
    canIUse: 'https://caniuse.com/#feat=woff2',
    description: 'TrueType/OpenType font that provides better compression than WOFF 1.0.',
    isChecked: true
  },
  {
    name: 'WOFF',
    type: 'woff',
    canIUse: 'https://caniuse.com/#feat=woff',
    description: 'Compressed TrueType/OpenType font that contains information about the font\'s source.',
    isChecked: false
  },
  {
    name: 'SVG (font)',
    type: 'svg',
    canIUse: 'https://caniuse.com/#feat=svg-fonts',
    description: 'Method of using fonts defined as SVG shapes. Removed from SVG 2.0 and considered as a deprecated feature with support being removed from browsers.',
    isChecked: false
  },
  {
    name: 'TTF',
    type: 'ttf',
    canIUse: 'https://caniuse.com/#feat=ttf',
    description: 'Support for the TrueType (.ttf) and OpenType (.otf) outline font formats in @font-face.',
    isChecked: false
  },
  {
    name: 'EOT',
    type: 'eot',
    canIUse: 'https://caniuse.com/#feat=eot',
    description: 'Type of font that can be derived from a regular font, allowing small files and legal use of high-quality fonts. Usage is restricted by the file being tied to the website.',
    isChecked: false
  },
];

function App() {
  const [fontFormats, setFontFormats] = useState(initialFontFormats);

  const [previewCSS, setPreviewCSS] = useState({});

  const setFontFormatIsChecked = (name, isChecked) => {
    const modifiedFormats = fontFormats.map(format => {
      if (format.name === name) {
        format.isChecked = isChecked;
      }

      return format;
    });

    setFontFormats([...modifiedFormats]);
  };

  const onDrop = useCallback(acceptedFiles => {
    const outputTypes = fontFormats.filter(format => {
      return format.isChecked;
    }).map(format => {
      return format.type
    });

    if (!outputTypes.length) {
      alert('No conversion formats present!');
      return;
    }

    const lenAcceptedFiles = acceptedFiles.length;

    for (let i = 0; i < lenAcceptedFiles; i++) {
      const { type } = acceptedFiles[i];

      if (type !== 'image/svg+xml') {
        alert('All uploaded files must be of an SVG type!');

        // Stop processing
        return;
      }
    }

    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.onload = async (evt) => {
      try {
        const svgData = reader.result;
        const { data: respData } = await axios.post('/api/svg', {
          svgData,
          outputTypes
        });

        const { cssTemplateString, uuid, sizeIncrease } = respData;
        setPreviewCSS({
          cssTemplateString,
          uuid,
          sizeIncrease
        });
      } catch (exc) {
        throw exc;
      }
    };

    acceptedFiles.forEach(file => reader.readAsBinaryString(file));
  }, [fontFormats]);

  const { getRootProps, getInputProps, /* isDragActive */ } = useDropzone({ onDrop, multiple: false });

  if (Object.keys(previewCSS).length) {
    const {
      cssTemplateString,
      uuid,
      sizeIncrease
    } = previewCSS;
    return (
      <Preview
        cssTemplateString={cssTemplateString}
        uuid={uuid}
        sizeIncrease={sizeIncrease}
        onClose={() => setPreviewCSS({})}
      />
    );
  }

  return (
    <div className="App" {...getRootProps()}>
      <header className="App-header">
        <FontIcon className="App-logo" alt="Font Icon" />
        <div style={{marginTop: 10}}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop an SVG file here, or click to select file</p>
        </div>
      </header>

      <Footer
        onClick={evt => evt.stopPropagation()}
        onTouchStart={evt => evt.stopPropagation()}
      >
        <span style={{fontStyle: 'italic'}}>Embedded formats:</span>
        {
          fontFormats.map((fontFormat, idx) => {
            const { name, canIUse, description, isChecked } = fontFormat;

            return (
              <div
                key={idx}
                title={description}
                style={{ backgroundColor: 'rgba(0,0,0,.1)', display: 'inline-block', margin: '0px 5px', padding: '4px 8px', border: '1px #ccc solid' }}
              >
                <label>{name}</label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={evt => setFontFormatIsChecked(name, evt.target.checked)}
                />

                <a
                  href={canIUse}
                  target="_blank"
                  rel="noopener noreferrer"
                >CanIUse?</a>
              </div>
            )
          })
        }

      </Footer>
    </div>
  );
}

export default App;
