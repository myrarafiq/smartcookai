document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    let level = document.getElementById("level").value;
    let cuisine = document.getElementById("cuisine").value;
    let mood = document.getElementById("mood").value;

    let userMessage = `I am a ${level} cook, I prefer ${cuisine} cuisine, and I am feeling ${mood}. Suggest a recipe for me.`;

    let apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your actual API key

    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
        document.getElementById("recipeResult").innerHTML = "⚠️ API Key is missing!";
        return;
    }

    try {
        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI chef assistant providing recipes." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300
            })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let recipe = data.choices[0].message.content;

        document.getElementById("recipeResult").innerHTML = `<strong>🍽️ Here's Your Recipe:</strong> <br><br> ${recipe}`;
        document.getElementById("feedbackSection").style.display = "block"; // Show feedback section

        // Save the recipe in a variable for feedback
        window.currentRecipe = recipe;

    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error fetching recipe: ${error.message}`;
        console.error("Error:", error);
    }
});

// Function to handle feedback
function sendFeedback(feedbackType) {
    let feedbackMessage = document.getElementById("feedbackMessage");
    feedbackMessage.style.display = "block";
    
    let feedbackData = {
        recipe: window.currentRecipe,
        feedback: feedbackType
    };

    console.log("User Feedback:", feedbackData);

    feedbackMessage.innerHTML = "Thank you for your feedback! 😊";
    
    // In a real application, you would send this data to a server or database
}

// Event Listeners for Feedback Buttons
document.getElementById("likeButton").addEventListener("click", () => sendFeedback("liked"));
document.getElementById("dislikeButton").addEventListener("click", () => sendFeedback("disliked"));
document.getElementById("easyButton").addEventListener("click", () => sendFeedback("easy"));
document.getElementById("difficultButton").addEventListener("click", () => sendFeedback("too difficult"));
