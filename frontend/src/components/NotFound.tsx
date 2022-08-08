import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="notfound-container">
            <img src="bplogo.png" alt="bp logo"></img>
            <h2>404 ERROR : NOT FOUND</h2>
            <Link to="/" style={{ textDecoration: 'none'}}><button>GO BACK TO HOME</button></Link>
        </div>
    );
}
