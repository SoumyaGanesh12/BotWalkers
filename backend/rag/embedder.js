const { OpenAI } = require('openai/index.mjs');
require('dotenv').config();

const openai = new OpenAI();

/**
 * Generate embedding for a single string
 */
async function getEmbedding(text) {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small", // Fast & cost-effective
            input: text,
        });

        return response.data[0].embedding;
    } catch (err) {
        console.error("Error generating embedding:", err);
    }
}

/**
 * Given a list of {question, answer}, return [{ embedding, content }]
 */
async function embedFaqChunks(faqs) {
    const embeddedChunks = [];

    for (let item of faqs) {
        const text = `${item.question} ${item.answer}`;
        const embedding = await getEmbedding(text);
        embeddedChunks.push({ embedding, content: text });
    }

    // example embeddedChunks -
    // [
    //     {
    //         embedding: [0.0213, -0.0034, ...], // 1536 numbers
    //         content: "What is StrideWalk's return policy? You can return products within 30 days..."
    //     }
    // ]

    return embeddedChunks;
}

module.exports = { embedFaqChunks };
