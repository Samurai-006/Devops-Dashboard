const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("DevOps Dashboard Backend Running");
});

app.get("/deployments", (req, res) => {
    res.json([
        { status: "Success", time: "2 min" }
    ]);
});

module.exports = app;