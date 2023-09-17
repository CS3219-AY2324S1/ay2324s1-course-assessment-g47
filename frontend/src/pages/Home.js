import { useEffect, useState } from "react";
import { useQuestionsContext } from "../hooks/useQuestionsContext";
import { Link } from "react-router-dom";
import "./Home.css";

// components
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";
import QuestionDetails from "../components/QuestionDetails";
import LoginPage from "../components/Login";

const Home = ({ user, handleLogin, handleLogout }) => {
	const { questions, dispatch } = useQuestionsContext();
	const [selectedQuestion, setSelectedQuestion] = useState(null); // State to store the selected question
	let rowCount = 1;

	// fetch questions from the backend
	useEffect(() => {
		const fetchQuestions = async () => {
			const response = await fetch("/api/questions");
			const json = await response.json();

			if (response.ok) {
				dispatch({ type: "SET_QUESTIONS", payload: json });
			}
		};

		fetchQuestions();
	}, [dispatch]);

	return user ? (
		<>
			<div className="header">
				<div className="left">
					<p>
						<Link to="/profile">Profile</Link>
					</p>
				</div>
				<div className="center">
					<h1>Welcome, {user.username}</h1>
				</div>
				<div className="right">
					<p>
						<button onClick={() => handleLogout()}>Logout</button>
					</p>
				</div>
			</div>{" "}
			<div className="home">
				<QuestionForm />
				<div className="table-container">
					<table className="table-header">
						<thead>
							<tr>
								<th>#</th>
								<th>Title</th>
								<th>Complexity</th>
								<th>Category</th>
								<th>Created</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{questions &&
								questions.map((question) => (
									<QuestionList
										id={rowCount++}
										key={question._id}
										question={question}
										onClick={(question) => {
											setSelectedQuestion(question);
										}}
										onDelete={(questionId) => {
											if (selectedQuestion !== null) {
												if (
													selectedQuestion._id ===
													questionId
												) {
													setSelectedQuestion(null);
												}
											}
										}}
									/>
								))}
						</tbody>
					</table>
				</div>
				<div className="QuestionDetails">
					<QuestionDetails selectedQuestion={selectedQuestion} />
				</div>
			</div>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
};

export default Home;
