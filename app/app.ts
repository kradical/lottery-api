import express from "express";
import bodyParser from "body-parser";

import routes from "./routes";
import error from "./controllers/error";

// Create Express App
const app = express();

app.use(bodyParser.json());

// Routes
app.use("/", routes);

app.use(error);

export default app;
