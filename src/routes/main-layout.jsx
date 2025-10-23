import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Header from "../components/header/header";
import Home from "../pages/home/home";
import Help from "../pages/help/help";
import Settings from "../pages/settings/settings";
import DetailItemGroup from "../pages/detail-item-group/detail-item-group";

export default function MainLayout() {
  return (
    <div className="app-container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-wrapper" style={{ flex: 1 }}>
        <Header />
        <main className="main-content" style={{ padding: "24px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail-group/:id" element={<DetailItemGroup />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
