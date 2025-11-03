import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Alert
} from "@mui/material";
import "./update-meeting-dialog.css";

export default function UpdateMeetingDialog({
    open,
    onClose,
    loading,
    newTitle,
    newDescription,
    setNewTitle,
    setNewDescription,
    handleUpdateMeeting,
    message,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                className: "update-meeting-dialog",
            }}
        >
            <DialogTitle className="update-meeting-title">Cập nhật cuộc họp</DialogTitle>

            <DialogContent className="update-meeting-content">
                <TextField
                    fullWidth
                    label="Tên cuộc họp"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    className="update-meeting-input"
                    disabled={loading}
                />
                <TextField
                    fullWidth
                    label="Mô tả cuộc họp"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    variant="outlined"
                    margin="dense"
                    className="update-meeting-input"
                    disabled={loading}
                />

                {message && (
                    <Alert severity={message.type} sx={{ mt: 2 }}>
                        {message.text}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions className="update-meeting-actions">
                <Button onClick={onClose} variant="outlined" disabled={loading}>
                    Hủy
                </Button>
                <Button
                    onClick={handleUpdateMeeting}
                    variant="contained"
                    disabled={loading}
                >
                    {/* {loading ? <CircularProgress size={24} color="inherit" /> : "Lưu"} */}
                    {loading ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>


    );
}
