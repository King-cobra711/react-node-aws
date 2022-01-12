const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// db
mongoose
  .connect(process.env.DATABASE_CLOUD)
  .then(console.log("db connected"))
  .catch((err) => console.log(err));

// import routes
const authenticationRoutes = require("./routes/authentication");
const userRoutes = require("./routes/user");

// app middleswares
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({ origin: process.env.CLIENT_URL }));

// middleware
app.use("/api", authenticationRoutes, userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
