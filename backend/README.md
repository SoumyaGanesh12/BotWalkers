# Backend

This is the Node.js and Express backend for the StrideWalk and ABC Shoes customer support chatbots. It handles user queries, performs FAQ retrieval (for RAG), and generates responses using OpenAI’s GPT models.

## Features

- Loads and parses FAQ documents
- Generates vector embeddings using OpenAI Embedding API
- Performs semantic search using cosine similarity (RAG)
- Sends prompt + context to GPT and returns a natural response
- Modular structure (loader, embedder, retriever, responder)

## Steps to run locally

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your-openai-key-here
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will run at:
```
http://localhost:4000
```

## Endpoints

- `POST /api/chat` – Used by the StrideWalk chatbot (RAG-based) to retrieve relevant FAQ context and generate a response.
- `POST /sendMessage` – Used by the ABC Shoes chatbot (prompt-based) to send a full prompt with all FAQs and generate a response directly from GPT.