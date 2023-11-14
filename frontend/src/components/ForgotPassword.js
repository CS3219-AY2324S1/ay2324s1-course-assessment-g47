import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		updateSuccess: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// You can add your registration logic here
		const { email, password } = formData;

		try {
			const response = await fetch(`/api/users/update/password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.status === 200) {
				// Successful update of password
				const data = await response.json();
				setFormData({ ...formData, updateSuccess: data.message });
				console.log("Updated password successfully");
			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="register-page">
			<h1>Forgot Password</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email:</label>
					<input
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
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				{formData.updateSuccess && (
					<p className="success">{formData.updateSuccess}</p>
				)}
				<button type="submit">Reset Password</button>
			</form>
			<div>
				<Link to="/">Back to Login</Link>
			</div>
		</div>
	);
}

export default ForgotPassword;
