import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Login.css";
import "./css/ChangeTypeHome.css";
import LoginPage from "./Login";
import "./css/Common.css";

function ChangeTypeHome({ user, handleUserChange, handleLogout, handleLogin}) {
    const postgresqlPort = 4001;
    const [formData, setFormData] = useState({
        email: "",
        account_type: "",
        updateSuccess: "",
    });

    const changeLabelText = (text) => {
        setFormData({
            ...formData,
            updateSuccess: text,
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
        if (user.account_type === "admin" && formData.account_type === "admin") {
            changeLabelText("Cannot change admin account type");
            return;
        }
        const { email, account_type } = formData;
        
        //get user id from local storage then update user info
        try {
            console.log(user);
            const response = await fetch(
                `http://localhost:${postgresqlPort}/users/update/type/${user.user_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, account_type }),
                }
            );

            //check that email exists in database
            if (response.status === 200) {
                // Successful update
                const data = await response.json();
                changeLabelText(data.message);
                console.log("Update successful");
            } else if (response.status === 401) {
                // Invalid email or password
                const errorData = await response.json();
                changeLabelText(errorData.error);
                console.log("Update failed: " + errorData.error);
            } else {
                // Handle other error cases
                console.log("Server error");
                changeLabelText("Server error");
            }
        } catch (error) {
            console.log(error);
            changeLabelText(error.message);
        }
    };

    return user ? (
        <>
            <div className="header">
                <div className="left">
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
                    </div>
                </div>{" "}
            <div className="changetypehome">
                <div className="changetypehome-container">
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
                                <option value="user" selected>User</option>
                                <option value="superuser">SuperUser</option>
                                <option value="admin">Admin</option>
                            </select>
                            </div>
                            <div className="form-group">
                            {formData.updateSuccess && (
                                <p className="success">{formData.updateSuccess}</p>
                            )}
                            </div>
                            <div className="button-wrapper">
                                <button
                                    className="login-button"
                                    type="submit"
                                >
                                    Save
                                </button>
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



