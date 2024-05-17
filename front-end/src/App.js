import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [imgFile, setImgFile] = useState('');
  const [imgPreview, setImgPreview] = useState('');

  const handleFileChange = (event) => {
    console.log("Handling file change");
    const file = event.target.files[0];
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  // The URL to send the photo to
  let imageUploadUrl = "http://localhost:9696/upload";

  // This function is run after the user clicks submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', imgFile);
    console.log(formData.get('image'));
    
    axios.post(imageUploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
            <img id='img-preview' src={imgPreview} alt="Upload your photo" />
          </div>
          {/* <button>Upload Your Image</button> */}
          <form id='image-form' onSubmit={handleSubmit}>
            <input name='image' type="file" accept='.jpg,.jpeg,.png' onChange={handleFileChange} />
            <input type='submit' value={"Upload"} />
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
