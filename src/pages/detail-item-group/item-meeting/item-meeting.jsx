import React from "react";
import "./item-meeting.css";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function MeetingItem({ meeting }) {
  const { title, scheduledAt, status } = meeting;

  // ✅ Xác định màu chip theo trạng thái
  const getStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "hoàn thành":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Hoàn thành"
            color="success"
            size="small"
          />
        );
      case "canceled":
      case "đã hủy":
        return (
          <Chip
            icon={<CancelIcon />}
            label="Đã hủy"
            color="error"
            size="small"
          />
        );
      default:
        return (
          <Chip
            icon={<HourglassEmptyIcon />}
            label="Đang chờ"
            color="warning"
            size="small"
          />
        );
    }
  };

  return (
    <Card className="meeting-item-card" variant="outlined">
      <CardContent>
        <Typography variant="h6" className="meeting-title" gutterBottom>
          {title || "Cuộc họp chưa có tên"}
        </Typography>

        <div className="meeting-info-row">
          <EventIcon className="meeting-icon" />
          <Typography variant="body2" color="text.secondary">
            Ngày họp:{" "}
            <b>{new Date(scheduledAt).toLocaleString("vi-VN")}</b>
          </Typography>
        </div>

        <div className="meeting-info-row">
          <AccessTimeIcon className="meeting-icon" />
          <Typography variant="body2" color="text.secondary">
            Trạng thái:
          </Typography>
          {getStatusChip(status)}
        </div>
      </CardContent>
    </Card>
  );
}
