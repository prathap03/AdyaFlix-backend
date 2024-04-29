const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors(
    {origin:"*"}
));

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(8000,()=>{
    console.log("app started at http://localhost:8000/")
})