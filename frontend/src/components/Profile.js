import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; //useLocation
import LoginPage from "./Login";
import "./css/Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profileImage from "../images/profile.png";
import { useNavigate } from "react-router-dom";

// Function used to retrieve user's name based on email given
async function fetchUserName(email, user) {
	try {
		const response = await fetch(
			`/api/users/fetch/${user.user.user_id}/username`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.accessToken}`,
				},
				body: JSON.stringify({ email }),
			}
		);

		if (response.ok) {
			const result = await response.json();
			return result.user.username; // Extract the username from the result
		} else {
			console.error("API request failed");
			return "User not found"; // Return an appropriate default value
		}
	} catch (err) {
		console.error("Error: ", err);
		return "Error"; // Return an error message
	}
}

// Manual parsing function to extract out the relevant information for category of question and date time of attempt
function Parser(data, type) {
	if (type === "category") {
		const parsedData = data.replace(/[{"}]/g, "");
		return parsedData.replace(/,/g, ", ");
	} else if (type === "category2") {
		// Used to format the categories into appropriate ones for parsing into the Room component for past code review
		// Define a regular expression to match the elements inside the curly braces
		const regex = /"([^"]+)"/g;
		const result = [];
		let match;
		while ((match = regex.exec(data)) !== null) {
			result.push(match[1]);
		}
		return result;
	} else {
		return data; // No use of Parser() if it ever reaches this line
	}
}

function Profile({ user, handleUserChange, handleLogout, handleLogin }) {
	const navigate = useNavigate();
	const [historyData, setHistoryData] = useState([]);
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
	const [userNames, setUserNames] = useState({}); // Store user names

	// let location = useLocation();

	const fetchUserHistory = async () => {
		if (!user.user.email) {
			console.log("Email cannot be empty");
			return;
		}
		try {
			const response = await fetch(
				`/api/users/user-history/${user.user.user_id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.accessToken}`,
					},
					body: JSON.stringify({
						email: user.user.email,
					}),
				}
			);

			if (response.status === 200) {
				// Successful update
				const data = await response.json();
				setHistoryData(data);
				console.log("Fetched user's history successfully");
				console.log(data);

				const userNamesData = {};
				for (const historyItem of data.data.rows) {
					const userEmail =
						historyItem.user1_email === user.user.email
							? historyItem.user2_email
							: historyItem.user1_email;

					// Fetch the user name and store it in the state
					const userName = await fetchUserName(userEmail, user);
					userNamesData[userEmail] = userName;
				}
				setUserNames(userNamesData);
			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		if (user) {
			fetchUserHistory();
			setLocalUser({
				username: user.user.username,
				email: user.user.email,
			});
		}
	}, [user]);

	// When user click on edit user details button
	const handleEditUserDetailsClick = () => {
		setIsEditingUserDetails(true);
		console.log(localUser);
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
				`/api/users/update/${user.user.user_id}`,
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
			const response = await fetch(`/api/users/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: user.user.email,
					password: passwordData.currentPassword,
				}),
			});

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
			const response = await fetch(`/api/users/update_password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.accessToken}`,
				},
				body: JSON.stringify({
					email: user.user.email,
					password: passwordData.newPassword,
				}),
			});

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
				const response = await fetch(`/api/users/delete`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.accessToken}`,
					},
					body: JSON.stringify(user.user),
				});

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

	// Inspired from: https://mdbootstrap.com/docs/standard/extended/profiles/
	return user ? (
		<>
			<div className="container py-5">
				<div className="row">
					<div className="col-lg-4">
						<div className="card mb-4">
							<div className="card-body text-center">
								<img
									src={profileImage}
									alt="avatar"
									className="rounded-circle img-fluid"
									style={{ width: "150px" }}
								/>
								<h5 className="my-3">{user.user.username}</h5>

								<div className="d-flex flex-column justify-content-center mb-2">
									{isEditingUserDetails ? (
										<>
											<button
												type="button"
												className="btn btn-outline-primary ms-1 mb-2"
												onClick={(e) =>
													handleSaveUserDetailsClick(
														e
													)
												}
											>
												Save User Details
											</button>
											<button
												type="button"
												className="btn btn-outline-primary ms-1 mb-2"
												onClick={(e) =>
													handleBackButtonClick(e)
												}
											>
												Back
											</button>
										</>
									) : isEditingPassword ? (
										<>
											<button
												type="button"
												className="btn btn-outline-primary ms-1 mb-2"
												onClick={(e) =>
													handleSavePasswordClick(e)
												}
											>
												Save Password
											</button>
											<button
												type="button"
												className="btn btn-outline-primary ms-1 mb-2"
												onClick={(e) =>
													handleBackButtonClick(e)
												}
											>
												Back
											</button>
										</>
									) : (
										<>
											<button
												type="button"
												className="btn btn-outline-primary ms-1 mb-2"
												onClick={
													handleEditUserDetailsClick
												}
											>
												Edit User Details
											</button>
											<button
												type="button"
												className="btn btn-outline-primary ms-1 mb-2"
												onClick={
													handleEditPasswordClick
												}
											>
												Edit Password
											</button>
											<button
												type="button"
												className="btn btn-outline-primary ms-1 mb-2"
												onClick={handleDeleteClick}
											>
												Delete account
											</button>
										</>
									)}
									{user.user.account_type === "superadmin" ||
									user.user.account_type === "admin" ? (
										<Link
											className="btn btn-outline-primary ms-1 mb-2"
											to="/changetype"
										>
											Change Account Type
										</Link>
									) : null}
								</div>
							</div>
						</div>
					</div>
					{/* For showing profile details */}
					<div className="col-lg-8">
						<div className="card mb-4">
							<div className="card-body">
								<div className="row">
									<div className="col-sm-3">
										<p className="mb-0">Username</p>
									</div>
									<div className="col-sm-9">
										<p className="text-muted mb-0">
											{isEditingUserDetails ? (
												<input
													className="profile-input"
													type="text"
													onChange={(e) => {
														setLocalUser({
															...localUser,
															username:
																e.target.value,
														});
													}}
													value={
														localUser.username ||
														user.user.username
													}
													name="username"
												/>
											) : (
												user.user.username
											)}
										</p>
									</div>
								</div>
								<hr />
								<div className="row">
									<div className="col-sm-3">
										<p className="mb-0">Email</p>
									</div>
									<div className="col-sm-9">
										<p className="text-muted mb-0">
											{isEditingUserDetails ? (
												<input
													className="profile-input"
													type="email"
													onChange={(e) => {
														setLocalUser({
															...localUser,
															email: e.target
																.value,
														});
													}}
													value={
														localUser.email ||
														user.user.email
													}
													name="email"
												/>
											) : (
												user.user.email
											)}
										</p>
									</div>
								</div>

								{isEditingPassword ? (
									<>
										<hr />
										<div className="row">
											<div className="col-sm-3">
												<p className="mb-0">
													Current Password
												</p>
											</div>
											<div className="col-sm-9">
												<p className="text-muted mb-0">
													{isEditingPassword ? (
														<input
															className="profile-input"
															type="password"
															value={
																passwordData.currentPassword
															}
															onChange={(e) => {
																setPasswordData(
																	{
																		...passwordData,
																		currentPassword:
																			e
																				.target
																				.value,
																	}
																);
															}}
														/>
													) : null}
												</p>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-3">
												<p className="mb-0">
													New Password
												</p>
											</div>
											<div className="col-sm-9">
												<p className="text-muted mb-0">
													{isEditingPassword ? (
														<input
															className="profile-input"
															type="password"
															value={
																passwordData.newPassword
															}
															onChange={(e) => {
																setPasswordData(
																	{
																		...passwordData,
																		newPassword:
																			e
																				.target
																				.value,
																	}
																);
															}}
														/>
													) : null}
												</p>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-3">
												<p className="mb-0">
													Repeat Password
												</p>
											</div>
											<div className="col-sm-9">
												<p className="text-muted mb-0">
													{isEditingPassword ? (
														<input
															className="profile-input"
															type="password"
															value={
																passwordData.repeatNewPassword
															}
															onChange={(e) => {
																setPasswordData(
																	{
																		...passwordData,
																		repeatNewPassword:
																			e
																				.target
																				.value,
																	}
																);
															}}
														/>
													) : null}
												</p>
											</div>
										</div>
									</>
								) : null}
							</div>
						</div>
					</div>

					{/* For history codes */}
					<div className="col">
						<div className="card mb-4">
							<div className="card-body">
								<h5 className="my-3">History</h5>
								{!historyData.data || !historyData.data.rows ? (
									<div className="no-history">
										<div style={{ marginTop: "2em" }}>
											<h5 className="my-3">
												No history found. Start a new
												PeerPrep Session today!
											</h5>
										</div>
									</div>
								) : (
									<table className="table history-table">
										<thead>
											<tr>
												<th>Question Name</th>
												<th>Question Difficulty</th>
												<th>Question Category</th>
												<th>Language</th>
												<th>Matched User</th>
												<th>
													Last Edited (Date & Time)
												</th>
											</tr>
										</thead>
										<tbody>
											{historyData.data.rows.map(
												(historyItem, index) => (
													<tr
														key={index}
														className={`history-row ${historyItem.question_difficulty.toLowerCase()}`}
														onClick={() =>
															navigate(
																`/history/${historyItem.room_id}`,
																{
																	state: {
																		source: "profile",
																		question:
																			{
																				category:
																					Parser(
																						historyItem.question_category,
																						"category2"
																					),
																				complexity:
																					historyItem.question_difficulty,
																				createdAt:
																					historyItem.timestamp,
																				description:
																					historyItem.question_description,
																				title: historyItem.question_name,
																				updatedAt:
																					historyItem.timestamp,
																			},
																		code: historyItem.code,
																		language:
																			JSON.parse(
																				historyItem.language
																			)
																				.label,
																		partner:
																			userNames[
																				historyItem.user1_email ===
																				user
																					.user
																					.email
																					? historyItem.user2_email
																					: historyItem.user1_email
																			] ||
																			" ",
																	},
																}
															)
														}
														style={{
															cursor: "pointer",
														}}
													>
														<td>
															{
																historyItem.question_name
															}
														</td>
														<td>
															{
																historyItem.question_difficulty
															}
														</td>
														<td>
															{Parser(
																historyItem.question_category,
																"category"
															)}
														</td>
														<td>
															{
																JSON.parse(
																	historyItem.language
																).label
															}
														</td>
														<td>
															{userNames[
																historyItem.user1_email ===
																user.user.email
																	? historyItem.user2_email
																	: historyItem.user1_email
															] || "Loading..."}
														</td>
														<td>
															{
																historyItem.timestamp
															}
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								)}
							</div>
						</div>
					</div>
				</div>
				<ToastContainer />
			</div>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
}

export default Profile;
