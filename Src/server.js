import express from 'express'
import { writeManys } from './write/writeMany.js';
import { manipulate } from './manipulate/manipulataMany.js';
import { streamUsers , loadJsonToMongos ,loadJsonToMongo, deleteUsers } from './query/query.js';
import mongoose from 'mongoose';
const app = express()
const port = 3000
app.use(express.json())

const url ="mongodb+srv://satyam:lL1gwWf7rDWoulQS@cluster0.k7sgg2s.mongodb.net/Big-Data?retryWrites=true&w=majority"
try {
    // await mongoose.connect("mongodb://localhost:27017/BillionRow")
    // console.log("database connected")
    await mongoose.connect(url)
    console.log("database connected")
} catch (err) {
    console.log({msg :  err.message});
}

app.get("/user/stream" , streamUsers);


app.delete("/delete" , deleteUsers)

app.get("/upload" ,async (req , res)=>{
    try {
        const count = await loadJsonToMongo();
        res.status(200).json({msg :"inserting users"});
    } catch (err) {
        res.status(400).json({msg: err.message})
    }
})


app.get('/generateData', (req, res) => {
  try {
    const numberOfWrites = req.query.q;
    writeManys(numberOfWrites);
    res.status(200).json({msg : `Data generated and Time taken`});
  } catch (error) {
    res.status(401).json({msg : err.message});
}
});

app.post('/manipulate', (req, res) => {
   const {keysToRemove , keysToCheck} = req.body;
    try {
        manipulate(keysToRemove, keysToCheck);
        res.status(200).json({msg : "Done"})
    } catch (error) {
        res.status(401).json({msg : err.message});
    }
});






app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})