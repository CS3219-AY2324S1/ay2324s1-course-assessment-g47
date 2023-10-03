import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Login.css";
import "./css/ChangeTypeHome.css";
import LoginPage from "./Login";
import "./css/Login.css";
import * as Constants from "../constants/constants.js";

function ChangeTypeHome({ user, handleUserChange, handleLogout, handleLogin }) {
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
				`http://localhost:${Constants.POSTGRESQL_PORT}/users/update/type/${user.user_id}`,
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
			<div className="header">
				{/* <div className="left">
                        <p>
                            <Link className="button-link" to="/">Dashboard</Link>
                        </p>
                    </div>
                    <div className="center">
                        <h1>Change Account Type</h1>
                    </div>
                    <div className="right">
                        <p>
                            <button className="button-link" onClick={() => handleLogout()}>Logout</button>
                        </p>
                    </div> */}
			</div>{" "}
			<div className="changetypehome">
				<div className="changetypehome-container">
					<h1 className="changetypehome-label">
						Change Account Type
					</h1>
					<div className="ChangeTypeHome">
						<form onSubmit={handleSaveClick}>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input
									type="email"
									id="email"
									onChange={handleChange}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="accountType">User Type</label>
								<select
									id="account_type"
									onChange={handleChange}
									value={selectedOption}
									required
								>
									<option value="user" selected>
										User
									</option>
									<option value="superuser">SuperUser</option>
									{user.account_type === "superadmin" ? (
										<option value="admin">Admin</option>
									) : null}
								</select>
							</div>
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
							<div className="edit-password-button">
								<button className="profile-button">Save</button>
								<Link className="profile-button" to="/profile">
									Back
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
}

export default ChangeTypeHome;
