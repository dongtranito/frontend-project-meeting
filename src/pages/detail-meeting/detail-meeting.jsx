import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Tab,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Mic, Stop, FolderOpen, CloudUpload, Description } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ChatBox from "../../components/chatbox/chatbox";
import "./detail-meeting.css";

export default function DetailMeeting() {
  const { id } = useParams();
  const [meetingDetail, setMeetingDetail] = useState(null);
  const [value, setValue] = useState("1");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const [loadingMinute, setLoadingMinute] = useState(false);
  const [minuteURL, setMinuteURL] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    fetchMeetingDetail();
  }, [id]);

  const fetchMeetingDetail = async () => {
    try {
      const res = await fetch(`http://localhost:3001/meeting/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setMeetingDetail(data.data);
      if (data.success && data.data?.audioUrl) {
        setUploaded(true);
      }
    } catch (err) {
      setMessage("❌ Không thể tải thông tin cuộc họp.");
    }
  };

  const handleChange = (e, newValue) => setValue(newValue);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        setFileName("recorded_audio.mp3");
      };

      recorder.start();
      setIsRecording(true);
      setMessage("");
    } catch (err) {
      setMessage("Không thể truy cập microphone");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("audio/mp3")) {
      setMessage("Vui lòng chọn tệp âm thanh hợp lệ");
      return;
    }
    setAudioBlob(file);
    setAudioURL(URL.createObjectURL(file));
    setFileName(file.name);
    setUploaded(false);
  };

  const uploadToServer = async () => {
    if (!audioBlob) return setMessage("Chưa có tệp âm thanh để tải lên");
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, fileName);
      formData.append("meetingId", id);

      const res = await fetch("http://localhost:3001/upload/record", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setUploadedUrl(data.data?.url || "");
      setUploaded(true);
      setMessage("Đã gửi mẫu giọng lên server");
    } catch (err) {
      setMessage(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTranscript = async () => {
    if (!uploaded) return setMessage("Cần upload mẫu giọng trước");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/create-transcript", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage("Đã tạo transcript thành công!");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!meetingDetail)
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );

  const createMinute = async () => {
    const audioUrlToUse = uploadedUrl || meetingDetail?.audioUrl;

    if (!audioUrlToUse) {
      showDialog("⚠️ Chưa có URL file ghi âm. Hãy upload record trước khi tạo biên bản!");
      return;
    }

    try {
      setLoadingMinute(true);
      const res = await fetch("http://localhost:3001/create-minute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          meetingId: id,
          url: audioUrlToUse,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.error || "Lỗi khi tạo biên bản");

      setMinuteURL(data.pdfUrl || "http://localhost:3001/uploads/minute.pdf");
      showDialog("✅ Biên bản đã được tạo thành công!");
    } catch (err) {
      console.error("Lỗi tạo biên bản:", err);
      showDialog("❌ Không thể tạo biên bản: " + err.message);
    } finally {
      setLoadingMinute(false);
    }

  };


  const handleUploadSampleMinute = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      alert("Vui lòng chọn file .docx hợp lệ!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("meetingId", id);

      const res = await fetch("http://localhost:3001/upload/sample-minute", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) {
        alert("❌ Upload thất bại: " + data.error);
        return;
      }

      alert("✅ Upload biên bản mẫu thành công!");
      await fetchMeetingDetail();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi upload file biên bản mẫu");
    }
  };

  return (
    <Box className="detail-meeting-container">
      <Box className="meeting-header">
        <Typography variant="h5" fontWeight="bold">
          {meetingDetail.title || "Không có tiêu đề"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {meetingDetail.description || ""}
        </Typography>
      </Box>

      <TabContext value={value}>
        <Box className="tab-header">
          <TabList onChange={handleChange} centered>
            <Tab label="Record & Transcript" value="1" />
            <Tab label="Biên bản" value="2" />
          </TabList>
        </Box>

        {/* === TAB 1 === */}
        <TabPanel value="1">
          <Card className="recorder-card">
            <CardContent>
              <Typography variant="h6" className="recorder-title">
                🎙️ Ghi âm hoặc tải tệp âm thanh
              </Typography>

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
                    id="upload-audio"
                    className="upload-input"
                    onChange={handleUpload}
                    disabled={loading}
                  />
                  <label htmlFor="upload-audio">
                    <IconButton component="span" disabled={loading} className="upload-btn">
                      <FolderOpen fontSize="large" />
                    </IconButton>
                  </label>
                  <Typography variant="body2">Tải file</Typography>
                </div>
              </div>

              {audioURL && (
                <div className="audio-preview">
                  <Typography variant="body2" className="file-name">
                    📁 {fileName}
                  </Typography>
                  <audio controls src={audioURL} />
                </div>
              )}

              {!audioURL && meetingDetail?.audioUrl && (
                <div className="audio-preview">
                  <Typography variant="body2" className="file-name">
                    🎧 Đoạn ghi âm đã lưu trên server:
                  </Typography>
                  <audio
                    controls
                    src={meetingDetail.audioUrl}
                    style={{ width: "100%", marginTop: "8px" }}
                  />
                </div>
              )}

              <div className="action-buttons">
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={uploadToServer}
                  disabled={loading || uploaded}
                >
                  {uploaded ? "✅ Đã gửi mẫu giọng" : "Gửi lên server"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={createTranscript}
                  disabled={loading || (!uploaded && !meetingDetail?.audioUrl)}
                >
                  Tạo transcript
                </Button>
              </div>

              {loading && (
                <div className="loading-section">
                  <CircularProgress size={30} />
                </div>
              )}

              {message && (
                <Typography
                  variant="body2"
                  className={`message ${message.startsWith("✅") ? "success" : "error"}`}
                >
                  {message}
                </Typography>
              )}
            </CardContent>
          </Card>
        </TabPanel>


        {/* === TAB 2 === */}
        <TabPanel value="2">
          <div className="meeting-tab">
            <div className="meeting-content">
              <div className="minute-header">
                <h2>Biên bản</h2>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={createMinute}
                  disabled={loadingMinute}
                  sx={{ mb: 2 }}
                >
                  {loadingMinute ? "Đang tạo biên bản..." : "Tạo biên bản"}
                </Button>
              </div>

              {minuteURL ? (
                <iframe
                  src={minuteURL}
                  title="Meeting Minute PDF"
                  width="100%"
                  height="600px"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    marginTop: "12px",
                  }}
                />
              ) : meetingDetail?.minutes?.sampleMinute ? (
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <p>📄 Biên bản mẫu đã được tải lên:</p>

                  <a
                    href={meetingDetail.minutes.sampleMinute}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#1976d2",
                      textDecoration: "underline",
                      wordBreak: "break-all",
                    }}
                  >
                    {meetingDetail.minutes.sampleMinute}
                  </a>

                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                      meetingDetail.minutes.sampleMinute
                    )}`}
                    width="100%"
                    height="600px"
                    title="Sample Minute Preview"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <p style={{ color: "#777" }}>
                    ⚠️ Chưa có biên bản mẫu nào được tải lên.
                  </p>

                  <Button
                    variant="outlined"
                    component="label"
                    color="secondary"
                    startIcon={<Description />}
                  >
                    📎 Thêm mẫu biên bản
                    <input
                      type="file"
                      accept=".docx"
                      hidden
                      onChange={handleUploadSampleMinute}
                    />
                  </Button>
                </div>
              )}
            </div>

            <ChatBox />
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}


