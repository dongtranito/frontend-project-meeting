import UploadAudio from "./components/UploadAudio";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import Home from "./pages/home/home";

import './App.css';
import Settings from "./pages/settings/settings";
import Help from "./pages/help/help";
import DetailItemGroup from "./pages/detail-item-group/detail-item-group";
import LoginForm from "./pages/login/login-form";
import MainLayout from "./routes/main-layout";
import { AuthProvider } from "./auth/auth-context";
import TestBackend from "./pages/test/test";
import { GroupContext, GroupProvider } from "./context/group-context";
function App() {
  return (
    <Router>
      <AuthProvider>
        <GroupProvider>
      <div className="app-container" >
        <Routes>
          <Route path="/*" element={<MainLayout />} />

          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/test" element={<TestBackend />} /> */}

        </Routes>
      </div>
      </GroupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
