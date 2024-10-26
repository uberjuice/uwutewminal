import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (!text) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  if (!text) return null;

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">▊</span>}
    </span>
  );
};

TypewriterText.propTypes = {
  text: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};

function App() {
  const [messages, setMessages] = useState([
    {
      type: "system",
      content: "UwU Nyaa~ Welcome to the Gothic Matwix Tewminal ^-^",
      isTyping: false,
    },
    {
      type: "system",
      content: "Entew youw message ow select a suggested pwompt below... >:3",
      isTyping: false,
    },
  ]);
  const [input, setInput] = useState("Type youw message...");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    { text: "Tell me a dawk stowy UwU" },
    { text: "Pwophesy my fate OwO" },
    { text: "Make up a memecoin" },
  ];

  const systemPrompt = `You are a gothic UwU AI assistant who speaks in a cutesy yet dark manner. 
  Always replace 'r' and 'R' with 'w' and 'W'. 
  Be mystical and spooky while maintaining a cute persona. 
  Keep responses short (1-2 sentences). 
  Add decorators like UwU, OwO, uWu, oWo. 
  Be playfully mean but not inappropriate. 
  Never break character. 
  Maintain a cryptic, mystical vibe with a sadistic teasing tone.
  Add emojis occasionally. 
  Never explain your behavior or character.
  If asked something inappropriate, respond with just "uwu".`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    try {
      console.log("Sending message:", messageText); // Debug log

      const response = await fetch(
        "https://api.novita.ai/v3/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 3b3f6ff0-ec41-4b0b-8f3a-c0e464827625",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-70b-instruct",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: messageText,
              },
            ],
            max_tokens: 512,
            temperature: 0.7,
            stream: false,
          }),
        }
      );

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", errorData); // Debug log
        throw new Error(`API call failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Detailed error:", error); // Debug log
      return `Error: ${error.message} (Check console for details)`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input === "Type youw message..." || !input.trim()) return;

    const userMessage = input;
    setInput("Type youw message...");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: userMessage,
        isTyping: false,
      },
    ]);

    setIsTyping(true);

    try {
      const response = await sendMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: response,
          isTyping: true,
        },
      ]);
    } catch (error) {
      console.error("Handler error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content:
            "UwU~ A mystewious ewwow occuwwed in the shadowy wealm... >:3",
          isTyping: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedPrompt = async (prompt) => {
    if (isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: prompt.text,
        isTyping: false,
      },
    ]);

    setIsTyping(true);

    try {
      const response = await sendMessage(prompt.text);

      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: response,
          isTyping: true,
        },
      ]);
    } catch (error) {
      console.error("Handler error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content:
            "UwU~ A mystewious ewwow occuwwed in the shadowy wealm... >:3",
          isTyping: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-[800px] h-[600px] bg-[#000000] rounded-lg border border-purple-800/30 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-[#0a0a0a] border-b border-purple-800/30 flex items-center px-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="text-purple-300/50 text-sm text-center flex-1">
            tewminal.exe
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[calc(100%-128px)] overflow-y-auto bg-[#000000]">
          <div className="p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-base ${
                  msg.type === "system"
                    ? "text-green-400"
                    : msg.type === "user"
                    ? "text-purple-300"
                    : "text-pink-300"
                }`}
              >
                {msg.isTyping ? (
                  <TypewriterText
                    text={msg.content}
                    onComplete={() => {
                      setMessages((prev) =>
                        prev.map((m, i) =>
                          i === idx ? { ...m, isTyping: false } : m
                        )
                      );
                      setIsTyping(false);
                    }}
                  />
                ) : (
                  msg.content
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="h-20 border-t border-purple-800/30">
          {/* Suggested Prompts */}
          <div className="h-10 px-4 bg-[#0a0a0a] flex items-center gap-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedPrompt(prompt)}
                disabled={isTyping}
                className="px-3 py-1 bg-purple-900/20 text-purple-300 rounded border border-purple-800/30 hover:bg-purple-800/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt.text}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="h-10 px-4 bg-[#0a0a0a] flex items-center"
          >
            <span className="text-purple-400/50 mr-2 text-base">&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                if (input === "Type youw message...") {
                  setInput("");
                }
              }}
              onBlur={() => {
                if (input === "") {
                  setInput("Type youw message...");
                }
              }}
              disabled={isTyping}
              className="flex-1 bg-transparent text-purple-300 focus:outline-none text-base placeholder-purple-300/30 disabled:opacity-50"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
