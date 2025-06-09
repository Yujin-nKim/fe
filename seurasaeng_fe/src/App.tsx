import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainPage from './pages/MainPage'
import NoticePage from './pages/NoticePage'
import NoticeDetailPage from './pages/NoticeDetailPage'
import MyInquiryPage from './pages/MyInquiryPage'
import InquiryDetailPage from './pages/InquiryDetailPage'
import InquiryWritePage from './pages/InquiryWritePage'
import QrPage from './pages/QrPage'
import MyRideHistoryPage from './pages/MyRideHistoryPage'
import QrScanPage from './pages/QrScanPage'
import ShuttleTimetablePage from './pages/ShuttleTimetablePage'
import AdminPageGps from './pages/AdminPageGps'
import EmployeeGPSApp from './pages/EmployeePageGps'
import ResetPasswordPage from './pages/ResetPasswordPage'
import EditProfilePage from './pages/EditProfilePage'
import AdminMainPage from './pages/AdminMainPage'
import NoticeWritePage from './pages/NoticeWritePage'

function App() {
  return (
    <BrowserRouter>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/:id" element={<NoticeDetailPage />} />
          <Route path="/inquiry" element={<MyInquiryPage />} />
          <Route path="/inquiry/:id" element={<InquiryDetailPage />} />
          <Route path="/inquiry/write" element={<InquiryWritePage />} />
          <Route path="/qr" element={<QrPage />} />
          <Route path="/qr-scan" element={<QrScanPage />} />
          <Route path="/my-ride-history" element={<MyRideHistoryPage />} />
          <Route path="/timetable" element={<ShuttleTimetablePage />} />
          <Route path="/realtime-shuttle" element={<EmployeeGPSApp />} />
          <Route path="/admin/race-gps" element={<AdminPageGps />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/admin" element={<AdminMainPage />} />
          <Route path="/admin/notice" element={<NoticePage isAdmin={true} />} />
          <Route path="/admin/notice/write" element={<NoticeWritePage />} />
          <Route path="/admin/inquiry" element={<MyInquiryPage isAdmin={true} />} />
          <Route path="/admin/inquiry/:id" element={<InquiryDetailPage isAdmin={true} />} />
          <Route path="/admin/timetable" element={<ShuttleTimetablePage isAdmin={true} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
