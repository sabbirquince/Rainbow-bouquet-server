const express = require("express");
const app = express();
const port = 4060 || process.env.PORT;
var cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
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

  app.post("/addService", (req, res) => {
    const serviceInfo = req.body;
    console.log(serviceInfo);

    servicesCollection
      .insertOne(serviceInfo)
      .then((result) => res.send(result.insertedCount > 0));
  });
});

app.listen(port);
