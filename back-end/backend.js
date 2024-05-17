import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import fs from 'fs'; //fs is just to test that the model is working and can actually read images
import multer from 'multer';
import { Image, createCanvas } from 'canvas';
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors({origin: '*'}));
app.use(express.static('./public'));
const port = 9696;
let net = null;
const img = new Image();

app.get('/', async (req, res) => {
    res.send('hi');
})

app.post('/upload', async (req, res) => {
    img.src = fs.readFileSync('public/images/paulfox.jpg'); //this would contain whatever image is uploaded, for now it's just a test image
    let face = await net.estimateFaces(createCanvasFromImage());
    //we would probably do the math in this section to or a call to another function to do the math so that when we find the most similar mugshot, we can return it to the front end as quick as they called it


    res.json({message: 'Image uploaded, Similar image:', image: 'http://localhost:9696/images/paulfox.jpg', dataTest: face});//Replace this later with image that is similar, also do the math, also other stuff, blah blah
})

app.get('/getImage', async (req, res) => {
    res.json({image: 'http://localhost:9696/images/robbie.png'})
})

function createCanvasFromImage(){
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    return canvas;
}

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    net = await facemesh.load();
    console.log('Model loaded');
})

// stuff to get data from Face Landmarks values
// img.src = fs.readFileSync('public/images/paulfox.jpg');
// const canvas = createCanvas(img.width, img.height);
// const ctx = canvas.getContext('2d');
// ctx.drawImage(img, 0, 0, img.width, img.height);
// let face = await net.estimateFaces(createCanvasFromImage());
// the face variable has all the data we need to do the math to find the most similar mugshot
