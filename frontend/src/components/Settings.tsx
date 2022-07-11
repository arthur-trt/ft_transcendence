import { Link } from 'react-router-dom';

export default function Settings() {

    return (
        <div className="settings-box">
            <div className="button"><Link to="/profile" style={{ textDecoration: 'none', color: 'white' }}>Your profile</Link></div>
            <div className="button"><Link to="/2fa" style={{ textDecoration: 'none', color: 'white' }}>Change 2FA</Link></div>
            <div className="button">Sign out</div>
        </div>
    )

}