// import React, { useState } from "react";
// import "./sidebar.css";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Avatar,
//   Button,
// //   Collapse,
//   Badge,

// } from "@mui/material";
// import {
//   CalendarViewWeek,
//   ExpandMore,
//   Dashboard,
//   Settings,
//   Info,
//   Logout
// } from "@mui/icons-material";
// import MenuIcon from '@mui/icons-material/Menu';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
// import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

// export default function Sidebar() {
//   const [active, setActive] = useState("Trang chủ");

//   const navTop = [
//     { label: "Trang chủ", icon: <HomeOutlinedIcon />, arrow: <ExpandMore /> },
//     { label: "Đã đăng ký", icon: <PeopleAltOutlinedIcon />, arrow: null },
//     { label: "Cài đặt", icon: <Settings />, arrow: null },
//   ];

//   const navBottom = [
//     { label: "Hỗ trợ", icon: <HelpOutlineOutlinedIcon />, arrow: null },
//     { label: "Đăng xuất", icon: <Logout />, arrow: null },
//   ];

//   const handleSetActive = (label) => {
//     setActive(label);
//   };

//   return (
//     <div className="shell">
//       <Drawer
//         variant="permanent"
//         anchor="left"
//         classes={{ paper: "sidebar" }}
//       >
//         <div className="project">
//           {/* <div className="avatar">
//             <Avatar
//               src="https://mui.com/static/images/avatar/1.jpg"
//               alt="Avatar"
//               sx={{ width: 36, height: 36 }}
//             />
//           </div> */}
//           <div className="project-name">
//             <MenuIcon className="icon-menu"/>
//           </div>
//           <div className="project-meta">
//             <div className="name">DocFU</div>
//             <div className="sub">Documented. Defined. Yours.</div>
//           </div>
//         </div>

//         {/* <Button className="board-row">
//           <CalendarViewWeek />
//           <span className="board-title" title="Scrum: Teams in Space">
//             Scrum: Teams in Space
//           </span>
//           <div className="board-sub">Board</div>
//           <ExpandMore className="chev" />
//         </Button> */}

//         <List className="nav">
//           {navTop.map((i) => (
//             <ListItemButton
//               key={i.label}
//               selected={active === i.label}
//               onClick={() => handleSetActive(i.label)}
//               className={active === i.label ? "active" : ""}
//             >
//               <ListItemIcon>{i.icon}</ListItemIcon>
//               <ListItemText primary={i.label} />
//             </ListItemButton>
//           ))}
//         </List>

//         <Divider className="sep" />

//         <List className="nav">
//           {navBottom.map((i) => (
//             <ListItemButton
//               key={i.label}
//               selected={active === i.label}
//               onClick={() => handleSetActive(i.label)}
//               className={active === i.label ? "active" : ""}
//             >
//               <ListItemIcon>{i.icon}</ListItemIcon>
//               <ListItemText primary={i.label} />
//             </ListItemButton>
//           ))}
//         </List>
//       </Drawer>

//       <main className="main-content">
//         <h2>Main Content</h2>
//         <p>This area will hold routed content later.</p>
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "./sidebar.css";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Settings,
  Logout,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import GroupIcon from "@mui/icons-material/Group";

export default function Sidebar() {
  const [active, setActive] = useState("Trang chủ");
  const [openGroups, setOpenGroups] = useState(false);
  const [activeGroup, setActiveGroup] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "70px" : "270px"
    );
  }, [collapsed]);

  const toggleGroups = () => {
    setOpenGroups(!openGroups);
    setActive("Đã đăng ký");
  };

  const handleGroupClick = (name) => {
    setActiveGroup(name);
    setActive(""); // bỏ active trên các mục chính nếu chọn nhóm con
  };

  const groupList = ["Nhóm A", "Nhóm B", "Nhóm C", "Nhóm D"];

  return (
    <div className="shell">
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{ paper: collapsed ? "sidebar collapsed" : "sidebar" }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#1e1e2f",
            color: "#fff",
          },
        }}
      >
        <div className="project" onClick={toggleCollapse}>
          <div className="project-name">
            <MenuIcon className="icon-menu" />
          </div>
          <div className="project-meta">
            <div className="name">DocFU</div>
            <div className="sub">Documented. Defined. Yours.</div>
          </div>
        </div>

        <Divider sx={{ color: "#ffffffff", fontSize: 14 }}/>
        <hr style={{ border: "1px solid #ccc", margin: "0 20px 20px 20px" }} />

        <List className="nav">
          {/* Trang chủ */}
          <ListItemButton
            selected={active === "Trang chủ"}
            onClick={() => {
              setActive("Trang chủ");
              setActiveGroup("");
            }}
            className={active === "Trang chủ" ? "active" : ""}
          >
            <ListItemIcon >
              <HomeOutlinedIcon />
            </ListItemIcon>
            {/* <ListItemText primary="Trang chủ" /> */}
            {!collapsed && <ListItemText primary="Trang chủ" className="icon-sidebar"/>}
          </ListItemButton>

          {/* Đã đăng ký */}
          <ListItemButton
            onClick={toggleGroups}
            className={`nav-item ${active === "Đã đăng ký" ? "active-border" : "" }`}
          >
            <ListItemIcon>
              <PeopleAltOutlinedIcon />
            </ListItemIcon>
            {/* <ListItemText primary="Đã đăng ký" /> */}
            {!collapsed && <ListItemText primary="Đã đăng ký" className="icon-sidebar"/>}
            {!collapsed && (openGroups ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {/* Danh sách nhóm */}
          <Collapse in={openGroups} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {groupList.map((name, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleGroupClick(name)}
                  className={`sub-item ${activeGroup === name ? "active-sub" : "" }`}
                >
                  <ListItemIcon>
                    <GroupIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={name} className="icon-sidebar"/>
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Cài đặt */}
          <ListItemButton
            selected={active === "Cài đặt"}
            onClick={() => {
              setActive("Cài đặt");
              setActiveGroup("");
            }}
            className={active === "Cài đặt" ? "active" : ""}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            {/* <ListItemText primary="Cài đặt" /> */}
            {!collapsed && <ListItemText primary="Cài đặt" className="icon-sidebar"/>}
          </ListItemButton>
        </List>

        <Divider className="sep" />

        <List className="nav">
          {/* Hỗ trợ */}
          <ListItemButton
            selected={active === "Hỗ trợ"}
            onClick={() => {
              setActive("Hỗ trợ");
              setActiveGroup("");
            }}
            className={active === "Hỗ trợ" ? "active" : ""}
          >
            <ListItemIcon>
              <HelpOutlineOutlinedIcon />
            </ListItemIcon>
            {/* <ListItemText primary="Hỗ trợ" /> */}
            {!collapsed && <ListItemText primary="Hỗ trợ" className="icon-sidebar"/>}
          </ListItemButton>

          {/* Đăng xuất */}
          <ListItemButton
            selected={active === "Đăng xuất"}
            onClick={() => {
              setActive("Đăng xuất");
              setActiveGroup("");
            }}
            className={active === "Đăng xuất" ? "active" : ""}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            {/* <ListItemText primary="Đăng xuất" /> */}
            {!collapsed && <ListItemText primary="Đăng xuất" className="icon-sidebar"/>}
          </ListItemButton>
        </List>
      </Drawer>

      <main className="main-content">
        <h2>{active || activeGroup || "Main Content"}</h2>
        <p>This area will hold routed content later.</p>
      </main>
    </div>
  );
}
