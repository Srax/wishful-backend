import app from "./app";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import "reflect-metadata";
import { User } from "./entity/User.entity";

dotenv.config();
const PORT = process.env.PORT ?? 5000;

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}!`);
    });
    // const user = new User("john@doe.com", "password1234", "John", "Doe");
    // await AppDataSource.manager.save(user);
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);
    console.log("Data source has been initialized!");
  })
  .catch((error) => console.error(error));
