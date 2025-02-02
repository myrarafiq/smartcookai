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
            recipe.cuisine.toLowerCase() === cuisine &&
            recipe.difficulty.toLowerCase() === level
        );

        // Secondary filtering (Prioritize mood but don't remove if no match)
        let moodFilteredRecipes = primaryFilteredRecipes.filter(recipe =>
            recipe.mood.toLowerCase() === mood
        );

        let finalRecipes = moodFilteredRecipes.length > 0 ? moodFilteredRecipes : primaryFilteredRecipes;

        let recipeResult = document.getElementById("recipeResult");

        if (finalRecipes.length > 0) {
            let recipe = finalRecipes[Math.floor(Math.random() * finalRecipes.length)];
            recipeResult.innerHTML = `
                <h3>🍽️ ${recipe.name}</h3>
                <img src="${recipe.thumbnail}" alt="${recipe.name}" width="200">
                <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
                <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
                <p><strong>Recipe:</strong> ${recipe.recipe}</p>
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing.measure} ${ing.ingredient}</li>`).join('')}
                </ul>
            `;
        } else {
            recipeResult.innerHTML = "⚠️ No matching recipes found! Try adjusting your preferences.";
        }

    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error loading recipes: ${error.message}`;
        console.error("Error:", error);
    }
});
