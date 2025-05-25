// Implementation of customer support chatbot without RAG for StrideWalk shoe company
import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Main.css";

const data = [
  {
    sender: "user",
    timestamp: "2024-02-04T10:00:00Z",
    content: "What's the weather like today?",
  },
  {
    sender: "ai_assistant",
    timestamp: "2024-02-04T10:00:05Z",
    content:
      "The weather today is sunny with a high of 75 degrees and a low of 55 degrees.",
  },
  {
    sender: "user",
    timestamp: "2024-02-04T10:05:00Z",
    content: "Can you remind me to call John at 2 PM?",
  },
  {
    sender: "ai_assistant",
    timestamp: "2024-02-04T10:05:05Z",
    content: "Sure, I've set a reminder for you to call John at 2 PM today.",
  },
  {
    sender: "user",
    timestamp: "2024-02-04T10:10:00Z",
    content: "How do I make a lasagna?",
  },
  {
    sender: "ai_assistant",
    timestamp: "2024-02-04T10:10:15Z",
    content:
      "To make a lasagna, cook the noodles, prepare a sauce with ground beef, and layer with ricotta and mozzarella cheese before baking at 375°F for 45 minutes.",
  },
  {
    sender: "user",
    timestamp: "2024-02-04T10:15:00Z",
    content: "Play some relaxing music.",
  },
  {
    sender: "ai_assistant",
    timestamp: "2024-02-04T10:15:05Z",
    content: "Playing relaxing music now.",
  },
];

function Main() {
  const inputRef = useRef();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(data);
  const [thread, setThread] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [isGenerating, setGenerating] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => res.json())
      .then((data) => setThread(data?.id || "Loading..."))
      .catch(() => setThread("Error fetching thread"));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const moderateConversation = (message) => {
    return new Promise((resolve, reject) => { 
      fetch("http://localhost:4000/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: message }),
      })
      .then((response) => response.json())
      .then(resolve)
    });
    
  }

  useEffect(() => {
    scrollToBottom(); 
  }, [messages]);

  const sendMessage = (message) => {
    setGenerating(true);
    fetch("http://localhost:4000/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: message }),
    })
      .then((response) => response.json())
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai_assistant", content: response.content, timestamp: new Date().toISOString() },
        ]);
        setGenerating(false);
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  const handleOnChange = (e) => setUserMessage(e.target.value);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    moderateConversation(userMessage).then(flagged => {
      if(flagged) {
        console.log("Message flagged", flagged);
      } else {
        const newMessage = {
          sender: "user",
          content: userMessage,
          timestamp: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        sendMessage(userMessage);
        setUserMessage("");
      }
    })
    
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleOnSubmit(e);
    }
  };

  const isDisabled = useMemo(() => {
    return !thread || thread === "Loading..." || thread === "Error fetching thread";
  }, [thread]);

  return (
    <div className="container">
      <div className="chat-container row d-flex flex-column justify-content-between">
        <div className="col-12 my-3">
          <h1 className="text-center text-secondary my-1">🤖 AI Assistant</h1>
          <hr />
          <small className="text-muted">THREAD: {thread}</small>
        </div>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`} // Ensuring unique key
              className="d-flex flex-column"
            >
              <small className="m-0 text-muted text-small">
                {message.sender === "user" ? "User" : "AI Assistant"}
              </small>
              <p>{message.content}</p>
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
              placeholder="Enter your message ..."
              disabled={isDisabled}
              value={userMessage}
              onChange={handleOnChange}
              onKeyDown={handleKeyPress}
            ></textarea>
            <div className="d-flex justify-content-between">
              {isGenerating && (
                <p className="text-info m-0 align-self-end d-flex">
                  <div className="spinner mx-1 align-self-end "></div>
                  <span> Generating response...</span>
                </p>
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

export default Main;
