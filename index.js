const express = require("express");
const app = express();
const port = process.env.PORT || 4060;
var cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const { response } = require("express");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyzsc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const ObjectId = require("mongodb").ObjectID;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const servicesCollection = client
    .db("rainbow-bouquet")
    .collection("services");
  const orderCollection = client.db("rainbow-bouquet").collection("orders");
  const reviewsCollection = client.db("rainbow-bouquet").collection("reviews");
  const adminCollection = client.db("rainbow-bouquet").collection("admins");

  app.post("/addService", (req, res) => {
    const serviceInfo = req.body;

    servicesCollection
      .insertOne(serviceInfo)
      .then((result) => res.send(result.insertedCount > 0));
  });

  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.post("/makeAdmin", (req, res) => {
    const admin = req.body;
    adminCollection
      .insertOne(admin)
      .then((response) => res.send(response.insertedCount > 0));
  });

  app.delete("/deleteService", (req, res) => {
    const id = req.query.id;
    servicesCollection
      .deleteOne({ _id: ObjectId(id) })
      .then((result) => res.send(result.deletedCount > 0));
  });

  app.get("/adminCheck", (req, res) => {
    const email = req.query.email;

    adminCollection
      .find({ email })
      .count()
      .then((result) => res.send(result > 0));
  });

  app.post("/bookService", (req, res) => {
    const data = req.body;
    console.log(data);

    orderCollection
      .insertOne(data)
      .then((result) => res.send(result.insertedCount > 0));
  });

  app.get("/getService", (req, res) => {
    const id = req.query.id;
    servicesCollection.find({ _id: ObjectId(id) }).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.get("/orderLists", (req, res) => {
    orderCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.patch("/setStatus", (req, res) => {
    const { _id, status } = req.body;

    orderCollection
      .updateOne({ _id: ObjectId(_id) }, { $set: { status } })
      .then((result) => res.send(result.modifiedCount > 0));
  });

  app.get("/myOrders", (req, res) => {
    const email = req.query.email;

    orderCollection.find({ email }).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.post("/addReview", (req, res) => {
    const review = req.body;

    console.log(review);
    reviewsCollection
      .insertOne(review)
      .then((result) => res.send(result.insertedCount > 0));
  });

  app.get("/reviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });
});

app.listen(port);
