import React, { useState } from "react";
import LoginPage from "./Login";
import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home({ user, handleLogin, handleLogout }) {
	return user ? (
		<>
			<div className="header">
				<div className="left">
					<p>
						<Link to="/profile">Profile</Link>
					</p>
				</div>
				<div className="center">
					<h1>Welcome, {user.username}</h1>
				</div>
				<div className="right">
					<p>
						<button onClick={() => handleLogout()}>Logout</button>
					</p>
				</div>
			</div>
			<Dashboard />
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
}
