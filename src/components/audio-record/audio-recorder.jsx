// import React, { useState, useRef, useContext } from "react";
// import { IconButton, Typography, Box, CircularProgress, Button } from "@mui/material";
// import { Mic, Stop, FolderOpen } from "@mui/icons-material";
// import axios from "axios";
// import { AuthContext } from "../../auth/auth-context";

// // export default function AudioRecorder() {
// //   const { user } = useContext(AuthContext);

// //   const [isRecording, setIsRecording] = useState(false);
// //   const [audioURL, setAudioURL] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState(null);

// //   const mediaRecorderRef = useRef(null);
// //   const audioChunks = useRef([]);

// //   // Bắt đầu ghi
// //   const startRecording = async () => {
// //     setMessage(null);
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //       const mediaRecorder = new MediaRecorder(stream);
// //       mediaRecorderRef.current = mediaRecorder;
// //       audioChunks.current = [];

// //       mediaRecorder.ondataavailable = (event) => {
// //         audioChunks.current.push(event.data);
// //       };

// //       mediaRecorder.onstop = async () => {
// //         const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
// //         const url = URL.createObjectURL(audioBlob);
// //         setAudioURL(url);

// //         // 👇 Gửi tới backend
// //         await uploadToServer(audioBlob);
// //       };

// //       mediaRecorder.start();
// //       setIsRecording(true);
// //     } catch (error) {
// //       alert("Không thể truy cập micro. Hãy cho phép quyền ghi âm.");
// //       console.error(error);
// //     }
// //   };

// //   // Dừng ghi
// //   const stopRecording = () => {
// //     mediaRecorderRef.current.stop();
// //     mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
// //     setIsRecording(false);
// //   };

// //   // Upload file ghi âm hoặc file chọn
// //   const handleUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setAudioURL(URL.createObjectURL(file));
// //       uploadToServer(file);
// //     }
// //   };

// //   // Gửi file lên API backend
// //   const uploadToServer = async (file) => {
// //     setLoading(true);
// //     setMessage(null);
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);

// //       const res = await axios.post("http://localhost:3001/create-sample-voice", formData, {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //           Authorization: `Bearer ${user?.token || ""}`, // nếu bạn có xác thực JWT
// //         },
// //       });

// //       setMessage(`✅ Thành công! Thời lượng: ${res.data.data.duration}s`);
// //     } catch (err) {
// //       const msg = err.response?.data?.error || "Lỗi khi gửi file lên server.";
// //       setMessage(`❌ ${msg}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         border: "1px solid #a0b0b0",
// //         borderRadius: 2,
// //         p: 2,
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         gap: 2,
// //         width: 400,
// //         mx: "auto",
// //       }}
// //     >
// //       {/* Ghi âm + Upload */}
// //       <Box sx={{ display: "flex", justifyContent: "center", gap: 6 }}>
// //         <Box sx={{ textAlign: "center" }}>
// //           <IconButton onClick={isRecording ? stopRecording : startRecording} disabled={loading}>
// //             {isRecording ? (
// //               <Stop sx={{ color: "red", fontSize: 28 }} />
// //             ) : (
// //               <Mic sx={{ color: "red", fontSize: 28 }} />
// //             )}
// //           </IconButton>
// //           <Typography variant="body2">
// //             {isRecording ? "Stop record" : "Start record"}
// //           </Typography>
// //         </Box>

// //         <Box sx={{ textAlign: "center" }}>
// //           <input
// //             type="file"
// //             accept="audio/*"
// //             onChange={handleUpload}
// //             style={{ display: "none" }}
// //             id="upload-audio"
// //           />
// //           <label htmlFor="upload-audio">
// //             <IconButton component="span" disabled={loading}>
// //               <FolderOpen sx={{ color: "#77a1a1", fontSize: 28 }} />
// //             </IconButton>
// //           </label>
// //           <Typography variant="body2">Upload record</Typography>
// //         </Box>
// //       </Box>

// //       {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
// //       {message && <Typography variant="body2">{message}</Typography>}

// //       {/* Nghe lại */}
// //       {audioURL && (
// //         <audio controls src={audioURL} style={{ marginTop: 8, width: "100%" }} />
// //       )}
// //     </Box>
// //   );
// // }


// export default function AudioRecorder() {
//   const { user } = useContext(AuthContext);

//   const [isRecording, setIsRecording] = useState(false);
//   const [audioURL, setAudioURL] = useState(null);
//   const [audioBlob, setAudioBlob] = useState(null); // ✅ lưu file để gửi sau
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [uploaded, setUploaded] = useState(false); // ✅ trạng thái "đã gửi mẫu giọng"

