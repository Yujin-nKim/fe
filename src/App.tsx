import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import MainPage from './components/MainPage'
import NoticePage from './components/NoticePage'
import NoticeDetailPage from './components/NoticeDetailPage'
import MyInquiryPage from './components/MyInquiryPage'
import InquiryDetailPage from './components/InquiryDetailPage'
import InquiryWritePage from './components/InquiryWritePage'
import QrPage from './components/QrPage'

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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
