import { useState, useEffect } from "react";
import '../index.css';

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
        <div className="setpro-container">
            <div className="settings">
                <h3>SETTINGS</h3>
            </div>
            <div className="profile">
                <h3>PROFILE</h3>
                <h5>PSEUDO : {data.name}</h5>
                <h5>FULL NAME : {data.fullname}</h5>
                <h5>MAIL : {data.mail}</h5>
                <h5>VICTORY : {data.wonMatches}</h5>
            </div>
        </div>
    )

}