// import { useState } from "react";

// function UploadAudio() {
//   const [file, setFile] = useState(null);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [url, setUrl] = useState(null);

//   const handleChange = (e) => {
//     setFile(e.target.files?.[0] || null);
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Chưa chọn file!");

//     const formData = new FormData();
//     formData.append("audio", file);
//     console.log("formDatahihi", formData);
//     const res = await fetch("http://localhost:4000/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();
//     console.log("Upload response:", data);
//     setUploadedFile(data.file);
//     setUrl(data.url);
//   };

//   return (
//     <div>
//       <h2>Upload file ghi âm</h2>
//       <input type="file" accept="audio/*" onChange={handleChange} />
//       <button onClick={handleUpload}>Upload</button>

//       {url && (
//         <div>
//           <h3>File đã upload:</h3>
//           <audio
//             controls
//             src={url}
//           />
//         </div>
//       )}

//       <audio
//         controls
//         src={`https://audio-project-final.s3.ap-southeast-2.amazonaws.com/audios/1759572005722-ghiam.mp3`}
//       />
//     </div>
//   );
// }

// export default UploadAudio;
