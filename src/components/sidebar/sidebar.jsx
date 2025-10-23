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

// export default function Sidebar() {
//   const navigate = useNavigate();

//   const [active, setActive] = useState("Trang chủ");
//   const [openGroups, setOpenGroups] = useState(false);
//   const [activeGroup, setActiveGroup] = useState("");
//   const [collapsed, setCollapsed] = useState(false);
//   // const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);



//   const groupList = ["Nhóm A", "Nhóm B", "Nhóm C", "Nhóm D"];

//   // Thay đổi chiều rộng sidebar khi collapse
//   useEffect(() => {
//     document.documentElement.style.setProperty(
//       "--sidebar-width",
//       collapsed ? "80px" : "270px"
//     );

//     // Khi collapse thì tự đóng group
//     if (collapsed && openGroups) {
//       setOpenGroups(false);
//     }
//   }, [collapsed]);

//   const [groups, setGroups] = useState([]);

//   // useEffect(() => {
//   //   axios.get("http://localhost:3001/get-list-group")
//   //     .then((res) => setGroups(res.data))
//   //     .catch((err) => console.error(err));
//   // }, []);

//   // Toggle mở rộng nhóm “Đã đăng ký”
//   const toggleGroups = () => {
//     if (!collapsed) {
//       setOpenGroups((prev) => !prev);
//       setActive("Đã đăng ký");
//       setActiveGroup("");
//     }
//   };

//   // Toggle thu gọn sidebar
//   const toggleCollapse = () => {
//     setCollapsed((prev) => !prev);
//   };

//   // Khi click từng group
//   const handleGroupClick = (name) => {
//     setActiveGroup(name);
//     setActive(""); // bỏ active tab chính
//   };

//   // useEffect(() => {
//   //   const token = localStorage.getItem("token");
//   //   if (token) {
//   //     setIsLoggedIn(true);
//   //   }
//   // }, []);


//   // Điều hướng các tab chính
//   // const handleNavigate = (label) => {
//   //   setActive(label);
//   //   setActiveGroup("");

//   //   switch (label) {
//   //     case "Trang chủ":
//   //       navigate("/");
//   //       break;
//   //     case "Đã đăng ký":
//   //       // toggleGroups() được gọi riêng để tránh double toggle
//   //       toggleGroups();
//   //       break;
//   //     case "Cài đặt":
//   //       navigate("/settings");
//   //       break;
//   //     case "Hỗ trợ":
//   //       navigate("/help");
//   //       break;
//   //     case "Đăng xuất":
//   //       navigate("/logout");
//   //       break;
//   //     default:
//   //       break;
//   //   }
//   // };

//   const handleNavigate = (label) => {
//     setActive(label);
//     setActiveGroup("");

//     switch (label) {
//       case "Trang chủ":
//         navigate("/");
//         break;

//       case "Đã đăng ký":
//         toggleGroups();
//         break;

//       case "Cài đặt":
//         navigate("/settings");
//         break;

//       case "Hỗ trợ":
//         navigate("/help");
//         break;

//       case "Đăng nhập":
//         navigate("/login"); // 👉 chuyển đến trang login
//         break;

//       case "Đăng xuất":
//         // 👉 clear trạng thái đăng nhập
//         setIsLoggedIn(false);
//         localStorage.removeItem("token"); // hoặc xóa thông tin user
//         navigate("/"); // quay về trang chủ
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
//             border: "none",
//           },
//         }}
//       >
//         {/* Header logo/menu */}
//         <div className="project" onClick={toggleCollapse}>
//           <MenuIcon className="icon-menu" />
//           {!collapsed && (
//             <div className="project-meta">
//               <div className="name">DocFU</div>
//               <div className="sub">Documented. Defined. Yours.</div>
//             </div>
//           )}
//         </div>

//         <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

//         <List className="nav">
//           {/* Trang chủ */}
//           <ListItemButton
//             selected={active === "Trang chủ"}
//             onClick={() => handleNavigate("Trang chủ")}
//             className={active === "Trang chủ" ? "active" : ""}
//           >
//             <ListItemIcon>
//               <HomeOutlinedIcon sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Trang chủ" />}
//           </ListItemButton>

