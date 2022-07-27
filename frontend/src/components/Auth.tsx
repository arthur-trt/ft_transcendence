import logo from './42logo.png';

export default function Auth() {
    return (
        <div>
            <div className="auth-header">
                <h1>BABY-PONG</h1>
            </div>
            <div className="auth-link">
                <h2>AUTHENTICATION</h2>
                <p>You must log in with your 42 account.</p>
                <a href='/api/auth/42/login'><button><img src={logo} ></img>LOGIN</button></a>
            </div>
        </div>
    )
}
