// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./sidebar.css";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Collapse,
// } from "@mui/material";
// import {
//   ExpandMore,
//   ExpandLess,
//   Settings,
//   Logout,
// } from "@mui/icons-material";
// import MenuIcon from "@mui/icons-material/Menu";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import GroupIcon from "@mui/icons-material/Group";

// import { Typography } from "@mui/material";

// export default function Sidebar() {
//   const [active, setActive] = useState("Trang chủ");
//   const [openGroups, setOpenGroups] = useState(false);
//   const [activeGroup, setActiveGroup] = useState("");
//   const [collapsed, setCollapsed] = useState(false);

//   const navigate = useNavigate();

//   const toggleCollapse = () => {
//     setCollapsed(!collapsed);
//   };

//   useEffect(() => {
//     document.documentElement.style.setProperty(
//       "--sidebar-width",
//       collapsed ? "80px" : "270px"
//     );
//   }, [collapsed]);

//   const toggleGroups = () => {
//     setOpenGroups(!openGroups);
//     setActive("Đã đăng ký");
//   };

//   const handleGroupClick = (name) => {
//     setActiveGroup(name);
//     setActive(""); // bỏ active trên các mục chính nếu chọn nhóm con
//   };

//   const groupList = ["Nhóm A", "Nhóm B", "Nhóm C", "Nhóm D"];

//   const handleNavigate = (label) => {
//     setActive(label);
//     setActiveGroup("");
//     switch (label) {
//       case "Trang chủ":
//         navigate("/");
//         break;
//       case "Đã đăng ký":
//         navigate("/registered");
//         break;
//       case "Cài đặt":
//         navigate("/settings");
//         break;
//       case "Hỗ trợ":
//         navigate("/help");
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div className="shell">
//       <Drawer
//         variant="permanent"
//         anchor="left"
//         classes={{ paper: collapsed ? "sidebar collapsed" : "sidebar" }}
//         sx={{
//           "& .MuiDrawer-paper": {
//             backgroundColor: "#1e1e2f",
//             color: "#fff",
//           },
//         }}
//       >
//         <div className="project" onClick={toggleCollapse}>
//           <div className="project-name">
//             <MenuIcon className="icon-menu" />
//           </div>
//           <div className="project-meta">
//             <div className="name">DocFU</div>
//             <div className="sub">Documented. Defined. Yours.</div>
//           </div>
//         </div>

//         <Divider sx={{ color: "#ffffffff", fontSize: 14 }} />
//         <hr style={{ border: "1px solid #ccc", margin: "0 20px 20px 20px" }} />

//         <List className="nav">
//           {/* Trang chủ */}
//           <ListItemButton
//             selected={active === "Trang chủ"}
//             // onClick={() => {
//             //   setActive("Trang chủ");
//             //   setActiveGroup("");
//             // }}
//             onClick={() => handleNavigate("Trang chủ")}
//             className={active === "Trang chủ" ? "active" : ""}
//           >
//             <ListItemIcon >
//               <HomeOutlinedIcon />
//             </ListItemIcon>
//             {/* <ListItemText primary="Trang chủ" /> */}
//             {!collapsed && <ListItemText primary="Trang chủ" className="icon-sidebar" />}
//           </ListItemButton>

//           {/* Đã đăng ký */}
//           <ListItemButton
//             onClick={toggleGroups}
//             className={`nav-item ${active === "Đã đăng ký" ? "active-border" : ""}`}
//           >
//             <ListItemIcon>
//               <PeopleAltOutlinedIcon />
//             </ListItemIcon>
//             {/* <ListItemText primary="Đã đăng ký" /> */}
//             {!collapsed && <ListItemText primary="Đã đăng ký" className="icon-sidebar" />}
//             {!collapsed && (openGroups ? <ExpandLess /> : <ExpandMore />)}
//           </ListItemButton>

//           {/* Danh sách nhóm */}
//           <Collapse in={openGroups} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {groupList.map((name, index) => (
//                 <ListItemButton
//                   key={index}
//                   onClick={() => handleGroupClick(name)}
//                   className={`sub-item ${activeGroup === name ? "active-sub" : ""}`}
//                 >
//                   <ListItemIcon>
//                     <GroupIcon fontSize="small" />
//                   </ListItemIcon>
//                   <ListItemText primary={name} className="icon-sidebar" />
//                 </ListItemButton>
//               ))}
//             </List>
//           </Collapse>

//           {/* Cài đặt */}
//           <ListItemButton
//             selected={active === "Cài đặt"}
//             // onClick={() => {
//             //   setActive("Cài đặt");
//             //   setActiveGroup("");
//             // }}
//             onClick={() => handleNavigate("Cài đặt")}
//             className={active === "Cài đặt" ? "active" : ""}
//           >
//             <ListItemIcon>
//               <Settings />
//             </ListItemIcon>
//             {/* <ListItemText primary="Cài đặt" /> */}
//             {!collapsed && <ListItemText primary="Cài đặt" className="icon-sidebar" />}
//           </ListItemButton>
//         </List>

//         <Divider className="sep" />

