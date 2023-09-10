import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // You can create a CSS file for styling

function Navbar() {
	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/" className="navbar-logo">
					PeerPrep
				</Link>
				{/* <Link to="/profile">Profile</Link>
				<Link to="/">Logout</Link> */}
			</div>
		</nav>
	);
}

export default Navbar;
