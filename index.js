const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axi3z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const inventoryCollection = client.db("groceryItem").collection("item");

    const itemCollection = client.db("groceryItem").collection("myItem");

    //  Inventory API
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventories = await cursor.toArray();
      res.send(inventories);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await inventoryCollection.findOne(query);
      res.send(inventory);
    });

    // post
    app.post("/inventory", async (req, res) => {
      const newInventory = req.body;
      const result = await inventoryCollection.insertOne(newInventory);
      res.send(result);
    });

    // app.put("/inventory/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const inventory = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updated = {
    //     $set: {
    //       quantity: inventory.quantity,
    //     },
    //   };
    //   const result = await inventoryCollection.updateOne(
    //     filter,
    //     updated,
    //     options
    //   );
    //   res.send(result);
    // });

    // myItems

    app.post("/myItem", async (req, res) => {
      const addItem = req.body;
      const result = await itemCollection.insertOne(addItem);
      res.send(result);
    });

    app.get("/myItem", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const cursor = itemCollection.find(query);
      const myItems = await cursor.toArray();
      res.send(myItems);
    });

    //delete
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("warehouse management running");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
