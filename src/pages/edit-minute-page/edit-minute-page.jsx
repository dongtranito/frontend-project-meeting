import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { SetMeal } from "@mui/icons-material";

export default function EditMinutePage() {
  const { id } = useParams();    // meetingId
  const [formData, setFormData] = useState({});
  const [officialUrl, setOfficialUrl] = useState("");
  
    const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`http://localhost:3001/minute/${id}`,
        {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", 
          }
      );
      const data = await res.json();
      console.log('data: ', data);
            console.log('data.data.placeholder: ', data.data.placeholder);

      if (data?.data.placeholder) {
        setFormData(data.data.placeholder || {});
        // setOfficialUrl(data.data.officeMinute);
      }


      const res_ = await fetch(`http://localhost:3001/meeting/${id}`,
        {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", 
          }
      );
      const data_ = await res_.json();
      console.log('data: ', data_);
            console.log('data_.data.title: ', data_.data.title);
            console.log('data_.data.minute.officialMinute: ', data_.data.minutes.officeMinute);

      if (data_?.data.minutes) {
        // setFormData(data_.data.minutes.officeMinute || {});
        setOfficialUrl(data_.data.minutes.officeMinute);
      }

    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch(`http://localhost:3001/minute/${id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeholder: formData }),
      credentials: "include"
    });

    const result = await res.json();
    if (result.success) setMessage("✅ Cập nhật thành công!");
      // alert("✅ Cập nhật thành công!"); 
    // else alert("❌ Lỗi cập nhật!");
    else setMessage("❌ Lỗi cập nhật!");
  };

  return (
    <div style={{ display: "flex", height: "100vh", gap: "10px", padding: "10px" }}>
      <div style={{ width: "55%", border: "1px solid #ddd" }}>
        {officialUrl ? (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              officialUrl
            )}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Official Minute"
          />
        ) : (
          <p style={{ padding: "20px" }}>⚠️ Chưa có biên bản chính thức</p>
        )}
      </div>

      <div style={{ width: "45%", overflowY: "auto", padding: "10px" }}>
        <h2>✏️ Chỉnh sửa biên bản</h2>

        {Object.keys(formData).map((key) => (
          <TextField
            key={key}
            label={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline={key === "noidungcuochop" || key === "ketluancuochop"}
            rows={key === "noidungcuochop" ? 4 : 2}
          />
        ))}

        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            💾 Lưu
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => window.history.back()}>
            🔙 Quay lại
          </Button>
        </Box>
      </div>
    </div>
  );
}
