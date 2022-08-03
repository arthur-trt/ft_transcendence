export default function Auth() {
    return (
        <div>
            <div className="auth-header">
                {/* <h1>BABY-PONG</h1> */}
                <div className='title'>

                <img src="bplogo.png" alt="bp logo"></img>
                </div>
            </div>
            <div className="auth-link">
                <h2>42 AUTHENTICATION</h2>
                <p>You must log in with your 42 account.</p>
                <a href='/api/auth/42/login'><button><img src="42logo.png" alt="logo 42"></img>LOGIN</button></a>
            </div>
        </div>
    )
}
