//import
const express = require('express')
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

//cors should not be under in bracket , else it's gonna be wrong
const cors = require("cors");
// dot env import
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhckh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const servicesCollection = database.collection("service");

        //get api            
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        //post api 

        app.post('/services', async (req, res) => {
            // create a document to insert
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //delete api
        app.delete('/services/:id', async (req, res) => {
            const service_id = req.params.id;
            const query = { _id: ObjectId(service_id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


//get 

app.get('/', (req, res) => {
    res.send('Running Genius Server')
})

app.listen(port, () => {
    console.log('Running genius server on', port);
})