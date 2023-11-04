import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function LoginPage(props) {
	const postgresqlPort = 4001;
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		loginError: "",
		loginSuccess: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { email, password } = formData;

		try {
			const response = await fetch(
				`http://localhost:${postgresqlPort}/users/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);

			if (response.status === 200) {
				// Successful login
				const data = await response.json();
				// Set isSignIn to true
				props.onSuccessLogin(data.user);
				setFormData({
					...formData,
					loginSuccess: data.message,
					loginError: "",
				});
				console.log("Login successful");
			} else if (response.status === 401) {
				// Invalid email or password
				const errorData = await response.json();
				setFormData({
					...formData,
					loginError: errorData.error,
					loginSuccess: "",
				});
				console.log("Login failed: " + errorData.error);
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
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
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
				{formData.loginError && (
					<p className="error">{formData.loginError}</p>
				)}
				{formData.loginSuccess && (
					<p className="success">{formData.loginSuccess}</p>
				)}
				<button className="login-button" type="submit">
					Login
				</button>
			</form>
			<div>
				<Link to="/register">Not a user? Sign up now</Link>
			</div>
			{/* <div>
				<Link to="/forgetPassword">Forgot password? Reset here</Link>
			</div> */}
		</div>
	);
}

export default LoginPage;
