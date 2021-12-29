const express = require("express");
var methodOverride = require("method-override");

const app = express();
const port = 3000;

var cors = require("cors");
app.use(cors());

const authRoute = require("./routes/User");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET", "DELETE"],
  })
);

app.use("/", authRoute);
