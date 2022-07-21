import { useState, useEffect } from "react";
import '../index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

export default function Profile() {

    const [data, setData] = useState<any>([]);
    const [name, setName] = useState("");
    const [inputState, setInputState] = useState(0);
    const [file, setFile] = useState<any>();

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

    let handleChangeName = (e:any) => {
        e.preventDefault();

        fetch('/api/user/userSettings', {
        method: 'PATCH',
        body: JSON.stringify({
            name: name,
            mail: data.mail,
            fullname: data.fullname,
            avatar_url: data.avatar_url
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        })

        setName("");
    }

    let handleInputName = () => {
        let i = inputState;
        i++;
        setInputState(i);
    }

    function displayInputName() {
    if (inputState % 2 === 1)
    {
        return (
            <form onSubmit={handleChangeName}>
                <input
                type="text"
                value={name}
                placeholder="Pseudo..."
                onChange={(e) => setName(e.target.value)}
                />
            </form>
        );
    }
    if (inputState % 2 === 0)
        return("");
    }

    function handleChangeAvatar(event:any) {
        setFile(event.target.files[0])
    }

    function handleSubmitAvatar(event:any) {
        event.preventDefault();
        // console.log(file);
        
        // // var postFile = new FormData();
        // postFile.append('file', file);

        fetch('/api/user/avatar', {
            method: 'POST',
            body: file,
            headers: {
                'Content-type': 'multipart/form-data',
            },
            })
      }

    return (
        <div className="profile-container">
            <div className="profile-img">
                <img src={data.avatar_url}></img>
                <form onSubmit={handleSubmitAvatar}>
                    <input type="file" onChange={handleChangeAvatar}/>
                    <button type="submit">Upload</button>
                </form>
            </div>
            <div className="profile-info">
                <div className="profile-name">
                    <h5>PSEUDO : {data.name}</h5>
                    <FontAwesomeIcon icon={faPen} className="pen" onClick={handleInputName}/>
                    {displayInputName()}
                </div>
                <div className="profile-other">
                    <h5>FULL NAME : {data.fullname}</h5>
                    <h5>MAIL : {data.mail}</h5>
                    <h5>VICTORY : {data.wonMatches}</h5>
                </div>
            </div>
        </div>
    )

}