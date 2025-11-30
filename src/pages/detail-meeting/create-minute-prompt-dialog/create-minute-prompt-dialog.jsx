import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogContentText
} from "@mui/material";
import './create-minute-prompt-dialog.css';

export default function CreateMinutePromptDialog({ open, onClose, onSubmit }) {
  const [prompt, setPrompt] = useState("");

  const handleCreate = () => {
    onSubmit(prompt); 
    setPrompt("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="create-prompt-dialog"
    >
      <DialogTitle>Nhập Prompt tạo biên bản</DialogTitle>

      <DialogContent>
        <DialogContentText>Nhập nội dung Prompt:</DialogContentText>

        <TextField
          label="Prompt"
          fullWidth
          multiline
          minRows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Nhập hướng dẫn để tạo biên bản..."
          className="prompt-input"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="cancel-btn">Hủy</Button>
        <Button variant="contained" onClick={handleCreate} className="create-btn">
          Tạo biên bản
        </Button>
      </DialogActions>
    </Dialog>
  );
}
