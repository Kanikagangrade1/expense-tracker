import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I am your assistant 👋 Ask me about expenses, savings, or insights.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chat", {
        message: userMessage,
      });

      const reply = res.data?.data?.reply || "No response received.";

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      console.log("CHAT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen h-screen bg-[#eef2ff] lg:flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

    <div className="flex-1 flex flex-col  overflow-hidden">
     
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">

        <div className="mt-6">
          <div className="mx-auto flex h-[calc(100vh-150px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-xl">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-3xl font-bold text-slate-800">Chat Support</h2>
              <p className="mt-2 text-slate-500">
                Ask about your expenses, savings, and smart insights
              </p>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 sm:px-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[70%] ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    Typing...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ask about your expenses..."
                  className="flex-1 rounded-full border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                  onClick={handleSend}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      </div>

    </div>
  );
}

export default Chatbot;