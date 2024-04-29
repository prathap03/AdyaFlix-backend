const express = require("express");
const cors = require("cors");
const app = express();

const userRouter = require("./routers/UserRouter");
const bookingRouter = require("./routers/BookingRouter");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require("mongoose");

app.use(express.json());

app.use(cors(
    {origin:"*"}
));


app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/user",userRouter);
app.use("/booking",bookingRouter);

app.listen(8000,()=>{
    try{
        mongoose.connect(process.env.MONGODB_URI);
        mongoose.connection.on("connected",()=>{
            console.log("connected to mongo");
        });
    }
    catch(err){
        console.log(err);
    }
    console.log("app started at http://localhost:8000/")
})

