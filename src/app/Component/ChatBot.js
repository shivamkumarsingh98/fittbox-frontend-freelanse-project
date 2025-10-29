"use client";

import { useEffect, useRef, useState } from "react";
import { CiChat1 } from "react-icons/ci";

const QA_PAIRS = [
  {
    q: "What is FittBox?",
    a: "FittBox is a diet food delivery service offering healthy meal plans.",
  },
  {
    q: "How do I subscribe?",
    a: "Go to the Menu page and choose a plan to subscribe.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major cards and UPI.",
  },
  {
    q: "Can I customize my meal?",
    a: "Currently, customization is limited. Contact support for special requests.",
  },
  {
    q: "How do I contact support?",
    a: "You can use the Contact page or email us at support@fittbox.com.",
  },
];

const TYPING_SOUND = "/typing.mp3"; // Place a short typing sound in public/
const BOT_REPLY_SOUND = "/bot-beep.mp3"; // short reply sound in public/

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const audioTypingRef = useRef(null);
  const audioBotRef = useRef(null);
  const chatRef = useRef(null);

  // Load chat from localStorage only when opening the chat
  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("chatbot-messages");
    if (saved) setMessages(JSON.parse(saved));
  }, [open]);

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot-messages", JSON.stringify(messages));
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Play typing sound
  const playTypingSound = () => {
    if (audioTypingRef.current) {
      audioTypingRef.current.currentTime = 0;
      audioTypingRef.current.play();
    }
  };

  // Play bot reply sound
  const playBotSound = () => {
    if (audioBotRef.current) {
      audioBotRef.current.currentTime = 0;
      audioBotRef.current.play();
    }
  };

  // Handle user message
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    // small typing animation + reply
    playTypingSound();
    setTimeout(() => {
      const answer = getAnswer(input);
      setMessages((msgs) => [...msgs, { from: "bot", text: answer }]);
      // play a distinct reply sound when bot responds
      playBotSound();
    }, 700);
  };

  // Clear messages and localStorage
  const clearMessages = () => {
    setMessages([]);
    try {
      localStorage.removeItem("chatbot-messages");
    } catch (e) {}
  };

  // Find answer or fallback
  const getAnswer = (q) => {
    const found = QA_PAIRS.find((pair) =>
      q.toLowerCase().includes(pair.q.toLowerCase())
    );
    if (found) return found.a;
    return "Sorry, I don't know that yet. Please contact support.";
  };

  return (
    <>
      <div className="fixed  bottom-8 right-8 z-50">
        {!open && (
          <button
            className="bg-blue-600 animate-bounce text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-blue-700 transition"
            onClick={() => setOpen(true)}
            aria-label="Open chatbot"
          >
            <CiChat1 />
          </button>
        )}
        {open && (
          <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-bold text-lg">FittBox ChatBot</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearMessages}
                  title="Clear chat"
                  className="text-gray-500 hover:text-gray-700 text-sm px-2"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    // when closing, clear chat (user requested deletion on close)
                    clearMessages();
                  }}
                  className="text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50"
            >
              {messages.length === 0 && (
                <div className="text-gray-400 text-center mt-8">
                  Ask me something!
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-2 border-t flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus={open}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
      {/* audio elements: typing and bot reply */}
      <audio ref={audioTypingRef} src={TYPING_SOUND} preload="auto" />
      <audio ref={audioBotRef} src={BOT_REPLY_SOUND} preload="auto" />
    </>
  );
}
