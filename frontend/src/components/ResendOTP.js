import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Login.css";
import * as Constants from "../constants/constants.js";

function ResendOTP() {
	const [email, setEmail] = useState("");
	const [createError, setCreateError] = useState(""); // Error message state
	const [createSuccess, setCreateSuccess] = useState(""); // Success message state

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`http://localhost:${Constants.POSTGRESQL_PORT}/resendOTPVerificationCode`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				}
			);

			if (response.status === 200) {
				// OTP resend successful
				setCreateSuccess(
					"A new OTP has been sent to you successfully!"
				);
				setCreateError(""); // Clear any previous error messages
			} else {
				// Handle other error cases
				setCreateError(
					"Failed to regenerate a new OTP. Please check that the email given is correct. If you are sure that the given email is correct, it might possibly be your account has ALREADY been VERIFIED. Check your account status for more details."
				);
				setCreateSuccess(""); // Clear any previous success messages
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="login-container">
			<h1 className="login-label">Generate New OTP</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email:</label>
					<input
						className="login-input"
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Generate New OTP</button>
			</form>
			{/* Conditionally render the error message */}
			{createError && <p className="error">{createError}</p>}
			{/* Conditionally render the success message */}
			{createSuccess && <p className="success">{createSuccess}</p>}
			<br />
			<div className="links">
				<Link to="/">Click here to login now</Link>
			</div>
		</div>
	);
}

export default ResendOTP;
