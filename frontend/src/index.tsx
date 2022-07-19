import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Auth from './components/Auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import TwoFactor from './components/TwoFactor';
import Profile from './components/Profile';
import Channels from './components/Channels-add';
import Game from './components/Game';

// import io from 'socket.io-client';
// export const socketo = io('http://localhost:8080');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Router>
      <Routes>

      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Header />} />
      <Route path="/2fa" element={<><Header/><TwoFactor/></>} />
      <Route path="/profile" element={<><Header/><Profile/></>} />
      <Route path="/chat" element={<><Header/><Channels/></>} />
      <Route path="/game" element={<><Header/><Game/></>} />

      </Routes>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
