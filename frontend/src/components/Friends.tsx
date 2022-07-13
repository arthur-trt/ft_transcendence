import { useState, useEffect } from "react";

export default function Channels() {

    const [data, setData] = useState<any>([]);

    useEffect(() => {
    const getData = async () => {
        const response = await fetch(
            `/api/user`
        );
        let actualData = await response.json();
        setData(actualData);
    }
    getData()
    }, [])

    function display() {
        var indents = [];
        let i = 0;
        while(i < data.length)
        {
            indents.push(<div className="uniquefriend" key={i}>
                <div>
                    <img src={data[i]?.avatar_url}></img>
                </div>
                <div className="friends-name">
                {data[i]?.name}
                </div>
                </div>);
            i++;
        }
        return indents;
    }

    return (
        <div className="friends-box">
            {display()}
        </div>
    )

}