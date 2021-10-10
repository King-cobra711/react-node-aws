const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// import routes
const authenticationRoutes = require("./routes/authentication");

// app middleswares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
// app.use(cors({ origin: process.env.CLIENT_URL }));

// middleware
app.use("/api", authenticationRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
