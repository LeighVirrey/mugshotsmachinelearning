import * as tf from '@tensorflow/tfjs-node';
import * as facemesh from '@tensorflow-models/facemesh';

const loadFacemesh = async () => {
    const model = await facemesh.load();
    return model;
}

