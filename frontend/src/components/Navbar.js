import { Link } from "react-router-dom";
import "./css/Navbar.css";

const Navbar = ({ user, handleLogout }) => {
	return (
		<header>
			<div className="container">
				<Link to="/">
					<h1>PeerPrep</h1>
				</Link>

				{user ? (
					<div className="center">
						<h1>Welcome, {user.user.username}</h1>
					</div>
				) : null}

				<div className="navbar-buttons">
					{user ? (
						<>
							<Link className="profile-button" to="/profile">
								Profile
							</Link>
							<button type="submit" onClick={handleLogout}>
								Logout
							</button>
						</>
					) : null}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
