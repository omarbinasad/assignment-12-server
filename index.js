const express = require("express");
const { MongoClient } = require("mongodb");

const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// midleware;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.13uxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("assignment_11");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders");
    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting single service");
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
    // Book Confirm
    // app.post("/addOrder", async (req, res) => {
    //   const service = req.body;
    //   console.log("hit the post api", order);

    //   const result = await ordersCollection.insertOne(order);
    //   console.log(result);
    //   res.json(result);
    // });
    app.post("/addOrder", (req, res) => {
      console.log(req.body);
      ordersCollection.insertOne(req.body).then((result) => {
        res.send(result);
      });
    });

    // get my orders
    app.get("/myorders/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
    app.delete("/myorders/:email", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running assignment 11 server");
});
app.listen(port, () => {
  console.log("running assignment 11 on port", port);
});
