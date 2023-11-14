import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerImage from "../images/register.jpg";
import { useNavigate } from "react-router-dom";

function Register() {
	const navigate = useNavigate();
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
			const response = await fetch(`/api/users/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					email,
					password,
					account_type: "user",
				}),
			});

			const data = await response.json();
			if (response.status === 200) {
				// Successful registration
				setFormData({
					...formData,
					createSuccess: data.message,
					createError: "",
				});
				console.log("Create user successful");
			} else {
				// Handle other error cases
				console.log("Server error");
				// Show an error toast message
				toast.error(data.message);
			}
		} catch (error) {
			console.error("Error:", error);
			// Show an error toast message for network errors
			toast.error(
				"Network error. Please check your internet connection."
			);
		}
	};

	// Inspired from: https://mdbootstrap.com/docs/standard/extended/login/
	return (
		<>
			<div className="container h-100 pt-5 mt-5">
				<div className="row d-flex justify-content-center align-items-center h-100">
					<div className="col-lg-12 col-xl-11">
						<div
							className="card text-black"
							style={{ borderRadius: "25px" }}
						>
							<div className="card-body p-md-5">
								<div className="row justify-content-center">
									<div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
										<p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
											Create Account
										</p>

										<form className="mx-1 mx-md-4">
											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-user fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<input
														type="text"
														id="username"
														name="username"
														value={
															formData.username
														}
														onChange={handleChange}
														required
														className="form-control"
														placeholder="Your Name"
													/>
												</div>
											</div>

											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<input
														type="email"
														id="email"
														name="email"
														value={formData.email}
														onChange={handleChange}
														required
														className="form-control"
														placeholder="Your Email"
													/>
												</div>
											</div>

											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-lock fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<input
														type="password"
														id="password"
														name="password"
														value={
															formData.password
														}
														onChange={handleChange}
														required
														className="form-control"
														placeholder="Password"
													/>
												</div>
											</div>

											{formData.createSuccess && (
												<p className="success">
													{formData.createSuccess}
												</p>
											)}
											{formData.createError && (
												<p className="success">
													{formData.createError}
												</p>
											)}
											<div className="d-flex align-items-center justify-content-center pt-4">
												<button
													type="button"
													className="btn btn-dark btn-lg w-100"
													onClick={handleSubmit}
												>
													Create Account
												</button>
											</div>
										</form>

										<div class="d-flex align-items-center justify-content-center pb-4">
											<p class="mb-0 me-2">
												Already a user?
											</p>

											<button
												type="button"
												className="btn btn-outline-danger"
												onClick={() => {
													navigate("/"); // Navigate to the registration page
												}}
											>
												Login now
											</button>
										</div>

										<ToastContainer />
									</div>
									<div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
										<img
											src={registerImage}
											className="img-fluid"
											alt="Register background"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Register;
