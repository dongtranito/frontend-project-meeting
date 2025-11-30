// import React, { useState } from 'react'
// import "./header.css";
// import Avatar from '@mui/material/Avatar';
// import { red } from '@mui/material/colors';
// import { Box, Button } from '@mui/material';
// import CreateGroupDialog from '../../pages/home/components/create-group-dialog/create-group-dialog';

// export default function Header({ onGroupCreated }) {
//   return (
//     <Box
//       className="container-header"
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}

//       style={{
//         display: "flex",
//         justifyContent: "end"
//       }}
//     >

//       <div className="right-header-container">
//         <CreateGroupDialog onGroupCreated={onGroupCreated} />
//       </div>
//     </Box>
//   );
// }

import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import CreateGroupDialog from './../../pages/home/components/create-group-dialog/create-group-dialog';

export default function Header({ onGroupCreated, title }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/home";

  return (
    <Box
      className="container-header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      style={{ padding: "12px 20px", borderBottom: "1px solid #eee"}}
    >
      {/* Left: Back + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!isHome && (
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        )}

        <Typography variant="h6" fontWeight={600}>
          {title || "Trang chủ"}
        </Typography>
      </div>

      {/* Right: Create Group (chỉ hiển thị ở Home) */}
      <div>
        {isHome && <CreateGroupDialog onGroupCreated={onGroupCreated} />}
      </div>
    </Box>
  );
}
