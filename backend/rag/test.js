// 1st test

// const { parseFaqFile } = require('./faqLoader');
// const { embedFaqChunks } = require('./embedder');

// (async () => {
//     const faqs = parseFaqFile('./files/faq_stridewalk.txt');
//     const embedded = await embedFaqChunks(faqs);
//     console.log("✅ Embedded FAQ chunks:");
//     console.log(embedded);
// })();

// 2nd test

// const path = require('path');
// const { parseFaqFile } = require('./faqLoader');
// const { embedFaqChunks } = require('./embedder');
// const { retrieveRelevantChunks } = require('./retriever');

// (async () => {
//     const filePath = path.join(__dirname, '../files/faq_stridewalk.txt');
//     const faqs = parseFaqFile(filePath);
//     const embedded = await embedFaqChunks(faqs);

//     const userQuestion = "How can I return a product?";
//     const topChunks = await retrieveRelevantChunks(userQuestion, embedded);

//     console.log("💡 Top relevant FAQ chunk(s):");
//     console.log(topChunks);
// })();

// 3rd test

const path = require('path');
const { parseFaqFile } = require('./faqLoader');
const { embedFaqChunks } = require('./embedder');
const { retrieveRelevantChunks } = require('./retriever');
const { generateAnswer } = require('./responder');

(async () => {
    const filePath = path.join(__dirname, '../files/faq_stridewalk.txt');
    const faqs = parseFaqFile(filePath);
    const embedded = await embedFaqChunks(faqs);

    const userQuestion = "How can I return a product?";
    const topChunks = await retrieveRelevantChunks(userQuestion, embedded);
    console.log("💡 Top relevant chunk(s):", topChunks);

    const answer = await generateAnswer(topChunks, userQuestion);
    console.log("🤖 GPT Response:\n", answer);
})();
