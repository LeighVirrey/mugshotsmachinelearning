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
let img = null;

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
        let userFace = await net.estimateFaces(createCanvasFromImage());
        if (userFace.length !== 0) {
            //the asyncronousity of img.src sucks
            console.log('math start')
            let mostSimilarMugshot = await findMostSimilarMugshot(userFace);
            console.log('math end');
            res.json({image: mostSimilarMugshot});
        }else{
            res.send({error: 'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png'});
        }
        fs.unlinkSync('public/images/userPhoto.jpg');
    }else{
        res.send('No image uploaded, upload an image by calling /upload first');
    }
})

//notes on math for presentation, for some reason Mugshot 43 was the one being hit the most, so I've opted to remove him and save him in my folders for later presenting

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
    //Don't even take this one seriously, I made it when I was tired and I didn't even use it because I came up with a better one right after
}

// function calculateCentroid(annotation) {
//     let centroid = [0, 0, 0];
//     annotation.forEach((point) => {
//         centroid[0] += point[0];
//         centroid[1] += point[1];
//         centroid[2] += point[2];
//     })
//     centroid = centroid.map(val => val / annotation.length);
//     return centroid;
// }

// function attemptMath(face){
//     let keyNumbers = [];
//     Object.keys(face).forEach((key) => {
//         let keyArray = [];
//         face[key].forEach((point) => {
//             let numbersAdded = point[0] + point[1] + point[2];
//             keyArray.push(numbersAdded);
//         })
//         keyNumbers.push(keyArray.reduce((a, b) => a + b, 0) / keyArray.length);
//     })
//     return keyNumbers;
// }
// function comparisonMath(face1, face2){
//     let totalDifference = 0;
//     Object.keys(face1).forEach((key) => {
//         let centroid1 = calculateCentroid(face1[key]);
//         let centroid2 = calculateCentroid(face2[key]);
//         let difference = Math.abs(centroid1[0] - centroid2[0]) + Math.abs(centroid1[1] - centroid2[1]) + Math.abs(centroid1[2] - centroid2[2]);
//         totalDifference += difference;
//     });
//     return totalDifference;
//     //CENTROID MATH
// }


// function comparisonMath(face1, face2){
//     let keyNumbers1 = attemptMath(face1);
//     let keyNumbers2 = attemptMath(face2);
//     let total1 = keyNumbers1.reduce((a, b) => a + b, 0);
//     let total2 = keyNumbers2.reduce((a, b) => a + b, 0);
//     return Math.abs(total1 - total2);
//     //AVERAGE MATH
// }

// async function findMostSimilarMugshot(userFace) {
//     let minDifference = Infinity;
//     let mostSimilarMugshotIndex = -1;

//     for (let i = 1; i <= 60; i++) {
//         img.src = fs.readFileSync(`public/images/Mugshots/${i}.png`);
//         const mugFace = await net.estimateFaces(createCanvasFromImage());

//         if (mugFace[0] && mugFace[0].faceInViewConfidence >= 0.9) {
//             let difference = comparisonMath(userFace[0].annotations, mugFace[0].annotations);

//             if (difference < minDifference) {
//                 minDifference = difference;
//                 mostSimilarMugshotIndex = i;
//             }
//         }
//     }
//     //average MATH
//     return mostSimilarMugshotIndex !== -1 ? `http://localhost:9696/images/Mugshots/${mostSimilarMugshotIndex}.png` : null;
// }

function calculateCentroid(annotation) {
    let centroid = [0, 0, 0];
    annotation.forEach((point) => {
        centroid[0] += point[0];
        centroid[1] += point[1];
        centroid[2] += point[2];
    })
    centroid = centroid.map(val => val / annotation.length);
    return centroid;
    //Euclidian
}

function euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
    //Euclidian
}

function comparisonMath(face1, face2){
    let totalDifference = 0;
    Object.keys(face1).forEach((key) => {
        let centroid1 = calculateCentroid(face1[key]);
        let centroid2 = calculateCentroid(face2[key]);
        let difference = euclideanDistance(centroid1, centroid2);
        totalDifference += difference;
    });
    return totalDifference;
    //Euclidian I won't lie to you, the previous math kept return mugshot43 for multiple userPhotos so I asked copilot for help on this one.
    //It seems the Euclidian math is the most accurate I can get it now, and it still returns mugshot43 for some reason, which means it's 43's problem and his face it just too dang old, probably from the beard.
}


async function findMostSimilarMugshot(userFace) {
    let minDifference = Infinity;
    let mostSimilarMugshotIndex = -1;

    for (let i = 1; i <= 59; i++) {
        img.src = fs.readFileSync(`public/images/Mugshots/${i}.png`);
        const mugFace = await net.estimateFaces(createCanvasFromImage());

        if (mugFace[0] && mugFace[0].faceInViewConfidence >= 0.9) {
            let difference = comparisonMath(userFace[0].annotations, mugFace[0].annotations);

            if (difference < minDifference) {
                minDifference = difference;
                mostSimilarMugshotIndex = i;
            }
        }
    }

    return mostSimilarMugshotIndex !== -1 ? `http://localhost:9696/images/Mugshots/${mostSimilarMugshotIndex}.png` : null;
 //Euclidian
}

function createCanvasFromImage(){
    let canvas =  createCanvas(img.width, img.height);
    let ctx =  canvas.getContext('2d');
     ctx.drawImage(img, 0, 0, img.width, img.height);
    return canvas;
}


app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    console.log('Loading model, PLEASE WAIT FOR THE MODEL TO BE LOADED BEFORE DOING ANYTHING ELSE. If the model is not loading, restart the server');
    net = await facemesh.load();
    console.log('Model loaded');
    img = new Image();


    //this is just for math testing, remove this later
    // img.src = fs.readFileSync(`public/images/Mugshots/1.png`);
    // const mugFace = await net.estimateFaces(createCanvasFromImage());
    //WackMath(mugFace[0].annotations);
    //attemptMath(mugFace[0].annotations);
    //let mugFaceData = attemptMath(mugFace[0].annotations);

    // img.src = fs.readFileSync('public/images/userPhoto.jpg');
    // let userFace = await net.estimateFaces(createCanvasFromImage());
    // if(userFace[0].faceInViewConfidence < 0.9 || !userFace[0]){
    //     console.log('No face detected');
    // }else{
    //     console.log(comparisonMath(mugFace[0].annotations, userFace[0].annotations));
    // }
    // img.src = fs.readFileSync('public/images/Mugshots/43.png');
    // let mugFace = await net.estimateFaces(createCanvasFromImage());
    // img.src = fs.readFileSync('public/images/userPhoto.jpg');
    // let userFace = await net.estimateFaces(createCanvasFromImage());
    // console.log(comparisonMath(mugFace[0].annotations,userFace[0].annotations));
})

