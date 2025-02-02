// Load recipes from the dataset
let recipes = [];

async function loadRecipes() {
    try {
        let response = await fetch("recipes.json");  // Ensure this file exists in your repo
        recipes = await response.json();
    } catch (error) {
        console.error("Error loading recipes:", error);
    }
}

// Fetch recipes when the page loads
loadRecipes();

document.getElementById("recipeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value.toLowerCase();
    let cuisine = document.getElementById("cuisine").value.toLowerCase();
    let mood = document.getElementById("mood").value.toLowerCase();

    // Ensure only beginner, intermediate, and expert are used
    let validLevels = ["beginner", "intermediate", "expert"];
    if (!validLevels.includes(level)) {
        document.getElementById("recipeResult").innerHTML = "⚠️ Invalid cooking level.";
        return;
    }

    // Primary filter: cuisine & skill level
    let filteredRecipes = recipes.filter(recipe =>
        recipe.cuisine.toLowerCase() === cuisine &&
        recipe.difficulty.toLowerCase() === level
    );

    // If mood-matching recipes exist, prioritize them
    let moodMatchingRecipes = filteredRecipes.filter(recipe => recipe.mood.toLowerCase() === mood);
    let finalRecipes = moodMatchingRecipes.length > 0 ? moodMatchingRecipes : filteredRecipes;

    if (finalRecipes.length === 0) {
        document.getElementById("recipeResult").innerHTML = "❌ No matching recipes found. Try a different selection!";
        document.getElementById("feedbackSection").style.display = "none";
        return;
    }

    // Randomly pick a recipe from the final filtered list
    let selectedRecipe = finalRecipes[Math.floor(Math.random() * finalRecipes.length)];

    document.getElementById("recipeResult").innerHTML = `
        <h3>${selectedRecipe.name}</h3>
        <p><strong>Cuisine:</strong> ${selectedRecipe.cuisine}</p>
        <p><strong>Difficulty:</strong> ${selectedRecipe.difficulty}</p>
        <p><strong>Mood:</strong> ${selectedRecipe.mood}</p>
        <p><strong>Ingredients:</strong> ${selectedRecipe.ingredients.join(", ")}</p>
        <p><strong>Instructions:</strong> ${selectedRecipe.instructions}</p>
    `;

    // Show feedback options
    document.getElementById("feedbackSection").style.display = "block";
    window.currentRecipe = selectedRecipe;
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
