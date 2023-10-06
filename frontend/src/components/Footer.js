import React from "react";
import "./css/Footer.css";

const Footer = () => {
	// Get the current year
	const currentYear = new Date().getFullYear();

	// Replace 'Your App Name' with your actual app name
	const appName = "CS3219 G47 PeerPrep";

	return (
		<footer className="app-footer">
			<div className="container">
				<p>
					&copy; {currentYear} {appName}
				</p>
			</div>
		</footer>
	);
};

export default Footer;
