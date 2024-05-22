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

  const imageUploadUrl = "http://localhost:9696/upload";

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
        <h1>Felon Face Finder</h1>
      </header>
      <div className="photos">
        <div className="photo-box">
          <div className="image-container">
            <img id="img-preview" src={imgPreview} alt="Upload your photo" />
            <div className="prison-bars"></div>
          </div>
          <form id="image-form" onSubmit={handleSubmit}>
            <input name="image" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
            <input type="submit" value="Upload" />
          </form>
        </div>
        <div className="btn-box">
          <button className="btn">Find your Felon look-alike</button>
        </div>
        <div className="photo-box">
          <div className="image-container">
            <img src="https://www.mugshots.org/post/terry-nunez-mugshot" alt="Felon" />
            <div className="prison-bars"></div>
          </div>
          <h3>Felon Info:</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
