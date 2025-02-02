document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let level = document.getElementById("level").value;
    let cuisine = document.getElementById("cuisine").value;
    let mood = document.getElementById("mood").value;

    let userMessage = `I am a ${level} cook, I prefer ${cuisine} cuisine, and I am feeling ${mood}. Suggest a recipe for me.`;

    let response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{role: "system", content: "You are an AI chef assistant providing recipes based on user preferences."}, {role: "user", content: userMessage}]
        })
    });

    let data = await response.json();
    document.getElementById("recipeResult").innerHTML = data.choices[0].message.content;
});
