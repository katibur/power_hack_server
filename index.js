const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aqlapfl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const billingCollection = client.db("power_hack").collection("billingList");

    app.use("/login", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "100d",
      });
      res.send({ token });
    });

    app.use("/registration ", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "100d",
      });
      res.send({ token });
    });

    app.post("/add-billing", async (req, res) => {
      const query = req.body;
      console.log(query);
      const result = await billingCollection.insertOne(query);
      res.send(result);
    });

    app.get("/billing-list", async (req, res) => {
      const query = {};
      const billingList = await billingCollection.find(query).toArray();
      res.send(billingList);
    });

    app.put("/update-billing", async (req, res) => {
      const id = req.query.id;
      console.log(id);
      const updatedData = req.body;
      console.log(updatedData);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
          amount: updatedData.amount,
        },
      };
      console.log(filter, updateDoc);
      const result = await billingCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/delete-billing/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      console.log(filter);
      const result = await billingCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("power hack is running");
});

app.listen(port, () => {
  console.log(`power hack running on port: , ${port}`);
});
