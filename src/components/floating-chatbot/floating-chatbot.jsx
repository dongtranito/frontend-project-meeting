import React, { useState, useRef, useEffect } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";
import "./floating-chatbot.css";
import { API_URL } from "../../config/api.js";

export default function FloatingChatStream({ groupId, meetingId, nameChat, headerColor }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: 0,
      sender: "system",
      text: "💬 Xin chào! Tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const messageIdRef = useRef(1);

  const toggleChat = () => setOpen((prev) => !prev);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const chatTargetId = groupId || meetingId;

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsgId = messageIdRef.current++;
    const botMsgId = messageIdRef.current++;

    // Add message of user and create placeholder for chat bot
    setChatHistory((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: message },
      { id: botMsgId, sender: "system", text: "" },
    ]);
    const currentMessage = message; // keep value before reset
    setMessage("");
    setLoading(true);

    if (!chatTargetId) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: messageIdRef.current++,
          sender: "system",
          text: "⚠️ Không tìm thấy groupId hoặc meetingId.",
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      // const res = await fetch("http://localhost:3001/chat", {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify({
          prompt: currentMessage,
          ...(groupId ? { groupId } : { meetingId }),
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          // update correctly chat bot by ID
          setChatHistory((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? { ...msg, text: (msg.text || "") + chunk }
                : msg
            )
          );
        }
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: messageIdRef.current++,
          sender: "system",
          text: `❌ Lỗi khi gọi API: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox-wrapper">
      <>
        <IconButton onClick={toggleChat} className="chat-toggle-btn">
          {/* {open ? <CloseIcon /> : <ChatIcon />} */}
          <img
            src="/chatbot.png"
            alt="Chat Toggle"
            className="chat-toggle-img"
          />
        </IconButton>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              className="chatbox-container"
            >
              <div
                className="chatbox-header"
                style={{ backgroundColor: headerColor }}
              >
                <span>{nameChat}</span>
                <IconButton
                  onClick={toggleChat}
                  size="small"
                  className="chatbox-close-btn"
                >
                  <CloseIcon fontSize="small" style={{ color: "white" }} />
                </IconButton>
              </div>

              <div className="chatbox-content">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${msg.sender === "user" ? "user" : "system"
                      }`}
                  >
                    <div className="chat-bubble">{msg.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>

              <div className="chatbox-input-area">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={loading}
                  className="chatbox-send-btn"
                >
                  {loading ? <CircularProgress size={18} /> : <SendIcon style={{color: headerColor}}/>}
                </IconButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </div>
  );
}
