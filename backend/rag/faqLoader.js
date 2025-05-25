const fs = require('fs');
const path = require('path');

/**
 * Parses a FAQ text file into an array of { question, answer } objects
 */
function parseFaqFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf-8');

    const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);
    const faqChunks = [];

    let currentQuestion = null;
    for (let line of lines) {
        if (line.endsWith('?')) {
            currentQuestion = line;
        } else if (line.startsWith('*') && currentQuestion) {
            const answer = line.replace(/^\*\s*/, ''); // remove "* " prefix
            faqChunks.push({ question: currentQuestion, answer });
            currentQuestion = null;
        }
    }

    return faqChunks;
}

module.exports = { parseFaqFile };
