export default function Auth() {
    async function getData() {
        const data = await fetch(
        `http://localhost:8080/api/auth/42/login`,
        {
            method: 'get',
            headers: { 'content-type': 'application/json' },
            mode: 'no-cors',
        }).then(response => response.json());
        console.log(data);
    }

    return (
        <div className="auth">
            <button onClick={getData}>LOGIN</button>
        </div>
    )
}