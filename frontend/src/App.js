import React, { useCallback } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { useDropzone } from 'react-dropzone';

function App() {
  const onDrop = useCallback(acceptedFiles => {
    const lenAcceptedFiles = acceptedFiles.length;

    for (let i = 0; i < lenAcceptedFiles; i++) {
      const { type } = acceptedFiles[i];

      if (type !== 'image/svg+xml') {
        alert('All uploaded files must be of an SVG type');

        // Stop processing
        return;
      }
    }

    // console.debug({acceptedFiles});

    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = (evt) => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      // console.log(binaryStr);

      axios.post('/api/svg', binaryStr).then(resp => console.log(resp));
    };

    acceptedFiles.forEach(file => reader.readAsBinaryString(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div className="App" {...getRootProps()}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <input {...getInputProps()} />
          <p>Drag 'n' drop an SVG file here, or click to select file</p>
        </div>
      </header>
    </div>
  );
}

export default App;
