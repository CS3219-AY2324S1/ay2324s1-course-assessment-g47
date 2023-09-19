// import React, { useState, useEffect } from 'react';
// import './App.css';

// import {BrowserRouter, Routes, Route} from 'react-router-dom'

// // pages & components
// import Home from './pages/Home'
// import Navbar from './components/Navbar'

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//       <Navbar />
//       <div className="pages">
//         <Routes>
//           <Route
//            path="/"
//            element={<Home />}
//           />
//         </Routes>
//       </div>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;

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
import { useAuthContext } from './hooks/useAuthContext';

function App() {
	const [user, setUser] = useState(null);
	const { dispatch } = useAuthContext()

	// Load user data from localStorage when the component mounts
	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem('user'));

		if (storedUser) {
			setUser(storedUser);
			dispatch({ type: 'LOGIN', payload: storedUser });
		}
	}, [dispatch]);

	const handleLogin = (user) => {
		// save the user to local storage
		localStorage.setItem('user', JSON.stringify(user))

		// update the auth context
		dispatch({type: 'LOGIN', payload: user})
		setUser(user);
	};

	const handleLogout = () => {
		// remove user from storage
		localStorage.removeItem('user')

		// dispatch logout action
		dispatch({ type: 'LOGOUT' })
		setUser(null);
	};

	const onUserchange = (newUser) => {
		setUser({ ...user, ...newUser });
		localStorage.setItem('user', JSON.stringify({ ...user, ...newUser }));
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
						<Route
							path="changetype"
							element={
								<ChangeTypeHome
									user={user?.user}
									handleUserChange={onUserchange}
									handleLogout={handleLogout}
									handleLogin={handleLogin}
								/>
							}
						/>
					</Route>
					<Route path="/verifyOTP" element={<VerifyOTP />}> </Route>
					<Route path="/resendOTPVerificationCode" element={<ResendOTP />}> </Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
