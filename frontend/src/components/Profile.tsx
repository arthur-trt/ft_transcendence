import { useState, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'



export default function Profile() {

    const [data, setData] = useState<any>([]);
    const [name, setName] = useState("");
    const [inputState, setInputState] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [twofaCheck, setTwofaCheck] = useState<boolean>(false);
    const [twoFaSecret, setTwoFaSecret] = useState<string>();
    const [twoFaImage, setTwoFaImage] = useState<string>();
    const [code, setCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(
                `/api/user/me`
            );
            let actualData = await response.json();
            setData(actualData);
            if (actualData.TwoFA_enable == true)
                setTwofaCheck(true);
        }
        getData()
    }, [])

    let handleChangeName = (e: any) => {
        e.preventDefault();

        fetch('/api/user/userSettings', {
            method: 'PATCH',
            body: JSON.stringify({
                name: name,
                mail: data.mail,
                fullname: data.fullname,
                avatar_url: data.avatar_url,
                two_fa: data.TwoFA_enable
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
        if (inputState % 2 === 1) {
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
            return ("");
    }

    async function handleSubmitAvatar(event: any) {
        event.preventDefault();

        var postFile = new FormData();
        postFile.append('file', event.target[0].files[0]);

        const response = await fetch('/api/user/avatar', {
            method: 'POST',
            body: postFile,
        })
        if (!response.ok) {
            if (response.status == 415)
                setErrorMsg("JS c'est du caca");
        }
        else {
            window.location.reload();
        }
    }

    async function handleTwoFAChange(event: any) {
        const secret = await (await fetch(
            "/api/auth/2fa/generate"
        )).json();
        setTwoFaSecret(secret.secret);
        setTwoFaImage(secret.qrcode);
    }

    async function handleTurnOnTwoFa(e: any) {
        e.preventDefault();
        try {
            let res = await fetch("/api/auth/2fa/turn-on", {
              method: "POST",
              body: JSON.stringify({
                token: code,
              }),
              headers: {
                  "Content-Type": "application/json",
              },
            });
             let resJson = await res.json();
            if (res.status !== 201) {
              setMessage(resJson.message);
            }
            else{
                setTwoFaSecret("");
                setTwofaCheck(true);
            }
          } catch (err) {
            console.log(err);
          }
    }



    return (
        <div className="profile-container">
            <div className="profile-img">
                <img src={data.avatar_url}></img>
                <form onSubmit={handleSubmitAvatar}>
                    <input type="file" />
                    <button type="submit">Upload</button>
                </form>
                {errorMsg && <h3 className="error"> {errorMsg} </h3>}
            </div>
            <div className="profile-info">
                <div className="profile-name">
                    <h5>PSEUDO : {data.name}</h5>
                    <FontAwesomeIcon icon={faPen} className="pen" onClick={handleInputName} />
                    {displayInputName()}
                </div>
                <div className="twofa_user">
                    <label>
                        <input
                            type="checkbox"
                            checked={twofaCheck}
                            onChange={handleTwoFAChange}
                        />
                        TwoFA Enable
                    </label>
                    {twoFaSecret &&
                        <div className="secret">
                            <img src={twoFaImage} alt="TwoFA QRCode Image" />
                            <p>{twoFaSecret}</p>
                            <form onSubmit={handleTurnOnTwoFa}>
                                <input
                                    type="text"
                                    value={code}
                                    placeholder="Validate your code"
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <button type="submit">Validate</button>
                                <div className="message">{message ? <p>{message}</p> : null}</div>
                            </form>
                        </div>
                    }

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
