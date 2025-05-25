const { OpenAI } = require('openai/index.mjs');
require('dotenv').config();

const openai = new OpenAI();

/**
 * Generate a final GPT response using context and user question
 */
async function generateAnswer(contextChunks, userQuestion) {
    const contextText = contextChunks.map(chunk => chunk.content).join("\n\n");

    const messages = [
        {
            role: "system",
            content: `
            You are StrideWalk's helpful and professional customer support assistant.
            Use the context below to answer the user's question. If the answer is not directly in the context, do not guess. 
            Instead, ask 2 or 3 follow-up questions or let the user know what information you need to help.
            After few followups, if you still don’t have enough information, provide the user with our support contact details, so that they can reach out directly.
            Speak in a friendly and natural way. Do not repeat the context word for word — summarize it clearly.

            Context:
            ${contextText}
                `.trim()
        },
        {
            role: "user",
            content: userQuestion
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.4
    });

    return response.choices[0].message.content.trim();
}

module.exports = { generateAnswer };
