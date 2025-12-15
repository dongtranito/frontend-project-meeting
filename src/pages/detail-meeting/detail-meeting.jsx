import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import {
  Mic,
  Stop,
  FolderOpen,
  CloudUpload,
  Description,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "./detail-meeting.css";
import MinuteActionsMenu from "./minute-action-menu/minute-action-menu";
import FloatingChatStream from "../../components/floating-chatbot/floating-chatbot";
import { API_URL } from "../../config/api.js";
import Header from "../../components/header/header.jsx";

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
  const navigate = useNavigate();

  const [signedMinute, setSignedMinute] = useState(null);

  const [transcript, setTranscript] = useState(null);
  
  const tabPanelRef = useRef(null);

  useEffect(() => {
    fetchMeetingDetail();
  }, [id]);

  useEffect(() => {
    if (value === "2" && tabPanelRef.current) {
      // Scroll đến TabPanel 2
      setTimeout(() => {
        tabPanelRef.current?.scrollIntoView({
          // behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [value]);

  const fetchMeetingDetail = async () => {
    try {
      // const res = await fetch(`http://localhost:3001/meeting/${id}`, {
      const res = await fetch(`${API_URL}/meeting/${id}`, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log("data meeting audio:", data.data);
      setMeetingDetail(data.data);
      if (data.success && data.data?.audioUrl) {
        setUploaded(true);
      }
    } catch (err) {
      setMessage("❌ Không thể tải thông tin cuộc họp.");
    }
  };

  const handleViewSignedMinute = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API_URL}/minute/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log("data sign:", data.data);

      // Có official nhưng chưa ký
      if (!data.data?.signedMinute) {
        setMessage("⚠️ Biên bản hiện chưa được ký.");
        setSignedMinute(null);
        return;
      }

      // Đã ký → mở file
      const signedUrl = data.data.signedMinute;
      setSignedMinute(signedUrl);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi tải biên bản đã ký.");
    } finally {
      setLoading(false);
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
        setUploaded(false);
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

    // Chỉ kiểm tra audio
    if (!file.type.startsWith("audio/")) {
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

      // const res = await fetch("http://localhost:3001/upload/record", {
      const res = await fetch(`${API_URL}/upload/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      console.log("data record meeting:", data.data);

      if (res.ok && data.success) {
        setUploadedUrl(data.data?.url || "");
        setUploaded(true);
        setMessage("Đã gửi đoạn ghi âm lên server");

        await fetchMeetingDetail();
      } else {
        setMessage(`❌ Lỗi: ${data.error || "Không rõ"}`);
      }
    } catch (err) {
      setMessage(`Lỗi: ${err.message}`);
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

  const createMinute = async (prompt) => {
    const audioUrlToUse = uploadedUrl || meetingDetail?.audioUrl;

    if (!audioUrlToUse) {
      setMessage("⚠️ Hãy upload file ghi âm trước!");
      return;
    }

    try {
      setLoadingMinute(true);

      const res = await fetch(`${API_URL}/create-minute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          meetingId: id,
          url: audioUrlToUse,
          prompt: prompt || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Lỗi khi tạo biên bản");
      }

      const officialUrl = data.data?.url;
      setMinuteURL(officialUrl);

      setMeetingDetail((prev) => ({
        ...prev,
        minutes: {
          ...(prev?.minutes || {}),
          officeMinute: officialUrl,
        },
      }));

      setMessage("✅ Tạo biên bản thành công!");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
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

      // const res = await fetch("http://localhost:3001/upload/sample-minute", {
      const res = await fetch(`${API_URL}/upload/sample-minute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) {
        setMessage(`Upload thất bại: ${data.error}`);
        return;
      }

      setMessage("✅ Upload biên bản mẫu thành công!");
      await fetchMeetingDetail();
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi upload file biên bản mẫu");
    }
  };

  const createTranscript = async () => {
    try {
      setLoading(true);
      // const res = await fetch(`http://localhost:3001/meeting/${id}`, {
      const res = await fetch(`${API_URL}/meeting/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data?.success && data?.data?.transcript) {
        setTranscript(data.data.transcript);
      } else {
        // alert("Không tìm thấy transcript cho cuộc họp này!");
        setMessage("Chưa có transcript cho cuộc họp này!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API transcript:", error);
      // alert("Đã xảy ra lỗi khi lấy transcript!");
      setMessage("Đã xảy ra lỗi khi lấy transcript!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="detail-meeting-container">
      <Box className="meeting-header">
        {/* <Typography variant="h5" fontWeight="bold">
          {meetingDetail.title || "Không có tiêu đề"}
        </Typography> */}
        <Header title={meetingDetail?.title || "Chi tiết cuộc họp"} />

        <Typography
          variant="body2"
          color="text.secondary"
          className="sub-detail-meeting"
        >
          Mô tả: {meetingDetail.description || ""}
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
          <Card className="recorder-card" sx={{ borderRadius: "12px" }}>
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
                    <IconButton
                      component="span"
                      disabled={loading}
                      className="upload-btn"
                    >
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
                  disabled={loading || !audioBlob || uploaded}
                >
                  {uploaded ? "Đã upload lên server" : "Gửi lên server"}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={createTranscript}
                  disabled={loading || !meetingDetail.minutes.officeMinute}
                >
                  {loading ? "Đang tải..." : "Hiển thị transcript"}
                </Button>
              </div>
              {transcript && (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="h6" gutterBottom>
                    Transcript:
                  </Typography>

                  <div
                    style={{
                      background: "#f9f9f9",
                      padding: "12px",
                      borderRadius: "8px",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    {transcript.segments?.map((seg, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: "8px",
                          paddingBottom: "6px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <strong style={{ color: "#1976d2" }}>
                          {seg.speaker}
                        </strong>{" "}
                        <span style={{ color: "#888" }}>[{seg.start}]</span>:
                        <span style={{ marginLeft: "4px" }}>{seg.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="loading-section">
                  <CircularProgress size={30} />
                </div>
              )}

              {message && (
                <Typography
                  variant="body2"
                  className={`message ${
                    message.startsWith("✅") ? "success" : "error"
                  }`}
                >
                  {message}
                </Typography>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* === TAB 2 === */}
        <TabPanel value="2" ref={tabPanelRef}>
          <Card
            className="meeting-tab"
            sx={{ borderRadius: "12px", boxShadow: 3 }}
          >
            <CardContent className="meeting-minute-content">
              <div className="minute-header">
                <Typography variant="h5" fontWeight="600" color="#006b7f">
                  📄 Biên bản cuộc họp
                </Typography>

                {meetingDetail.minutes?.signedMinute ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "#4caf50",
                        animation: "pulse 2s infinite",
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight="500"
                    >
                      ✓ Đã ký hoàn tất
                    </Typography>
                  </Box>
                ) : (
                  <div className="minute-actions">
                    <MinuteActionsMenu
                      createMinute={createMinute}
                      handleUploadSampleMinute={handleUploadSampleMinute}
                      navigate={navigate}
                      id={id}
                      loadingMinute={loadingMinute}
                    />
                  </div>
                )}
              </div>

              {meetingDetail.minutes?.signerEmails?.length > 0 && (
                <Box
                  sx={{
                    bgcolor: "#e8f5e9",
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 2,
                    mb: 1,
                    border: "1px solid #4caf50",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="success.dark"
                    fontWeight="500"
                  >
                    Người ký: {meetingDetail.minutes.signerEmails.join(", ")}
                  </Typography>
                </Box>
              )}

              <div className="minute-body">
                {loadingMinute ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: 2,
                    }}
                  >
                    <CircularProgress size={50} sx={{ color: "#006b7f" }} />
                    <Typography variant="body1" color="text.secondary">
                      ⏳ Đang tạo biên bản, vui lòng đợi...
                    </Typography>
                  </Box>
                ) : meetingDetail.minutes?.signedMinute ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: 2,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "#4caf50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h3" color="white">
                        ✓
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      color="success.main"
                      fontWeight="600"
                    >
                      Biên bản đã được ký hoàn tất
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      File đã ký có sẵn để xem và tải xuống
                    </Typography>
                  </Box>
                ) : meetingDetail?.minutes?.officeMinute || minuteURL ? (
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                      minuteURL || meetingDetail.minutes.officeMinute || ""
                    )}`}
                    width="100%"
                    height="100%"
                    style={{ border: "none", borderRadius: "8px" }}
                    title="Official Minute"
                  />
                ) : meetingDetail?.minutes?.sampleMinute ? (
                  <>
                    <Box
                      sx={{
                        bgcolor: "#fff3cd",
                        padding: 1.5,
                        borderRadius: 1,
                        mb: 1,
                        border: "1px solid #ffc107",
                      }}
                    >
                      <Typography variant="body2" color="warning.dark">
                        📋 Đây là biên bản mẫu. Vui lòng tạo biên bản chính
                        thức.
                      </Typography>
                    </Box>
                    <iframe
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        meetingDetail.minutes.sampleMinute
                      )}`}
                      width="100%"
                      height="100%"
                      style={{ border: "none", borderRadius: "8px" }}
                      title="Sample Minute"
                    />
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: 2,
                      color: "#999",
                    }}
                  >
                    <Description sx={{ fontSize: 80, color: "#ddd" }} />
                    <Typography variant="h6" color="text.secondary">
                      Chưa có biên bản
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hãy tạo biên bản hoặc tải lên file mẫu
                    </Typography>
                  </Box>
                )}
              </div>

              {meetingDetail.minutes?.signedMinute && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleViewSignedMinute}
                    disabled={loading}
                    sx={{
                      bgcolor: "#006b7f",
                      "&:hover": { bgcolor: "#005566" },
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Xem biên bản đã ký"
                    )}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* <FloatingChatBox meetingId={id} /> */}
        <FloatingChatStream
          meetingId={id}
          nameChat="Chat hỗ trợ cuộc họp"
          headerColor="#006b7f"
        />
      </TabContext>
    </Box>
  );
}
