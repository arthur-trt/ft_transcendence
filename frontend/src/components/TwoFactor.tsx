import { useState } from "react";

function TwoFactor() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let res = await fetch("/api/user/joinChannel", {
        method: "POST",
        body: JSON.stringify({
          chanName: name,
        }),
        headers: {
            "Content-Type": "application/json",
        },
      });
      // let resJson = await res.json();
      if (res.status === 201) {
        setName("");
        setMessage("2FA created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="2FA..."
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">Create</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default TwoFactor;
