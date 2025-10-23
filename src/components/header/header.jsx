import React, { useState } from 'react'
import "./header.css";
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { Box, Button } from '@mui/material';
import CreateGroupDialog from '../../pages/home/components/create-group-dialog/create-group-dialog';



// export default function Header() {
//   const [openDialog, setOpenDialog] = useState(false);

//   const handleCreateGroup = () => {
//     setOpenDialog(true);
//   };

//   const handleClose = () => {
//     setOpenDialog(false);
//   };

//   return (
//     <Box
//       className='container-header'
//       sx={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}
//     >
//       <div className='header-name'>
//         Group name
//       </div>
//       {/* <Button onClick={handleCreateGroup} color="error" variant="contained">
//         Tạo nhóm
//       </Button> */}

//       <div className='right-header-container'>
//         <CreateGroupDialog
//         // open={open}       // Truyền trạng thái hiện tại (true/false)
//         // handleClose={handleClose} // Truyền hàm đóng cho Dialog
//         />

//         <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" >
//           NA
//         </Avatar>
//       </div>
//     </Box>
//   )
// }

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




// import React, { useState } from 'react';
// import { Box } from '@mui/material';
// import Avatar from '@mui/material/Avatar';
// import { red } from '@mui/material/colors'; 

// // Giả định: Component này nhận prop 'isDetailPage' để biết trạng thái
// export default function Header({ isDetailPage }) {
//   // Hoặc dùng state nội bộ nếu bạn có logic chuyển trang tại đây
//   const [isDetail, setIsDetail] = useState(false); 

//   return (
//     <Box
//       className='container-header'
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         // Bỏ justifyContent: 'space-between' nếu chỉ dùng margin-left: auto
//       }}
//     >
//       {/* 1. Hiển thị Group Name dựa trên điều kiện */}
//       {/* Sử dụng biểu thức điều kiện (isDetailPage && ...) để quyết định render hay không.
//         - Nếu isDetailPage là true, div này sẽ được render.
//         - Nếu isDetailPage là false, div này sẽ không được render.
//       */}
//       {/* {isDetailPage && ( */}
//         <div className='header-name'>
//           Group name
//         </div>
//       {/* )} */}

//       {/* 2. Avatar cố định bên phải bằng Flexbox 'margin-left: auto' */}
//       <Avatar 
//         sx={{ 
//           bgcolor: red[500],
//           // Lệnh này đẩy component sang phải hết mức có thể trong Flex container
//           marginLeft: 'auto' 
//         }} 
//         aria-label="recipe" 
//       >
//         NA
//       </Avatar>
//     </Box>
//   );
// }