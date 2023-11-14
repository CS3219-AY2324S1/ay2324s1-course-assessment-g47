import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import "./css/ChangeTypeHome.css";
import LoginPage from "./Login";
import "./css/Login.css";

function ChangeTypeHome({ user, handleUserChange, handleLogout, handleLogin }) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		account_type: "user",
		updateSuccess: "",
		updateError: "",
	});

	const changeLabelText = (success, error) => {
		setFormData({
			...formData,
			updateSuccess: success,
			updateError: error,
		});
	};

	const [selectedOption, setSelectedOption] = useState("user");

	const handleChange = (e) => {
		setSelectedOption(e.target.value);
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSaveClick = async (e) => {
		e.preventDefault();
		//do not allow admin to change their another admin's account type
		const { email, account_type } = formData;

		//get user id from local storage then update user info
		try {
			console.log(user.user);
			const response = await fetch(
				`/api/users/update/type/${user.user_id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.accessToken}`,
					},
					body: JSON.stringify({ email, account_type }),
				}
			);

			//check that email exists in database
			if (response.status === 200) {
				// Successful update
				const data = await response.json();
				changeLabelText(data.message);
				console.log("Update successful", "");
				handleUserChange(user);
			} else if (response.status === 401) {
				// Invalid email or password
				const errorData = await response.json();
				changeLabelText("", errorData.error);
				console.log("Update failed: " + errorData.error);
			} else {
				// Handle other error cases
				console.log("Server error");
				changeLabelText("", "Server error");
			}
		} catch (error) {
			console.log(error);
			changeLabelText("", error.message);
		}
	};

	return user ? (
		<>
			<section className="text-center">
				{/* Background image */}
				<div
					className="p-5 bg-image"
					style={{
						backgroundImage:
							'url("https://mdbootstrap.com/img/new/textures/full/171.jpg")',
						height: "300px",
					}}
				></div>
				{/* Background image */}

				<div
					className="card mx-4 mx-md-5 shadow-5-strong"
					style={{
						marginTop: "-100px",
						background: "hsla(0, 0%, 100%, 0.8)",
						backdropFilter: "blur(30px)",
					}}
				>
					<div className="card-body py-5 px-md-5">
						<div className="row d-flex justify-content-center">
							<div className="col-lg-8">
								<h2 className="fw-bold mb-5">
									Change Account Type
								</h2>
								<form>
									{/* Email input */}
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
											onChange={handleChange}
											required
											className="form-control"
										/>
									</div>

									{/* Password input */}
									<div className="form-outline mb-4">
										<label htmlFor="accountType">
											User Type
										</label>
										<select
											id="account_type"
											onChange={handleChange}
											value={selectedOption}
											required
										>
											<option value="user" selected>
												User
											</option>
											<option value="superuser">
												SuperUser
											</option>
											{user.account_type ===
											"superadmin" ? (
												<option value="admin">
													Admin
												</option>
											) : null}
										</select>
									</div>

									{/* Show error */}
									<div className="form-group">
										{formData.updateSuccess && (
											<p className="success">
												{formData.updateSuccess}
											</p>
										)}
									</div>
									<div className="form-group">
										{formData.updateError && (
											<p className="error">
												{formData.updateError}
											</p>
										)}
									</div>

									{/* Submit button */}
									<button
										type="submit"
										className="btn btn-primary btn-block mb-4"
										onClick={handleSaveClick}
									>
										Save
									</button>
									<button
										type="submit"
										className="btn btn-primary btn-block mb-4"
										onClick={() => {
											navigate("/profile"); // Navigate to the registration page
										}}
									>
										Back
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
}

export default ChangeTypeHome;
