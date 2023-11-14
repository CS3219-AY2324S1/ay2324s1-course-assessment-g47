// import { useParams, Link } from "react-router-dom";
import "./css/room.css";
import { useEffect } from "react";

function RoomUserExit() {
	useEffect(() => {
		const popup = document.getElementById("popup");
		popup.style.display = "block";

		const closePopupButton = document.getElementById("closePopup");
		closePopupButton.addEventListener("click", () => {
			window.location.href = "/";
		});
	}, []);

	return (
		<div className="room-container">
			<div id="popup" class="popup">
				<p>The other user has disconnected.</p>
				<button id="closePopup">OK</button>
			</div>
		</div>
	);
}

export default RoomUserExit;
