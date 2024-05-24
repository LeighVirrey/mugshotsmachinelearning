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

        img.src = fs.readFileSync('public/images/userPhoto.jpg');
        let face = await net.estimateFaces(createCanvasFromImage());
        res.json({image: 'http://localhost:9696/images/userPhoto.jpg', data: face});
        fs.unlinkSync('public/images/userPhoto.jpg');
    }else{
        res.send('No image uploaded, upload an image by calling /upload first');
    }
})

function WackMath(face){
    //console.log(face)
    console.log("Running Wack Math");
    let keyNumbers = [];
    Object.keys(face).forEach((key) => {
        //console.log(key)
        let keyArray = [];
        face[key].forEach((point) => {
            //console.log(point);
            let numbersAdded = point[0] + point[1] + point[2];
            keyArray.push(numbersAdded);
        })
        keyNumbers.push(keyArray.reduce((a, b) => a + b, 0) / keyArray.length);
    })
    //console.log(keyNumbers);
    let total = keyNumbers.reduce((a, b) => a + b, 0);
    console.log(total);
    //here's this math, takes each point and adds them up, then gets the average in the Key, then adds up the averages from each key.
}

function attemptMath(face){
    console.log("Running Attempt Math");
    let keyNumbers = [];
    Object.keys(face).forEach((key) => {
        let keyArray = [];
        face[key].forEach((point) => {
            let numbersAdded = point[0] + point[1] + point[2];
            keyArray.push(numbersAdded);
        })
        keyNumbers.push(keyArray.reduce((a, b) => a + b, 0) / keyArray.length);
    })
    return keyNumbers;
}

function comparisonMath(face1, face2){
    let keyNumbers1 = attemptMath(face1);
    let keyNumbers2 = attemptMath(face2);
    let total1 = keyNumbers1.reduce((a, b) => a + b, 0);
    let total2 = keyNumbers2.reduce((a, b) => a + b, 0);
    return Math.abs(total1 - total2);
}

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


    //this is just for math testing, remove this later
    img.src = fs.readFileSync(`public/images/MG1.jpg`);
    const mugFace = await net.estimateFaces(createCanvasFromImage());
    //WackMath(mugFace[0].annotations);
    //attemptMath(mugFace[0].annotations);
    //let mugFaceData = attemptMath(mugFace[0].annotations);

    img.src = fs.readFileSync('public/images/userPhoto.jpg');
    let userFace = await net.estimateFaces(createCanvasFromImage());
    if(userFace[0].faceInViewConfidence < 0.9 || !userFace[0]){
        console.log('No face detected');
    }else{
        console.log(comparisonMath(mugFace[0].annotations, userFace[0].annotations));
    }
    //let userFaceData = attemptMath(userFace[0].annotations);
})

// stuff to get data from Face Landmarks values
// img.src = fs.readFileSync('public/images/paulfox.jpg');
// const canvas = createCanvas(img.width, img.height);
// const ctx = canvas.getContext('2d');
// ctx.drawImage(img, 0, 0, img.width, img.height);
// let face = await net.estimateFaces(createCanvasFromImage());
// the face variable has all the data we need to do the math to find the most similar mugshot
