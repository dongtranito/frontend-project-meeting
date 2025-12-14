import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { API_URL } from "../../../config/api.js";
import "./send-minute-dialog.css";

export default function SendMinuteDialog({ open, handleClose, meetingId }) {
  const [email, setEmail] = useState("");
  const [signers, setSigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAddEmail = () => {
    if (email && /\S+@\S+\.\S+/.test(email)) {
      if (!signers.includes(email)) {
        setSigners([...signers, email]);
        setEmail("");
      } else {
        setMessage({ type: "warning", text: "Email đã có trong danh sách." });
      }
    } else {
      setMessage({ type: "error", text: "Vui lòng nhập email hợp lệ." });
    }
  };

  const handleRemoveEmail = (removeEmail) => {
    setSigners(signers.filter((s) => s !== removeEmail));
  };

  const handleSend = async () => {
    if (signers.length === 0) {
      setMessage({ type: "warning", text: "Vui lòng thêm ít nhất một email." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      // const res = await fetch(`http://localhost:3001/minute/${meetingId}/sign`, {
      const res = await fetch(`${API_URL}/minute/${meetingId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify({ signers }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Gửi biên bản thành công! Biên bản đã được gửi đến: ${data.result.signerEmails}`,
        });
        setSigners([]);

        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        throw new Error(data.error || "Không thể gửi biên bản.");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="create-prompt-dialog send-minute-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmailIcon sx={{ mr: 1 }} />
          Gửi Biên Bản để Ký
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Nhập email những người cần ký biên bản này theo thứ tự ký:
        </DialogContentText>

        <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
          <TextField
            label="Email người ký"
            placeholder="vd: example@gmail.com"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={handleAddEmail}
            variant="contained"
            disabled={loading || !email}
            className="add-signer-btn"
          >
            Thêm
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {signers.map((e, idx) => (
            <Chip
              key={idx}
              label={e}
              onDelete={() => handleRemoveEmail(e)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>

        {message && <Alert severity={message.type}>{message.text}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading} className="cancel-btn">
          Hủy
        </Button>
        <Button onClick={handleSend} variant="contained" disabled={loading || signers.length === 0} className="create-btn">
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Gửi biên bản"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}