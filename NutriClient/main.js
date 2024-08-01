import { fetchMeals, filterMeals, getImageURL, getServer  } from "./serverquery.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const meal_planner_container = document.getElementById("meal-planner");

  let selectedSex = "";
  let selectedActivity = "";

  function caloriesCounter(weight, sex, height, activity) {
    // Factors for sex and activity
    const sexFactor = { male: 1, female: 0.7 };
    const activityFactor = { low: 1, medium: 1.2, high: 1.4 };

    // Calculate calories
    let cals =
      (10 * weight + 6 * height) * sexFactor[sex] * activityFactor[activity];
    return cals;
  }

  function handleDropdownSelection(dropdownId, buttonId) {
    const dropdown = document.getElementById(dropdownId);
    const button = document.getElementById(buttonId);

    dropdown.addEventListener("click", (event) => {
      const target = event.target;

      if (target && target.hasAttribute("data-value")) {
        button.textContent = target.textContent;

        if (dropdownId === "sex_dropdown") {
          selectedSex = target.getAttribute("data-value").toLowerCase();
        } else if (dropdownId === "activity_dropdown") {
          selectedActivity = target.getAttribute("data-value").toLowerCase();
        }
      }
    });
  }

  handleDropdownSelection("sex_dropdown", "sex_btn");
  handleDropdownSelection("activity_dropdown", "activity_btn");

  function handleFormSubmit() {
    const weightInput = document.getElementById("weight_input").value.trim();
    const heightInput = document.getElementById("height_input").value.trim();

    const weight = Number(weightInput);
    const height = Number(heightInput);

    if (Number.isFinite(weight) && Number.isFinite(height)) {
      let formValues = {
        weight: weight,
        height: height,
        sex: selectedSex,
        activity: selectedActivity,
      };

      console.log(formValues);

      let calories = caloriesCounter(
        weight,
        selectedSex,
        height,
        selectedActivity
      );

      if (calories !== null) {
        document.getElementById("calorie-value").textContent =
          calories.toFixed(2);
        console.log(calories);
      } else {
        document.getElementById("calorie-value").textContent = "Invalid input";
      }

      document.getElementById("weight_input").value = "";
      document.getElementById("height_input").value = "";
      document.getElementById("sex_btn").textContent = "Sex:";
      document.getElementById("activity_btn").textContent = "Activity:";
  
    } else {
      alert("Please enter valid numbers for weight and height.");
    }
  }

  document
    .getElementById("submit_button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      handleFormSubmit();
      if(document.getElementById("calorie-value").textContent != "NaN"){
        makeMealPlanner();
      }
      
    });

  async function getCalorieMultiplier(){
    const meals = await fetchMeals();
    let calorieMultiplier = 1.0;
    let totalCalories = 0;
    for(let i = 0; i < 3; i++){
      totalCalories += meals[i].total_calories;
    }

    calorieMultiplier = document.getElementById("calorie-value").textContent / totalCalories;

    return calorieMultiplier;
  }

  
  async function makeMealPlanner(){
     // Empty every time calories is calculated
     meal_planner_container.innerHTML = '';
    let calorieMultiplier = await getCalorieMultiplier();
    const breakfast = await filterMeals("Breakfast");
    const lunch = await filterMeals("Lunch");
    const dinner = await filterMeals("Dinner");
    makeMealPlan(breakfast, 0, calorieMultiplier);
    makeMealPlan(lunch, 0, calorieMultiplier);
    makeMealPlan(dinner, 0, calorieMultiplier);
  }

  async function makeMealPlan(meals ,meal_id, calorieMultiplier){
  

    // Declare elements
    const div= document.createElement('div');
    const mealname = document.createElement('h1');
    const calories = document.createElement('p');
    const ingredientcontainer = document.createElement('div');
    const image = document.createElement('img');

    // Declare classes
    mealname.classList.add("mealname");
    div.classList.add ("meal_plan");
    ingredientcontainer.classList.add("ingredientcontainer");
    calories.classList.add("calories");
    image.classList.add("mealimage");

    // Get image url from server
    image.src = getImageURL(meals[meal_id].meal_type);

    mealname.textContent = meals[meal_id].meal_name;

    // NOTE: Defaults to base calories
    let newcalories = parseInt(meals[meal_id].total_calories) * calorieMultiplier;
    calories.textContent = `Calories: ${Math.floor(newcalories)}`;

    div.appendChild(image);
    div.appendChild(mealname);

    for(let i = 0; i<meals[meal_id].meal_ingredient_names.length;i++){
      const ingredient = document.createElement('p');
      ingredient.classList.add("ingredients");

      if(!meals[meal_id].meal_ingredient_amounts[i].search("AMT="))
      {
        let amount = parseInt(meals[meal_id].meal_ingredient_amounts[i].replaceAll("AMT=", "")) * calorieMultiplier;
        ingredient.textContent = `${Math.floor(amount)}`;
        ingredient.textContent += ` ${meals[meal_id].meal_ingredient_names[i]}.`;
      }
      else if(!meals[meal_id].meal_ingredient_amounts[i].search("GRAMS=")){
        let amount = parseInt(meals[meal_id].meal_ingredient_amounts[i].replaceAll("GRAMS=", "")) * calorieMultiplier;
        ingredient.textContent = `${meals[meal_id].meal_ingredient_names[i]}:`;
        ingredient.textContent += ` ${Math.floor(amount)} grams.`;
      }

      const newline = document.createElement('br');
      ingredientcontainer.appendChild(ingredient);
      ingredientcontainer.appendChild(newline);
    }

    div.appendChild(ingredientcontainer);
    div.appendChild(calories);
    meal_planner_container.appendChild(div);
  }
});
