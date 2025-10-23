import React from "react";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import "./chatbox.css";

export default function ChatBox() {
  return (
    <div className="chatbox">
      {/* <IconButton className="chatbox-icon">
        <AddIcon />
        
      </IconButton> */}
      <IconButton
        variant="outlined"
        component="label"
        className="upload-btn"
      >
        <AddIcon />
        <input hidden accept="*" type="file" />
      </IconButton>
      <input
        type="text"
        className="chatbox-input"
        placeholder="Nhập tin nhắn..."
      />
      <IconButton className="chatbox-icon">
        <SendIcon />
      </IconButton>
    </div>
  );
}
