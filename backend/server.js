const express=require("express");
const cors=require("cors");
const { request } = require("node:http");

const app=express();

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Devops Dashboard Backend is running");
});

app.get('/deployments',(req,res)=>{
    res.send([
        {status:"Success", time:"2 mins"},
        {status:"Failed", time:"5 mins"}
    ]);
});

app.listen(5000,()=>{
    console.log("Backend running on port 5000");
});