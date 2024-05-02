const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const dbcongif = require("./config/config");
require("dotenv").config();

const portfolioRoute = require("./routes/portfolioRoute").router;
const AuthRoute = require("./routes/Auth");
app.use("/api/portfolio", portfolioRoute);
app.use("/api/auth", AuthRoute);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
