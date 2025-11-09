"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function GeminiStream() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);

  // 🔄 Tự động cuộn xuống cuối khi có dữ liệu mới
  // useEffect(() => {
  //   if (responseRef.current) {
  //     responseRef.current.scrollTop = responseRef.current.scrollHeight;
  //   }
  // }, [response]);

  // 🧩 Gửi prompt lên server và đọc stream trả về
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, meetingId: "6RyL9qPSdT3gYTgN92iJ"}),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          console.log(chunk)
          setResponse((prev) => prev + chunk);
        }
      }
    } catch (err) {
      console.error(err);
      setResponse("❌ Lỗi khi gọi API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h2>💬 Gemini Streaming Demo</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi..."
          style={{
            width: "80%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 12px",
            marginLeft: 8,
            borderRadius: 6,
            background: "#007bff",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            
          }}
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </form>

      <div
        id="response-box"
        style={{
          marginTop: 20,
          background: "#f7f7f7",
          borderRadius: 8,
          padding: 12,
          minHeight: 150,
          maxHeight: 400,
          overflowY: "auto",
          fontFamily: "monospace", 
        }}
      >
        {loading && response === "" && <p><i>⏳ Đang chờ phản hồi...</i></p>}
        {response && <ReactMarkdown>{response}</ReactMarkdown>}
      </div>
    </div>
  );
}
