import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './auth/login/Login'
import Signup from './auth/signup/Signup'
import Dashboard from './pages/Dashboard'
import HeroPage from './pages/hero/page';
import Profile from './pages/Profile';
import GenerateKeys from './pages/GenerateKeys';
import SendToken from './pages/SendToken';
import Sends from './pages/Send';
import Receive from './pages/Receive';
import NotFound from './pages/NotFound';
import History from './pages/History';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send-token" element={<SendToken />} />
        <Route path="/send" element={<Sends />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HeroPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/generate-keys" element={<GenerateKeys/>}/>
        <Route path='/*' element={<NotFound />}/>
        <Route path='/history' element={<History/>}/>
      </Routes>
    </Router>
  )
}

export default App
