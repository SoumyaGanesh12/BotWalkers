# Frontend

This is the React-based frontend for the StrideWalk and ABC Shoes customer support chatbots. It provides a clean and responsive chat interface where users can interact with the assistant in real time.

## Features

- Chat-style interface with scrollable message history
- Timestamps and sender labels for each message
- Typing indicator while the assistant generates a response
- Auto-scroll to latest message
- Input handling with Enter and Shift+Enter support

## Steps to run locally

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```

Make sure the backend is running on `http://localhost:4000` for the assistant to respond.

## API Integration

- Sends user questions to: `POST http://localhost:4000/api/chat` (StrideWalk Chatbot)
- Sends user questions to: `POST http://localhost:4000/sendMessage` (ABC Chatbot)
- Displays assistant responses returned from the backend

## Tech Stack

- React (functional components + hooks)
- Bootstrap (layout and responsiveness)
- Fetch API for backend communication
