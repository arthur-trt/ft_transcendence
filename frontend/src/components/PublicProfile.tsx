import { useState, useEffect } from "react";
import '../index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useParams } from "react-router-dom";



export default function PublicProfile() {

    const [data, setData] = useState<any>([]);

	const { uuid } = useParams();

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(
                `/api/user/` + uuid
            );
            let actualData = await response.json();
			if (response.ok)
            	setData(actualData);
			else
			{
				const tmp = {
					"name": "Not found",
					"fullname": "Not found",
					"mail": "Not found",
					"wonMatches": "Can you even read? Think about it. A user who is not found cannot have won a match. Idiot."
				}
				setData(tmp);
			}
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
                    <h5>PSEUDO PUBLIC : {data.name}</h5>
                </div>
                <div className="profile-other">
                    <h5>FULL NAME : {data.fullname}</h5>
                    <h5>MAIL : {data.mail}</h5>
                    <h5>VICTORY : {data.wonMatches}</h5>
                </div>
            </div>
        </div >
    )

}
