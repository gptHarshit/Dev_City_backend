const express = require("express");

const app = express();

app.use("/",(req,res) => {
    res.send("Hello Harsh!!");
});
app.use("/test",(req,res) => {
    res.send("Hello I am from Test");
});
app.use("/start",(req,res) => {
    res.send("Hello I am From Start!!");
})


app.listen(3000 , () => {
    console.log("Server had created successfully");
});