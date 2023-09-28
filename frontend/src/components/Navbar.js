import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Question</h1>
                </Link>
                <Link to="/room">
                    <h1>Room1</h1>
                </Link>
            </div>
        </header>
    )
}

export default Navbar