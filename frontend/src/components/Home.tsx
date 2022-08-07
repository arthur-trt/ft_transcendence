import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import {socketo} from '../index';
import Game from './Game';
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const [socket, setSocket] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [friends, setFriends] = useState<any>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const socket = socketo;
        setSocket(socket);
        socket.emit('getUsers');
        socket.emit('getFriends');
        socket.on('listUsers', (tab:any) => {
            setUsers(tab);
          });
        socket.on('friendList', (msg:any, tab:any) => {
            setFriends(tab);
        });
      }, []);

    const [next, setNext] = useState(0);
    const [singleColor, setSingleColor] = useState("white");
    const [doubleColor, setDoubleColor] = useState("white");
    const [mode, setMode] = useState(0);
    const [error, setError] = useState("");

    function handleSingleMode() {
        setMode(1);
        setSingleColor("#1dd1a1");
        setDoubleColor("white");
    }

    function handleDoubleMode() {
        setMode(2);
        setSingleColor("white");
        setDoubleColor("#1dd1a1");
    }

    function handleLook() {
        if (!mode)
            setError("YOU MUST SELECT A MODE");
        else
            setNext(2);
    }

    function displayFriends(mode: number) {
        var indents:any = [];
        let j = 0;
        let i = 0;
        let online_friends = 0;
        while (j < users?.length)
        {
            i = 0;
            while (i < friends?.friends?.length)
            {
                if (friends?.friends[i].id === users[j].id)
                    if (users[j].status === 'online')
                    {
                        online_friends = 1;
                        indents.push(
                            <div className='home-search-single-friend' key={i}>
                                <img src={friends?.friends[i].avatar_url} alt="avatar"></img>
                                <h5>{friends?.friends[i].name}</h5>
                                <button id={friends?.friends[i].id} onClick={handleLaunchGameWithFriend}>PLAY</button>
                                </div>
                        );
                    }
                i++;
            }
            j++;
        }
        if (!online_friends)
        {
            indents.push(
                <div className='home-search-single-friend' key={i}>
                    <h5 style={{textAlign: 'center'}}>No online friends</h5>
                </div>
            );
        }
        return indents;
    }

    function handleLaunchMatchMaking(mode: number) {
        if (mode == 1)
        {
            console.log("MODE SIMPLE");
            socket.emit('game_inQueue', mode);
            navigate('/game');
        }
        else if (mode == 2)
        {
            console.log("MODESPECIAL");
            socket.emit('game_inQueue', mode);
            navigate('/game');
        }
    }
    let handleLaunchGameWithFriend = (e:any) =>
    {
        if (mode == 1)
        {
            console.log("MODESOLO WITH FRIEND");
            socket.emit('joinGame', e.currentTarget.id, mode);
            navigate('/game');
        }
        else if (mode == 2)
        {
            console.log("MODESPECIAL WITH FRIEND");
            socket.emit('joinGame', e.currentTarget.id, mode);
            navigate('/game');
        }
    }

    function displaySteps() {
        if (!next)
        {
            return (
                <div className='home-button'>
                    <h2>WELCOME TO <span>BABY-PONG</span> !</h2>
                    <button onClick={() => setNext(1)}>START TO PLAY</button>
                </div>
            );
        }
        else if (next === 1)
        {
            return (
                <div className='home-mode'>
                    <h2>SELECT YOUR GAME MODE</h2>
                    <div className='home-mode-button'><button onClick={handleSingleMode} style={{backgroundColor : singleColor}}>SINGLE PALLET</button></div>
                    <div className='home-mode-button'><button onClick={handleDoubleMode} style={{backgroundColor : doubleColor}}>DOUBLE PALLETS</button></div>
                    <div className='home-look-button'><button onClick={handleLook}><FontAwesomeIcon icon={faMagnifyingGlass} className="glass"/>LOOK FOR A GAME</button></div>
                    {error && <h5>{error}</h5>}
                </div>
            );
        }
        else if (next === 2)
        {
            let mode_selec = "";
            if (mode === 1)
                mode_selec = "SINGLE PALLET";
            else if (mode === 2)
                mode_selec = "DOUBLE PALLETS";

            return (
                <div className='home-search'>
                    <h2>FIND A GAME</h2>
                    <h3>MODE : <span>{mode_selec}</span></h3>
                    <div className='home-play-matchmaking'><button onClick={() => handleLaunchMatchMaking(mode)}>PLAY WITH MATCHMAKING</button></div>
                    <div className='home-play-friends'>
                        <h4>PLAY WITH ONLINE FRIENDS</h4>
                        {displayFriends(mode)}
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="home-container">
            {displaySteps()}
        </div>
    );
}
