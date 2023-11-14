import React, { useState } from "react";
import "./css/Login.css";
import otpImage from "../images/otp.jpg";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
	const navigate = useNavigate();
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
			const response = await fetch(`/api/users/verifyOTP`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

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
											Verify OTP
										</p>
										<form class="mx-1 mx-md-4">
											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<input
														type="email"
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
														type="text"
														name="otp"
														value={formData.otp}
														onChange={handleChange}
														required
														className="form-control"
														placeholder="OTP"
													/>
												</div>
											</div>

											<div className="d-flex align-items-center justify-content-center">
												<button
													type="button"
													className="btn btn-dark btn-lg w-100"
													onClick={handleSubmit}
												>
													Submit
												</button>
											</div>
										</form>

										{/* Conditionally render the error message */}
										{formData.createError && (
											<p className="error">
												{formData.createError}
											</p>
										)}
										{/* Conditionally render the success message */}
										{formData.createSuccess && (
											<p className="success">
												{formData.createSuccess}
											</p>
										)}

										<div class="d-flex align-items-center justify-content-center pb-4">
											<p class="mb-0 me-2">Verified?</p>

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

										<div class="d-flex align-items-center justify-content-center pb-4">
											<p class="mb-0 me-2">
												Forgot your OTP?
											</p>

											<button
												type="button"
												className="btn btn-outline-danger"
												onClick={() => {
													navigate(
														"/resendOTPVerificationCode"
													); // Navigate to the registration page
												}}
											>
												Get a new code here
											</button>
										</div>
									</div>
									<div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
										<img
											src={otpImage}
											className="img-fluid"
											alt="Verifying OTP background"
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

export default VerifyOTP;
