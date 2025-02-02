// Load recipes from the dataset
let recipes = [];

async function loadRecipes() {
    try {
        let response = await fetch("recipes.json");  // Ensure this file exists in your repo
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        recipes = await response.json();
        console.log("Recipes loaded successfully:", recipes);
    } catch (error) {
        console.error("Error loading recipes:", error);
        document.getElementById("recipeResult").innerHTML = "❌ Failed to load recipes.";
    }
}

// Fetch recipes when the page loads
loadRecipes();

document.getElementById("recipeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (recipes.length === 0) {
        document.getElementById("recipeResult").innerHTML = "❌ Recipes not loaded yet. Please wait.";
        return;
    }

    let level = document.getElementById("level").value.toLowerCase();
    let cuisine = document.getElementById("cuisine").value.toLowerCase();
    let mood = document.getElementById("mood").value.toLowerCase();

    // Ensure only beginner, intermediate, and expert are used
    let validLevels = ["beginner", "intermediate", "expert"];
    if (!validLevels.includes(level)) {
        document.getElementById("recipeResult").innerHTML = "⚠️ Invalid cooking level.";
        return;
    }

    console.log("Filtering for:", cuisine, level, mood);

    // Primary filtering (Cuisine + Difficulty)
    let primaryFilteredRecipes = recipes.filter(recipe =>
        recipe.cuisine.toLowerCase() === cuisine &&
        recipe.difficulty.toLowerCase() === level
    );

    // Secondary filtering (Mood preference, but not strict)
    let moodFilteredRecipes = primaryFilteredRecipes.filter(recipe =>
        recipe.mood && recipe.mood.toLowerCase() === mood
    );

    let finalRecipes = moodFilteredRecipes.length > 0 ? moodFilteredRecipes : primaryFilteredRecipes;

    console.log("Filtered Recipes:", finalRecipes);

    let recipeResult = document.getElementById("recipeResult");

    if (finalRecipes.length > 0) {
        let selectedRecipe = finalRecipes[Math.floor(Math.random() * finalRecipes.length)];

        console.log("Selected Recipe:", selectedRecipe);

        // Ensure ingredients exist before mapping
        let ingredientsList = selectedRecipe.ingredients && Array.isArray(selectedRecipe.ingredients)
            ? selectedRecipe.ingredients.map(ing => 
                typeof ing === "object" 
                ? `<li>${ing.measure || ''} ${ing.ingredient || ''}</li>` 
                : `<li>${ing}</li>`
              ).join('')
            : "<li>No ingredients available.</li>";

        // Ensure instructions exist
        let instructionsText = selectedRecipe.instructions ? selectedRecipe.instructions : "No instructions available.";

        // Fix image (if available)
        let imageHTML = selectedRecipe.image 
            ? `<img src="${selectedRecipe.image}" alt="${selectedRecipe.name}" style="max-width:100%; border-radius: 10px;">` 
            : "";

        recipeResult.innerHTML = `
            ${imageHTML}
            <h3>🍽️ ${selectedRecipe.name}</h3>
            <p><strong>Cuisine:</strong> ${selectedRecipe.cuisine}</p>
            <p><strong>Difficulty:</strong> ${selectedRecipe.difficulty}</p>
            <p><strong>Mood:</strong> ${selectedRecipe.mood}</p>
            <h4>Ingredients:</h4>
            <ul>${ingredientsList}</ul>
            <h4>Instructions:</h4>
            <p>${instructionsText}</p>
        `;

        // Show feedback options
        document.getElementById("feedbackSection").style.display = "block";
        window.currentRecipe = selectedRecipe;
    } else {
        recipeResult.innerHTML = "⚠️ No matching recipes found! Try adjusting your preferences.";
        document.getElementById("feedbackSection").style.display = "none";
    }
});

// Handle feedback
function sendFeedback(feedbackType) {
    let feedbackMessage = document.getElementById("feedbackMessage");
    feedbackMessage.style.display = "block";

    let feedbackData = {
        recipe: window.currentRecipe.name,
        feedback: feedbackType
    };

    console.log("User Feedback:", feedbackData);

    feedbackMessage.innerHTML = "Thank you for your feedback! 😊";
}

// Event Listeners for Feedback Buttons
document.getElementById("likeButton").addEventListener("click", () => sendFeedback("liked"));
document.getElementById("dislikeButton").addEventListener("click", () => sendFeedback("disliked"));
document.getElementById("easyButton").addEventListener("click", () => sendFeedback("easy"));
document.getElementById("difficultButton").addEventListener("click", () => sendFeedback("too difficult"));
