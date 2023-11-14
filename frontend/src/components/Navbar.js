import "./css/Navbar.css";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ user, handleLogout }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const isRoomRoute = location.pathname.includes("/room");
	const isHistoryRoom = location.pathname.includes("/history");
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	const handleProfileClick = () => {
		navigate("/profile");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<a
					className="navbar-brand"
					href={isRoomRoute || isHistoryRoom ? "#" : "/"}
				>
					PeerPrep
				</a>
				{user && !isRoomRoute && !isHistoryRoom ? (
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
									<button
										className="nav-link button-rounded"
										onClick={handleProfileClick}
									>
										Profile
									</button>
								</li>
								<li className="nav-item active">
									<button
										className="nav-link button-rounded"
										onClick={handleLogout}
									>
										Logout
									</button>
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
