export default function Ladder() {

    const dataLadder:any = [
        {"rank":"1", "name":"codebrai", "victories":"400", "defeats":"0"},
        {"rank":"2", "name":"ldes-cou", "victories":"0", "defeats":"100"},
        {"rank":"3", "name":"hdurand", "victories":"0", "defeats":"100"},
        {"rank":"4", "name":"ccommiss", "victories":"0", "defeats":"100"},
        {"rank":"5", "name":"atrouill", "victories":"0", "defeats":"100"}
    ];
    
    var indents:any = [];
    
    let i = 0;
    while (i < dataLadder.length)
    {
        indents.push(
            <div className='ladder-line' key={i}>
                <div className='ladder-rank'><h5>#</h5>{dataLadder[i].rank}</div>
                <div className='ladder-name'>{dataLadder[i].name}</div>
                <div className='ladder-victories'><h5>VICTORIES :&nbsp;</h5>{dataLadder[i].victories}</div>
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