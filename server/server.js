import express, { response } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
dotenv.config();
app.use(cors());

// Get database
const db = new pg.Pool({
    connectionString: process.env.DATABASE_CONNECTION,
});

// Root
app.get("/", function(request,response){
    response.send("This is the root route.");
});

// Query to find specific user by id
app.post("/mealquery", async function (request,response){
    console.log("request.body", request.body.meal_type);
    if(request.body.meal_type == "any" || request.body.meal_type == "all"){
        const result = await db.query(`SELECT * FROM mealplans`);
        response.json(result.rows);
    }
    else{
        const result = await db.query(`SELECT * FROM mealplans WHERE meal_type='${request.body.meal_type}'`);
        response.json(result.rows);
    }
});

// Query to find specific user by id
app.get("/meals", async function (request,response){
    const result = await db.query(`SELECT * FROM mealplans`);
    response.json(result.rows);
});


// Port 8080
app.listen(8080,() => {
    console.log("Running on port 8080");
});