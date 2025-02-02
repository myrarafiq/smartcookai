const fetch = require('node-fetch');
const fs = require('fs');

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const allMeals = [];

const fetchMeals = async () => {
    for (const letter of alphabet) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();
        if (data.meals) {
            allMeals.push(...data.meals);
        }
    }
    console.log(`Fetched ${allMeals.length} meals.`);
    processMeals(allMeals);
};

const processMeals = (meals) => {
    const processedMeals = meals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory,
        area: meal.strArea,
        instructions: meal.strInstructions,
        thumbnail: meal.strMealThumb,
        tags: meal.strTags ? meal.strTags.split(',') : [],
        youtube: meal.strYoutube,
        ingredients: getIngredients(meal)
    }));
    saveToFile(processedMeals);
};

const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push({
                ingredient: meal[`strIngredient${i}`],
                measure: meal[`strMeasure${i}`]
            });
        } else {
            break;
        }
    }
    return ingredients;
};

const saveToFile = (meals) => {
    fs.writeFileSync('recipes.json', JSON.stringify(meals, null, 2));
    console.log('recipes.json has been saved with the fetched meals.');
};

fetchMeals();
