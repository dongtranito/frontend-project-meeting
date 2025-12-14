import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Header from "../components/header/header";
import Home from "../pages/home/home";
import Help from "../pages/help/help";
import Settings from "../pages/settings/settings";
import DetailItemGroup from "../pages/detail-item-group/detail-item-group";
import DetailMeeting from "../pages/detail-meeting/detail-meeting";
import EditMinutePage from "../pages/edit-minute-page/edit-minute-page";

import { useLocation } from "react-router-dom";

export default function MainLayout() {

  const location = useLocation();

  const getHeaderTitle = () => {
    if (location.pathname.includes("/detail-group")) return "Chi tiết nhóm";
    if (location.pathname.includes("/meeting/") && !location.pathname.includes("edit-minute")) return "Chi tiết cuộc họp";
    if (location.pathname.includes("/edit-minute")) return "Chỉnh sửa biên bản";

    return "Home";
  };

  return (
    <div className="app-container" style={{ display: "flex" }}>
      <Sidebar />

      <div className="main-wrapper" style={{ flex: 1 }}>

        <main className="main-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/detail-group/:id" element={<DetailItemGroup />} />
            <Route path="/meeting/:id" element={<DetailMeeting />} />
            <Route path="/meeting/:id/edit-minute" element={<EditMinutePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
