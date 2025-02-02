document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value;
    let cuisine = document.getElementById("cuisine").value;
    let mood = document.getElementById("mood").value;

    try {
        let response = await fetch("recipes.json"); // Load local recipe data
        let recipes = await response.json();

        let filteredRecipes = recipes.filter(recipe =>
            recipe.cuisine === cuisine &&
            recipe.difficulty === level &&
            recipe.mood === mood
        );

        let recipeResult = document.getElementById("recipeResult");

        if (filteredRecipes.length > 0) {
            let recipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
            recipeResult.innerHTML = `<strong>🍽️ ${recipe.name}</strong><br>${recipe.recipe}`;
        } else {
            recipeResult.innerHTML = "⚠️ No matching recipes found! Try adjusting your preferences.";
        }

        // Save user preferences for learning
        localStorage.setItem("lastSelected", JSON.stringify({ level, cuisine, mood }));

    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error loading recipes: ${error.message}`;
        console.error("Error:", error);
    }
});
