import { useState } from 'react';

export default function Home() {

    const [next, setNext] = useState(0);

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
        else
        {
            return (
                <h2>SELECT YOUR GAME MODE</h2>
            );
        }
    }

    return (
        <div className="home-container">
            {displaySteps()}
        </div>
    );
}