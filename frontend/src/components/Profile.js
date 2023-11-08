import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginPage from "./Login";
import "./css/Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Constants from "../constants/constants.js";

function Profile({ user, handleUserChange, handleLogout, handleLogin }) {
	const [isEditingUserDetails, setIsEditingUserDetails] = useState(false);
	const [isEditingPassword, setIsEditingPassword] = useState(false);
	const [localUser, setLocalUser] = useState({
		username: user ? user.user.username : "",
		email: user ? user.user.email : "",
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		repeatNewPassword: "",
	});
	// const navigate = N();

	// When user click on edit user details button
	const handleEditUserDetailsClick = () => {
		setIsEditingUserDetails(true);
	};

	// When user click on edit password button
	const handleEditPasswordClick = () => {
		setIsEditingPassword(true);
	};

	const handleBackButtonClick = () => {
		setIsEditingPassword(false);
		setIsEditingUserDetails(false);
	};

	// When user click on save user details button
	const handleSaveUserDetailsClick = async (e) => {
		// Check if the username and email are not empty
		if (!localUser.username || !localUser.email) {
			console.log("Username and email cannot be empty");
			toast.error("Username and email cannot be empty");
			return;
		}

		e.preventDefault();
		setIsEditingUserDetails(false);
		//get user id from local storage then update user info
		try {
			console.log(user);
			const response = await fetch(
				`http://localhost:${Constants.POSTGRESQL_PORT}/users/update/${user.user.user_id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.accessToken}`,
					},
					body: JSON.stringify(localUser),
				}
			);

			if (response.status === 200) {
				//successful update
				console.log("Update successful");
				handleUserChange(user);
			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	// When user click on save password button
	const handleSavePasswordClick = async (e) => {
		console.log(passwordData);
		// Check if the username and email are not empty
		if (
			!passwordData.currentPassword ||
			!passwordData.newPassword ||
			!passwordData.repeatNewPassword
		) {
			console.log("Password cannot be empty");
			toast.error("Password cannot be empty");
			return;
		}
		e.preventDefault();
		setIsEditingPassword(false);

		// Check if the new password and repeat new password are the same
		if (passwordData.newPassword !== passwordData.repeatNewPassword) {
			console.log(
				"New password and repeat new password are not the same"
			);
			toast.error(
				"New password and repeat new password are not the same"
			);
			return;
		}

		// Check if the current password is correct
		try {
			const response = await fetch(
				`http://localhost:${Constants.POSTGRESQL_PORT}/users/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: user.user.email,
						password: passwordData.currentPassword,
					}),
				}
			);

			if (response.status === 200) {
				//successful login
				console.log("Correct password entered");
				handleUserChange(user);
			} else if (response.status === 401) {
				// Invalid email or password
				const errorData = await response.json();
				console.log("Update password failed: " + errorData.error);
				toast.error("Current password is incorrect");
				return;
			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}

		// Update the password
		try {
			const response = await fetch(
				`http://localhost:${Constants.POSTGRESQL_PORT}/users/update_password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.accessToken}`,
					},
					body: JSON.stringify({
						email: user.user.email,
						password: passwordData.newPassword,
					}),
				}
			);

			if (response.status === 200) {
				//successful update
				console.log("Update successful");
				toast.success("Password updated successfully");
			} else {
				// Handle other error cases
				console.log("Server error");
				toast.error("Password update failed");
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("Password update failed");
		}
	};

	// When user click on delete account button
	const handleDeleteClick = async (e) => {
		e.preventDefault();

		// Show a confirmation dialog
		const confirmed = window.confirm(
			"Are you sure you want to delete this user?"
		);

		if (confirmed) {
			try {
				const response = await fetch(
					`http://localhost:${Constants.POSTGRESQL_PORT}/users/delete`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.tokens.accessToken}`,
						},
						body: JSON.stringify(user.user),
					}
				);

				if (response.status === 200) {
					//successful delete
					console.log("Delete successful");

					handleLogout();
				} else if (response.status === 401) {
					// Invalid email or password
					const errorData = await response.json();
					console.log("Delete failed: " + errorData.error);
				} else {
					// Handle other error cases
					console.log("Server error");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	return user ? (
		<>
			<div className="header">
				{/* <div className="left">
					{!isEditingUserDetails ? (
						<Link className="button-link" to="/">
							Dashboard
						</Link>
					) : null}
				</div> */}

				{/* <div className="right">
					<p>
						<button
							className="button-link"
							onClick={() => handleLogout()}
						>
							Logout
						</button>
					</p>
				</div> */}
			</div>{" "}
			<div className="profile-container">
				<p>
					{user.user.account_type === "superadmin" ||
					user.user.account_type === "admin" ? (
						<Link
							className="button-link-change-account"
							to="/changetype"
						>
							Change Account Type
						</Link>
					) : null}
				</p>
				<h1 className="profile-label">Profile Settings</h1>
				<div className="username-wrapper">
					<label className="profile-label">Username:</label>
					{isEditingUserDetails ? (
						<input
							className="profile-input"
							type="text"
							onChange={(e) => {
								setLocalUser({
									...localUser,
									username: e.target.value,
								});
							}}
							value={localUser.username}
							name="username"
						/>
					) : (
						<span className="profile-display">
							{user.user.username}
						</span>
					)}
				</div>
				<div className="email-wrapper">
					<label className="profile-label">Email:</label>
					{isEditingUserDetails ? (
						<input
							className="profile-input"
							type="email"
							onChange={(e) => {
								setLocalUser({
									...localUser,
									email: e.target.value,
								});
							}}
							value={localUser.email}
							name="email"
						/>
					) : (
						<span className="profile-display">
							{user.user.email}
						</span>
					)}
				</div>

				<div className="buttons">
					{isEditingUserDetails ? (
						<div className="edit-user-button">
							<button
								className="profile-button"
								onClick={(e) => handleSaveUserDetailsClick(e)}
							>
								Save User Details
							</button>
							<button
								className="profile-button"
								onClick={(e) => handleBackButtonClick(e)}
							>
								Back
							</button>
						</div>
					) : isEditingPassword ? (
						<>
							<div className="password-wrapper">
								<label className="profile-label">
									Current Password:
								</label>
								<input
									className="profile-input"
									type="password"
									value={passwordData.currentPassword}
									onChange={(e) => {
										setPasswordData({
											...passwordData,
											currentPassword: e.target.value,
										});
									}}
								/>
							</div>
							<div className="password-wrapper">
								<label className="profile-label">
									New Password:
								</label>
								<input
									className="profile-input"
									type="password"
									value={passwordData.newPassword}
									onChange={(e) => {
										setPasswordData({
											...passwordData,
											newPassword: e.target.value,
										});
									}}
								/>
							</div>
							<div className="password-wrapper">
								<label className="profile-label">
									Repeat Password:
								</label>
								<input
									className="profile-input"
									type="password"
									value={passwordData.repeatNewPassword}
									onChange={(e) => {
										setPasswordData({
											...passwordData,
											repeatNewPassword: e.target.value,
										});
									}}
								/>
							</div>
							<div className="edit-password-button">
								<button
									className="profile-button"
									onClick={(e) => handleSavePasswordClick(e)}
								>
									Save Password
								</button>
								<button
									className="profile-button"
									onClick={(e) => handleBackButtonClick(e)}
								>
									Back
								</button>
							</div>
						</>
					) : (
						<div className="edit-profile-button">
							<button
								className="profile-button"
								onClick={handleEditUserDetailsClick}
							>
								Edit User Details
							</button>
							<button
								className="profile-button"
								onClick={handleEditPasswordClick}
							>
								Edit Password
							</button>
							<button
								className="profile-button"
								onClick={handleDeleteClick}
							>
								Delete account
							</button>
						</div>
					)}
				</div>
				<ToastContainer />
			</div>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
}

export default Profile;
