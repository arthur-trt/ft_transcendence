import { useEffect, useState } from "react";

export default function Ladder() {

	const [ladder, setLadder] = useState();

	useEffect(()  =>  {
		const getData = async () => {
			const response = await fetch(
				`/api/game/ladder`
			);
			console.log(response);
			let actualData = await response.json();
			setLadder(actualData);
			console.log(actualData);
		}
		 getData()
		}, [])

	const dataLadder : any = ladder;
    var indents : any = [];

	let i = 0;

    while (i < dataLadder?.length)
    {
        indents.push(
            <div className='ladder-line' key={i}>
				<div className='ladder-rank'><h5>#</h5>{i + 1}</div>
				<div className="profile-img">
				<img src={dataLadder[i].avatar_url}></img>
            	</div>
                <div className='ladder-name'>{dataLadder[i].name}</div>
                <div className='ladder-victories'><h5>VICTORIES :&nbsp;</h5>{dataLadder[i].wonMatches}</div>
                <div className='ladder-defeats'><h5>DEFEATS :&nbsp;</h5>{dataLadder[i].defeats}</div>
            </div>
        );
        i++;
    }

    return (
        <div className='ladder-container'>
            {indents}
        </div>
    )
}
