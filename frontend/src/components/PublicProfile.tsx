import { useState, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { useParams } from "react-router-dom";

import {useNavigate} from 'react-router-dom';

export default function PublicProfile() {

    const [data, setData] = useState<any>([]);

	const { uuid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(
                `/api/user/` + uuid
                );
                let actualData = await response.json();
                if (response.ok)
                	setData(actualData);
            else
                navigate('*');
			// {
			// 	const tmp = {
			// 		"name": "Not found",
			// 		"fullname": "Not found",
			// 		"mail": "Not found",
			// 		"wonMatches": "Can you even read? Think about it. A user who is not found cannot have won a match. Idiot."
			// 	}
			// 	setData(tmp);
			// }
        }
        getData()
    }, [])

    return (
        <div className="profile-container">
            <div className="profile-public">
            <FontAwesomeIcon icon={faEye} className="eye" />
            PUBLIC
            </div>

            <div className="profile-img">
                <img src={data.avatar_url}></img>
            </div>

            <div className="profile-name">
                <h5>PSEUDO : <span>{data.name}</span></h5>
            </div>

            <div className="profile-other">
                <div><h5>FULL NAME</h5><p>{data.fullname}</p></div>
                <div><h5>MAIL</h5><p>{data.mail}</p></div>
                <div><h5>VICTORY</h5><p>{data.wonMatches}</p></div>
            </div>

            </div>
    )

}
