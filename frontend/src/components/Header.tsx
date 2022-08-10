import { useState, useEffect } from "react";
import 'font-awesome/css/font-awesome.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

export const Header = () => {

    const [data, setData] = useState<any>([]);
    const location = useLocation().pathname;
    const [cookies, , removeCookie] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        const getData = () => {
            fetch(`/api/user/me`).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    removeCookie('Authentication');
                    navigate('/login');
                    throw new Error('not cool man');
                }
            }).then((responseJson) => {
                setData(responseJson);
                // Debug function to remove
                localStorage.setItem(responseJson.name, cookies.Authentication);
            }).catch((err) => {
                const mute = err;
            })
        }
        getData()
    }, [])

    return (
            <div className="header">
                <div className="title">
                    <Link to="/" style={{ textDecoration: 'none' }}><img src="bplogo.png" alt="bp logo"></img></Link>
                </div>
                <div className="onglets">
                    <h3 style={{borderBottom: location==="/community" ? '3px solid #1dd1a1' : '', }}><Link to="/community" style={{ textDecoration: 'none', color: 'black' }}>COMMUNITY</Link></h3>
                    {/* <h3 style={{borderBottom: location==="/game" ? '3px solid #1dd1a1' : '', }}><Link to="/game" style={{ textDecoration: 'none', color: 'black' }}>GAME</Link></h3> */}
                    <h3 style={{borderBottom: location==="/ladder" ? '3px solid #1dd1a1' : '', }}><Link to="/ladder" style={{ textDecoration: 'none', color: 'black' }}>LADDER</Link></h3>
                </div>
                <div className="info">
                    <img src={data.avatar_url} alt="user"></img>
                    <h1 style={{borderBottom: location==="/profile/me" ? '3px solid #1dd1a1' : '', }}>{data.name}</h1>
                    <Link to="/profile/me" style={{ textDecoration: 'none', color: 'black' }}>
                        <i className="fa fa-solid fa-user"></i>
                    </Link>
                </div>
            </div>
    )
}
