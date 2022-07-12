import { useState, useEffect } from "react";
import 'font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom';

export const Header = () => {

    const [data, setData] = useState<any>([]);

    useEffect(() => {
    const getData = async () => {
        const response = await fetch(
            `/api/user/me`
        );
        let actualData = await response.json();
        setData(actualData);
    }
    getData()
    }, [])


    return (
        <div>

        <div className="header">
            <div className="title"><h1><Link to="/home" style={{ textDecoration: 'none', color: 'black' }}>
                BABY-PONG</Link></h1>
            </div>
            <div className="onglets">
                <h3><Link to="/chat" style={{ textDecoration: 'none', color: 'black' }}>CHAT</Link></h3>
                <h3>LADDER</h3>
            </div>
            <div className="info">
                <img src={data.avatar_url}></img>
                <h1>{data.name}</h1>
                <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
                <i className="fa fa-solid fa-user"></i>

                </Link>
            </div>
        </div>
        
        </div>

    )
}