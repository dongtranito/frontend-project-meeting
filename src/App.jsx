import UploadAudio from "./components/UploadAudio";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import Home from "./pages/home/home";

import './App.css';
import Settings from "./pages/settings/settings";
import Help from "./pages/help/help";
import DetailItemGroup from "./pages/detail-item-group/detail-item-group";
function App() {
  return (
    // <div className="app-container">
    //   {/* <LoginForm /> */}
    //   <Sidebar />
    //   <Header />
    // </div>
    <Router>
      <div className="app-container" >
        <Sidebar />
        <div >
          <Header />
          <main className="main-content" style={{ padding: "24px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/group/:id" element={<DetailItemGroup />} />

              {/* <Route path="/registered" element={<Registered />} /> */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} /> 
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
