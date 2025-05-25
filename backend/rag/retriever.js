const { OpenAI } = require('openai/index.mjs');
require('dotenv').config();

const openai = new OpenAI();

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Get embedding for the user query
 */
async function getQueryEmbedding(query) {
    const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query
    });

    return res.data[0].embedding;
}

/**
 * Given user input + all embedded chunks, return top K matches
 */
async function retrieveRelevantChunks(query, embeddedChunks, topK = 1) {
    const queryEmbedding = await getQueryEmbedding(query);

    // Computes similarity between the query and each FAQ chunk
    const scored = embeddedChunks.map(chunk => ({
        content: chunk.content,
        score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    // Sort descending by similarity score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);  // Top K results
}

module.exports = { retrieveRelevantChunks };