//   const mediaRecorderRef = useRef(null);
//   const audioChunks = useRef([]);

//   // ✅ Bắt đầu ghi
//   const startRecording = async () => {
//     setMessage(null);
//     setUploaded(false);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunks.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         audioChunks.current.push(event.data);
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(audioChunks.current, { type: "audio/webm" });
//         const url = URL.createObjectURL(blob);
//         setAudioBlob(blob);
//         setAudioURL(url);
//         setIsRecording(false);
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       alert("⚠️ Không thể truy cập micro. Hãy cho phép quyền ghi âm.");
//       console.error(error);
//     }
//   };

//   // ✅ Dừng ghi
//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
//     }
//   };

//   // ✅ Upload file ghi âm hoặc file chọn từ máy
//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAudioURL(URL.createObjectURL(file));
//       setAudioBlob(file);
//       setUploaded(false);
//       setMessage(null);
//     }
//   };

//   // ✅ Gửi file lên backend (chỉ khi bấm nút "Gửi lên server")
//   const uploadToServer = async () => {
//     if (!audioBlob) {
//       setMessage("⚠️ Chưa có file để gửi!");
//       return;
//     }

//     setLoading(true);
//     setMessage(null);
//     try {
//       const formData = new FormData();
//       formData.append("file", audioBlob);

//       const res = await axios.post("http://localhost:3001/create-sample-voice", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${user?.token || ""}`,
//         },
//       });

//       setMessage(`✅ Thành công! Thời lượng: ${res.data.data.duration}s`);
//       setUploaded(true);
//     } catch (err) {
//       const msg = err.response?.data?.error || "❌ Lỗi khi gửi file lên server.";
//       setMessage(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         border: "1px solid #a0b0b0",
//         borderRadius: 2,
//         p: 2,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 2,
//         width: 400,
//         mx: "auto",
//       }}
//     >
//       {/* Ghi âm + Upload */}
//       <Box sx={{ display: "flex", justifyContent: "center", gap: 6 }}>
//         <Box sx={{ textAlign: "center" }}>
//           <IconButton
//             onClick={isRecording ? stopRecording : startRecording}
//             disabled={loading}
//           >
//             {isRecording ? (
//               <Stop sx={{ color: "red", fontSize: 28 }} />
//             ) : (
//               <Mic sx={{ color: "red", fontSize: 28 }} />
//             )}
//           </IconButton>
//           <Typography variant="body2">
//             {isRecording ? "Dừng ghi" : "Ghi âm"}
//           </Typography>
//         </Box>

//         <Box sx={{ textAlign: "center" }}>
//           <input
//             type="file"
//             accept="audio/*"
//             onChange={handleUpload}
//             style={{ display: "none" }}
//             id="upload-audio"
//           />
//           <label htmlFor="upload-audio">
//             <IconButton component="span" disabled={loading}>
//               <FolderOpen sx={{ color: "#77a1a1", fontSize: 28 }} />
//             </IconButton>
//           </label>
//           <Typography variant="body2">Tải file</Typography>
//         </Box>
//       </Box>

//       {/* Nút gửi lên backend */}
//       {audioBlob && !isRecording && (
//         <Button
//           variant="contained"
//           onClick={uploadToServer}
//           disabled={loading}
//           sx={{
//             mt: 1,
//             backgroundColor: uploaded ? "#4caf50" : "#1976d2",
//             "&:hover": { backgroundColor: uploaded ? "#45a049" : "#1565c0" },
//           }}
//         >
//           {uploaded ? "Đã gửi mẫu giọng" : "Gửi lên server"}
//         </Button>
//       )}

//       {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
//       {message && (
//         <Typography
//           variant="body2"
//           sx={{ color: message.startsWith("✅") ? "green" : "red", mt: 1 }}
//         >
//           {message}
//         </Typography>
//       )}

//       {/* Nghe lại */}
//       {audioURL && (
//         <audio controls src={audioURL} style={{ marginTop: 8, width: "100%" }} />
//       )}
//     </Box>
//   );
// }


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
      alert("⚠️ Không thể truy cập micro. Hãy cho phép quyền ghi âm.");
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
      setMessage("⚠️ Chưa có file để gửi!");
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

      setMessage(`✅ Thành công! Thời lượng: ${res.data.data.duration}s`);
      setUploaded(true);
    } catch (err) {
      const msg = err.response?.data?.error || "❌ Lỗi khi gửi file lên server.";
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
