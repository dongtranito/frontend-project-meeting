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

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

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
        navigate("/home");
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
        // sx={{
        //   "& .MuiDrawer-paper": {
        //     backgroundColor: "#1e1e2f",
        //     color: "#fff",
        //     border: "none",
        //   },
        // }}
        className="sidebar-bg"
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
