document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value.toLowerCase();
    let cuisine = document.getElementById("cuisine").value.toLowerCase();
    let mood = document.getElementById("mood").value.toLowerCase();

    try {
        let response = await fetch("recipes.json");

        // Check if response is valid
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let recipes = await response.json();

        // Debugging: Check if recipes are correctly loaded
        console.log("Loaded Recipes:", recipes);

        // Ensure recipes is an array
        if (!Array.isArray(recipes)) {
            throw new Error("recipes.json is not an array!");
        }

        // Primary filtering (Cuisine + Difficulty)
        let primaryFilteredRecipes = recipes.filter(recipe =>
            recipe.cuisine && recipe.cuisine.toLowerCase() === cuisine &&
            recipe.difficulty && recipe.difficulty.toLowerCase() === level
        );

        // Secondary filtering (Prioritize mood but do not exclude other recipes)
        let moodFilteredRecipes = primaryFilteredRecipes.filter(recipe =>
            recipe.mood && recipe.mood.toLowerCase() === mood
        );

        let finalRecipes = moodFilteredRecipes.length > 0 ? [...moodFilteredRecipes, ...primaryFilteredRecipes] : primaryFilteredRecipes;

        // Remove duplicates while maintaining priority (mood matches come first)
        finalRecipes = [...new Set(finalRecipes)];

        let recipeResult = document.getElementById("recipeResult");

        if (finalRecipes.length > 0) {
            let recipe = finalRecipes[Math.floor(Math.random() * finalRecipes.length)];

            // Debugging: Log the selected recipe to check for missing fields
            console.log("Selected Recipe:", recipe);

            // Ensure recipe fields are defined
            let recipeName = recipe.name || "Unknown Recipe";
            let recipeCuisine = recipe.cuisine || "Unknown Cuisine";
            let recipeDifficulty = recipe.difficulty || "Unknown Difficulty";
            let recipeInstructions = recipe.recipe || "No instructions available.";
            let recipeThumbnail = recipe.thumbnail || "https://via.placeholder.com/200"; // Placeholder image if missing

            // Ensure ingredients exist before mapping
            let ingredientsList = (recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0)
                ? recipe.ingredients.map(ing => `<li>${ing.measure || ''} ${ing.ingredient || ''}</li>`).join('')
                : "<li>No ingredients available.</li>";

            recipeResult.innerHTML = `
                <h3>🍽️ ${recipeName}</h3>
                <img src="${recipeThumbnail}" alt="${recipeName}" width="200">
                <p><strong>Cuisine:</strong> ${recipeCuisine}</p>
                <p><strong>Difficulty:</strong> ${recipeDifficulty}</p>
                <p><strong>Recipe:</strong> ${recipeInstructions}</p>
                <h4>Ingredients:</h4>
                <ul>${ingredientsList}</ul>
            `;
        } else {
            recipeResult.innerHTML = "⚠️ No matching recipes found! Try adjusting your preferences.";
        }

    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error loading recipes: ${error.message}`;
        console.error("Error:", error);
    }
});
