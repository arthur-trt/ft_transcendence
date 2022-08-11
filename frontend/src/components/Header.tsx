import { useState, useEffect } from "react";
import 'font-awesome/css/font-awesome.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { socketo } from '../index';

export const Header = () => {

    const [data, setData] = useState<any>([]);
    const location = useLocation().pathname;
    const [cookies, , removeCookie] = useCookies();
    const [gameInvite, setGameInvite] = useState("");
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
                // const mute = err;
            })
        }
        getData()
    }, [cookies.Authentication, navigate, removeCookie])

    useEffect(
        () => {
          socketo.on('accept invite', (id: string, mode:number) => {
            setGameInvite("Game : new request !");
          });
          socketo.on('newFriendRequest', (msg: any, tab: any) => {
            if (msg === "newfriendrequest")
                setGameInvite("Friend : new request !")
          });
          socketo.on('error', (msg: any) => {
            setGameInvite("Error : " + msg.event);
            });
          
        }, []);

        function displayNot() {
            setTimeout(() => {
                setGameInvite("");
              }, 8000);
            if (!gameInvite)
                return("");
            else if (gameInvite[0] === 'G')
                return (<div className="notifbg" style={{backgroundColor: '#f0932b'}}><h5>{gameInvite}</h5></div>)
            else if (gameInvite[0] === 'F')
                return (<div className="notifbg" style={{backgroundColor: '#54a0ff'}}><h5>{gameInvite}</h5></div>)
            else if (gameInvite[0] === 'E')
                return (<div className="notifbg" style={{backgroundColor: '#eb4d4b'}}><h5>{gameInvite}</h5></div>)
        }

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

                <div className="notifications">
                    {displayNot()}
                </div>
            </div>
    )
}
