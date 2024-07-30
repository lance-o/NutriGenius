import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_CONNECTION });

db.query(`CREATE TABLE IF NOT EXISTS mealplans (
  meal_id SERIAL PRIMARY KEY,
  meal_name VARCHAR(20) unique,
  total_calories INT,
  meal_type VARCHAR(10),
  meal_ingredient_names VARCHAR(40) [],
  meal_ingredient_amounts VARCHAR(40)[],
  meal_image_url TEXT
);

INSERT INTO mealplans (meal_name, total_calories, meal_type, meal_ingredient_names, meal_ingredient_amounts, meal_image_url)
VALUES ('Breakfast Meal', 700, 'breakfast', ARRAY['Eggs', 'Bacon Slices', 'Slices of Bread', 'Beans', 'Mushrooms', 'Tomato'], ARRAY['AMT=2', 'AMT=2', 'AMT=1', 'GRAMS=150', 'AMT=1', 'AMT=1'], '');

INSERT INTO mealplans (meal_name, total_calories, meal_type, meal_ingredient_names, meal_ingredient_amounts, meal_image_url)
VALUES ('Lunch Meal', 800, 'Lunch', ARRAY['Diced Chicken', 'Boiled Rice', 'Broccoli', 'Green Peppers', 'Peas'], ARRAY['GRAMS=300', 'GRAMS=300', 'AMT=3', 'AMT=3', 'GRAMS=200'], '');

INSERT INTO mealplans (meal_name, total_calories, meal_type, meal_ingredient_names, meal_ingredient_amounts, meal_image_url)
VALUES ('Dinner Meal', 800, 'Dinner', ARRAY['Steak', 'Onion', 'Rosemary'], ARRAY['GRAMS=155', 'AMT=1', 'GRAMS=30'], '');`);
