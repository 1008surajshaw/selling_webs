const express = require("express");
const mongoose = require("mongoose")
const cors = require('cors')
const adminRouter = require("")
const app = express();

app.use(cors())
app.use(express.json());

app.get("/",(req,res) => res.json({
    msg:"ok"
}))
mongoose.connect("mongodb://localhost:27017/courses",{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses"  })

app.listen(3000, () =>console.log('Server running on port 3000'));