import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Mic, Stop, CloudUpload, FolderOpen } from "@mui/icons-material";
import "./audio-recorder.css";
import { AuthContext } from "../../auth/auth-context";
import { API_URL } from "../../config/api.js";

export default function AudioRecorder() {
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [uploadedAudioURL, setUploadedAudioURL] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const fetchUploadedAudio = async () => {
    if (!userEmail) return;
    try {
      // const res = await fetch(`http://localhost:3001/getSampleVoice`, {
      const res = await fetch(`${API_URL}/getSampleVoice`, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${user?.token || ""}`,
          "Content-Type": "application/json" 
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data?.sampleVoice) {
        setUploadedAudioURL(data.data.sampleVoice);
        setUploaded(true);
      }
    } catch (err) {
      console.error("Không tải được file đã upload:", err);
    }
  };

  useEffect(() => {
    fetchUploadedAudio();
  }, [userEmail]);

  const startRecording = async () => {
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        setFileName("recorded_audio.mp3");
        setUploaded(false); // chưa upload
      };

      recorder.start();
      setIsRecording(true);

      // Auto stop after 10 second
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          stopRecording();
        }
      }, 10_000);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Không thể truy cập microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadToServer = async () => {
    if (!audioBlob) {
      setMessage("❌ Chưa có file để upload");
      return;
    }
    if (!userEmail) {
      setMessage("❌ Không tìm thấy email người dùng");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", audioBlob, fileName);
      formData.append("email", userEmail);

      // const res = await fetch("http://localhost:3001/create-sample-voice", {
      const res = await fetch(`${API_URL}/create-sample-voice`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      console.log("data sample voice: ", data.data);

      if (res.ok && data.success) {
        setUploadedAudioURL(data.data.url);
        setUploaded(true);
        setMessage("✅ Upload thành công!");

        await fetchUploadedAudio();
      } else {
        setMessage(`❌ Lỗi: ${data.error || "Không rõ"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="recorder-card">
      <CardContent>
        <Typography variant="h6" className="recorder-title">
          🎙️ Tạo mẫu giọng nói
        </Typography>

        {userEmail ? (
          <Typography variant="body2">
            Email: <b>{userEmail}</b>
          </Typography>
        ) : (
          <Typography variant="body2" color="error">
            ⚠️ Bạn chưa đăng nhập
          </Typography>
        )}

        <Typography variant="body2">
          Hãy tạo mẫu giọng nói, bạn có thể sử dụng mẫu câu sau: Chào bạn, tôi
          tên là Nguyễn Văn A.
        </Typography>

        <div className="recorder-actions">
          <div className="recorder-action">
            <IconButton
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading || !userEmail}
              className={`record-btn ${isRecording ? "recording" : ""}`}
            >
              {isRecording ? <Stop /> : <Mic />}
            </IconButton>
            <Typography variant="body2">
              {isRecording ? "Dừng ghi" : "Ghi âm"}
            </Typography>
          </div>
        </div>

        {uploaded && uploadedAudioURL ? (
          <div className="audio-preview">
            <Typography>🎵 File đã upload:</Typography>
            <audio controls src={uploadedAudioURL} />
          </div>
        ) : audioURL ? (
          // Nếu chưa upload mà có file ghi âm -> hiển thị file ghi âm
          <div className="audio-preview">
            <Typography className="file-name">
              🎧 File vừa ghi: {fileName}
            </Typography>
            <audio controls src={audioURL} />
          </div>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Bạn chưa có mẫu giọng nói.
          </Typography>
        )}

        <div className="action-buttons">
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={uploadToServer}
            disabled={loading || !audioBlob || uploaded}
          >
            {uploaded ? "✅ Đã upload" : "Upload lên server"}
          </Button>
        </div>

        {loading && (
          <div className="loading-section">
            <CircularProgress size={30} />
          </div>
        )}

        {message && (
          <Typography
            className={`message ${message.startsWith("✅") ? "success" : "error"
              }`}
          >
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
