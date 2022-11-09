const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

//midel waer
app.use(cors());
app.use(express.json());

 function jottoken(req, res, next) {
  const authtoken = req.headers.authorizitan;
 

  if (!authtoken) {
    return res.status(401).send({ message: "user ont found" });
  }
  const token = authtoken.split(" ")[1];
  jwt.verify(token, process.env.JOT_TOKEN, function (error, decoded) {
    if (error) {
      return res.status(403).send({ message: " Forbidden" });
    }
    req.decoded = decoded;
    next();
  });
}

// mongodb atlast conected

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.rd0mbf3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const createdb = client.db("freeeservices").collection("searvices");
    const revewdb = client.db("freeeservices").collection("review");

    //jwt token used

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JOT_TOKEN, { expiresIn: "12h" });
      res.send({ token });
    });

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

    //services add
    app.post("/searvices", async (req, res) => {
      const information = req.body;
      const result = await createdb.insertOne(information);
      res.send(result);
    });

    // post all review
    app.post("/review", async (req, res) => {
      const reviewitem = {
        ...req.body,
        date: new Date(),
      };
      const result = await revewdb.insertOne(reviewitem);
      res.send(result);
    });
    //post catogury data
    app.get("/review/:ids", async (req, res) => {
      const ids = req.params.ids;
      const query = { id: ids };
      const curture = revewdb.find(query).sort({ date: -1 });
      const result = await curture.toArray();
      res.send(result);
    });

    //email in veryfy
    app.get("/review", jottoken, async (req, res) => {
      const decoded = req.decoded;



      // const emails = req.query.email;
      // const query = { email: emails };
      // const curture = revewdb.find(query).sort({ date: -1 });
      // const result = await curture.toArray();
      // res.send(result);

      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const curture = revewdb.find(query).sort({ date: -1 });
      const result = await curture.toArray();
      res.send(result);
    });

    // delete oparations review
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await revewdb.deleteOne(query);
      res.send(result);
    });

    //edite reviews
    app.put("/review/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const texts = req.body;
      const option = { upsert: true };
      const updaterev = {
        $set: {
          text: texts.text,
        },
      };
   
      const result = await revewdb.updateOne(filter, updaterev, option);
      res.send(result);
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