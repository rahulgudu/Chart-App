import express from "express";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000
app.get("/", (req, res) => {
    res.send("<h1>App is healthy</h1>")
})

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})