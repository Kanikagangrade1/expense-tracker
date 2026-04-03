import { useState } from "react";
import API from "../services/api";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I am your assistant. How can I help you with your expenses today? You can ask about total spending, highest category, recent expenses, and savings suggestions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // show user message
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chat", {
        message: userMessage,
      });

      const reply = res.data.data.reply;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="card chatbot-card ">
      <h3>Chat Support</h3>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.role === "user" ? "user-msg" : "bot-msg"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="chat-message bot-msg">Typing...</div>}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask about your expenses..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;