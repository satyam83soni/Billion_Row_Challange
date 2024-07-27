import express from 'express'
import { writeManys } from './write/writeMany.js';
import { manipulate } from './manipulate/manipulataMany.js';
import { streamUsers , loadJsonToMongo , deleteUsers } from './query/query.js';
import mongoose from 'mongoose';
const app = express()
const port = 3000
app.use(express.json())


try {
    await mongoose.connect("mongodb://localhost:27017/BillionRow")
    console.log("database connected")
} catch (err) {
    console.log({msg :  err.message});
}

app.get("/user/stream" , streamUsers);


app.delete("/delete" , deleteUsers)

app.get("/upload" , (req , res)=>{
    try {
        console.time("start");
        const count= loadJsonToMongo();
        console.timeEnd("start")
        res.status(200).json({msg : `finished inserting ${count} users`});
    } catch (err) {
        res.status(400).json({msg: err.message})
    }
})


app.get('/generateData', (req, res) => {
  try {
    const numberOfWrites = req.query.q;
    console.time("start")
    writeManys(numberOfWrites);
    const time = console.timeEnd("start");
    res.status(200).json({msg : `Data generated and Time taken: ${time}`});
  } catch (error) {
    res.status(401).json({msg : err.message});
}
});

app.get('/manipulate', (req, res) => {
    try {
        console.time("start")
        manipulate("john", "name");
        const time = console.time("start") 
        res.status(200).json({msg : `Time taken: ${time}`})
    } catch (error) {
        res.status(401).json({msg : err.message});
    }
});


app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})