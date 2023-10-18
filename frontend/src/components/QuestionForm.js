import { useCallback, useState } from "react";
import { useQuestionsContext } from "../hooks/useQuestionsContext";
import MultiSelect from "multiselect-react-dropdown";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useAuthContext } from "../hooks/useAuthContext";
import "../App.css";

const complexityOptions = ["Easy", "Medium", "Hard"];
const categoryOptions = [
	"String",
	"Algorithms",
	"Data Structures",
	"Bit Manipulation",
	"Recursion",
	"Databases",
	"Arrays",
	"Brainteaser",
]; // Define your category options here

const TOOLBAR_OPTIONS = [
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	[{ font: [] }],
	[{ list: "ordered" }, { list: "bullet" }],
	["bold", "italic", "underline"],
	[{ color: [] }, { background: [] }],
	[{ script: "sub" }, { script: "super" }],
	[{ align: [] }],
	["image", "blockquote", "code-block"],
	["clean"],
];

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

	const wrapperRef = useCallback((wrapper) => {
		if (wrapper == null) return;

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
				setQuill(q);
			}
		});

		setQuill(q);
	}, []);

	return (
		<form className="create" onSubmit={handleSubmit}>
			<h2 className="question-header">Add a New Question</h2>
			<label>Question title:</label>
			<input
				type="text"
				placeholder="Question Title"
				onChange={(e) => setTitle(e.target.value)}
				value={title}
				className={emptyFields.includes("title") ? "error" : ""}
			/>
			<label>Complexity:</label>
			<select
				value={complexity}
				onChange={(e) => setComplexity(e.target.value)}
				className={emptyFields.includes("complexity") ? "error" : ""}
			>
				<option value="">Select Complexity</option>
				{complexityOptions.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
			<label>Category:</label>
			<MultiSelect
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
			<label>Description:</label>
			<div
				className={`description-container ${
					emptyFields.includes("description") ? "error" : ""
				}`}
				ref={wrapperRef}
			></div>
			<button className="add-button"> Add Question </button>
			{error && <div className="error">{error}</div>}
		</form>
	);
};

export default QuestionForm;
