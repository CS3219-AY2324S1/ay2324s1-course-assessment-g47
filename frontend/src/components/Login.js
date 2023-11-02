import React, { useState } from "react";
import "./css/Login.css";
import loginImage from "../images/login.jpg";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
	const navigate = useNavigate();
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
			const response = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.status === 200) {
				// Successful login
				const json = await response.json();
				// Set isSignIn to true
				props.onSuccessLogin(json);
				setFormData({
					...formData,
					loginSuccess: json.message,
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

	// Inspired from: https://mdbootstrap.com/docs/standard/extended/login/
	return (
		<>
			<div className="container-fluid h-custom">
				<div className="row d-flex justify-content-center align-items-center h-100">
					<div className="col-md-9 col-lg-6 col-xl-5">
						<img
							src={loginImage}
							className="img-fluid"
							alt="Login page background"
						/>
					</div>
					<div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
						<form>
							<div className="form-outline mb-4">
								<label
									className="form-label"
									htmlFor="form3Example3"
								>
									Email address
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="form-control form-control-lg"
									placeholder="Enter a valid email address"
								/>
							</div>

							<div className="form-outline mb-3">
								<label
									className="form-label"
									htmlFor="form3Example4"
								>
									Password
								</label>
								<input
									type="password"
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
									className="form-control form-control-lg"
									placeholder="Enter password"
								/>
							</div>

							{formData.loginError && (
								<p className="error">{formData.loginError}</p>
							)}
							{formData.loginSuccess && (
								<p className="success">
									{formData.loginSuccess}
								</p>
							)}
							<div className="d-flex align-items-center justify-content-center pt-4">
								<button
									type="button"
									className="btn btn-dark btn-lg w-100"
									onClick={handleSubmit}
								>
									Login
								</button>
							</div>

							<div className="d-flex align-items-center justify-content-center pt-4">
								<p className="mb-0 me-2">
									Don't have an account?
								</p>

								<button
									type="button"
									className="btn btn-outline-danger"
									onClick={() => {
										navigate("/register"); // Navigate to the registration page
									}}
								>
									Create new
								</button>
							</div>

							<div className="d-flex align-items-center justify-content-center pt-4">
								<p className="mb-0 me-2">
									Haven't verified your account
								</p>

								<button
									type="button"
									className="btn btn-outline-danger"
									onClick={() => {
										navigate("/verifyOTP"); // Navigate to the registration page
									}}
								>
									Verify here
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default LoginPage;
