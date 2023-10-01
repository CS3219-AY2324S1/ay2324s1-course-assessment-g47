import QuestionList from "../QuestionList"; // Adjust the path as needed
import "../App.css";

import React, { useState, useEffect } from "react";

function Dashboard() {
	const [questions, setQuestions] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [complexity, setComplexity] = useState("Easy");
	const [categoryOptions] = useState([
		"String",
		"Algorithms",
		"Data Structures",
		"Bit Manipulation",
		"Recursion",
		"Databases",
		"Arrays",
		"Brainteaser",
	]);

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		saveData();
	}, [questions]);

	const addQuestion = (e, accountType) => {
		e.preventDefault();

		if (accountType !== "admin") {
			alert("You are not authorised to add this question.");
			return;
		}

		if (title.trim() === "" || description.trim() === "") {
			alert("Please enter a title and description.");
			return;
		}

		const isDuplicate = questions.some(
			(question) =>
				question.title === title || question.description === description
		);

		if (!isDuplicate) {
			const newQuestion = {
				id: questions.length + 1,
				title,
				description,
				category: selectedCategories.join(", "),
				complexity,
			};
			setQuestions([...questions, newQuestion]);
			clearForm();
		} else {
			alert(
				"A question with the same title/description already exists. Please choose a different title/description."
			);
		}
	};

	const clearForm = () => {
		setTitle("");
		setDescription("");
		setComplexity("Easy");
		setSelectedCategories([]);
	};

	// Change the deleteQuestion function to delete only with authorised account type

	const deleteQuestion = (id, accountType) => {
		if (accountType !== "admin") {
			alert("You are not authorised to delete this question.");
			return;
		}
		const updatedQuestions = questions.filter(
			(question) => question.id !== id
		);
		setQuestions(updatedQuestions);
	};

	const saveData = () => {
		localStorage.setItem("questions", JSON.stringify(questions));
	};

	const loadData = () => {
		const data = localStorage.getItem("questions");
		if (data) {
			setQuestions(JSON.parse(data));
		}
	};

	const handleCategoryChange = (e) => {
		const value = e.target.value;
		if (selectedCategories.includes(value)) {
			setSelectedCategories(
				selectedCategories.filter((category) => category !== value)
			);
		} else {
			setSelectedCategories([...selectedCategories, value]);
		}
	};

	return (
		<div className="App">
			<h1>Questions</h1>
			<div className="container">
				<div className="column" id="left-column">
					
					<form id="add-question-form" onSubmit={addQuestion}>
						<div className="form-group">
							<label htmlFor="question-title">Title*:</label>
							<input
								type="text"
								id="question-title"
								placeholder="Question Title"
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="question-complexity">
								Complexity*:
							</label>
							<select
								id="question-complexity"
								value={complexity}
								onChange={(e) => setComplexity(e.target.value)}
							>
								<option value="Easy">Easy</option>
								<option value="Medium">Medium</option>
								<option value="Hard">Hard</option>
							</select>

							<label htmlFor="question-category">
								Categories*:
							</label>
							<div className="category-options-container">
								{categoryOptions.map((category, index) => (
									<div key={index}>
										<input
											type="checkbox"
											id={`category-${index}`}
											value={category}
											checked={selectedCategories.includes(
												category
											)}
											onChange={handleCategoryChange}
										/>
										<label htmlFor={`category-${index}`}>
											{category}
										</label>
									</div>
								))}
							</div>
						</div>
						<div className="form-group">
							<label
								htmlFor="question-description"
								className="top-label"
							>
								Description*:
							</label>
							<textarea
								id="question-description"
								placeholder="Question Description"
								required
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
						</div>
						<button type="submit">Add Question</button>
					</form>
					<div className="column" id="question-list">
						<QuestionList
							questions={questions}
							deleteQuestion={deleteQuestion}
						/>
					</div>
				</div>
				<div className="column" id="right-column">
					<div className="question-detail" id="question-details">
						{/* Question details will be displayed here */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
