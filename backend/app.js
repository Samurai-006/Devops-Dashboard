const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("DevOps Dashboard Backend Running");
});

let deployments = [
  { id: 1, status: "Success", time: "2 min" },
  { id: 2, status: "Failed", time: "5 min" },
  { id: 3, status: "Success", time: "3 min" }
];

app.get("/deployments", (req, res) => {
  res.json(deployments);
});

app.post("/deploy", (req, res) => {

  const newDeployment = {
    id: deployments.length + 1,
    status: "Running",
    time: "-"
  };

  deployments.push(newDeployment);

  res.json({ message: "Deployment started" });
});

app.get("/logs", (req, res) => {

  const logs = [
    "Installing dependencies...",
    "Running tests...",
    "Building Docker image...",
    "Deployment successful"
  ];

  res.json(logs);
});

app.get("/health", (req, res) => {

  res.json({
    backend: "Running",
    database: "Connected",
    frontend: "Running"
  });

});

module.exports = app;