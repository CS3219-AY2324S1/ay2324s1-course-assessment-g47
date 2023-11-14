import { useCallback, useState } from "react";
import { useQuestionsContext } from "../hooks/useQuestionsContext";
import MultiSelect from "multiselect-react-dropdown";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAuthContext } from "../hooks/useAuthContext";
import "../App.css";
import * as Constants from "../constants/constants.js";

const complexityOptions = Constants.complexityOptions;
const categoryOptions = Constants.categoryOptions;
const TOOLBAR_OPTIONS = Constants.TOOLBAR_OPTIONS;

const QuestionForm = () => {
	const { dispatch } = useQuestionsContext();
	const { user } = useAuthContext();
	const [title, setTitle] = useState("");
	const [complexity, setComplexity] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);
	const [quill, setQuill] = useState();

	const multiselectStyle = {
		multiselectContainer: {
			backgroundColor: "white",
		},
		searchBox: {
			borderColor: "#ddd",
			padding: "0px",
			marginTop: "10px",
			marginBottom: "10px",
			width: "100%",
			border: "1px solid #ddd",
			borderRadius: "4px",
			boxSizing: "border-box",
			backgroundColor: "#ddd",
		},
		inputField: {
			backgroundColor: "white",
			border: "1px solid #ddd",
			borderRadius: "4px",
			margin: "0px",
		},
		chips: {
			backgroundColor: "#1aac83",
			margin: "5px",
			color: "white",
		},
		optionContainer: {
			border: "1px solid #ccc",
			alignItems: "center",
		},
		option: {
			color: "black",
			display: "inline-block",
			borderRadius: "4px",
			alignItems: "center",
			padding: "5px",
			margin: "0px",
		},
	};

	const multiselectErrorStyle = {
		multiselectContainer: {
			backgroundColor: "white",
		},
		searchBox: {
			border: "1px solid #e7195a",
			color: "#e7195a",
			padding: "0px",
			marginTop: "10px",
			marginBottom: "10px",
			width: "100%",
			borderRadius: "4px",
			boxSizing: "border-box",
			backgroundColor: "#ffefef",
		},
		inputField: {
			backgroundColor: "white",
			border: "1px solid #ddd",
			borderRadius: "4px",
			margin: "0px",
		},
		chips: {
			backgroundColor: "#1aac83",
			margin: "5px",
			color: "white",
		},
		optionContainer: {
			border: "1px solid #ccc",
			alignItems: "center",
		},
		option: {
			color: "black",
			display: "inline-block",
			borderRadius: "4px",
			alignItems: "center",
			padding: "5px",
			margin: "0px",
		},
	};

	const handleSubmit = async (e) => {
		e.preventDefault(); //prevent page refresh

		if (!user) {
			setError("Please login to add a question");
			return;
		}

		const category = selectedCategories;
		let description = "";
		let upvotes = [];

		const isQuillEmpty = quill.getText().trim() === "";
		if (!isQuillEmpty) {
			description = quill.root.innerHTML.trim(); // Get the HTML content from Quill
		}

		const question = { title, complexity, category, description, upvotes };

		console.log(JSON.stringify(question));

		const response = await fetch("/api/questions", {
			method: "POST",
			body: JSON.stringify(question), //converts to JSON string
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.accessToken}`,
			},
		});
		const json = await response.json();

		if (!response.ok) {
			setError(json.error);
			setEmptyFields(json.emptyFields);
		} else {
			setTitle("");
			setComplexity("");
			setSelectedCategories([]);
			quill.setText("");
			setError(null);
			setEmptyFields([]);
			console.log("new question added", json);
			dispatch({ type: "CREATE_QUESTION", payload: json });
		}
	};

	const handlePaste = (e) => {
		if (quill) {
			const clipboardData = e.clipboardData || window.clipboardData;
			const items = clipboardData.items;

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (item.type.indexOf("image") !== -1) {
					const blob = item.getAsFile();
					const reader = new FileReader();

					reader.onload = () => {
						const base64Image = reader.result;

						const range = quill.getSelection();
						if (range) {
							quill.insertEmbed(
								range.index,
								"image",
								base64Image
							);
						}
					};
					reader.readAsDataURL(blob);
				}
			}
		}
	};

	const wrapperRef = useCallback(
		(wrapper) => {
			if (wrapper == null || quill) return; // Prevent setting quill again

			wrapper.innerHTML = "";
			const editor = document.createElement("div");
			wrapper.append(editor);
			const q = new Quill(editor, {
				theme: "snow",
				modules: { toolbar: TOOLBAR_OPTIONS },
				trimWhitespace: true,
			});

			q.root.addEventListener("paste", handlePaste);

			q.on("text-change", (delta, oldDelta, source) => {
				if (source === "user") {
					setQuill(q); // Set the state here
				}
			});
		},
		[quill, handlePaste]
	);

	return (
		<div className="container-fluid" style={{ minWidth: "200px" }}>
			<form
				className="create d-flex flex-column p-3 m-1 bg-dark rounded-4 shadow-sm"
				onSubmit={handleSubmit}
			>
				<h2 className="text-center mb-4 text-accent-color">
					Add a New Question
				</h2>

				<div className="form-outline mb-4">
					<label className="form-label" htmlFor="title">
						Question title:
					</label>
					<input
						type="text"
						id="title"
						placeholder="Question Title"
						onChange={(e) => setTitle(e.target.value)}
						value={title}
						className={`form-control form-control-lg fs-6 ${
							emptyFields.includes("title") ? "is-invalid" : ""
						}`}
					/>
				</div>

				<div className="form-outline mb-4">
					<label className="form-label" htmlFor="complexity">
						Complexity:
					</label>
					<select
						id="complexity"
						value={complexity}
						onChange={(e) => setComplexity(e.target.value)}
						className={`form-select form-control-lg ${
							emptyFields.includes("complexity")
								? "is-invalid"
								: ""
						}`}
					>
						<option value="">Select Complexity</option>
						{complexityOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className="form-outline mb-4">
					<label className="form-label" htmlFor="category">
						Category:
					</label>
					<MultiSelect
						id="category"
						isObject={false}
						options={categoryOptions}
						onRemove={(e) => {
							setSelectedCategories(e);
						}}
						onSelect={(e) => {
							setSelectedCategories(e);
						}}
						selectedValues={selectedCategories}
						placeholder="Select Category"
						showCheckbox
						showArrow
						style={
							emptyFields.includes("category")
								? multiselectErrorStyle
								: multiselectStyle
						}
					/>
				</div>

				<div className="form mb-4">
					<label className="form-label" htmlFor="description">
						Description:
					</label>
					<div
						className={`editor-container ${
							emptyFields.includes("description")
								? "is-invalid"
								: ""
						}`}
						ref={wrapperRef}
					></div>
				</div>

				<div className="d-flex justify-content-center">
					<button
						type="submit"
						className="btn btn-primary btn-lg bg-success"
					>
						Add Question
					</button>
				</div>

				{error && (
					<div className="alert alert-danger mt-3">{error}</div>
				)}
			</form>
		</div>
	);
};

export default QuestionForm;
