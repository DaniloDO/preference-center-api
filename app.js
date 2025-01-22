import express from "express"
import dotenv from "dotenv"

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

app.set("json spaces", 2);

app.get("/", (req, res) => {
    res.status(200).json({message: "Preference Center is running"}); 
});

process.on("SIGINT", () => {
    console.log("Shutting down server"); 
    process.exit(0); 
});

app.listen(port, () => console.log(`Listening on port: ${port}`)); 

