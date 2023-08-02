const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const errorHandler = require("./middlewares/error-handler");

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
