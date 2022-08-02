import { useState, useEffect } from "react";
import 'font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import bplogo from './bplogo.png';

export const Header = () => {

    const [data, setData] = useState<any>([]);
    let current_url = window.location.href.substring(21);
    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {
        const getData = async () => {

            const response = await fetch(
                `/api/user/me`
            );
            if (response.ok) {
                let actualData = await response.json();
                setData(actualData);
                localStorage.setItem(actualData.name, cookies.Authentication);
            }
            else
            {
                removeCookie('Authentication');
                window.location.reload();
            }
        }
        getData()
    }, [])
    
    return (
            <div className="header">
                <div className="title">
                    <Link to="/" style={{ textDecoration: 'none' }}><img src={bplogo} alt="bp logo"></img></Link>
                </div>
                <div className="onglets">
                    <h3 style={{borderBottom: current_url==="/community" ? '3px solid #1dd1a1' : '', }}><Link to="/community" style={{ textDecoration: 'none', color: 'black' }}>COMMUNITY</Link></h3>
                    <h3 style={{borderBottom: current_url==="/game" ? '3px solid #1dd1a1' : '', }}><Link to="/game" style={{ textDecoration: 'none', color: 'black' }}>GAME</Link></h3>
                    <h3 style={{borderBottom: current_url==="/ladder" ? '3px solid #1dd1a1' : '', }}><Link to="/ladder" style={{ textDecoration: 'none', color: 'black' }}>LADDER</Link></h3>
                </div>
                <div className="info">
                    <img src={data.avatar_url} alt="user"></img>
                    <h1 style={{borderBottom: current_url==="/profile/me" ? '3px solid #1dd1a1' : '', }}>{data.name}</h1>
                    <Link to="/profile/me" style={{ textDecoration: 'none', color: 'black' }}>
                        <i className="fa fa-solid fa-user"></i>
                    </Link>
                </div>
            </div>
    )
}
