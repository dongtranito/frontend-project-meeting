import React from "react";
import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import './settings.css';
import AudioRecorder from "../../components/audio-record/audio-recorder";

export default function Settings() {

  return (
    <div className="settings-container">
      <Card sx={{ width: '100%' }}>
        <CardHeader className="item-group-container-header" title="Hồ sơ" />
        <Divider />
        <CardContent>
          <Typography variant="body2" component="div">
            <AudioRecorder />
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%' }}>
        <CardHeader className="item-group-container-header" title="Thông báo" />
        <Divider />
        <CardContent>
          <Typography variant="body2">
            Các cài đặt thông báo!!
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
