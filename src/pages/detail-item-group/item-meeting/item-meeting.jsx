import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  DialogContentText,
  Box,
} from "@mui/material";
import "./item-meeting.css";
import UpdateMeetingDialog from "./update-meeting-dialog/update-meeting-dialog";
import { API_URL } from "../../../config/api.js";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function MeetingItem({ meeting, onUpdated, onDeleted, isOwner }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [newTitle, setNewTitle] = useState(meeting.title);
  const [newDescription, setNewDescription] = useState(meeting.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleClose = () => {
    setOpenUpdate(false);
    setMessage(null);
  };

  const handleDeleteMeeting = async () => {
    try {
      // const res = await fetch(`http://localhost:3001/delete-meeting/${meeting.meetingId}`, {
      const res = await fetch(
        `${API_URL}/delete-meeting/${meeting.meetingId}`,
        {
          method: "DELETE",
          headers: {
            // Authorization: `Bearer ${user?.token || ""}`,
          },
          credentials: "include",
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message);

      onDeleted(meeting.meetingId);

      setMessage({ type: "success", text: "Xóa cuộc họp thành công!" });
      setOpenConfirm(false);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setMessage({ type: "error", text: "Không thể xóa cuộc họp." });
    }
  };

  const handleUpdateMeeting = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // const res = await fetch(`http://localhost:3001/update-meeting/${meeting.meetingId}`, {
      const res = await fetch(
        `${API_URL}/update-meeting/${meeting.meetingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      if (onUpdated) onUpdated(data.data);
      setMessage({ type: "success", text: "Cập nhật thành công!" });

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setMessage({ type: "error", text: "Không thể cập nhật cuộc họp." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="meeting-item"
      onClick={(e) => {
        if (openConfirm || openUpdate) return;
        navigate(`/meeting/${meeting.meetingId}`);
      }}
      sx={{ borderRadius: "12px", cursor: "pointer" }}
    >
      <CardContent>
        <div className="meeting-header">
          <Typography variant="h6" className="meeting-title">
            {meeting.title}
          </Typography>

          <Typography variant="body1" className="meeting-description">
            {meeting.description}
          </Typography>

          <Typography variant="body2" className="meeting-time">
            🕒 {new Date(meeting.scheduledAt).toLocaleString()}
          </Typography>

          <Typography
            variant="body2"
            className={`meeting-status ${meeting.minutes
                ? meeting.status === "signed"
                  ? "signed"
                  : "unsigned"
                : "no-minutes"
              }`}
          >
            {meeting.minutes
              ? meeting.status === "signed"
                ? "Biên bản đã được ký"
                : "Biên bản chưa được ký"
              : "Chưa có biên bản"}
          </Typography>

        </div>

        {isOwner && (
          <div className="meeting-actions">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpenUpdate(true);
              }}
              className="btn-update"
            >
              Cập nhật
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpenConfirm(true);
              }}
              disabled={loading}
              className="btn-delete"
            >
              Xóa
            </Button>
          </div>
        )}

      </CardContent>

      <UpdateMeetingDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        loading={loading}
        newTitle={newTitle}
        newDescription={newDescription}
        setNewTitle={setNewTitle}
        setNewDescription={setNewDescription}
        handleUpdateMeeting={handleUpdateMeeting}
        message={message}
      />

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        className="create-prompt-dialog confirmation-dialog"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningAmberIcon sx={{ mr: 1 }} />
            Xác nhận
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có muốn xóa cuộc họp <strong>{meeting.title}</strong> khỏi nhóm không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} className="cancel-btn">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteMeeting}
            className="create-btn"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        message={error}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Card>
  );
}
