import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { socketo } from '../index';

export default function Profile() {

    const [data, setData] = useState<any>([]);
    const [name, setName] = useState("");
    const [inputState, setInputState] = useState(0);

    // NEW TWO-FA
    const [enable_disable, setEnableDisable] = useState("");
    const [indexDisplayTwoFa, setIndexDisplayTwoFa] = useState(0);
    const [twoFadata, setTwoFaData] = useState<any>([]);
    const [codeTwoFa, setCodeTwoFa] = useState<string>("");

    const [history, setHistory] = useState<any>([]);
    const [datausers, setDatausers] = useState<any>([]);
    const [achievements, setAchievements] = useState<any>([]);

    // FETCH
    useEffect(() => {
        const getData = async () => {
            const response = await fetch(
                `/api/user/me`
            );
            const actualData = await response.json();
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
            const actualData = await response.json();
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
            setAchievements(tab);
        });

    }, []);

    // FETCH
    async function handleChangeName(e: any) {
        e.preventDefault();
        const response = await fetch('/api/user/userSettings', {
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
        if (!response.ok)
            alert("Error : username");
        else
        {
                const response = await fetch(
                    `/api/user/me`
                );
                const actualData = await response.json();
                setData(actualData);
                if (actualData.TwoFA_enable)
                    setEnableDisable("DISABLE 2FA");
                else if (!actualData.TwoFA_enable)
                    setEnableDisable("ENABLE 2FA");
                socketo.emit('refreshUsers');
        }
        setName("");
    }


    const handleInputName = () => {
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

    // FETCH
    async function handleSubmitAvatar(event: any) {
        event.preventDefault();

        const postFile = new FormData();
        if ( event.target[0].files[0])
        {
            postFile.append('file', event.target[0].files[0]);
    
            const response = await fetch('/api/user/avatar', {
                method: 'POST',
                body: postFile,
            })
            if (!response.ok)
                alert("Error : avatar");
            else
            {
                const response = await fetch(
                    `/api/user/me`
                );
                const actualData = await response.json();
                setData(actualData);
                if (actualData.TwoFA_enable)
                    setEnableDisable("DISABLE 2FA");
                else if (!actualData.TwoFA_enable)
                    setEnableDisable("ENABLE 2FA");
                socketo.emit('refreshUsers');
            }
        }
    }

    // FETCH
    async function handleTurnOnTwoFa(e: any) {
        e.preventDefault();
            const res = await fetch("/api/auth/2fa/turn-on", {
              method: "POST",
              body: JSON.stringify({
                token: codeTwoFa,
              }),
              headers: {
                  "Content-Type": "application/json",
              },
            });
            const resJson = await res.json();
            if (res.status !== 201) {
                alert(resJson.message);
            }
            else
                window.location.reload();
    }


    // FETCH
    async function handleDeactivateTwoFa() {
        const res = await fetch("/api/auth/2fa/deactivate", {
            method: "POST",
          });
           const resJson = await res.json();
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


    // FETCH
    async function handleLogout(e: any) {
        e.preventDefault();
        const res = await fetch("/api/auth/logout", {
            method: "GET",
        });
        if (res.status === 200)
            window.location.reload();
    }

    function displayHistory() {
        const indents : any = [];
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

    function displayAchievements() {
        const indents : any = [];
        let i = 0;
        const bgColor = '#1dd1a1';

        while (i < achievements?.length)
        {
            indents.push(
                <div style={{backgroundColor: bgColor}} className='achievements-line' key={i}>
                    <FontAwesomeIcon icon={faTrophy} className="trophy"/>
                    <div className="name">{achievements[i]?.achievement_list}</div>
                </div>
            );
            i++;
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
                    <input type="file" accept="image/*" required/>
                    <button type="submit">UPLOAD</button>
                </form>
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
            
            <div className="profile-achievements">
                <h4>ACHIEVEMENTS</h4>
                {displayAchievements()}
            </div>

            <div className="profile-history">
                <h4>MATCH HISTORY</h4>
                {displayHistory()}
            </div>

        </div >
    )

}