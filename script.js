// Load recipes from the dataset
let recipes = [];

async function loadRecipes() {
    try {
        let response = await fetch("recipes.json");  // Make sure this file exists in your repository
        recipes = await response.json();
    } catch (error) {
        console.error("Error loading recipes:", error);
    }
}

// Fetch recipes when the page loads
loadRecipes();

document.getElementById("recipeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value;
    let cuisine = document.getElementById("cuisine").value;
    let mood = document.getElementById("mood").value;

    let filteredRecipes = recipes.filter(recipe =>
        recipe.cuisine.toLowerCase() === cuisine.toLowerCase() &&
        (recipe.mood.toLowerCase() === mood.toLowerCase() || recipe.mood === "any")
    );

    if (filteredRecipes.length === 0) {
        document.getElementById("recipeResult").innerHTML = "❌ No matching recipes found. Try a different selection!";
        document.getElementById("feedbackSection").style.display = "none";
        return;
    }

    let selectedRecipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];

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

    // In a real application, we would save this feedback in a database
}

document.getElementById("likeButton").addEventListener("click", () => sendFeedback("liked"));
document.getElementById("dislikeButton").addEventListener("click", () => sendFeedback("disliked"));
document.getElementById("easyButton").addEventListener("click", () => sendFeedback("easy"));
document.getElementById("difficultButton").addEventListener("click", () => sendFeedback("too difficult"));
