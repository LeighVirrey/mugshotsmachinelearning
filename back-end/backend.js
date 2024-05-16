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

app.get('/', async (req, res) => {
    const img = new Image();
    img.src = fs.readFileSync('public/images/robbie.png');
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const face = await net.estimateFaces(canvas);
    res.send(face);

    //This stuff is just for testing, we'll be improving the different end points of the back-end later, I just spent a while doing this.

    //NOTE, I found that if the image type is not correct, then it will not be found. We need to add a check for this later but I'm too lazy to do it now.
})

app.post('/upload', async (req, res) => {
    //req.body.image = null
    //DO THIS LATER
    res.json({message: 'Image uploaded, Similar image:', image: 'http://localhost:9696/images/paulfox.jpg'});//Replace this later with image that is similar, also do the math, also other stuff, blah blah
})

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    net = await facemesh.load();
    console.log('Model loaded');
})

