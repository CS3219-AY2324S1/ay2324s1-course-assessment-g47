import React, { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";

function App() {
	const [user, setUser] = useState(null);
	const handleLogin = (user) => {
		setUser(user);
	};

	const handleLogout = () => {
		setUser(null);
	};

	const onUserchange = (newUser) => {
		setUser({ ...user, ...newUser });
	};
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route
							index
							element={
								<Home
									user={user}
									handleLogin={handleLogin}
									handleLogout={handleLogout}
								/>
							}
						/>
						<Route path="register" element={<Register />} />
						<Route
							path="forgetPassword"
							element={<ForgotPassword />}
						/>
						<Route
							path="profile"
							element={
								<Profile
									user={user}
									handleUserChange={onUserchange}
									handleLogout={handleLogout}
									handleLogin={handleLogin}
								/>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
