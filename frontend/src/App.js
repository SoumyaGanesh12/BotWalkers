// Implementation of customer support chatbot with RAG for StrideWalk shoe company
import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const inputRef = useRef();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "ai_assistant",
      content:
        "Hello, I’m the StrideWalk Assistant. I can help you with returns, shipping, store hours, and more. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isGenerating, setGenerating] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    setGenerating(true);

    try {
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai_assistant",
          content: data.answer,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
    }

    setGenerating(false);
  };

  const handleOnChange = (e) => setUserMessage(e.target.value);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const message = userMessage.trim();
    if (!message) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", content: message, timestamp: new Date().toISOString() },
    ]);

    sendMessage(message);
    setUserMessage("");
  };

  return (
    <div className="container">
      <div className="chat-container row d-flex flex-column justify-content-between">
        <div className="col-12 my-3">
          <h1 className="text-center text-secondary my-1">👟💬 StrideWalk Assistant</h1>
          <hr />
        </div>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className={`message ${message.sender}`}
            >
              <small className="text-muted">
                {message.sender === "user" ? "You" : "StrideWalk Assistant"}
              </small>
              <p>{message.content}</p>
              {/* Timestamp */}
              <small className="text-muted timestamp">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleOnSubmit}>
          <div className="border rounded p-3 my-2 d-flex flex-column">
            <textarea
              className="text-input"
              ref={inputRef}
              rows="1"
              placeholder="Ask me anything about StrideWalk..."
              value={userMessage}
              onChange={handleOnChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleOnSubmit(e);
                }
              }}
            ></textarea>
            <div className="d-flex justify-content-between">
              {isGenerating && (
                <div className="text-info m-0 align-self-end d-flex">
                  <div className="spinner mx-1 align-self-end"></div>
                  <span> Thinking...</span>
                </div>
              )}
              <button type="submit" className="mt-2 align-self-end btn btn-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#000"
                  className="bi bi-send-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
