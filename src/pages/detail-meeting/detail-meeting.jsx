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

  useEffect(() => {
    fetchMeetingDetail();
  }, [id]);

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

  // const handleViewSignedMinute = async () => {
  //   try {
  //     setLoading(true);
  //     setMessage("");

  //     // const res = await fetch(`http://localhost:3001/minute/${id}`, {
  //     const res = await fetch(`${API_URL}/minute/${id}`, {
  //       method: "GET",
  //       headers: {
  //         // Authorization: `Bearer ${user?.token || ""}`,
  //       },
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     console.log("data sign:", data);

  //     if (data.success && data.data?.signedMinute) {
  //       const signedUrl = data.data.signedMinute;
  //       setSignedMinute(signedUrl);
  //       window.open(signedUrl, "_blank", "noopener,noreferrer");
  //     } else {
  //       setMessage("⚠️ Biên bản hiện chưa được ký.");
  //       setSignedMinute(null);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("❌ Lỗi khi tải biên bản đã ký.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
    // if (uploaded) {
    //   setMessage("🚫 Bạn đã upload bản ghi âm này. Không thể ghi lại nữa.");
    //   return;
    // }
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
          // Authorization: `Bearer ${user?.token || ""}`,
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

  // const createMinute = async () => {
  //   const audioUrlToUse = uploadedUrl || meetingDetail?.audioUrl;

  //   if (!audioUrlToUse) {
  //     setMessage("⚠️ Hãy upload file ghi âm trước!");
  //     return;
  //   }

  //   try {
  //     setLoadingMinute(true);

  //     // const res = await fetch("http://localhost:3001/create-minute", {
  //     const res = await fetch(`${API_URL}/create-minute`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Authorization: `Bearer ${user?.token || ""}`,
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         meetingId: id,
  //         url: audioUrlToUse,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok || data.error) {
  //       throw new Error(data.error || "Lỗi khi tạo biên bản");
  //     }

  //     const officialUrl = data.data?.url;
  //     setMinuteURL(officialUrl);

  //     setMeetingDetail((prev) => ({
  //       ...prev,
  //       minutes: {
  //         ...(prev?.minutes || {}),
  //         officeMinute: officialUrl,
  //       },
  //     }));

  //     setMessage("✅ Tạo biên bản thành công!");
  //     console.log("message thanh cong");
  //   } catch (err) {
  //     setMessage(`❌ ${err.message}`);
  //   } finally {
  //     setLoadingMinute(false);
  //   }
  // };
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
          prompt: prompt || ""
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
          // Authorization: `Bearer ${user?.token || ""}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) {
        // alert("❌ Upload thất bại: " + data.error);
        setMessage(`Upload thất bại: ${data.error}`);
        return;
      }

      // alert("✅ Upload biên bản mẫu thành công!");
      setMessage("✅ Upload biên bản mẫu thành công!");
      await fetchMeetingDetail();
    } catch (err) {
      console.error(err);
      // alert("❌ Lỗi khi upload file biên bản mẫu");
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
        setMessage("Chưa có transcript cho cuộc họp này!")
      }
    } catch (error) {
      console.error("Lỗi khi gọi API transcript:", error);
      // alert("Đã xảy ra lỗi khi lấy transcript!");
      setMessage("Đã xảy ra lỗi khi lấy transcript!")
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

        <Typography variant="body2" color="text.secondary" className="sub-detail-meeting">
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
                  className={`message ${message.startsWith("✅") ? "success" : "error"
                    }`}
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
            <div className="meeting-minute-content">

              <div className="minute-header">
                <h2>Biên bản</h2>

                {meetingDetail.status === "signed" && (
                  <Typography variant="body2" color="success.main">
                    Đã gửi ký cho: {meetingDetail.minutes?.signerEmails?.join(", ")}
                  </Typography>
                )}

                {meetingDetail.status !== "signed" && (
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

              <div className="minute-body">
                {loadingMinute && (
                  <p style={{ color: "#555" }}>⏳ Đang tạo biên bản...</p>
                )}

                {meetingDetail.status === "signed" ? (
                  <p style={{ color: "#4caf50", marginTop: "10px" }}>
                    ✔ Biên bản đã hoàn tất và được ký đầy đủ.
                  </p>
                ) : (
                  <>
                    {meetingDetail?.minutes?.signedMinute ? (
                      <Typography variant="body2" color="text.secondary">
                        Xem biên bản đã ký tại: {meetingDetail.minutes.signedMinute}
                      </Typography>
                    ) : meetingDetail?.minutes?.officeMinute || minuteURL ? (
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                          minuteURL || meetingDetail.minutes.officeMinute || ""
                        )}`}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        title="Official Minute"
                      />
                    ) : meetingDetail?.minutes?.sampleMinute ? (
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                          meetingDetail.minutes.sampleMinute
                        )}`}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        title="Sample Minute"
                      />
                    ) : (
                      <p style={{ color: "#777" }}>⚠️ Chưa có biên bản nào được tải lên.</p>
                    )}
                  </>
                )}
              </div>

              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleViewSignedMinute}
                  disabled={loading || !meetingDetail.minutes?.signedMinute}
                >
                  {loading ? "Đang tải..." : "Xem biên bản đã ký"}
                </Button>
              </div>

            </div>
          </div>
        </TabPanel>

        {/* <FloatingChatBox meetingId={id} /> */}
        <FloatingChatStream meetingId={id} nameChat="Chat hỗ trợ cuộc họp" headerColor="#006b7f" />
      </TabContext>
    </Box>
  );
}
