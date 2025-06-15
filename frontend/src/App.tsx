import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './auth/login/Login'
import Signup from './auth/signup/Signup'
import Dashboard from './pages/Dashboard'
import HeroPage from './pages/hero/page';
import Profile from './pages/Profile';
import GenerateKeys from './pages/GenerateKeys';
import SendToken from './pages/SendToken';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendToken />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HeroPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/generate-keys" element={<GenerateKeys/>}/>
      </Routes>
    </Router>
  )
}

export default App
