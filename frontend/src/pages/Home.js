import { useEffect, useState } from "react";
import { useQuestionsContext } from "../hooks/useQuestionsContext";
import { Link } from "react-router-dom";
import "./Home.css";

// components
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";
import QuestionDetails from "../components/QuestionDetails";
import LoginPage from "../components/Login";
import QuestionQueue from "../components/QuestionQueue";
import { set } from "date-fns";

const Home = ({ user, handleLogin }) => {
	const { questions, dispatch } = useQuestionsContext();
	const [selectedQuestion, setSelectedQuestion] = useState(null); // State to store the selected question
	const [sort, setSort] = useState("none");
	const [asc, setAsc] = useState(false);
	const [desc, setDesc] = useState(false);
	let rowCount = 1;

	// fetch questions from the backend
	useEffect(() => {
		const fetchQuestions = async () => {
			const response = await fetch("/api/questions", {
				headers: { Authorization: `Bearer ${user.tokens.accessToken}` }
			});
			const json = await response.json();

			if (response.ok) {
				dispatch({ type: "SET_QUESTIONS", payload: json });
			}
		};

		if (user) {
			fetchQuestions();
		}
	}, [dispatch, user]);

	const handleSortByPopularity = () => {
		const sortedQuestions = [...questions]
		if (sort === "none") {
			// Sort by popularity in descending order (highest to lowest)
			sortedQuestions.sort((a, b) => b.upvotes.length - a.upvotes.length);
			setSort("asc");
			setAsc(true);
			setDesc(false);
		  } else if (sort === "asc") {
			// Sort by popularity in ascending order (lowest to highest)
			sortedQuestions.sort((a, b) => a.upvotes.length - b.upvotes.length);
			setSort("desc");
			setAsc(false);
			setDesc(true);
		  } else if (sort === "desc") {
			// Return to the original order (no sorting)
			sortedQuestions.reverse();
			setSort("none");
			setAsc(false);
			setDesc(false);
		  }
		dispatch({ type: "SET_QUESTIONS", payload: sortedQuestions });
	}

	return user ? (
		<>
			<div className="header"></div>{" "}
			<div className="home">
				<QuestionQueue user={user.user}/>
				{user.user.account_type !== "user" ? (
					<div>
						<QuestionForm />
					</div>
				) : null}
				<div className="QuestionDetails">
					<QuestionDetails selectedQuestion={selectedQuestion} />
				</div>
			</div>
			<div className="table-container">
				<button onClick={handleSortByPopularity}
					className={
						asc
						? "asc-button"
						: desc
						? "desc-button"
						: "none-button"
					}>
					{	asc 
						? (
							<i className="fas fa-arrow-up"></i>
						)
						: desc 
						? (
							<i className="fas fa-arrow-down"></i>
						)
						: (
							<i className="fas fa-sort"></i>
					)}
						Sort by Popularity
				</button>
				<table className="table-header">
					<thead>
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Complexity</th>
							<th>Category</th>
							<th>Created</th>
							<th>Upvotes</th>
							{user.user.account_type !== "user" ? (
								<th>Action</th>
							) : null}
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
									user={user.user}
								/>
							))}
					</tbody>
				</table>
			</div>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
};

export default Home;
