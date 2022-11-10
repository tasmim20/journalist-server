const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.izqajim.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
          const serviceCollection = client.db('journalist').collection('services');
          const reviewCollection = client.db('journalist').collection('reviews');
          app.get('/services', async(req, res) =>{
                const query = {}
                const cursor = serviceCollection.find(query);
                    const services = await cursor.toArray();
                    res.send(services);
            
            
          });
          app.get('/servicesLimit', async(req, res) =>{
                const query = {}
                const cursor = serviceCollection.find(query);
                    const services = await cursor.limit(3).toArray();
                    res.send(services);
            
            
          });

          app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
          });

        // review api
        app.get('/reviews', async (req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // app.get('/reviews/:service', async(req, res) =>{
        //     const service = req.params.service;
        //     const query = {_id: ObjectId(service)};
        //     const reviews = await reviewCollection.findOne(query);
        //     res.send(reviews);
        //   });


        app.post('/reviews', async (req, res) =>{
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.patch('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)}
            const updatedDoc = {
                   $set:{
                    status: status
                   }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
        })

        app.delete('/reviews/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally{

    }

}
run().catch(error => console.error(error))


app.get('/', (req, res) =>{
    res.send('journalist server side is running')
})

app.listen(port , () =>{
    console.log(`journalist server site is running on ${port}`)
})