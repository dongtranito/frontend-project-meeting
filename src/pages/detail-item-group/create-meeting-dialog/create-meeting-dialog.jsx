import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import './create-meeting-dialog.css';

export default function CreateMeetingDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const email = formJson.email;
        console.log(email);
        handleClose();
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Tạo cuộc họp
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                className="create-meeting-dialog"
                PaperProps={{
                    sx: {
                        width: "600px", // 👈 custom width
                        maxWidth: "90%",
                        borderRadius: "16px",
                        padding: 2,
                    },
                }}
            >
                <DialogTitle className="dialog-title">Tạo cuộc họp</DialogTitle>

                <DialogContent className="dialog-content">
                    <DialogContentText>Nhập tên cuộc họp.</DialogContentText>
                    <TextField
                        required
                        id="name"
                        name="groupName"
                        label="Tên nhóm"
                        type="text"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        className="dialog-input"
                    />

                    <DialogContentText>Nhập ngày.</DialogContentText>
                    <TextField
                        required
                        id="date"
                        name="date"
                        label="Ngày"
                        type="date"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        className="dialog-input"
                    />

                    <DialogContentText>Nhập giờ.</DialogContentText>
                    <TextField
                        required
                        id="time"
                        name="time"
                        label="Giờ"
                        type="time"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        className="dialog-input"
                    />

                    <DialogContentText>Meta data.</DialogContentText>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        className="upload-btn"
                    >
                        Chọn file
                        <input hidden accept="*" type="file" />
                    </Button>

                    <DialogContentText>Biên bản mẫu.</DialogContentText>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        className="upload-btn"
                    >
                        Chọn file
                        <input hidden accept="*" type="file" />
                    </Button>
                </DialogContent>

                <DialogActions className="dialog-actions">
                    <Button onClick={handleClose} className="cancel-btn">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        type="submit"
                        className="create-btn"
                        variant="contained"
                    >
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
