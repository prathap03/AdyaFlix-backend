const express = require("express");
const cors = require("cors");
const app = express();

const userRouter = require("./routers/UserRouter");
const bookingRouter = require("./routers/BookingRouter");
const movieRouter = require("./routers/MovieRouter");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require("mongoose");

app.use(express.json());

if(process.env.NODE_ENV !== "production"){
    app.use(cors(
        {origin:"*"}
    ));
}else{
    app.use(cors(
        {origin:"https://adya-flix.vercel.app"}
    ))
}




app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/user",userRouter);
app.use("/booking",bookingRouter);
app.use("/movie",movieRouter);

var port=8000;

if(process.env.NODE_ENV === 'production'){
    port=10000
}

app.listen(port,()=>{
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

