import express, { response } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
//dotenv.config();
app.use(cors());


// Root
app.get("/", function(request,response){
    response.send("This is the root route.");
});

// Port 8080
app.listen(8080,() => {
    console.log("Running on port 8080");
});