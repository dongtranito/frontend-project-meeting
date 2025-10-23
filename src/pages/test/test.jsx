import React, { useEffect, useState } from "react";
import api from "../../config/api";

export default function TestBackend() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/test")
      .then(res => setMessage(res.data))
      .catch(err => console.error(err));
  }, []);

  return <h3>{message}</h3>;
}