//         <List className="nav">
//           {/* Hỗ trợ */}
//           <ListItemButton
//             selected={active === "Hỗ trợ"}
//             // onClick={() => {
//             //   setActive("Hỗ trợ");
//             //   setActiveGroup("");
//             // }}
//             onClick={() => handleNavigate("Hỗ trợ")}
//             className={active === "Hỗ trợ" ? "active" : ""}
//           >
//             <ListItemIcon>
//               <HelpOutlineOutlinedIcon />
//             </ListItemIcon>
//             {/* <ListItemText primary="Hỗ trợ" /> */}
//             {!collapsed && <ListItemText primary="Hỗ trợ" className="icon-sidebar" />}
//           </ListItemButton>

//           {/* Đăng xuất */}
//           <ListItemButton
//             selected={active === "Đăng xuất"}
//             // onClick={() => {
//             //   setActive("Đăng xuất");
//             //   setActiveGroup("");
//             // }}
//             onClick={() => handleNavigate("Đăng xuất")}
//             className={active === "Đăng xuất" ? "active" : ""}
//           >
//             <ListItemIcon>
//               <Logout />
//             </ListItemIcon>
//             {/* <ListItemText primary="Đăng xuất" /> */}
//             {!collapsed && <ListItemText primary="Đăng xuất" className="icon-sidebar" />}
//           </ListItemButton>
//         </List>
//       </Drawer>

//       <main className="main-content">
//         <h2>{active || activeGroup || "Main Content"}</h2>
//         <p>This area will hold routed content later.</p>
//       </main>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [active, setActive] = useState("Trang chủ");
  const [openGroups, setOpenGroups] = useState(false);
  const [activeGroup, setActiveGroup] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const groupList = ["Nhóm A", "Nhóm B", "Nhóm C", "Nhóm D"];

  // Thay đổi chiều rộng sidebar khi collapse
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "80px" : "270px"
    );

    // Khi collapse thì tự đóng group
    if (collapsed && openGroups) {
      setOpenGroups(false);
    }
  }, [collapsed]);

  // Toggle mở rộng nhóm “Đã đăng ký”
  const toggleGroups = () => {
    if (!collapsed) {
      setOpenGroups((prev) => !prev);
      setActive("Đã đăng ký");
      setActiveGroup("");
    }
  };

  // Toggle thu gọn sidebar
  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  // Khi click từng group
  const handleGroupClick = (name) => {
    setActiveGroup(name);
    setActive(""); // bỏ active tab chính
  };

  // Điều hướng các tab chính
  const handleNavigate = (label) => {
    setActive(label);
    setActiveGroup("");

    switch (label) {
      case "Trang chủ":
        navigate("/");
        break;
      case "Đã đăng ký":
        // toggleGroups() được gọi riêng để tránh double toggle
        toggleGroups();
        break;
      case "Cài đặt":
        navigate("/settings");
        break;
      case "Hỗ trợ":
        navigate("/help");
        break;
      case "Đăng xuất":
        navigate("/logout");
        break;
      default:
        break;
    }
  };

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
            border: "none",
          },
        }}
      >
        {/* Header logo/menu */}
        <div className="project" onClick={toggleCollapse}>
          <MenuIcon className="icon-menu" />
          {!collapsed && (
            <div className="project-meta">
              <div className="name">DocFU</div>
              <div className="sub">Documented. Defined. Yours.</div>
            </div>
          )}
        </div>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <List className="nav">
          {/* Trang chủ */}
          <ListItemButton
            selected={active === "Trang chủ"}
            onClick={() => handleNavigate("Trang chủ")}
            className={active === "Trang chủ" ? "active" : ""}
          >
            <ListItemIcon>
              <HomeOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Trang chủ" />}
          </ListItemButton>

          {/* Đã đăng ký */}
          <ListItemButton
            onClick={() => handleNavigate("Đã đăng ký")}
            className={`nav-item ${active === "Đã đăng ký" ? "active-border" : ""}`}
          >
            <ListItemIcon>
              <PeopleAltOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Đã đăng ký" />}
            {!collapsed && (openGroups ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {/* Nhóm con */}
          <Collapse in={openGroups} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {groupList.map((name) => (
                <ListItemButton
                  key={name}
                  onClick={() => handleGroupClick(name)}
                  className={`sub-item ${activeGroup === name ? "active-sub" : ""}`}
                >
                  <ListItemIcon>
                    <GroupIcon fontSize="small" sx={{ color: "#cfd8dc" }} />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Cài đặt */}
          <ListItemButton
            selected={active === "Cài đặt"}
            onClick={() => handleNavigate("Cài đặt")}
            className={active === "Cài đặt" ? "active" : ""}
          >
            <ListItemIcon>
              <Settings sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Cài đặt" />}
          </ListItemButton>
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <List className="nav">
          {/* Hỗ trợ */}
          <ListItemButton
            selected={active === "Hỗ trợ"}
            onClick={() => handleNavigate("Hỗ trợ")}
            className={active === "Hỗ trợ" ? "active" : ""}
          >
            <ListItemIcon>
              <HelpOutlineOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Hỗ trợ" />}
          </ListItemButton>

          {/* Đăng xuất */}
          <ListItemButton
            selected={active === "Đăng xuất"}
            onClick={() => handleNavigate("Đăng xuất")}
            className={active === "Đăng xuất" ? "active" : ""}
          >
            <ListItemIcon>
              <Logout sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Đăng xuất" />}
          </ListItemButton>
        </List>
      </Drawer>

      <main className="main-content">
        <h2>{activeGroup || active}</h2>
        <p>This area will hold routed content later.</p>
      </main>
    </div>
  );
}
