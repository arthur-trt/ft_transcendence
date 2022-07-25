import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TwoFactor() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  let navigate = useNavigate(); //redirection

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let res = await fetch("/api/auth/2fa/validate", {
        method: "POST",
        body: JSON.stringify({
          token: name,
        }),
        headers: {
            "Content-Type": "application/json",
        },
      });
      // let resJson = await res.json();
      if (res.status === 201) {
        setName("");
        setMessage("2FA created successfully");
        return (navigate("/")); //redirection to home if success
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
