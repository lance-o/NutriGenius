document.addEventListener("DOMContentLoaded", () => {
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
    });
});
