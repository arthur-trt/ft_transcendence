import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { socketo } from '../index';

export default function Profile() {

    const [data, setData] = useState<any>([]);
    const [name, setName] = useState("");
    const [inputState, setInputState] = useState(0);

    const [errorMsg, setErrorMsg] = useState<string>("");

    // NEW TWO-FA
    const [enable_disable, setEnableDisable] = useState("");
    const [indexDisplayTwoFa, setIndexDisplayTwoFa] = useState(0);
    const [twoFadata, setTwoFaData] = useState<any>([]);
    const [codeTwoFa, setCodeTwoFa] = useState<string>("");

    const [history, setHistory] = useState<any>([]);
    const [datausers, setDatausers] = useState<any>([]);


    useEffect(() => {
        const getData = async () => {
            const response = await fetch(
                `/api/user/me`
            );
            let actualData = await response.json();
            setData(actualData);
            if (actualData.TwoFA_enable)
                setEnableDisable("DISABLE 2FA");
            else if (!actualData.TwoFA_enable)
                setEnableDisable("ENABLE 2FA");
        }

        const getImage = async () => {
            const response = await fetch(
                `/api/auth/2fa/generate`
            );
            let actualData = await response.json();
            setTwoFaData(actualData);
        }
        
        getData()
        getImage()
    }, [])
    
    useEffect(
    () => {
        const socket = socketo;
        socket.emit('get history');
        socket.emit('getUsers');
        socket.on('MatchHistory', (tab:any) => {
            setHistory(tab);
        });
        socket.on('listUsers', (tab: any) => {
            setDatausers(tab);
        });
        socket.emit('get achievements');
        socket.on('Achievements', (tab: any) => {
            console.log(tab);
        });

    }, []);

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
        window.location.reload();
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
        if (!response.ok)
            alert("error with avatar");
        else
            window.location.reload();
    }

    async function handleTurnOnTwoFa(e: any) {
        e.preventDefault();
            let res = await fetch("/api/auth/2fa/turn-on", {
              method: "POST",
              body: JSON.stringify({
                token: codeTwoFa,
              }),
              headers: {
                  "Content-Type": "application/json",
              },
            });
            let resJson = await res.json();
            if (res.status !== 201) {
                alert(resJson.message);
            }
            else
                window.location.reload();
    }

    async function handleDeactivateTwoFa() {
        let res = await fetch("/api/auth/2fa/deactivate", {
            method: "POST",
          });
           let resJson = await res.json();
          if (res.status !== 201) {
              alert(resJson.message);
          }
          else
              window.location.reload();
    }


    function handleDisplayTwoFa() {
        let i = indexDisplayTwoFa;
        i++;
        setIndexDisplayTwoFa(i);
    }

    function displayTwoFa() {
        if (indexDisplayTwoFa % 2 === 1)
        {
            if (data.TwoFA_enable)
                handleDeactivateTwoFa();
            else if (!data.TwoFA_enable)
            {
                return (
                    <div className="profile-2fa-enable">
                        <FontAwesomeIcon icon={faXmark} className="xmark" onClick={handleDisplayTwoFa} />
                        <img src={twoFadata.qrcode} alt="qrcode"/>
                        <p>{twoFadata.secret}</p>
                        <form onSubmit={handleTurnOnTwoFa}>
                            <input
                                type="text"
                                value={codeTwoFa}
                                placeholder="Send your code"
                                onChange={(e) => setCodeTwoFa(e.target.value)}
                            />
                        </form>
                    </div>
                )
            }
        }
        else if (indexDisplayTwoFa % 2 === 0)
            return ("");
    }

    async function handleLogout(e: any) {
        e.preventDefault();
        let res = await fetch("/api/auth/logout", {
            method: "GET",
        });
        window.location.reload();
    }

    function displayHistory() {
        var indents : any = [];
        let i = 0;
        let bgColor = '#ff7675';
        let MyRes = 0;
        let OppId = 0;
        let OppRes = 0;
        let VorD = "DEFEAT";
        let OppIndex = 0;

        while (i < history?.length)
        {
            if (history[i]?.user1 === data.id)
            {
                MyRes = history[i]?.scoreUser1;
                OppId = history[i]?.user2;
                OppRes = history[i]?.scoreUser2;
            }
            else
            {
                MyRes = history[i]?.scoreUser2;
                OppId = history[i]?.user1;
                OppRes = history[i]?.scoreUser1;
            }
            if (MyRes > OppRes)
            {
                VorD = "VICTORY"
                bgColor = '#74b9ff';
            }
            let j = 0;
            while (j < datausers?.length)
            {
                if (datausers[j]?.id === OppId)
                    OppIndex = j;
                j++;
            }
            indents.push(
                <div style={{backgroundColor: bgColor}} className='history-line' key={i}>
                    <div className="result">{VorD}</div>
                    <div className="myavatar"><img src={data.avatar_url} alt="avatar"></img></div>
                    <div className="myname">{data.name}</div>
                    <div className="score">{MyRes} - {OppRes}</div>
                    <div className="oppname">{datausers[OppIndex]?.name}</div>
                    <div className="oppavatar"><img src={datausers[OppIndex]?.avatar_url} alt="avatar"></img></div>
                </div>
            );
            i++;
            VorD = "DEFEAT";
            bgColor = '#ff7675';
            MyRes = 0;
            OppId = 0;
            OppRes = 0;
            OppIndex = 0;
        }
        return (indents);
    }

    return (
        <div className="profile-container">

            <div className="profile-img">
                <img src={data.avatar_url} alt="avatar"></img>
            </div>
            <div className="profile-upload-img">
                <form onSubmit={handleSubmitAvatar}>
                    <input type="file"/>
                    <button type="submit">UPLOAD</button>
                </form>
                {errorMsg && <h3 className="error"> {errorMsg} </h3>}
            </div>

                <div className="profile-name">
                    <h5>PSEUDO : <span>{data.name}</span></h5>
                    <FontAwesomeIcon icon={faPen} className="pen" onClick={handleInputName} />
                    {displayInputName()}
                </div>

                <div className="profile-other">
                    <div><h5>FULL NAME</h5><p>{data.fullname}</p></div>
                    <div><h5>MAIL</h5><p>{data.mail}</p></div>
                    <div><h5>VICTORY</h5><p>{data.wonMatches}</p></div>
                </div>

            <div className="profile-2fa-and-logout">
                <div className="profile-2fa">
                    <button onClick={handleDisplayTwoFa}>{enable_disable}</button>
                    {displayTwoFa()}
                </div>

                <div className="profile-logout">
                    <button onClick={handleLogout}>LOGOUT</button>
                </div>
            </div>

            <div className="profile-history">
                <div className="history-title">
                    <h4 style={{color: '#74b9ff'}}>MATCH&nbsp;</h4>
                    <h4 style={{color: '#ff7675'}}>&nbsp;HISTORY</h4>
                </div>
                {displayHistory()}
            </div>

        </div >
    )

}