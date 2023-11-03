import React from "react";
import "../App.css";
import { format } from "date-fns";

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

const QuestionDetails = ({ selectedQuestion }) => {
	if (!selectedQuestion) {
		return (
			<div className="container-fluid" style={{ minWidth: '200px'}}>
				<div className="card m-1 rounded-4">
					<div className="card-body bg-dark rounded-4 d-flex flex-column justify-content-center align-items-center">
						<h4 className="card-title text-light">Click a question to view</h4>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid" style={{ minWidth: '200px'}}>
			<div className="card m-1 rounded-4">
				<div className="card-body bg-dark rounded-4">
					<h4 className="card-title text-light">{selectedQuestion.title}</h4>
					<p className="mb-1 text-light"><strong>Complexity:</strong> {selectedQuestion.complexity}</p>
					<p className="mb-1 text-light"><strong>Category:</strong> {selectedQuestion.category.join(", ")}</p>
					<p className="mb-1 text-light"><strong>Description:</strong></p>
					<div className="description-box mb-3 p-2 rounded-2 text-light" style={{ border: '1px solid #ccc' }}>
						{parseDescription(selectedQuestion.description)}
					</div>
					<p className="card-text d-flex justify-content-center text-light">
						Created at: {format(new Date(selectedQuestion.createdAt), "dd MMM yyyy HH:mm:ss")}
					</p>
				</div>
			</div>
		</div>

	);
};

export default QuestionDetails;
