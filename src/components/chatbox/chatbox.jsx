import React, { useState } from "react";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import "./chatbox.css";
import { API_URL } from "../../config/api.js";

export default function ChatBox() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // === Khi chọn file từ trình duyệt ===
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // === Khi nhấn nút gửi ===
  const handleSend = async () => {
    if (selectedFiles.length === 0) {
      alert("Vui lòng chọn ít nhất 1 tệp để tải lên!");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);
      // const res = await fetch("http://localhost:3001/upload/metadata", {
      const res = await fetch(`${API_URL}/upload/metadata`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi khi tải file");

      alert("✅ Tải file thành công!");
      setSelectedFiles([]);
      setMessage("");
    } catch (err) {
      console.error("❌ Upload lỗi:", err);
      alert("Không thể tải file lên server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <input
        id="file-input"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="file-input">
        <IconButton component="span" className="chatbox-add-btn" size="small">
          <AddIcon fontSize="medium" />
        </IconButton>
      </label>

      <input
        type="text"
        className="chatbox-input"
        placeholder="Nhập tin nhắn hoặc chọn file..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <IconButton
        className="chatbox-send-btn"
        onClick={handleSend}
        disabled={loading}
      >
        <SendIcon />
      </IconButton>

      {selectedFiles.length > 0 && (
        <div className="file-preview">
          {selectedFiles.map((file, i) => (
            <p key={i}>📎 {file.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}
