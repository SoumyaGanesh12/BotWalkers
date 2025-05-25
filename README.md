# 👟💬 BotWalkers: AI-Powered Customer Support Chatbots

**BotWalkers** demonstrates two implementations of AI-powered customer support chatbots using OpenAI:

- A prompt-based assistant for **ABC Shoes** company
- A RAG (Retrieval-Augmented Generation) based assistant for **StrideWalk** shoes company

This project compares both approaches in handling customer queries such as return policies, store hours, shipping, and more, with an emphasis on scalability, accuracy, and contextual understanding.

## Overview

| Assistant | Technique | Description |
|-----------|-----------|-------------|
| **ABC Shoes** | Prompt-based | Injects the entire FAQ into the system prompt. Simple, lightweight, less scalable. |
| **StrideWalk** | RAG-based | Embeds FAQ chunks and retrieves top-matching context dynamically. More accurate, scalable. |

## Features

- Built with **React**, **Node.js**, and **Express**
- Uses **OpenAI GPT-3.5 / GPT-4** for natural response generation
- Uses **OpenAI Embedding API (`text-embedding-3-small`)**
- Manual **RAG implementation** with cosine similarity
- FAQ documents are parsed from `.txt` files
- Context-aware GPT prompts with fallback logic
- Timestamps for messages and loading indicators in UI
- Modular backend (loader, embedder, retriever, responder)

## 🔁 RAG Workflow (StrideWalk Bot)

```text
User Question
   ↓
Query Embedding (OpenAI API)
   ↓
Cosine Similarity with Embedded FAQ Chunks
   ↓
Top Matches Selected
   ↓
Injected as Context in GPT Prompt
   ↓
Final Response Generated
```

## Sample Interactions

### 1. Prompt-based (ABC Shoes)

> **User:** What is your return policy?  
> **Assistant:** You can return products within 30 days of purchase.

> **User:** Is the store open now?  
> **Assistant:** Our store is open from 9 AM to 8 PM, Monday to Saturday.

### RAG-based (StrideWalk)

> **User:** Can I return shoes I wore once?  
> **Assistant:** Were the shoes worn outdoors or just tried on at home? Returns must be in original condition. I can help better if I know more.

> **User:** Is the store open right now?  
> **Assistant:** Our physical stores are open from 9 AM to 8 PM, Monday to Saturday. You may check your local time to confirm.

> **User:** Do you offer eco-friendly products?  
> **Assistant:** Yes, we have a sustainable line made from recycled materials.

## Benefits of Using RAG

| Aspect         | Prompt-Based (ABC Shoes)     | RAG-Based (StrideWalk)              |
|----------------|-------------------------------|-------------------------------------|
| Accuracy       | May guess or hallucinate      | Context-aware and reliable          |
| Scalability    | Hard to scale                 | Easy to update FAQs                 |
| Token Usage    | Higher (entire FAQ injected)  | Lower (only top chunks used)        |
| Performance    | Simple and fast               | More robust and precise             |
| Customization  | Requires full re-prompting    | Just update the source file         |
| Clarification  | No follow-up logic            | Smart follow-ups and contact fallback |

## Technologies Used

- **React** – Frontend chat UI
- **Node.js + Express** – Backend server and API routing
- **OpenAI GPT-3.5 / GPT-4** – Language model for generating responses
- **OpenAI Embedding API** – Converts FAQ and questions into semantic vectors
- **Cosine Similarity** – Computes relevance between user queries and FAQ content
- **Markdown-formatted `.txt` files** – Easy-to-edit source of FAQs

## How to Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/botwalkers.git
   cd botwalkers
   ```

2. **Set up the OpenAI API key**

   In the backend folder, create a `.env` file and add your API key:

   ```env
   OPENAI_API_KEY=your-openai-key-here
   ```

3. **Install and start the backend**

   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Install and start the frontend**

   Open a new terminal:

   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Access the app**

   Open your browser and go to:

   ```
   http://localhost:3000
   ```

Ask questions and test both chatbot versions!

## Conclusion

This project highlights how both prompt engineering and Retrieval-Augmented Generation (RAG) play an important role in building effective chatbots. Well-crafted prompts guide the assistant’s tone and behavior, while RAG helps provide accurate answers by adding the right context. Together, they improve the quality, reliability, and flexibility of chatbot responses without needing to train a custom model.

