import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Register() {
	const postgresqlPort = 4001;
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		createError: "",
		createSuccess: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { username, email, password } = formData;

		if (password.length < 6) {
			// Display an error message when the password is too short
			setFormData({
				...formData,
				createSuccess: "",
				createError: "Password must be at least 6 characters long",
			});
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:${postgresqlPort}/users/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, email, password }),
				}
			);

			if (response.status === 200) {
				// Successful registration
				const data = await response.json();
				setFormData({
					...formData,
					createSuccess: data.message,
					createError: "",
				});
				console.log("Create user successful");
			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="login-container">
			<h1>Create Account</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username:</label>
					<input
						className="login-input"
						type="text"
						id="username"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="email">Email:</label>
					<input
						className="login-input"
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password:</label>
					<input
						className="login-input"
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				{formData.createSuccess && (
					<p className="success">{formData.createSuccess}</p>
				)}
				{formData.createError && (
					<p className="success">{formData.createError}</p>
				)}
				<button className="login-button" type="submit">
					Create Account
				</button>
			</form>
			<div>
				<Link to="/">Already a user? Login now</Link>
			</div>
		</div>
	);
}

export default Register;
