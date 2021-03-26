const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;


const password = "c.qQcuH.Cp43B8H";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://organicUser:c.qQcuH.Cp43B8H@cluster0.5okrn.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get("/products", (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
              // For data update.
  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log('one product inserted successfully');
      res.redirect('/');
    })
  })
    console.log('Database connection established');


  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0);
    })
    
  })


    app.delete('/delete/:id', (req, res) => {
      productCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then((result) => {
        res.send(result.deletedCount > 0);
      })
    })
  
});



app.listen(3000);