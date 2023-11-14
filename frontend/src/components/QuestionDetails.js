import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../App.css";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useQuestionsContext } from "../hooks/useQuestionsContext";
import ErrorMessage from "./ErrorMessage";
import MultiSelect from "multiselect-react-dropdown";
import * as Constants from "../constants/constants.js";
import { FaPen } from "react-icons/fa";

const complexityOptions = Constants.complexityOptions;
const categoryOptions = Constants.categoryOptions;
const TOOLBAR_OPTIONS = Constants.TOOLBAR_OPTIONS;

// Function to parse the description and replace Base64-encoded images
const parseDescription = (description) => {
	const imageRegex = /<img[^>]+src=['"]data:image\/[^'"]+['"][^>]*>/g;
	const imageTags = description.match(imageRegex);

	if (!imageTags) {
		return <div dangerouslySetInnerHTML={{ __html: description }} />;
	}

	let formattedDescription = description;
	imageTags.forEach((imageTag) => {
		const imgSrcRegex = /src=['"]([^'"]+)['"]/;
		const srcMatch = imageTag.match(imgSrcRegex);

		if (srcMatch) {
			const imgSrc = srcMatch[1];
			formattedDescription = formattedDescription.replace(
				imageTag,
				<img src={imgSrc} alt="" />
			);
		}
	});
	return <div dangerouslySetInnerHTML={{ __html: formattedDescription }} />;
};

