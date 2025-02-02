document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value.toLowerCase();
    let cuisine = document.getElementById("cuisine").value.toLowerCase();
    let mood = document.getElementById("mood").value.toLowerCase();

    try {
        let response = await fetch("recipes.json"); // Load recipes from local JSON
        let recipes = await response.json();

        // Step 1: Strict filter (Cuisine + Difficulty + Mood)
        let filteredRecipes = recipes.filter(recipe =>
            recipe.cuisine.toLowerCase() === cuisine &&
            recipe.difficulty.toLowerCase() === level &&
            recipe.mood && recipe.mood.toLowerCase() === mood
        );

        // Step 2: If no match, ignore Mood (Cuisine + Difficulty only)
        if (filteredRecipes.length === 0) {
            filteredRecipes = recipes.filter(recipe =>
                recipe.cuisine.toLowerCase() === cuisine &&
                recipe.difficulty.toLowerCase() === level
            );
        }

        // Step 3: If still no match, ignore Difficulty too (Only Cuisine)
        if (filteredRecipes.length === 0) {
            filteredRecipes = recipes.filter(recipe =>
                recipe.cuisine.toLowerCase() === cuisine
            );
        }

        // Step 4: If STILL no match, return a completely RANDOM recipe
        if (filteredRecipes.length === 0) {
            filteredRecipes = recipes;
        }

        // Pick a random recipe from filtered results
        let recipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];

        // Display the recipe
        document.getElementById("recipeResult").innerHTML = `
            <h2>🍽️ ${recipe.name}</h2>
            <img src="${recipe.thumbnail}" alt="${recipe.name}" width="200"><br>
            <strong>Instructions:</strong> <p>${recipe.recipe}</p>
            <strong>Ingredients:</strong>
            <ul>
                ${recipe.ingredients.map(ing => `<li>${ing.measure} ${ing.ingredient}</li>`).join("")}
            </ul>
        `;

    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error loading recipes: ${error.message}`;
        console.error("Error:", error);
    }
});
