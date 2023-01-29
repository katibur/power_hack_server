const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aqlapfl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const billingCollection = client.db("power_hack").collection("billingList");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      res.send({ token });
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
