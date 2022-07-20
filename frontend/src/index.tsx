import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Auth from './components/Auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import TwoFactor from './components/TwoFactor';
import Profile from './components/Profile';
import Channels from './components/Channels-add';
//import Game from './components/Game';
import { CookiesProvider } from "react-cookie";
import io from 'socket.io-client';
import Debug from './components/Debug';
export const socketo = io();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <CookiesProvider>
    <Router>
      <Routes>

      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Header />} />
      <Route path="/2fa" element={<><Header/><TwoFactor/></>} />
      <Route path="/profile" element={<><Header/><Profile/></>} />
      <Route path="/chat" element={<><Header/><Channels/></>} />
      <Route path="/debug" element={<><Header/><Debug/></>} />
      {/*<Route path="/game" element={<><Game/></>} />*/}

      </Routes>
    </Router>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
