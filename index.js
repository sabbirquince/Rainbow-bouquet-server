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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const servicesCollection = client
    .db("rainbow-bouquet")
    .collection("services");
  const orderCollection = client.db("rainbow-bouquet").collection("services");
  const reviewsCollection = client.db("rainbow-bouquet").collection("reviews");
  const adminCollection = client.db("rainbow-bouquet").collection("admins");

  app.post("/addService", (req, res) => {
    const serviceInfo = req.body;
    console.log(serviceInfo);

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
});

app.listen(port);
