import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import ChangeTypeHome from "./components/ChangeTypeHome";
import VerifyOTP from "./components/VerifyOTP";
import ResendOTP from "./components/ResendOTP";
import { useAuthContext } from "./hooks/useAuthContext";
import Room from "./components/Room";
import History from "./components/History";
import Navbar from "./components/Navbar";
import RoomUserExit from "./components/RoomUserExit";

function App() {
	const [user, setUser] = useState(null);
	const { dispatch } = useAuthContext();
	// const postgresqlPort = 4001;

	// Load user data from localStorage when the component mounts
	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));

		if (storedUser) {
			setUser(storedUser);
			dispatch({ type: "LOGIN", payload: storedUser });
		}
	}, [dispatch]);

	const handleLogin = (user) => {
		// save the user to local storage
		localStorage.setItem("user", JSON.stringify(user));

		// update the auth context
		dispatch({ type: "LOGIN", payload: user });
		setUser(user);
	};

	const handleLogout = () => {
		// remove user from storage
		localStorage.removeItem("user");

		// dispatch logout action
		dispatch({ type: "LOGOUT" });
		setUser(null);
	};

	const onUserchange = (newUser) => {
		const fetchDataFromAPI = async () => {
			try {
				const response = await fetch(
					`/api/users/fetch/${newUser.user.user_id}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${newUser.tokens.accessToken}`,
						},
						body: JSON.stringify(newUser), // Send user data directly
					}
				);

				if (response.ok) {
					const user = await response.json();

					// Update the 'user' state with the API data
					setUser(user);

					// Update 'user' in localStorage with the API data
					localStorage.setItem("user", JSON.stringify(user));
				} else {
					console.error("API request failed");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};
		fetchDataFromAPI();
	};
	return (
		<>
			<BrowserRouter>
				<Navbar user={user} handleLogout={handleLogout} />
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route
							index
							element={
								<Home user={user} handleLogin={handleLogin} />
							}
						/>
						<Route path="register" element={<Register />} />
						<Route
							path="forgetPassword"
							element={<ForgotPassword />}
						/>
						<Route path="verifyOTP" element={<VerifyOTP />} />
						<Route
							path="resendOTPVerificationCode"
							element={<ResendOTP />}
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
						<Route
							path="changetype"
							element={
								<ChangeTypeHome
									user={user}
									handleUserChange={onUserchange}
									handleLogout={handleLogout}
									handleLogin={handleLogin}
								/>
							}
						/>
					</Route>
					<Route path="/verifyOTP" element={<VerifyOTP />}>
						{" "}
					</Route>
					<Route
						path="/resendOTPVerificationCode"
						element={<ResendOTP />}
					>
						{" "}
					</Route>
					<Route path="/room/:roomId" element={user ? (
						<Room user={user} />
					) : (
						<div>Loading...</div>
					)}>
						{" "}
					</Route>
					<Route path="/history/:historyId" element={user ? (
						<History user={user} />
					) : (
						<div>Loading...</div>
					)}>
						{" "}
					</Route>
					<Route path="/roomexit" element={<RoomUserExit />}>
						{" "}
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
