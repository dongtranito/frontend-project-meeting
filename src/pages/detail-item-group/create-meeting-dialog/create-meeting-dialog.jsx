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
import {
  renderTimeViewClock,
} from '@mui/x-date-pickers/timeViewRenderers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { API_URL } from "../../../config/api.js";


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
    const { groupName, description } = Object.fromEntries(formData.entries());

    if (!selectedDate || !selectedTime) {
      setError("Vui lòng chọn ngày và giờ hợp lệ!");
      return;
    }

    const scheduledAt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    if (scheduledAt < new Date()) {
      setError("Ngày và giờ không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      // 🔹 1️⃣ Tạo meeting trước
      // const response = await fetch("http://localhost:3001/create-meeting", {
      const response = await fetch(`${API_URL}/create-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          groupId,
          title: groupName,
          description,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Không thể tạo cuộc họp");

      const meetingId = result.data.meetingId; // 🔹 lấy ID meeting vừa tạo

      // 🔹 2️⃣ Nếu có file, upload sample minute gắn với meetingId
      if (metaFile && meetingId) {
        const fileForm = new FormData();
        fileForm.append("file", metaFile);
        fileForm.append("meetingId", meetingId);

        // const uploadRes = await fetch("http://localhost:3001/upload/sample-minute", {
        const uploadRes = await fetch(`${API_URL}/upload/sample-minute`, {
          method: "POST",
          body: fileForm,
          credentials: "include",
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error("Upload biên bản mẫu thất bại");
      }

      // 🔹 3️⃣ Đóng dialog và refresh danh sách
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
          <DialogTitle>Tạo cuộc họp</DialogTitle>

          <DialogContent>
            <DialogContentText>Nhập tên cuộc họp:</DialogContentText>
            <TextField
              required
              name="groupName"
              label="Tên cuộc họp"
              fullWidth
              variant="outlined"
              margin="dense"
            />

            <DialogContentText>Nhập mô tả cuộc họp:</DialogContentText>
            <TextField
              required
              name="description"
              label="Mô tả cuộc họp"
              fullWidth
              variant="outlined"
              margin="dense"
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DialogContentText>Nhập ngày:</DialogContentText>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: { fullWidth: true, margin: "dense", variant: "outlined" },
                }}
              />

              <DialogContentText>Nhập giờ:</DialogContentText>
              {/* <TimePicker
                label="Chọn giờ"
                ampm
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                slotProps={{
                  textField: { fullWidth: true, margin: "dense", variant: "outlined" },
                }}
              /> */}
              <TimePicker
                label="Chọn giờ"
                ampm
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
                slots={{
                  openPickerIcon: AccessTimeIcon,
                }}
                slotProps={{
                  textField: { fullWidth: true, margin: "dense", variant: "outlined" },
                  
                }}
                
              />
            </LocalizationProvider>

            <DialogContentText>Meta data:</DialogContentText>
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
            <Button onClick={handleClose} className="cancel-btn">
              Hủy
            </Button>
            <Button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
