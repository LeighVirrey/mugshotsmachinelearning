import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [imgFile, setImgFile] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [mugShot, setMugShot] = useState('');

  // This runs every time the user selects an image (but before uploading it)
  const handleFileChange = (event) => {
    console.log("Handling file change");
    const file = event.target.files[0];
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const imageUploadUrl = "http://localhost:9696/upload";
  const imageGetUrl = "http://localhost:9696/getImage";

  // This is called when the user clicks "upload"
  const handleSubmit = (event) => {
    console.log("Handling submission");
    event.preventDefault();
    // Form data is created and the image is added to it
    const formData = new FormData();
    formData.append('image', imgFile);
    console.log(formData.get('image'));

    // This post sends the form data with the image to the server for calculations to be run
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

  // This function is called when the user clicks "Find your Felon look-alike"
  function getImage() {
    // This just asks the server for the photo 
    axios.get(imageGetUrl)
      .then((response) => {
        // Use the URL of the photo that is given from the server and display it to the user
        setMugShot(response.data.image);
        // console.log(mugShot);
        console.log(response);
      })
      .catch((error) => {
        console.log("There was an error");
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
            <img className='preview-image' id="img-preview" src={imgPreview} alt="Upload your photo" />
            <div className="prison-bars"></div>
          </div>
          <form id='image-form' onSubmit={handleSubmit}>
            <input name="image" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
            <input type="submit" value="Upload" />
          </form>
        </div>
        <div className="btn-box">
          <button className="btn" onClick={getImage}>Find your Felon look-alike</button>
        </div>
        <div className="photo-box">
          <div className="image-container">
            <img className='preview-image' id='felon-mugshot' src={mugShot} alt="Felon" />
            <div className="prison-bars"></div>
          </div>
          <h3>Felon Info:</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
