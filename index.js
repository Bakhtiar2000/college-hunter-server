const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvsxjlv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const collegesCollection = client.db('collegeHunterDb').collection('colleges')
        const reviewsCollection = client.db('collegeHunterDb').collection('reviews')
        const usersCollection = client.db('collegeHunterDb').collection('users')

        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray()
            res.send(result)
        })

        app.get('/colleges/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const result = await collegesCollection.findOne(filter)
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const updatedUser = req.body
            console.log(updatedUser.newRole)
            const updateDoc = {
                $set: {
                    role: updatedUser.newRole
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally { }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('College hunting has begun')
})

app.listen(port, () => {
    console.log(`college hunter server is running on port: ${port}`)
})
