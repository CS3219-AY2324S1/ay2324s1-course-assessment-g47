import { Link } from "react-router-dom";
import "./css/Navbar.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Navbar = ({ user, handleLogout }) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<a className="navbar-brand" href="/">
					PeerPrep
				</a>
				{user ? (
					<>
						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							onClick={toggleCollapse}
						>
							<span className="navbar-toggler-icon"></span>
						</button>

						<div
							className={`collapse navbar-collapse ${
								isCollapsed ? "show" : ""
							}`}
						>
							<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
								<li className="nav-item active">
									<a className="nav-link" href="/profile">
										Profile{" "}
										<span className="sr-only">
											(current)
										</span>
									</a>
								</li>
								<li className="nav-item active">
									<a
										className="nav-link"
										href=""
										onClick={handleLogout}
									>
										Logout
									</a>
								</li>
							</ul>
						</div>
					</>
				) : null}
			</div>
		</nav>
	);
};

export default Navbar;
