document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value.toLowerCase();
    let cuisine = document.getElementById("cuisine").value.toLowerCase();
    let mood = document.getElementById("mood").value.toLowerCase();

    try {
        let response = await fetch("recipes.json"); // Load local recipe data
        let recipes = await response.json();

        // First, apply strict filters (Cuisine + Difficulty + Mood)
        let filteredRecipes = recipes.filter(recipe =>
            recipe.cuisine.toLowerCase() === cuisine &&
            recipe.difficulty.toLowerCase() === level &&
            recipe.mood.toLowerCase() === mood
        );

        // If no exact match, ignore mood
        if (filteredRecipes.length === 0) {
            filteredRecipes = recipes.filter(recipe =>
                recipe.cuisine.toLowerCase() === cuisine &&
                recipe.difficulty.toLowerCase() === level
            );
        }

        // If still no match, ignore difficulty as well (only match cuisine)
        if (filteredRecipes.length === 0) {
            filteredRecipes = recipes.filter(recipe =>
                recipe.cuisine.toLowerCase() === cuisine
            );
        }

        // If no match at all, return a random recipe
        if (filteredRecipes.length === 0) {
            filteredRecipes = recipes;
        }

        // Select a random recipe from the filtered list
        let recipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];

        // Display the recipe
        document.getElementById("recipeResult").innerHTML = `
            <strong>🍽️ ${recipe.name}</strong><br>
            <img src="${recipe.thumbnail}" alt="${recipe.name}" width="200"><br>
            <strong>Instructions:</strong> ${recipe.recipe}<br>
            <strong>Ingredients:</strong> <ul>
            ${recipe.ingredients.map(ing => `<li>${ing.measure} ${ing.ingredient}</li>`).join("")}
            </ul>
        `;

    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error loading recipes: ${error.message}`;
        console.error("Error:", error);
    }
});
