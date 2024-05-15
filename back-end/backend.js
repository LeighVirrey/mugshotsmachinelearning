import * as tf from '@tensorflow/tfjs-node';
const facemesh = require('@tensorflow-models/facemesh');
require('@tensorflow/tfjs-backend-wasm');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors(origin = '*'));
const port = 9696;

async function loadFacemesh() {
    const model = await facemesh.load();
    return model;
}

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    console.log('Facemesh model loaded');
})