//           {/* Đã đăng ký */}
//           <ListItemButton
//             onClick={() => handleNavigate("Đã đăng ký")}
//             className={`nav-item ${active === "Đã đăng ký" ? "active-border" : ""}`}
//           >
//             <ListItemIcon>
//               <PeopleAltOutlinedIcon sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Đã đăng ký" />}
//             {!collapsed && (openGroups ? <ExpandLess /> : <ExpandMore />)}
//           </ListItemButton>

//           {/* Nhóm con */}
//           <Collapse in={openGroups} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {groups.map((name) => (
//                 <ListItemButton
//                   key={name}
//                   onClick={() => handleGroupClick(name)}
//                   className={`sub-item ${activeGroup === name ? "active-sub" : ""}`}
//                 >
//                   <ListItemIcon>
//                     <GroupIcon fontSize="small" sx={{ color: "#cfd8dc" }} />
//                   </ListItemIcon>
//                   <ListItemText primary={name} />
//                 </ListItemButton>
//               ))}
//             </List>
//           </Collapse>

//           {/* Cài đặt */}
//           <ListItemButton
//             selected={active === "Cài đặt"}
//             onClick={() => handleNavigate("Cài đặt")}
//             className={active === "Cài đặt" ? "active" : ""}
//           >
//             <ListItemIcon>
//               <Settings sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Cài đặt" />}
//           </ListItemButton>
//         </List>

//         <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

//         <List className="nav">
//           {/* Hỗ trợ */}
//           <ListItemButton
//             selected={active === "Hỗ trợ"}
//             onClick={() => handleNavigate("Hỗ trợ")}
//             className={active === "Hỗ trợ" ? "active" : ""}
//           >
//             <ListItemIcon>
//               <HelpOutlineOutlinedIcon sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Hỗ trợ" />}
//           </ListItemButton>

//           {/* Đăng xuất */}
//           {/* <ListItemButton
//             selected={active === "Đăng xuất"}
//             onClick={() => handleNavigate("Đăng xuất")}
//             className={active === "Đăng xuất" ? "active" : ""}
//           >
//             <ListItemIcon>
//               <Logout sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Đăng xuất" />}
//           </ListItemButton> */}

//           <ListItemButton
//             selected={active === (isLoggedIn ? "Đăng xuất" : "Đăng nhập")}
//             onClick={() => handleNavigate(isLoggedIn ? "Đăng xuất" : "Đăng nhập")}
//             className={active === (isLoggedIn ? "Đăng xuất" : "Đăng nhập") ? "active" : ""}
//           >
//             <ListItemIcon>
//               <Logout sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && (
//               <ListItemText primary={isLoggedIn ? "Đăng xuất" : "Đăng nhập"} />
//             )}
//           </ListItemButton>

//         </List>
//       </Drawer>

//       <main className="main-content">
//         <h2>{activeGroup || active}</h2>
//         <p>This area will hold routed content later.</p>
//       </main>
//     </div>
//   );
// }



// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
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
//   HelpOutlineOutlined as HelpOutlineOutlinedIcon,
//   PeopleAltOutlined as PeopleAltOutlinedIcon,
//   HomeOutlined as HomeOutlinedIcon,
//   Menu as MenuIcon,
//   Group as GroupIcon,
// } from "@mui/icons-material";
// import { AuthContext } from "../../auth/auth-context";
// import './sidebar.css';

// export default function Sidebar() {
//   const navigate = useNavigate();
//   // const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
//   const { isLoggedIn, logout, user } = useContext(AuthContext);

//   const [active, setActive] = useState("Trang chủ");
//   const [openGroups, setOpenGroups] = useState(false);
//   const [activeGroup, setActiveGroup] = useState("");
//   const [collapsed, setCollapsed] = useState(false);
//   const [groups, setGroups] = useState([]);

//   // Khi collapse thì thay đổi width
//   useEffect(() => {
//     document.documentElement.style.setProperty(
//       "--sidebar-width",
//       collapsed ? "80px" : "270px"
//     );
//     if (collapsed && openGroups) setOpenGroups(false);
//   }, [collapsed]);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         if (!user?.email) return;

