// Implementation of customer support chatbot with RAG for StrideWalk shoe company
const express = require('express');
const path = require('path');
const { parseFaqFile } = require('./rag/faqLoader'); // parses the FAQ file
const { embedFaqChunks } = require('./rag/embedder'); // generates embeddings
const { retrieveRelevantChunks } = require('./rag/retriever'); // matches user query with chunks
const { generateAnswer } = require('./rag/responder'); // generates GPT response

const router = express.Router();

let embeddedChunks = [];

// Load and embed once at server startup
(async () => {
    const filePath = path.join(__dirname, './files/faq_stridewalk.txt');
    const faqs = parseFaqFile(filePath);
    embeddedChunks = await embedFaqChunks(faqs);
    console.log("Embedded FAQ knowledge base ready.");
})();

router.post('/chat', async (req, res) => {
    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).json({ error: 'Missing question in request body' });
    }

    const topChunks = await retrieveRelevantChunks(userQuestion, embeddedChunks);
    const answer = await generateAnswer(topChunks, userQuestion);

    return res.json({ answer });
});

module.exports = router;
