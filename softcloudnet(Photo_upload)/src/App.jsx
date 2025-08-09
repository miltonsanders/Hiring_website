import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersonalInfo from "./pages/PersonalInfo";
import Location from "./pages/Location";
import MonthlyRate from "./pages/MonthlyRate";
import Commitment from "./pages/Commitment";
import EnglishLevel from "./pages/EnglishLevel";
import Availability from "./pages/Availability";
import Links from "./pages/Links";
import VideoIntro from "./pages/VideoIntro";
import Complete from "./pages/Complete";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/toast";
import Init from "./components/Init";
import BusinessType from "./pages/BusinessType";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastProvider>
          <Routes>
            <Route path="/" element={<PersonalInfo />} />
            <Route path="/business-type" element={<BusinessType />} />
            <Route path="/location" element={<Location />} />
            <Route path="/monthly-rate" element={<MonthlyRate />} />
            <Route path="/commitment" element={<Commitment />} />
            <Route path="/english-level" element={<EnglishLevel />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/links" element={<Links />} />
            <Route path="/video-intro" element={<VideoIntro />} />
            <Route path="/complete" element={<Complete />} />
          </Routes>
          <Init />
          <ToastContainer />
        </ToastProvider>
      </div>
    </Router>
  );
}

export default App;
