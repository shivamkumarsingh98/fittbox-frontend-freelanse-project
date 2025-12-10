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

// Typing animation dots
const TypingDots = () => {
  return (
    <div className="flex space-x-1 items-center">
      <div
        className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
};

const TYPING_SOUND = "/"; // Place a short typing sound in public/
const BOT_REPLY_SOUND = "/"; // short reply sound in public/

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const audioTypingRef = useRef(null);
  const audioBotRef = useRef(null);
  const chatRef = useRef(null);

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem(
      "AIzaSyAKu4ry19EFVgu-G82Lif3XFVFpgv28yw4"
    );
    if (savedKey) setApiKey(savedKey);
  }, []);

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
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message immediately
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");

    // Show typing indicator
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: "typing...", isTyping: true },
    ]);
    playTypingSound();

    try {
      // Get AI response
      const answer = await getAnswer(input);

      // Remove typing indicator and add real response
      setMessages((msgs) => msgs.filter((m) => !m.isTyping));
      setMessages((msgs) => [...msgs, { from: "bot", text: answer }]);
      playBotSound();
    } catch (error) {
      // Handle error gracefully
      setMessages((msgs) => msgs.filter((m) => !m.isTyping));
      setMessages((msgs) => [
        ...msgs,
        {
          from: "bot",
          text: "Sorry, I'm having trouble right now. Please try again.",
        },
      ]);
    }
  };

  // Clear messages and localStorage
  const clearMessages = () => {
    setMessages([]);
    try {
      localStorage.removeItem("chatbot-messages");
    } catch (e) {}
  };

  // Get answer from Gemini API or fallback to local QA
  const getAnswer = async (q) => {
    try {
      // First check if it matches any predefined QA pairs
      const found = QA_PAIRS.find((pair) =>
        q.toLowerCase().includes(pair.q.toLowerCase())
      );
      if (found) return found.a;

      // If no match found, ask Gemini AI
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      return (
        data.response ||
        "I'm having trouble understanding. Please try asking about our meal plans or services."
      );
    } catch (error) {
      console.error("Chat error:", error);
      return "Sorry, I'm having trouble right now. Please try asking about our meal plans or services.";
    }
  };

  return (
    <>
      <div className="fixed  bottom-8 right-8 z-50">
        {!open && (
          <button
            className="bg-blue-600  text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-blue-700 transition"
            onClick={() => setOpen(true)}
            aria-label="Open chatbot"
          >
            <CiChat1 />
          </button>
        )}
        {open && (
          <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 animate-slide-up">
            <div className="flex items-center justify-between px-4 py-2 border-b relative">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-lg">FittBox AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Settings"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={clearMessages}
                  title="Clear chat"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    clearMessages();
                  }}
                  className="text-gray-500 hover:text-red-500 text-xl transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-lg animate-slide-down">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">AI Settings</h3>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Gemini API Key
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          localStorage.setItem(
                            "gemini-api-key",
                            e.target.value
                          );
                        }}
                        placeholder="Enter your Gemini API key"
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Your API key is stored locally and never sent to our
                      servers.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {messages.length === 0 && (
                <div className="text-gray-400 text-center mt-8 animate-fade-in">
                  👋 Hi! I'm FittBox AI. Ask me anything about our meal plans,
                  delivery, or services!
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  {msg.from === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[75%] shadow-sm ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white"
                        : msg.isTyping
                        ? "bg-gray-100 text-gray-600"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {msg.isTyping ? <TypingDots /> : msg.text}
                    </div>
                  </div>
                  {msg.from === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white ml-2 flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t">
              <div className="relative">
                <input
                  className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus={open}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim()}
                >
                  <svg
                    className="w-5 h-5 transform rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
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
