const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b3llw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("cycleRepair").collection("BookingList");
  const reviewCollection = client.db("cycleRepair").collection("review");
  const adminCollection = client.db("cycleRepair").collection("admin");
  const orderServiceCollection = client.db("cycleRepair").collection("orderService");
  
    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        console.log(booking)
        bookingCollection.insertOne(booking)
        .then(result => {
            console.log(result)
            res.send(result.insertedCount)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('delete this', id)
        bookingCollection.deleteOne({_id: id})
        .then(documents => {
            console.log(documents)
        })
    })

    app.get('/bookings', (req, res) => {
        bookingCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({email: email})
        .toArray((err, admins) => {
            res.send(admins.length > 0);
        })
    })

    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })


    app.post('/addOrderService', (req, res) => {
        const orderService = req.body;
        orderServiceCollection.insertOne(orderService)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    app.get('/getOrderService', (req, res) => {
        // console.log(req.query.email)
        orderServiceCollection.find({email: req.query.email})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

    app.get('/allOrderService', (req, res) => {
        orderServiceCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

});


app.listen(process.env.PORT || port)