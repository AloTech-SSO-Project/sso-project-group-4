const express = require("express");
var cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const port = 3010;

var cors = require("cors");
app.use(cors());

const router = require("./router/index");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);
app.use("/", router);
