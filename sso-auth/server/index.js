const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./router/index");

const app = express();

const port = 3010;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", router);

// Server start
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
