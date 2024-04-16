import app from "./app";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import "reflect-metadata";
import { User } from "./entities/User.entity";

dotenv.config();
const PORT = process.env.PORT ?? 5000;

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}!`);
    });
  })
  .catch((error) => console.error(error));
