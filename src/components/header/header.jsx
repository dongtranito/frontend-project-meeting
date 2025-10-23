import React, { useState } from 'react'
import "./header.css";
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { Box, Button } from '@mui/material';
import CreateGroupDialog from '../../pages/home/components/create-group-dialog/create-group-dialog';

export default function Header({ onGroupCreated }) {
  return (
    <Box
      className="container-header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="header-name">Group name</div>

      <div className="right-header-container">
        <CreateGroupDialog onGroupCreated={onGroupCreated} />
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          NA
        </Avatar>
      </div>
    </Box>
  );
}