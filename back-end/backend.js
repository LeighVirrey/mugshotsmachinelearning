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
let img = new Image();

app.get('/', async (req, res) => {
    res.send('hi');
})

let storage = multer.diskStorage({
    destination : "./public/images",
    filename: function (req, file, cb) {
        cb(null, "userPhoto.jpg")
    }
})

let upload = multer({ storage: storage }).single('image');

app.post('/upload', async (req, res) => {
    if (fs.existsSync('public/images/userPhoto.jpg')){
        fs.unlinkSync('public/images/userPhoto.jpg');
    }
    upload(req, res, function(err){
        if (err){
            return res.send(err);
        }
        res.send("File is uploaded");
    })
    // img.src = fs.readFileSync('public/images/paulfox.jpg'); //this would contain whatever image is uploaded, for now it's just a test image
    // let face = await net.estimateFaces(createCanvasFromImage());
    // res.json({message: 'Image uploaded, Similar image:', image: 'http://localhost:9696/images/paulfox.jpg', dataTest: face});//Replace this later with image that is similar, also do the math, also other stuff, blah blah
})

app.get('/getImage', async (req, res) => {
    //this is where the big math will be, once the front-end calls for this then we run the comparison math and return an image with the least amount of differences
    if(fs.existsSync('public/images/userPhoto.jpg')){
        //img.onload = async () => {return};


        img.src = fs.readFileSync(`public/images/MG1.jpg`);
        const mugFace = await net.estimateFaces(createCanvasFromImage());
        //console.log ( JSON.stringify(mugFace[0].annotations));
        res.json(mugFace[0].annotations);
        mugFace[0].annotations.forEach((annotation) => {

        });


        img.src = fs.readFileSync('public/images/userPhoto.jpg');
        let face = await net.estimateFaces(createCanvasFromImage());
        res.json({image: 'http://localhost:9696/images/userPhoto.jpg', data: face});
        fs.unlinkSync('public/images/userPhoto.jpg');
    }else{
        res.send('No image uploaded, upload an image by calling /upload first');
    }
})

function createCanvasFromImage(){
    const canvas =  createCanvas(img.width, img.height);
    const ctx =  canvas.getContext('2d');
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
