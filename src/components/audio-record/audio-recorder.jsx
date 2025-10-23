import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { Mic, Stop, FolderOpen } from "@mui/icons-material";
import { IconButton, Typography, CircularProgress, Button } from "@mui/material";
import "./audio-recoder.css";
import { AuthContext } from "../../auth/auth-context";

export default function AudioRecorder() {
  const { user } = useContext(AuthContext);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    setMessage(null);
    setUploaded(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert("Không thể truy cập micro. Hãy cho phép quyền ghi âm.");
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioURL(URL.createObjectURL(file));
      setAudioBlob(file);
      setUploaded(false);
      setMessage(null);
    }
  };

  const uploadToServer = async () => {
    if (!audioBlob) {
      setMessage("Chưa có file để gửi!");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob);

      const res = await axios.post("http://localhost:3001/create-sample-voice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token || ""}`,
        },
      });

      setMessage(`Thành công! Thời lượng: ${res.data.data.duration}s`);
      setUploaded(true);
    } catch (err) {
      const msg = err.response?.data?.error || "Lỗi khi gửi file lên server.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recorder-container">
      <div className="recorder-actions">
        <div className="recorder-action">
          <IconButton
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`record-btn ${isRecording ? "recording" : ""}`}
          >
            {isRecording ? <Stop /> : <Mic />}
          </IconButton>
          <Typography variant="body2">
            {isRecording ? "Dừng ghi" : "Ghi âm"}
          </Typography>
        </div>

        <div className="recorder-action">
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            id="upload-audio"
            className="upload-input"
          />
          <label htmlFor="upload-audio">
            <IconButton component="span" disabled={loading} className="upload-btn">
              <FolderOpen />
            </IconButton>
          </label>
          <Typography variant="body2">Tải file</Typography>
        </div>
      </div>

      {audioBlob && !isRecording && (
        <Button
          variant="contained"
          onClick={uploadToServer}
          disabled={loading}
          className={`send-btn ${uploaded ? "sent" : ""}`}
        >
          {uploaded ? "Đã gửi mẫu giọng" : "Gửi lên server"}
        </Button>
      )}

      {loading && <CircularProgress size={24} className="loading" />}

      {message && (
        <Typography
          variant="body2"
          className={`message ${message.startsWith("✅") ? "success" : "error"}`}
        >
          {message}
        </Typography>
      )}

      {audioURL && <audio controls src={audioURL} className="audio-player" />}
    </div>
  );
}
