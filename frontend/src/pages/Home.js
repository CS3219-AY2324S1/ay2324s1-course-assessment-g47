	import { useEffect, useState } from "react";
	import { useQuestionsContext } from "../hooks/useQuestionsContext";
	import { Link } from "react-router-dom";
	import "./Home.css";
	import Select from "react-select";

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
				const response = await fetch("/api/questions", {
					headers: { Authorization: `Bearer ${user.tokens.accessToken}` }
				});
				const json = await response.json();

				if (response.ok) {
					setOriginalQuestions(json);
        			setFilteredQuestions(json);
					dispatch({ type: "SET_QUESTIONS", payload: json });
				}
			};

			if (user) {
				fetchQuestions();
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

		// Define the handleDifficultyChange function
		const handleDifficultyChange = (selectedOptions) => {
			const selectedDifficultyValues = selectedOptions.map((option) => option.value);
			// Filter the questions based on the selected difficulty or show all questions if none are selected
			const filteredQuestions = selectedDifficultyValues.length === 0
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
			const selectedCategoryValues = selectedOptions.map((option) => option.value);
			// Filter the questions based on the selected categories or show all questions if none are selected
			const filteredQuestions = selectedCategoryValues.length === 0
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

		const customStyles = {
			control: (styles) => ({
				...styles,
				width: "200px",
			}),
			menu: (provided) => ({
				...provided,
				width: "200px",
				maxHeight: "300px",
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
			<div {...innerProps} 
				className={isSelected ? "option selected" : "option"}
				style={{width: "200px"}}
			>
				<label>
					{label}
				</label>
			</div>
		);

		return user ? (
			<>
			  <div className="header"></div>
			  <div className="home">
				<QuestionQueue user={user.user} />
				{user.user.account_type !== "user" ? (
				  <div>
					<QuestionForm />
				  </div>
				) : null}
				<div className="QuestionDetails">
				  <QuestionDetails selectedQuestion={selectedQuestion} />
				</div>
			  </div>
			  <div className="table-container" style={pageStyles}>
			<div className="filter-container">
				<div className="filter-option">
				<button onClick={handleSortByPopularity}
					className={
					asc
						? "asc-button"
						: desc
						? "desc-button"
						: "none-button"
					}>
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
				<div className="filter-option">
				<label>Select Categories:</label>
				<Select
					options={categoryOptions}
					isMulti
					value={categoryOptions.filter((option) =>
						selectedCategories.includes(option.value)
					)}
					onChange={handleCategoryChange}
					styles={customStyles}
					components={{ Option: CustomOption }}
				/>
				</div>
				<div className="filter-option">
				<label>Select Difficulty:</label>
				<Select
					options={difficultyOptions}
					isMulti
					value={difficultyOptions.filter((option) =>
						selectedDifficulty.includes(option.value)
					)}
					onChange={handleDifficultyChange}
					styles={customStyles}
					components={{ Option: CustomOption }}
				/>
				</div>
			</div>
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
							  if (selectedQuestion._id === questionId) {
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
