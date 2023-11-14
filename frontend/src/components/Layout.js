import React from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<>
			{/* <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> */}
			<section>
				<Outlet />
			</section>
			{/* Footer */}
			{/* <Footer /> */}
		</>
	);
};

export default Layout;