//         // const res = await fetch(`http://localhost:3001/get-list-group`);
//         // const res = await fetch("http://localhost:3001/get-list-group", {
//         //   method: "POST",
//         //   headers: { "Content-Type": "application/json" },
//         //   body: JSON.stringify({ email: user.email }),
//         // });

//         const res = await fetch("http://localhost:3001/get-list-group", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${user.token}`, // token từ AuthContext
//           },
//         });


//         if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.statusText}`);

//         const data = await res.json();

//         // ✅ Lấy đúng data.data
//         const { joinedGroups = [], ownedGroups = [] } = data.data;

//         const allGroupNames = [
//           ...new Set([
//             ...ownedGroups.map((g) => g.name),
//             ...joinedGroups.map((g) => g.name),
//           ]),
//         ];

//         setGroups(allGroupNames);
//       } catch (error) {
//         console.error("Lỗi khi tải danh sách nhóm:", error);
//       }
//     };

//     fetchGroups();
//   }, [user]);


//   useEffect(() => {
//   console.log("🧠 User context:", user);
// }, [user]);



//   const toggleGroups = () => {
//     if (!collapsed) {
//       setOpenGroups((prev) => !prev);
//       setActive("Đã đăng ký");
//       setActiveGroup("");
//     }
//   };

//   const toggleCollapse = () => setCollapsed((prev) => !prev);

//   const handleGroupClick = (name) => {
//     setActiveGroup(name);
//     setActive("");
//     navigate(`/detail-group/${name}`); // ✅ điều hướng tới trang nhóm cụ thể
//   };

//   const handleNavigate = (label) => {
//     setActive(label);
//     setActiveGroup("");

//     switch (label) {
//       case "Trang chủ":
//         navigate("/");
//         break;
//       case "Đã đăng ký":
//         toggleGroups();
//         break;
//       case "Cài đặt":
//         navigate("/settings");
//         break;
//       case "Hỗ trợ":
//         navigate("/help");
//         break;
//       case "Đăng nhập":
//         navigate("/login");
//         break;
//       case "Đăng xuất":
//         logout();          // ✅ dùng hàm logout() trong context
//         navigate("/");     // quay về trang chủ
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
//             border: "none",
//           },
//         }}
//       >
//         <div className="project" onClick={toggleCollapse}>
//           <MenuIcon className="icon-menu" />
//           {!collapsed && (
//             <div className="project-meta">
//               <div className="name">DocFU</div>
//               <div className="sub">Documented. Defined. Yours.</div>
//             </div>
//           )}
//         </div>

//         <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

//         <List className="nav">
//           <ListItemButton
//             selected={active === "Trang chủ"}
//             onClick={() => handleNavigate("Trang chủ")}
//           >
//             <ListItemIcon>
//               <HomeOutlinedIcon sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Trang chủ" />}
//           </ListItemButton>

//           <ListItemButton
//             onClick={() => handleNavigate("Đã đăng ký")}
//             className={`nav-item ${active === "Đã đăng ký" ? "active-border" : ""}`}
//           >
//             <ListItemIcon>
//               <PeopleAltOutlinedIcon sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Đã đăng ký" />}
//             {!collapsed && (openGroups ? <ExpandLess /> : <ExpandMore />)}
//           </ListItemButton>

//           {/* DANH SÁCH NHÓM */}
//           <Collapse in={openGroups} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {groups.length === 0 ? (
//                 <ListItemText
//                   primary="(Không có nhóm nào)"
//                   sx={{ pl: 4, color: "#bbb" }}
//                 />
//               ) : (
//                 groups.map((name) => (
//                   <ListItemButton
//                     key={name}
//                     onClick={() => handleGroupClick(name)}
//                     className={`sub-item ${activeGroup === name ? "active-sub" : ""
//                       }`}
//                     sx={{ pl: 4 }}
//                   >
//                     <ListItemIcon>
//                       <GroupIcon fontSize="small" sx={{ color: "#cfd8dc" }} />
//                     </ListItemIcon>
//                     <ListItemText primary={name} />
//                   </ListItemButton>
//                 ))
//               )}
//             </List>
//           </Collapse>

