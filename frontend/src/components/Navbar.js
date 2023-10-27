import { Link } from "react-router-dom";
import "./css/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, handleLogout }) => {
	const navigate = useNavigate();
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<Link className="navbar-brand me-2" to="/">
					<h1>PeerPrep</h1>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-mdb-toggle="collapse"
					data-mdb-target="#navbarButtonsExample"
					aria-controls="navbarButtonsExample"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<i className="fas fa-bars"></i>
				</button>

				<div
					className="collapse navbar-collapse"
					id="navbarButtonsExample"
				>
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							{user ? (
								<div className="navbar-brand me-2">
									<h1>Welcome, {user.user.username}</h1>
								</div>
							) : null}
						</li>
					</ul>

					<div className="d-flex align-items-center">
						{user ? (
							<>
								<button
									type="button"
									className="btn btn-info px-3 me-2"
									onClick={() => {
										navigate("/profile");
									}}
								>
									Profile
								</button>
								<button
									type="button"
									className="btn btn-light me-3"
									onClick={handleLogout}
								>
									Logout
								</button>
							</>
						) : null}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
