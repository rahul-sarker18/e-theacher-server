const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT ||5000;

//midel waer

app.use(cors());
app.use(express.json());




app.get('/', (req ,res)=>{
    res.send('welcome !!')
})






app.listen(port , ()=>{
    console.log(`server is run in port ${port}`);
})