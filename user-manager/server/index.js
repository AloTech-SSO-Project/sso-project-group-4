const express = require("express");
const methodOverride = require("method-override");
const cors = require("cors");
const authRoute = require("./routes/User");

const app = express();

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET", "DELETE"],
  })
);

// Routes
app.use("/", authRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
