import { useState, useEffect } from "react";
import '../index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

export default function Profile() {

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
        <div className="profile-container">
            <div className="profile-img">
                <img src={data.avatar_url}></img>
            </div>
            <div className="profile-info">
                <div className="profile-name">
                    <h5>PSEUDO : {data.name}</h5>
                    <FontAwesomeIcon icon={faPen} className="pen"/>
                </div>
                <h5>FULL NAME : {data.fullname}</h5>
                <h5>MAIL : {data.mail}</h5>
                <h5>VICTORY : {data.wonMatches}</h5>
            </div>
        </div>
    )

}