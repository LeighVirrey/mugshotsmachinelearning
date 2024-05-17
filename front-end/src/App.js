import './App.css';
import axios from "axios";
import { useState } from 'react';

function App() {
  const [state, setState] = useState({selectedFile: null});
  const [image, setImage] = useState("")

  const fileSelectedHandler = event => {
    setState({selectedFile: event.target.files[0]})
    // setImage(event.target.files[0])

    var fr = new FileReader();
    fr.onload = function(){
      setImage(fr.result);
    }
    fr.readAsDataURL(event.target.files[0]);

    console.log("Event: ", event.target.files[0])
  }
  const fileUploadHandler = () => {
    const fd = new FormData();
    console.log(image)

    // Push the image to your back-end

    fd.append('image', state.selectedFile, state.selectedFile.name)
    let url = "url to my back end";

    axios.post('url',fd, {
      onUploadProgress: ProgressEvent => { 
        console.log("Upload Progress: " + Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + "%")
      }
    })
    .then(res => {
      // Update the mugshot image for the user
      // set felon.src = result
      console.log("Response: ", res)
    })


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
          <div >
          <img className="image" src={image} alt="Upload"></img>
          </div>
          <input type="file" onChange={fileSelectedHandler}/>
          {/* <button onClick={fileUploadHandler}>Upload</button> */}
        </div>
        <div className="btn=box">
        <button className="btn">Find your Felon look-alike</button>
        </div>
        <div className="photo-box">
          <div >
          <img className="image" src="https://www.mugshots.org/post/terry-nunez-mugshot" alt="Felon"></img>
          </div>
          <h3>Felon Info:</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
