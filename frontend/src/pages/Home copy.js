import { useEffect, useState } from "react";
import { useQuestionsContext } from "../hooks/useQuestionsContext";
import { Link } from "react-router-dom";
import "./Home.css";
import Select from "react-select";
import * as Constants from "../constants/constants.js";

// components
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";
import QuestionDetails from "../components/QuestionDetails";
import LoginPage from "../components/Login";
import QuestionQueue from "../components/QuestionQueue";
import DoughnutChart from "../components/DoughnutChart.js";
import LineChart from "../components/LineChart.js";
import Calendar from "../components/Calendar.js";
import { set } from "date-fns";

const Home = ({ user, handleLogin }) => {
	const [historyData, setHistoryData] = useState([]);
	const [timestamps, setTimestamps] = useState([]); // Store user names
	const [completedQnDiffculty, setCompletedQnDifficulty] = useState([0, 0, 0]);

	const { questions, dispatch } = useQuestionsContext();
	const [selectedQuestion, setSelectedQuestion] = useState(null); // State to store the selected question
	const [selectedCategories, setSelectedCategories] = useState([]); // State to store the selected category
	const [sort, setSort] = useState("none");
	const [asc, setAsc] = useState(false);
	const [desc, setDesc] = useState(false);
	const [originalQuestions, setOriginalQuestions] = useState([]);
	const [filteredQuestions, setFilteredQuestions] = useState([]);
	const [selectedDifficulty, setSelectedDifficulty] = useState([]); // State to store the selected difficulty
	let rowCount = 1;

	// fetch questions from the backend
	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const response = await fetch("/api/questions", {
					headers: {
						Authorization: `Bearer ${user.tokens.accessToken}`,
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const json = await response.json();

				setOriginalQuestions(json);
				setFilteredQuestions(json);
				dispatch({ type: "SET_QUESTIONS", payload: json });
			} catch (error) {
				// Handle the error here
				console.error("Error fetching questions:", error.message);
				// You can set an error state or display an error message to the user
			}
		};

		if (user) {
			fetchQuestions();
			fetchUserHistory();
		}
	}, [dispatch, user]);

	// Define your category options
	const categoryOptions = [
		{ label: "String", value: "String" },
		{ label: "Algorithms", value: "Algorithms" },
		{ label: "Data Structures", value: "Data Structures" },
		{ label: "Bit Manipulation", value: "Bit Manipulation" },
		{ label: "Recursion", value: "Recursion" },
		{ label: "Databases", value: "Databases" },
		{ label: "Arrays", value: "Arrays" },
		{ label: "Brainteaser", value: "Brainteaser" },
	];

	// Define your difficulty options
	const difficultyOptions = [
		{ label: "Easy", value: "Easy" },
		{ label: "Medium", value: "Medium" },
		{ label: "Hard", value: "Hard" },
	];

	const fetchUserHistory = async () => {
		if (!user.user.email) {
			console.log("Email cannot be empty");
			return;
		}
		try {
			const response = await fetch(
				`http://localhost:${Constants.POSTGRESQL_PORT}/users/user-history/${user.user.user_id}`,
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

				const timestamps = []; // Create an array to store timestamps
				let easy = 0;
				let med = 0;
				let hard = 0;
				for (const historyItem of data.data.rows) {
					const timestamp = historyItem.timestamp;
					const date = new Date(timestamp);
					timestamps.push(date);
					if (historyItem.question_difficulty === "Easy") {
						easy++;
					} else if (historyItem.question_difficulty === "Medium") {
						med++;
					} else if (historyItem.question_difficulty === "Hard") {
						hard++;
					}
				}
				setCompletedQnDifficulty([easy, med, hard]);

				setTimestamps(timestamps);
				console.log(timestamps);

			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	function processTimestamps(timestamps) {
		const counts = new Array(7).fill(0); // Array for each day of the week
		const now = new Date(); // Current date

		// Determine the start and end of the current week
		const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(endOfWeek.getDate() + 6);

		timestamps.forEach(ts => {
			const date = ts;
			if (date >= startOfWeek && date <= endOfWeek) {
				counts[date.getDay()]++; // Increment the count for the specific day
			}
		});
		return counts;
	}

	// Define the handleDifficultyChange function
	const handleDifficultyChange = (selectedOptions) => {
		const selectedDifficultyValues = selectedOptions.map(
			(option) => option.value
		);
		// Filter the questions based on the selected difficulty or show all questions if none are selected
		const filteredQuestions =
			selectedDifficultyValues.length === 0
				? originalQuestions
				: originalQuestions.filter((question) =>
					selectedDifficultyValues.includes(question.complexity)
				);

		setFilteredQuestions(filteredQuestions);
		setSelectedDifficulty(selectedDifficultyValues);
		dispatch({ type: "SET_QUESTIONS", payload: filteredQuestions });

		// Reset the sorting
		setSort("none");
		setAsc(false);
		setDesc(false);
	};

	// Define the handleCategoryChange function
	const handleCategoryChange = (selectedOptions) => {
		const selectedCategoryValues = selectedOptions.map(
			(option) => option.value
		);
		// Filter the questions based on the selected categories or show all questions if none are selected
		const filteredQuestions =
			selectedCategoryValues.length === 0
				? originalQuestions
				: originalQuestions.filter((question) =>
					question.category.some((category) =>
						selectedCategoryValues.includes(category)
					)
				);

		setFilteredQuestions(filteredQuestions);
		setSelectedCategories(selectedCategoryValues);
		dispatch({ type: "SET_QUESTIONS", payload: filteredQuestions });

		// Reset the sorting
		setSort("none");
		setAsc(false);
		setDesc(false);
	};

	const handleSortByPopularity = () => {
		const sortedQuestions = [...questions];
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
			sortedQuestions.sort((a, b) => a._id - b._id);
			setSort("none");
			setAsc(false);
			setDesc(false);
		}
		dispatch({ type: "SET_QUESTIONS", payload: sortedQuestions });
	};

	const customStyles = {
		control: (styles) => ({
			...styles,
			width: "400px",
		}),
		valueContainer: (provided) => ({
			...provided,
			maxHeight: "30px", // Adjust the max height as per your needs
			overflowY: "auto",
		}),
		menu: (provided) => ({
			...provided,
			width: "400px",
			maxHeight: "150px", // Adjust the max height as per your needs
			overflowY: "auto",
			zIndex: 999,
		}),
	};

	// CSS for the entire page
	const pageStyles = {
		height: "100vh", // Make sure the page takes up the full viewport height
		overflowY: "auto", // Allow the entire page to scroll if the content doesn't fit
	};

	const CustomOption = ({ innerProps, label, isSelected }) => (
		<div
			{...innerProps}
			className={isSelected ? "option selected" : "option"}
			style={{ width: "200px" }}
		>
			<label>{label}</label>
		</div>
	);

	return user ? (
		<>
			<div className="header"></div>

			<div className="home">
				<div className="row">
					{/* Line Chart with 50% width */}
					<div className="col-md-6" style={{ backgroundColor: 'darkgrey', padding: '20px' }}>
						<h5 style={{ color: 'white' }}>Line Chart</h5>
						<LineChart data={processTimestamps(timestamps)} />
					</div>

					{/* Doughnut Chart with 25% width */}
					<div className="col-md-3" style={{ backgroundColor: 'darkgrey', padding: '20px' }}>
						<h5 style={{ color: 'white' }}>Doughnut Chart</h5>
						{completedQnDiffculty.every(count => count === 0) ? (
							<p>Start working on questions today!</p>
						) : (
							<DoughnutChart data={completedQnDiffculty} />
						)}
					</div>

					{/* Calendar with 25% width */}
					<div className="col-md-3" style={{ backgroundColor: 'darkgrey', padding: '20px' }}>
						<h5 style={{ color: 'white' }}>Calendar</h5>
						<Calendar timestamps={timestamps} />
					</div>
				</div>

				{user.user.account_type !== "user" ? (
					<div>
						<QuestionForm />
					</div>
				) : null}

				<QuestionQueue user={user.user} />
				<div className="QuestionDetails">
					<QuestionDetails
						selectedQuestion={selectedQuestion}
						onUpdate={(questionId, updatedQuestion) => {
							setSelectedQuestion(updatedQuestion);
						}} />
				</div>
			</div>

			<div className="table-container" style={pageStyles}>
				<div className="container">
					<div className="row">
						<div className="col-12 col-sm-6 col-md-4">
							<div className="filter-option">
								<div className="btn-group">
									<button
										onClick={handleSortByPopularity}
										className={`btn ${asc
											? "btn-success"
											: desc
												? "btn-danger"
												: "btn-secondary"
											}`}
									>
										{asc ? (
											<i className="fas fa-sort-up"></i>
										) : desc ? (
											<i className="fas fa-sort-down"></i>
										) : (
											<i className="fas fa-sort"></i>
										)}
										Sort by Popularity
									</button>
								</div>
							</div>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<div className="filter-option">
								<label className="mb-0">
									Select Categories:
								</label>
								<Select
									options={categoryOptions}
									isMulti
									value={categoryOptions.filter((option) =>
										selectedCategories.includes(
											option.value
										)
									)}
									onChange={handleCategoryChange}
									// styles={customStyles}
									components={{ Option: CustomOption }}
								/>
							</div>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<div className="filter-option">
								<label className="mb-0">
									Select Difficulty:
								</label>
								<Select
									options={difficultyOptions}
									isMulti
									value={difficultyOptions.filter((option) =>
										selectedDifficulty.includes(
											option.value
										)
									)}
									onChange={handleDifficultyChange}
									// styles={customStyles}
									components={{ Option: CustomOption }}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="table-responsive">
					<table className="table">
						<thead className="table-dark">
							<tr>
								<th>#</th>
								<th>Title</th>
								<th>Complexity</th>
								<th>Category</th>
								<th>Created</th>
								<th>Upvotes</th>
								{user.user.account_type !== "user" && (
									<th>Action</th>
								)}
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
			</div>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
};

export default Home;