//           <ListItemButton
//             selected={active === "Cài đặt"}
//             onClick={() => handleNavigate("Cài đặt")}
//           >
//             <ListItemIcon>
//               <Settings sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Cài đặt" />}
//           </ListItemButton>
//         </List>

//         <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

//         <List className="nav">
//           <ListItemButton
//             selected={active === "Hỗ trợ"}
//             onClick={() => handleNavigate("Hỗ trợ")}
//           >
//             <ListItemIcon>
//               <HelpOutlineOutlinedIcon sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && <ListItemText primary="Hỗ trợ" />}
//           </ListItemButton>

//           <ListItemButton
//             selected={active === (isLoggedIn ? "Đăng xuất" : "Đăng nhập")}
//             onClick={() => handleNavigate(isLoggedIn ? "Đăng xuất" : "Đăng nhập")}
//           >
//             <ListItemIcon>
//               <Logout sx={{ color: "#fff" }} />
//             </ListItemIcon>
//             {!collapsed && (
//               <ListItemText primary={isLoggedIn ? "Đăng xuất" : "Đăng nhập"} />
//             )}
//           </ListItemButton>
//         </List>
//       </Drawer>
//     </div>
//   );
// }


// import React, { useContext, useEffect, useState } from "react";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Divider,
// } from "@mui/material";
// import {
//   HomeOutlined as HomeOutlinedIcon,
//   PeopleAltOutlined as PeopleAltOutlinedIcon,
//   ExpandLess,
//   ExpandMore,
//   Settings,
//   HelpOutlineOutlined as HelpOutlineOutlinedIcon,
//   Logout,
//   Menu as MenuIcon,
//   Group as GroupIcon,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../auth/auth-context";
// import './sidebar.css';
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  HomeOutlined as HomeOutlinedIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  Settings,
  HelpOutlineOutlined as HelpOutlineOutlinedIcon,
  Logout,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Group as GroupIcon,
} from "@mui/icons-material";
import "./sidebar.css";
import { GroupContext } from "../../context/group-context";
import { AuthContext } from "../../auth/auth-context";