const QuestionDetails = ({ selectedQuestion, onUpdate }) => {
	const { user } = useAuthContext();
	const { dispatch } = useQuestionsContext();
	const [editMode, setEditMode] = useState(false);
	const [editedTitle, setEditedTitle] = useState(
		selectedQuestion ? selectedQuestion.title : ""
	);
	const [editedComplexity, setEditedComplexity] = useState(
		selectedQuestion ? selectedQuestion.complexity : ""
	);
	const [editedCategories, setEditedCategories] = useState(
		selectedQuestion ? selectedQuestion.category : []
	);
	const [editedDescription, setEditedDescription] = useState(
		selectedQuestion ? selectedQuestion.description : ""
	);
	const [error, setError] = useState("");
	const [showErrorModal, setShowErrorModal] = useState(false);

	useEffect(() => {
		if (selectedQuestion) {
			setEditMode(false);
			setEditedTitle(selectedQuestion.title);
			setEditedComplexity(selectedQuestion.complexity);
			console.log(selectedQuestion.category);
			setEditedCategories(selectedQuestion.category);
			setEditedDescription(selectedQuestion.description);
		}
	}, [selectedQuestion]);

	const handleSave = () => {
		const updatedFields = {
			title: editedTitle,
			complexity: editedComplexity,
			category: editedCategories,
			description: editedDescription,
		};
		handleUpdateQuestion(selectedQuestion._id, updatedFields);
		setEditMode(false);
	};

	const handleCategoryChange = (selectedList) => {
		setEditedCategories(selectedList);
	};

	const handleUpdateQuestion = async (questionId, updatedFields) => {
		try {
			const response = await fetch(`/api/questions/${questionId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.accessToken}`,
				},
				body: JSON.stringify(updatedFields),
			});
			const updatedQuestion = await response.json();

			if (response.ok) {
				dispatch({ type: "UPDATE_QUESTION", payload: updatedQuestion });
				onUpdate(questionId, updatedQuestion);
				// Reset any existing error message
			} else {
				// Use the error message from the response if available
				setError(
					updatedQuestion.message ||
						"Failed to update the question. Please try again later."
				);
				setShowErrorModal(true); // Show the modal
			}
		} catch (error) {
			// Handle any network errors
			setError(
				error.toString() || "Network error. Please try again later."
			);
			setShowErrorModal(true); // Show the modal
		}
	};

	const hideErrorModal = () => {
		setError("");
		setShowErrorModal(false);
	};

	const handleCancel = () => {
		setEditedDescription(selectedQuestion.description);
		setEditMode(false);
	};

	if (!selectedQuestion) {
		return (
			<div className="container-fluid" style={{ minWidth: "200px" }}>
				<div className="card m-1 rounded-4">
					<div className="card-body bg-dark rounded-4 d-flex flex-column justify-content-center align-items-center">
						<h4 className="card-title text-light">
							Click a question to view
						</h4>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid" style={{ minWidth: "200px" }}>
			<div className="card m-1 rounded-4">
				<div className="card-body bg-dark rounded-4 position-relative">
					{user.user.account_type !== "user" && (
						<div className="position-absolute top-0 end-0 pt-2 pe-2">
							{editMode ? (
								<></>
							) : (
								<button
									className="btn btn-primary rounded-circle"
									onClick={() => setEditMode(true)}
								>
									<span className="material-icons">
										<FaPen />
									</span>
								</button>
							)}
						</div>
					)}
					{editMode ? (
						<>
							<h2 className="text-center mb-4 text-accent-color">
								Edit Question
							</h2>
							<div className="form-outline mb-4">
								<label className="form-label" htmlFor="title">
									Question title:
								</label>
								<input
									type="text"
									value={editedTitle}
									onChange={(e) =>
										setEditedTitle(e.target.value)
									}
									className="form-control mb-2"
								/>
							</div>
							<div className="form-outline mb-4">
								<label
									className="form-label"
									htmlFor="complexity"
								>
									Complexity:
								</label>
								<select
									value={editedComplexity}
									onChange={(e) =>
										setEditedComplexity(e.target.value)
									}
									className="form-select mb-2"
								>
									{complexityOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>
							</div>
							<div className="form-outline mb-4">
								<label
									className="form-label"
									htmlFor="category"
								>
									Category:
								</label>
								<MultiSelect
									id="category"
									isObject={false}
									options={categoryOptions}
									onRemove={(e) => {
										setEditedCategories(e);
									}}
									onSelect={(e) => {
										setEditedCategories(e);
									}}
									selectedValues={editedCategories}
									placeholder="Select Category"
									showCheckbox
									showArrow
								/>
							</div>
							<div className="form mb-4">
								<label
									className="form-label"
									htmlFor="description"
								>
									Description:
								</label>
								<div className="editor-container">
									<ReactQuill
										value={editedDescription}
										onChange={setEditedDescription}
									/>
								</div>
							</div>
							<button
								className="btn btn-success me-2"
								onClick={handleSave}
							>
								<span className="material-icons">Save</span>
							</button>
							<button
								className="btn btn-danger"
								onClick={handleCancel}
							>
								<span className="material-icons">Cancel</span>
							</button>
						</>
					) : (
						<>
							<h4 className="card-title text-light">
								{selectedQuestion.title}
							</h4>
							<p className="mb-1 text-light">
								<strong>Complexity:</strong>{" "}
								{selectedQuestion.complexity}
							</p>
							<p className="mb-1 text-light">
								<strong>Category:</strong>{" "}
								{selectedQuestion.category.join(", ")}
							</p>
							<p className="mb-1 text-light">
								<strong>Description:</strong>
							</p>
							<div
								className="description-box mb-3 p-2 rounded-2 text-light"
								style={{
									border: "1px solid #ccc",
									maxHeight: "500px",
									overflowY: "auto",
								}}
							>
								{parseDescription(selectedQuestion.description)}
							</div>
						</>
					)}

					<p className="card-text d-flex justify-content-center text-light">
						Updated at:{" "}
						{format(
							new Date(selectedQuestion.updatedAt),
							"dd MMM yyyy HH:mm:ss"
						)}
					</p>
				</div>
				<ErrorMessage
					show={showErrorModal}
					errorMessage={error}
					onHide={hideErrorModal}
				/>
			</div>
		</div>
	);
};

export default QuestionDetails;
