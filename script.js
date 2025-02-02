document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value;
    let cuisine = document.getElementById("cuisine").value;
    let mood = document.getElementById("mood").value;

    let userMessage = `I am a ${level} cook, I prefer ${cuisine} cuisine, and I am feeling ${mood}. Suggest a recipe for me.`;

    try {
        let response = await fetch("https://still-block-3489.aa10813.workers.dev", { // Your Cloudflare Worker URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI chef assistant providing recipes based on user preferences." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300
            })
        });

        let data = await response.json();
        document.getElementById("recipeResult").innerHTML = `<strong>🍽️ Here's Your Recipe:</strong> <br><br> ${data.choices[0].message.content}`;
    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error fetching recipe: ${error.message}`;
        console.error("Error:", error);
    }
});
