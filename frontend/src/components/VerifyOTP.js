import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Login.css";
import * as Constants from "../constants/constants.js";

function VerifyOTP() {
	const [formData, setFormData] = useState({
		email: "",
		otp: "",
		createError: "",
		createSuccess: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`http://localhost:${Constants.POSTGRESQL_PORT}/verifyOTP`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			if (response.status === 200) {
				// OTP verification successful
				const data = await response.json();
				console.log("OTP Verification successful");
				setFormData({
					...formData,
					createSuccess: data.message,
					createError: "",
				});
			} else {
				// Handle OTP verification failure
				const errorData = await response.json(); // Parse error response
				setFormData({
					...formData,
					createSuccess: "",
					createError: errorData.message,
				});
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="login-container">
			<h1 className="login-label">Verify OTP</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Email:</label>
					<input
						className="login-input"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label>OTP:</label>
					<input
						className="login-input"
						type="text"
						name="otp"
						value={formData.otp}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
			{/* Conditionally render the error message */}
			{formData.createError && (
				<p className="error">{formData.createError}</p>
			)}
			{/* Conditionally render the success message */}
			{formData.createSuccess && (
				<p className="success">{formData.createSuccess}</p>
			)}
			<br />
			<div className="links">
				<Link to="/">Click here to login now</Link>
				<br />
				<Link to="/resendOTPVerificationCode">
					Forgot your OTP? Get a new one here!
				</Link>
			</div>
		</div>
	);
}

export default VerifyOTP;
