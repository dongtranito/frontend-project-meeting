import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateIcon from "@mui/icons-material/Create";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import SendMinuteDialog from "../send-minute-dialog/send-minute-dialog";
import CreateMinutePromptDialog from "../create-minute-prompt-dialog/create-minute-prompt-dialog";

export default function MinuteActionsMenu({
  createMinute,
  handleUploadSampleMinute,
  navigate,
  id,
  loadingMinute,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openPromptDialog, setOpenPromptDialog] = useState(false);

  const handleSendMinute = () => {
    setOpenSendDialog(true);
    setTimeout(() => handleClose(), 0);
  };

  return (
    <div>
      <IconButton color="primary" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>

      {/* Menu popup */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* <MenuItem
          onClick={() => {
            createMinute();
            handleClose();
          }}
          disabled={loadingMinute}
        >
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {loadingMinute ? "Đang tạo..." : "Tạo biên bản"}
          </ListItemText>
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            setOpenPromptDialog(true);  // mở dialog
            handleClose();              // đóng popup menu
          }}
        >
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Tạo biên bản</ListItemText>
        </MenuItem>

        <MenuItem component="label">
          <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Thêm / cập nhật mẫu biên bản</ListItemText>
          <input type="file" hidden onChange={handleUploadSampleMinute} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate(`/meeting/${id}/edit-minute`);
            handleClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa biên bản</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleSendMinute}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Gửi biên bản</ListItemText>
        </MenuItem>

      </Menu>
      <SendMinuteDialog
        open={openSendDialog}
        handleClose={() => setOpenSendDialog(false)}
        meetingId={id}
      />
      <CreateMinutePromptDialog
        open={openPromptDialog}
        onClose={() => setOpenPromptDialog(false)}
        onSubmit={(prompt) => {
          setOpenPromptDialog(false);
          createMinute(prompt);
        }}
      />

    </div>
  );
}
