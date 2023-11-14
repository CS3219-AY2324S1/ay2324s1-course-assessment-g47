import React, { useState } from "react";
import "./css/Login.css";
import otpImage from "../images/otp.jpg";
import { useNavigate } from "react-router-dom";

function ResendOTP() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [createError, setCreateError] = useState(""); // Error message state
	const [createSuccess, setCreateSuccess] = useState(""); // Success message state

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`/api/users/resendOTPVerificationCode`,
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
														id="email"
														name="email"
														value={email}
														onChange={(e) =>
															setEmail(
																e.target.value
															)
														}
														required
														className="form-control"
														placeholder="Your Email"
													/>
												</div>
											</div>

											<div className="d-flex align-items-center justify-content-center">
												<button
													type="button"
													className="btn btn-dark btn-lg w-100"
													onClick={handleSubmit}
												>
													Generate a new OTP
												</button>
											</div>
										</form>

										{/* Conditionally render the error message */}
										{createError && (
											<p className="error">
												{createError}
											</p>
										)}
										{/* Conditionally render the success message */}
										{createSuccess && (
											<p className="success">
												{createSuccess}
											</p>
										)}

										<div className="d-flex align-items-center justify-content-center pb-4">
											<p className="mb-0 me-2">
												Verified?
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
									</div>
									<div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
										<img
											src={otpImage}
											className="img-fluid"
											alt="ResendOTP background"
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

export default ResendOTP;
