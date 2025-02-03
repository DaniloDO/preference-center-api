import express from "express";
import dotenv from "dotenv"; 
import postgreClient from "./src/database/config/postgreClient.js";
import UserRepository from "./src/repositories/usersRepository.js";
import userRouter from "./src/routes/usersRoutes.js";

const app = express();
const environment = process.env.NODE_ENV || "development"; 

dotenv.config({path: `.${environment}.env`});
console.log(`environment: ${environment}`);

const port = process.env.PORT || 3000; 

postgreClient;

const userRepository = new UserRepository(postgreClient); 

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use("/users", userRouter); 

app.set("json spaces", 2);

app.get("/", (req, res) => {
    res.status(200).json({message: "Preference Center is running"}); 
});

process.on("SIGINT", async () => {
    await postgreClient.closeConnection(); 
    console.log("Shutting down server"); 
    process.exit(0); 
});

app.listen(port, () => console.log(`Listening on port: ${port}`)); 

