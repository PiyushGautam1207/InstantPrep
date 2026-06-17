const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
        console.error("❌ ERROR: No GEMINI_API_KEY found in your .env file!");
        return;
    }

    console.log(`Checking models for key: ${apiKey.substring(0, 6)}...XXXX`);
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ GOOGLE API ERROR:", data.error.message);
            return;
        }

        console.log("\n✅ SUCCESS! YOUR AUTHORIZED MODELS:");
        console.log("------------------------------------");
        if (data.models && data.models.length > 0) {
            data.models.forEach(m => {
                // Clean up the name for readability
                console.log(`- ${m.name.replace('models/', '')}`);
            });
        } else {
            console.log("No models found. Your key might be restricted.");
        }
        console.log("------------------------------------\n");
        
    } catch (err) {
        console.error("❌ NETWORK ERROR:", err.message);
    }
}

listModels();