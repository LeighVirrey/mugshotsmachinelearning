import * as tf from '@tensorflow/tfjs-node';
import * as facemesh from '@tensorflow-models/facemesh';
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors(origin = '*'));
const port = 9696;

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    const model = await loadFacemesh();
    console.log('Facemesh model loaded');
})

