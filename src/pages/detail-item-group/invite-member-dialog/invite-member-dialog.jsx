// import * as React from 'react';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

// export default function InviteMemberDialog() {
//     const [open, setOpen] = React.useState(false);

//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = (event, reason) => {
//         if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
//             return;
//         }
//         setOpen(false);
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         const formData = new FormData(event.currentTarget);
//         const formJson = Object.fromEntries(formData.entries());
//         const email = formJson.email;
//         console.log(email);
//         handleClose();
//     };

//     return (
//         <React.Fragment>
//             <Button variant="outlined" onClick={handleClickOpen}>
//                 Mời thành viên
//             </Button>
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>Mời thành viên</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Nhập tên nhóm.
//                     </DialogContentText>
//                     <form onSubmit={handleSubmit} id="subscription-form">
//                         <TextField
//                             autoFocus
//                             required
//                             margin="dense"
//                             id="name"
//                             name="groupName"
//                             label="Tên nhóm"
//                             type="text"
//                             fullWidth
//                             variant="standard"
//                         />
//                     </form>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose}>Cancel</Button>
//                     <Button type="submit" form="subscription-form">
//                         Tạo
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </React.Fragment>
//     );
// }

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./invite-member-dialog.css";

export default function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [members] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com", color: "#6dbf67" },
    { id: 2, name: "Trần Thị B", email: "b@example.com", color: "#8974c4" },
  ]);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Mời thành viên
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="invite-member-dialog"
        PaperProps={{
          sx: {
            width: 420,
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogContent className="invite-content">
          {/* Search */}
          <div className="search-container">
            <TextField
              placeholder="Tìm kiếm thành viên..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              InputProps={{
                endAdornment: (
                  <IconButton className="search-icon">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </div>

          {/* Member list */}
          <List className="member-list">
            {filtered.map((m) => (
              <ListItem
                key={m.id}
                secondaryAction={
                  <Button
                    className="add-btn"
                    variant="contained"
                    size="small"
                  >
                    Thêm
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: m.color,
                      width: 40,
                      height: 40,
                      fontSize: "1rem",
                    }}
                  >
                    {m.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={m.name}
                  secondary={m.email}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.8rem",
                    color: "#6b6b6b",
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Footer */}
          <div className="footer">
            <Button
              onClick={() => setOpen(false)}
              className="cancel-btn"
              variant="contained"
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

