import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./css/Login.css";
import "./css/ChangeTypeHome.css";

function ChangeTypeHome({ user, handleUserChange, handleLogout}) {
    const postgresqlPort = 4001;
    const [localUser, setLocalUser] = useState({
        username: user ? user.username : "",
        email: user ? user.email : "",
        account_type: user ? user.account_type : "",
    });      

    useEffect(() => {
        setLocalUser({
            username: user ? user.username : "",
            email: user ? user.email : "",
            account_type: user ? user.account_type : "",
        });
    }, [user]);

    const handleSaveClick = async (e) => {
        e.preventDefault();
        handleUserChange(localUser);
        //get user id from local storage then update user info
        try {
            console.log(user);
            const response = await fetch(
                `http://localhost:${postgresqlPort}/users/update/${user.user_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(localUser),
                }
            );

            if (response.status === 200) {
                //successful update
                const data = await response.json();
                console.log("Update successful");
            } else {
                // Handle other error cases
                console.log("Server error");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="changetypehome-container">
            <div className="ChangeTypeHome">
                <h1>Change User Type</h1>
                <form>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e) =>
                            setLocalUser({ ...localUser, email: e.target.value })
                        }
                    />
                    <label htmlFor="accountType">User Type</label>
                    <select
                        id="account_type"
                        onChange={(e) =>
                            setLocalUser({
                                ...localUser,
                                account_type: e.target.value,
                            })
                        }
                        value={localUser.account_type}
                    >
                        <option value="user">User</option>
                        <option value="superuser">SuperUser</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="button-wrapper">
                        <button
                            className="login-button"
                            onClick={handleSaveClick}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangeTypeHome;



