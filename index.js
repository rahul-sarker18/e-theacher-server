const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT ||5000;

//midel waer

app.use(cors());
app.use(express.json());


// mongodb atlast conected 

//username : all-modul
//password:  YFpNtBkSaE24ELEw




const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://all-modul:YFpNtBkSaE24ELEw@cluster0.rd0mbf3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const createdb = client.db("freeeservices").collection("searvices");
    const revewdb = client.db("freeeservices").collection("review");

    //get all searvices and limit 3
    app.get("/searvices", async (req, res) => {
      const lemet = parseInt(req.query.lemet);
      const query = {};
      const curture = createdb.find(query);
      const result = await curture.limit(lemet).toArray();
      res.send(result);
    });
    // get all searvices  lode
    app.get("/searvices", async (req, res) => {
      const query = {};
      const curture = createdb.find(query);
      const result = await curture.toArray();
      res.send(result);
    });
    // get id and data lode find one
    app.get("/searvices/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await createdb.findOne(query);
      res.send(result);
    });

    // post all review
    app.post("/review", async (req, res) => {
      const reviewitem = {
        ...req.body,
        date: new Date(),
      };
      const result = await revewdb.insertOne(reviewitem);
      res.send(result)
    });
  } finally {
  }
}
  run().catch(console.dir);














app.get('/', (req ,res)=>{
    res.send('welcome !!')
})






app.listen(port , ()=>{
    console.log(`server is run in port ${port}`);
})