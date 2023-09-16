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

import React, { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import ChangeTypeHome from "./components/ChangeTypeHome";

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
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
