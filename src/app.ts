// server/src/app.ts

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import flash from "express-flash";
import morgan from "morgan";

import routes from "./routes/index";
import config from "./config/config";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const baseUrl = config.AUTH0.BASE_URL;

app.use(morgan("dev"));
app.use(cors({ origin: baseUrl }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

app.use("/api", routes);

app.use(errorHandler);

export default app;
