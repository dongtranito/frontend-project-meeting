import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AuthContext } from "../../../auth/auth-context";
import { vi } from "date-fns/locale";
import "./create-meeting-dialog.css";

export default function CreateMeetingDialog({ groupId, onCreated }) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metaFile, setMetaFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { groupName } = Object.fromEntries(formData.entries());

    if (!selectedDate || !selectedTime) {
      setError("Vui lòng chọn ngày và giờ hợp lệ!");
      return;
    }

    // ✅ Gộp ngày & giờ
    const scheduledAt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    // ❌ Kiểm tra thời gian trong quá khứ
    const now = new Date();
    if (scheduledAt < now) {
      setError("Ngày và giờ không hợp lệ! Vui lòng chọn thời gian trong tương lai.");
      return;
    }

    setLoading(true);
    try {
      let metaUrl = null;

      // ✅ Upload file metadata (nếu có)
      if (metaFile) {
        const fileForm = new FormData();
        fileForm.append("file", metaFile);

        const res = await fetch("http://localhost:3001/upload/metadata", {
          method: "POST",
          body: fileForm,
        });
        const data = await res.json();
        if (data.success) metaUrl = data.data.url;
      }

      // ✅ Tạo cuộc họp
      const response = await fetch("http://localhost:3001/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          groupId,
          title: groupName,
          scheduledAt: scheduledAt.toISOString(),
          metaData: metaUrl ? { url: metaUrl } : {},
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Không thể tạo cuộc họp");

      if (onCreated) onCreated();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Tạo cuộc họp
      </Button>

      <Dialog open={open} onClose={handleClose} className="create-meeting-dialog">
        <form onSubmit={handleSubmit}>
          <DialogTitle className="dialog-title">Tạo cuộc họp</DialogTitle>

          <DialogContent className="dialog-content">
            <DialogContentText>Nhập tên cuộc họp.</DialogContentText>
            <TextField
              required
              name="groupName"
              label="Tên cuộc họp"
              fullWidth
              variant="outlined"
              margin="dense"
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DialogContentText>Nhập ngày.</DialogContentText>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: { fullWidth: true, margin: "dense", variant: "outlined" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fafafa",
                  },
                }}
              />

              <DialogContentText>Nhập giờ.</DialogContentText>
              <TimePicker
                label="Chọn giờ"
                ampm
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                slotProps={{
                  textField: { fullWidth: true, margin: "dense", variant: "outlined" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fafafa",
                  },
                }}
              />
            </LocalizationProvider>

            <DialogContentText>Meta data.</DialogContentText>
            <Button variant="outlined" component="label" fullWidth>
              Chọn file meta data
              <input
                hidden
                type="file"
                onChange={(e) => setMetaFile(e.target.files[0])}
              />
            </Button>
            {metaFile && <p className="file-name">📄 {metaFile.name}</p>}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar thông báo lỗi */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        message={error}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </React.Fragment>
  );
}
