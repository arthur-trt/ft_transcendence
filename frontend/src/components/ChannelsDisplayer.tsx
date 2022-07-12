import { useState, useEffect } from "react";

export const ChannelsDisplayer = () => {

    const [data, setData] = useState<any>([]);

    useEffect(() => {
    async function getData() {
        const response = await fetch(
            `/api/channel`
        )
        let actualData = await response.json();
        setData(actualData);
    }
    getData();
    }, [])

    function display() {
        var indents = [];
        let i = 0;
        while(i < data.length)
        {
            indents.push(<div className="uniquechan" key={i}>
                <h4>
                {data[i]?.name}
                </h4>
                </div>);
            i++;
        }
        return indents;
    }

    return (
        <div className="everychan">
            {display()}
        </div>
    )
}