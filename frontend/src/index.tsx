import "./index.css"
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Auth from './components/Auth';
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import TwoFactor from './components/TwoFactor';
import Profile from './components/Profile';
import Channels from './components/Channels-add';
import Game from './components/Game';
import { CookiesProvider, useCookies } from "react-cookie";
import io from 'socket.io-client';
import Debug from './components/Debug';
import PublicProfile from './components/PublicProfile';
import jwtDecode from 'jwt-decode';
import Ladder from "./components/Ladder";

export const socketo = io();

/**
 * Check if a cookie is present and if token is valid. Can't check every case, for exemple if
 * server change secret, this token can be valid client side, but not server side. This will occur
 * in a lot of uncaught 401. Maybe a check at each fetch would be necessary
 * @param param0 Don't know, react magic !
 * @returns Don't know react magic again !
 */
function RequireAuth({ children }: { children: JSX.Element }) {
  const [cookies, setCookie] = useCookies();

  if (!cookies.Authentication) {
    return <Navigate to="/login" replace />;
  }
  const token: any = jwtDecode(cookies.Authentication)
  const dateNow = new Date();
  if (token.exp * 1000 < dateNow.getTime()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<RequireAuth><Header /></RequireAuth>} />
        <Route path="/2fa" element={<><RequireAuth><TwoFactor /></RequireAuth></>} />
        <Route path="profile">
          <Route path="me" element={<><Header /><RequireAuth><Profile /></RequireAuth></>} />
          <Route path=":uuid" element={<><Header /><RequireAuth><PublicProfile /></RequireAuth></>} />
        </Route>
        <Route path="/community" element={<><Header /><RequireAuth><Channels /></RequireAuth></>} />
        <Route path="/ladder" element={<><Header /><RequireAuth><Ladder /></RequireAuth></>} />
        <Route path="/debug" element={<><Header /><RequireAuth><Debug /></RequireAuth></>} />
        <Route path="/game" element={<><Header /><Game/></>} />

      </Routes>
    </BrowserRouter>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