export default function Sidebar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { ownedGroups, joinedGroups, fetchGroups, loading } =
    useContext(GroupContext);

  const [active, setActive] = useState("Trang chủ");
  const [openGroups, setOpenGroups] = useState(false);
  const [activeGroup, setActiveGroup] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  // useEffect(() => {
  //   fetchGroups();
  // }, [fetchGroups]);

  // const [groups, setGroups] = useState([]);

  // useEffect(() => {
  //   // 🔥 Cập nhật lại danh sách mỗi khi dữ liệu nhóm trong context thay đổi
  //   const uniqueGroups = [
  //     ...new Set([
  //       ...ownedGroups.map((g) => g.name),
  //       ...joinedGroups.map((g) => g.name),
  //     ]),
  //   ];
  //   setGroups(uniqueGroups);
  // }, [ownedGroups, joinedGroups]);

  // 🔹 Fetch danh sách nhóm từ GroupContext
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // 🔹 Đồng bộ danh sách nhóm (kết hợp ownedGroups và joinedGroups)
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!ownedGroups && !joinedGroups) return;

    // Chuẩn hóa danh sách nhóm theo format { groupId, name }
    const allGroups = [
      ...ownedGroups.map((g) => ({
        groupId: g.groupId,
        name: g.name,
      })),
      ...joinedGroups.map((g) => ({
        groupId: g.groupId,
        name: g.name,
      })),
    ];

    // Xóa trùng (nếu có)
    const unique = allGroups.filter(
      (v, i, a) => a.findIndex((t) => t.groupId === v.groupId) === i
    );

    setGroups(unique);
  }, [ownedGroups, joinedGroups]);



  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "80px" : "270px"
    );
    if (collapsed && openGroups) setOpenGroups(false);
  }, [collapsed]);

  const toggleGroups = () => {
    if (!collapsed) {
      setOpenGroups((prev) => !prev);
      setActive("Đã đăng ký");
      setActiveGroup("");
    }
  };

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  // const handleGroupClick = (name) => {
  //   setActiveGroup(name);
  //   setActive("");
  //   navigate(`/detail-group/${name}`);
  // };

  const handleGroupClick = (groupId, groupName) => {
    setActiveGroup(groupName);
    setActive("");
    navigate(`/detail-group/${groupId}`);
  };


  const handleNavigate = (label) => {
    setActive(label);
    setActiveGroup("");

    switch (label) {
      case "Trang chủ":
        navigate("/");
        break;
      case "Đã đăng ký":
        toggleGroups();
        break;
      case "Cài đặt":
        navigate("/settings");
        break;
      case "Hỗ trợ":
        navigate("/help");
        break;
      case "Đăng xuất":
        logout();
        navigate("/login");
        break;
      case "Đăng nhập":
        navigate("/login");
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
          <ListItemButton
            selected={active === "Trang chủ"}
            onClick={() => handleNavigate("Trang chủ")}
          >
            <ListItemIcon>
              <HomeOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Trang chủ" />}
          </ListItemButton>

          <ListItemButton
            onClick={() => handleNavigate("Đã đăng ký")}
            className={`nav-item ${active === "Đã đăng ký" ? "active-border" : ""
              }`}
          >
            <ListItemIcon>
              <PeopleAltOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Đã đăng ký" />}
            {!collapsed && (openGroups ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {/* <Collapse in={openGroups} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {loading ? (
                <ListItemText
                  primary="Đang tải..."
                  sx={{ pl: 4, color: "#bbb" }}
                />
              ) : groups.length === 0 ? (
                <ListItemText
                  primary="(Không có nhóm nào)"
                  sx={{ pl: 4, color: "#bbb" }}
                />
              ) : (
                groups.map((group) => (
                  <ListItemButton
                    key={group.groupId}
                    onClick={() => handleGroupClick(group.groupId, group.name)}
                    className={`sub-item ${activeGroup === group.name ? "active-sub" : ""
                      }`}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <GroupIcon fontSize="small" sx={{ color: "#cfd8dc" }} />
                    </ListItemIcon>
                    <ListItemText primary={group.name} />
                  </ListItemButton>
                ))
              )}
            </List>
          </Collapse> */}
          <Collapse in={openGroups} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    {loading ? (
      <ListItemText
        primary="Đang tải..."
        sx={{ pl: 4, color: "#bbb" }}
      />
    ) : groups.length === 0 ? (
      <ListItemText
        primary="(Không có nhóm nào)"
        sx={{ pl: 4, color: "#bbb" }}
      />
    ) : (
      groups.map((group) => (
        <ListItemButton
          key={group.groupId}
          onClick={() => handleGroupClick(group.groupId, group.name)}
          className={`sub-item ${
            activeGroup === group.name ? "active-sub" : ""
          }`}
          sx={{ pl: 4 }}
        >
          <ListItemIcon>
            <GroupIcon fontSize="small" sx={{ color: "#cfd8dc" }} />
          </ListItemIcon>
          <ListItemText primary={group.name} />
        </ListItemButton>
      ))
    )}
  </List>
</Collapse>


          <ListItemButton
            selected={active === "Cài đặt"}
            onClick={() => handleNavigate("Cài đặt")}
          >
            <ListItemIcon>
              <Settings sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Cài đặt" />}
          </ListItemButton>
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <List className="nav">
          <ListItemButton
            selected={active === "Hỗ trợ"}
            onClick={() => handleNavigate("Hỗ trợ")}
          >
            <ListItemIcon>
              <HelpOutlineOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Hỗ trợ" />}
          </ListItemButton>

          <ListItemButton
            selected={active === (isLoggedIn ? "Đăng xuất" : "Đăng nhập")}
            onClick={() => handleNavigate(isLoggedIn ? "Đăng xuất" : "Đăng nhập")}
          >
            <ListItemIcon>
              <Logout sx={{ color: "#fff" }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
              />
            )}
          </ListItemButton>
        </List>
      </Drawer>
    </div>
  );
}
