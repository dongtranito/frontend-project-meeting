import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './create-group-dialog.css';

export default function CreateGroupDialog() {
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
                Tạo nhóm
            </Button>
            <Dialog open={open} onClose={handleClose} className="create-group-dialog">
                <DialogTitle>Tạo nhóm</DialogTitle>
                <DialogContent>
                    <DialogContentText>Nhập tên nhóm.</DialogContentText>
                    <form onSubmit={handleSubmit} id="subscription-form">
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="groupName"
                            label="Tên nhóm"
                            type="text"
                            fullWidth
                            variant="outlined"
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} className="cancel-btn">
                        Hủy
                    </Button>
                    <Button type="submit" form="subscription-form" className="create-btn">
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    );
}
