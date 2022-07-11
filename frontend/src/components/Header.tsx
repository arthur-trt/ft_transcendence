import { useState, useEffect } from "react";
import 'font-awesome/css/font-awesome.min.css';
import Settings from './Settings';
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

    const [isShown, setIsShown] = useState(false);

    const handleClick = () => {
    setIsShown(current => !current);

    };


    return (
        <div>

        <div className="header">
            <div className="title"><h1><Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
                42-PONG</Link></h1>
            </div>
            <div className="info">
                <img src={data.avatar_url}></img>
                <h1>{data.name}</h1>
                <i onClick={handleClick} className="fa fa-solid fa-gear"></i>
            </div>
        </div>
        
        <div>
            {isShown && <Settings />}
        </div>
        </div>

    )
}