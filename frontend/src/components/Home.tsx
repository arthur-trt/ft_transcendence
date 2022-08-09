import { useState, useEffect } from 'react';
import {socketo} from '../index';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

export default function Home() {

    const [socket, setSocket] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [friends, setFriends] = useState<any>([]);
    const navigate = useNavigate();
    const location = useLocation();

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
    const [mode, setMode] = useState(0);

    useEffect(() => {
        setNext(0);
        setMode(0);
    }, [location]);

    function handleSingleMode() {
        setMode(1);
        setNext(2);
    }

    function handleDoubleMode() {
        setMode(2);
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
                                <button id={friends?.friends[i].id} onClick={sendingInvite}>PLAY</button>
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
    let sendingInvite = (e:any) =>
    {
        socket.emit(('pending invite'), {friendId: e.currentTarget.id, mode: mode})
        navigate('/game');
        console.log('sending invite')
    }
    function handleLaunchMatchMaking(mode: number) {
        if (mode === 1)
        {
            console.log("MODE SIMPLE");
            socket.emit('game_inQueue', mode);
            navigate('/game');
        }
        else if (mode === 2)
        {
            console.log("MODESPECIAL");
            socket.emit('game_inQueue', mode);
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
                    <div className='home-mode-button'><button onClick={handleSingleMode}>SINGLE PALLET</button></div>
                    <div className='home-mode-button'><button onClick={handleDoubleMode}>DOUBLE PALLETS</button></div>
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
