import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://EmergingPro:Felons@cluster19.wmdm3xt.mongodb.net/'

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.DAL = {
    async getAll(){
        const db = client.db('EmergingPro');
        const collection = db.collection('Images');
        return await collection.find().toArray();
    },
    async insertOne(imageUrl){
        const db = client.db('EmergingPro');
        const collection = db.collection('Images');
        return await collection.insertOne(data);
    },
    async updateWithData(imageUrl, data){
        const db = client.db('EmergingPro');
        const collection = db.collection('Images');
        return await collection.updateOne({imageUrl: imageUrl}, {$set: {data: data}});
    }
}