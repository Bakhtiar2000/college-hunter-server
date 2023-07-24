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
        const myCollegesCollection = client.db('collegeHunterDb').collection('myColleges')

        // Colleges API
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

        // Reviews API
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body
            console.log(review)
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })

        // Users API
        app.post('/users', async (req, res) => {
            const user = req.body
            const query= {email: user.email}
            const existingUser= await usersCollection.findOne(query)

            console.log('existing user', existingUser)
            if(existingUser) return res.send({ message: 'User already exists' })

            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const email = req.query.email
            console.log(email)
            const query = { email: email };
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })

        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const updatedUser = req.body
            console.log(updatedUser)
            const updateDoc = {
                $set: {
                    email: updatedUser.email,
                    name: updatedUser.name,
                    address: updatedUser.address,
                    university: updatedUser.university,
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // My Colleges API
        app.post('/myColleges', async (req, res) => {
            const college = req.body
            console.log(college)
            const result = await myCollegesCollection.insertOne(college)
            res.send(result)
        })

        app.get('/myColleges', async (req, res) => {
            const email = req.query.email
            console.log(email)
            const query = { email: email };
            const result = await myCollegesCollection.find(query).toArray()
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
