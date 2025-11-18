import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Description } from "@mui/icons-material";
import { API_URL } from "../../../config/api.js";



export default function TranscriptSection({ meetingId }) {
    const [loading, setLoading] = useState(false);
    const [transcript, setTranscript] = useState(null);

    const createTranscript = async () => {
        try {
            setLoading(true);
            // const res = await fetch(`http://localhost:3001/meeting/${meetingId}`, {
            const res = await fetch(`${API_URL}/meeting/${meetingId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            const data = await res.json();

            if (data?.success && data?.data?.transcript) {
                setTranscript(data.data.transcript);
            } else {
                alert("Không tìm thấy transcript cho cuộc họp này!");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API transcript:", error);
            alert("Đã xảy ra lỗi khi lấy transcript!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                variant="outlined"
                startIcon={<Description />}
                onClick={createTranscript}
                disabled={loading}
            >
                {loading ? "Đang tải..." : "Tạo transcript"}
            </Button>

            {loading && <CircularProgress size={24} style={{ marginLeft: 10 }} />}

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
                                <strong style={{ color: "#1976d2" }}>{seg.speaker}</strong>{" "}
                                <span style={{ color: "#888" }}>[{seg.start}]</span>:
                                <span style={{ marginLeft: "4px" }}>{seg.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
