const serverHost = "https://nutrigenius.onrender.com";
const serverResources = `${serverHost}/resources/`;

async function fetchMeals(){
    const result = await fetch(`${serverHost}/meals`);
    const meals = await result.json();
    console.log(meals);
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
