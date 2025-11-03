// import React, { useState, useRef, useContext } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import { Mic, Stop, CloudUpload } from "@mui/icons-material";
// import { AuthContext } from "../../auth/auth-context";
// import "./audio-recorder.css";
// export default function AudioRecorder() {
//   const { user } = useContext(AuthContext);
//   const userEmail = user?.email;

//   const [isRecording, setIsRecording] = useState(false);
//   const [audioURL, setAudioURL] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [uploadedAudioURL, setUploadedAudioURL] = useState(null);


//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const handleStartRecording = async () => {
//     setMessage("");
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       audioChunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const mimeType = mediaRecorderRef.current.mimeType || "audio/mp3";
//         const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
//         const url = URL.createObjectURL(audioBlob);
//         setAudioURL(url);
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Không thể ghi âm:", err);
//       setMessage("Trình duyệt không cho phép truy cập micro.");
//     }
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const handleUpload = async () => {
//     if (!audioURL) {
//       setMessage("Bạn cần ghi âm trước khi upload!");
//       return;
//     }
//     if (!userEmail) {
//       setMessage("Không tìm thấy email người dùng.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const audioBlob = new Blob(audioChunksRef.current, {
//         type: mediaRecorderRef.current.mimeType || "audio/mp3",
//       });
//       const formData = new FormData();
//       formData.append("file", audioBlob, "sample.mp3");
//       formData.append("email", userEmail);

//       const res = await fetch("http://localhost:3001/create-sample-voice", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Upload thành công!");
//         console.log("Server response:", data);
//         setUploadedAudioURL(data.url);
//       } else {
//         setMessage(`Lỗi: ${data.error || "Không rõ"}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage(" Upload thất bại!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // <div className="audio-recorder-container">
//     //   <h2>Tạo mẫu giọng nói</h2>
//     //   {userEmail ? (
//     //     <p>Email: <b>{userEmail}</b></p>
//     //   ) : (
//     //     <p className="warning-text">⚠️ Bạn chưa đăng nhập</p>
//     //   )}

//     //   <div className="recorder-controls">
//     //     {!isRecording ? (
//     //       <button
//     //         onClick={handleStartRecording}
//     //         disabled={loading || !userEmail}
//     //         className="btn record-btn"
//     //       >
//     //         🎙️ Bắt đầu ghi âm
//     //       </button>
//     //     ) : (
//     //       <button
//     //         onClick={handleStopRecording}
//     //         disabled={loading}
//     //         className="btn stop-btn"
//     //       >
//     //         ⏹ Dừng ghi âm
//     //       </button>
//     //     )}
//     //   </div>

//     //   {audioURL && (
//     //     <div className="audio-section">
//     //       <audio src={audioURL} controls />
//     //       <button
//     //         onClick={handleUpload}
//     //         disabled={loading}
//     //         className="btn upload-btn"
//     //       >
//     //         {loading ? "Đang upload..." : "⬆️ Upload mẫu giọng nói"}
//     //       </button>
//     //     </div>
//     //   )}

//     //   {message && <p className="message-text">{message}</p>}
//     // </div>
//     <Card className="recorder-card">
//       <CardContent>
//         <Typography variant="h6" className="recorder-title">
//           🎙️ Tạo mẫu giọng nói
//         </Typography>

//         {userEmail ? (
//           <Typography variant="body2">
//             Email: <b>{userEmail}</b>
//           </Typography>
//         ) : (
//           <Typography variant="body2" color="error">
//             ⚠️ Bạn chưa đăng nhập
//           </Typography>
//         )}

//         {/* 🎛 Nút ghi âm */}
//         <div className="recorder-actions">
//           <IconButton
//             onClick={isRecording ? handleStopRecording : handleStartRecording}
//             disabled={loading || !userEmail}
//             className={`record-btn ${isRecording ? "recording" : ""}`}
//           >
//             {isRecording ? <Stop /> : <Mic />}
//           </IconButton>
//           <Typography variant="body2">
//             {isRecording ? "Dừng ghi" : "Ghi âm"}
//           </Typography>
//         </div>

//         {/* 🔊 Hiển thị audio sau khi ghi */}
//         {audioURL && (
//           <div className="audio-preview">
//             <Typography variant="body2" className="file-name">
//               🎧 Đã ghi xong
//             </Typography>
//             <audio controls src={audioURL} style={{ width: "100%", marginTop: 8 }} />
//           </div>
//         )}

//         {/* Audio đã upload */}
//         {uploadedAudioURL && (
//           <div className="audio-preview uploaded">
//             <Typography variant="body2">🎵 Mẫu giọng nói đã upload</Typography>
//             <audio controls src={uploadedAudioURL} style={{ width: "100%", marginTop: 8 }} />
//           </div>
//         )}

//         {/* 📤 Nút upload */}
//         {audioURL && (
//           <div className="action-buttons">
//             <Button
//               variant="contained"
//               startIcon={<CloudUpload />}
//               onClick={handleUpload}
//               disabled={loading}
//             >
//               {loading ? "Đang upload..." : "Upload mẫu giọng nói"}
//             </Button>
//           </div>
//         )}

//         {/* ⏳ Loading */}
//         {loading && (
//           <div className="loading-section">
//             <CircularProgress size={30} />
//           </div>
//         )}

//         {/* ✅ / ❌ Thông báo */}
//         {message && (
//           <Typography
//             variant="body2"
//             className={`message ${message.startsWith("✅") ? "success" : "error"}`}
//           >
//             {message}
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

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
import './audio-recorder.css';
import { AuthContext } from "../../auth/auth-context";

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

  useEffect(() => {
    const fetchUploadedAudio = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(
          `http://localhost:3001/getSampleVoice`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success && data.data?.sampleVoice) {
          setUploadedAudioURL(data.data.sampleVoice);
          setUploaded(true);
        }
      } catch (err) {
        console.error("Không tải được file đã upload:", err);
      }
    };
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

  // === Upload lên server ===
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

      const res = await fetch("http://localhost:3001/create-sample-voice", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadedAudioURL(data.data.url);
        setUploaded(true);
        setMessage("✅ Upload thành công!");
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
        <Typography variant="h6" className="recorder-title">🎙️ Tạo mẫu giọng nói</Typography>

        {userEmail ? (
          <Typography variant="body2">Email: <b>{userEmail}</b></Typography>
        ) : (
          <Typography variant="body2" color="error">⚠️ Bạn chưa đăng nhập</Typography>
        )}

        <div className="recorder-actions">
          <div className="recorder-action">
            <IconButton
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading || !userEmail}
              className={`record-btn ${isRecording ? "recording" : ""}`}
            >
              {isRecording ? <Stop /> : <Mic />}
            </IconButton>
            <Typography variant="body2">{isRecording ? "Dừng ghi" : "Ghi âm"}</Typography>
          </div>
        </div>

        {audioURL && (
          <div className="audio-preview">
            <Typography className="file-name">🎧 File vừa ghi / chọn: {fileName}</Typography>
            <audio controls src={audioURL} />
          </div>
        )}

        {uploadedAudioURL && uploaded && (
          <div className="audio-preview">
            <Typography>🎵 File đã upload:</Typography>
            <audio controls src={uploadedAudioURL} />
          </div>
        )}

        <div className="action-buttons">
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={uploadToServer}
            disabled={loading || uploaded}
          >
            {uploaded ? "✅ Đã upload" : "Upload lên server"}
          </Button>
        </div>

        {loading && <div className="loading-section"><CircularProgress size={30} /></div>}

        {message && (
          <Typography
            className={`message ${message.startsWith("✅") ? "success" : "error"}`}
          >
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
