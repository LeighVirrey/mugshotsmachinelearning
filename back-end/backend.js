import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import fs from 'fs'; //fs is just to test that the model is working and can actually read images
import { Image, createCanvas } from 'canvas';
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors({origin: '*'}));
const port = 9696;
let net = null;

app.get('/', async (req, res) => {
    const img = new Image();
    img.src = fs.readFileSync('paulfox.jpg');
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const face = await net.estimateFaces(canvas);
    res.send(face);

    //This stuff is just for testing, we'll be improving the different end points of the back-end later, I just spent a while doing this.
})

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    net = await facemesh.load();
    console.log('Model loaded');
})

