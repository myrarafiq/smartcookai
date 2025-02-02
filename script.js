document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    let level = document.getElementById("level").value;
    let cuisine = document.getElementById("cuisine").value;
    let mood = document.getElementById("mood").value;

    let userMessage = `I am a ${level} cook, I prefer ${cuisine} cuisine, and I am feeling ${mood}. Suggest a recipe for me.`;

    let apiKey = "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"; // Replace with your actual API key

    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
        document.getElementById("recipeResult").innerHTML = "⚠️ API Key is missing! Update script.js with your OpenAI API key.";
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
                    { role: "system", content: "You are an AI chef assistant providing recipes based on user preferences." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        document.getElementById("recipeResult").innerHTML = `<strong>🍽️ Here's Your Recipe:</strong> <br><br> ${data.choices[0].message.content}`;
    } catch (error) {
        document.getElementById("recipeResult").innerHTML = `⚠️ Error fetching recipe: ${error.message}`;
        console.error("Error:", error);
    }
});
