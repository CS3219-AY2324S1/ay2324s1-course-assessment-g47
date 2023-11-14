import React from "react";
import "./css/Footer.css";

const Footer = () => {
	// Get the current year
	const currentYear = new Date().getFullYear();

	// Replace 'Your App Name' with your actual app name
	const appName = "CS3219 G47 PeerPrep";

	return (
		<footer className="bg-dark text-center text-lg-start d-flex flex-column justify-content-center footer">
			<div className="text-center text-light p-2">
				&copy; {currentYear} {appName}
			</div>
		</footer>
	);
};

export default Footer;
