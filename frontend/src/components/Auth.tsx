export default function Auth() {
    async function getData() {
        const data = await fetch(
            'http://localhost:8080/api/auth/42/login',
            {
                method: 'GET',
                redirect: 'follow',
            }
        ).then(response => response.json());
        console.log(data);
    }

    return (
        <div className="auth">
            <a href='http://localhost:8080/api/auth/42/login'>
                <button>LOGIN</button>
            </a>
            {/*<button onClick={getData}>LOGIN</button>*/}
        </div>
    )
}
