document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const meal_planner_container = document.getElementById("meal-planner");

  let selectedSex = "";
  let selectedActivity = "";

  const serverHost = "https://nutrigenius.onrender.com";
const serverResources = `${serverHost}/resources/`;

async function fetchMeals(){
    const result = await fetch(`${serverHost}/meals`);
    const meals = await result.json();
    return meals;
}

async function filterMeals(meal_type){
    let result = await fetch(`${serverHost}/mealquery`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({meal_type}),
    });
    let meals = await result.json();
    return meals;
}

function getImageURL(meal){
    return `${serverResources}${meal}.png`;
}

function getServer(){
    return serverHost;
}


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

  function makeMealPlanner(){
    for(let i = 0; i < 3; i++){
      makeMealPlan(i);
    }
  }

  async function makeMealPlan(meal_id){
    meal_planner_container.innerHTML = '';
    const mealname = document.createElement('h1');
    const calories = document.createElement('p');
    const ingredients = document.createElement('p');
    const image = document.createElement('img');

    mealname.classList.add("mealname");
    calories.classList.add("calories");
    ingredients.classList.add("ingredients");
    image.classList.add("mealimage");

    const meals = await fetchMeals();

    image.src = getImageURL(meals[meal_id].meal_type);
    image.style.width = "100px";

    mealname.textContent = meals[meal_id].meal_name;
    calories.textContent = meals[meal_id].total_calories;
    //ingredients.textContent = meals[meal_id];
    //image.textContent = meals[meal_id];
    //console.log(meals);



    //content.textContent = "i am being added from javascript";
    //content.style.color = "black";
    meal_planner_container.appendChild(image);
    meal_planner_container.appendChild(mealname);
    meal_planner_container.appendChild(calories);
  }
});
