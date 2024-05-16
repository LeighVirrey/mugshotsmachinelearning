import './App.css';
import React, { useState } from 'react';

function App() {
  const [imgFile, setImgFile] = useState('');

  return (
    <div className="App">
      <header className="App-header">

      </header>
      <div>
        <h1>Felon Face Finder</h1>
      </div>
      <div className="photos">
        <div className="photo-box">
          <div className="image">
            <img className="image" alt="Upload"></img>
          </div>
          {/* <button>Upload Your Image</button> */}
          <form id='image-form'>
            <input name='image' type="file" />
            <input type='submit' />
          </form>
        </div>
        <div className="btn=box">
          <button className="btn">Find your Felon look-alike</button>
        </div>
        <div className="photo-box">
          <div className="image">
            <img alt="Felon"></img>
          </div>
          <h3>Felon Info:</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
