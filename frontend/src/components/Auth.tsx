import '../index.css';

export default function Auth() {

    return (
            <div>
        <div className="auth-header">
            <h1>BABY-PONG</h1>
        </div>

        <div className="auth-link">
            <a href='/api/auth/42/login'><button>LOGIN</button></a>
        </div>
            </div>
    )

}
