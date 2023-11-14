import React from "react";
import { format } from "date-fns";
import { FaSync } from "react-icons/fa";
import "./css/DisplayRandomQuestion.css";

function DisplayRandomQuestion({
	randomQuestion,
	handleRefreshQuestion,
	hideRefresh = false,
}) {
	return (
		<div style={{ height: "70%" }}>
			{randomQuestion ? (
				<div className="col" style={{ height: "100%" }}>
					<div
						className="card m-1 rounded-4"
						style={{
							height: "100%",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div
							className="card-body bg-dark rounded-4 d-flex flex-column"
							style={{ height: "100%" }}
						>
							<div className="d-flex justify-content-between align-items-center mb-3">
								<h4 className="card-title text-light m-0">
									{randomQuestion.title}
								</h4>
								{!hideRefresh && (
									<button
										onClick={handleRefreshQuestion}
										className="btn btn-secondary"
									>
										<FaSync />
									</button>
								)}
							</div>
							<p className="mb-1 text-light">
								<strong>Complexity:</strong>{" "}
								{randomQuestion.complexity}
							</p>
							<p className="mb-1 text-light">
								<strong>Category:</strong>{" "}
								{randomQuestion.category.join(", ")}
							</p>
							<p className="mb-1 text-light">
								<strong>Description:</strong>
							</p>
							<div
								className="description-box mb-3 p-2 rounded-2 text-light"
								style={{
									border: "1px solid #ccc",
									overflowY: "auto",
									flex: "1",
								}}
							>
								{parseDescription(randomQuestion.description)}
							</div>
							<p className="card-text text-light">
								Created at:{" "}
								{format(
									new Date(randomQuestion.createdAt),
									"dd MMM yyyy HH:mm:ss"
								)}
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="col">
					<div className="card m-1 rounded-4">
						<div className="card-body bg-dark rounded-4 d-flex flex-column">
							<div className="d-flex justify-content-between align-items-center mb-3">
								<h4 className="card-title text-light m-0">
									Choose a question
								</h4>
								{!hideRefresh && (
									<button
										onClick={handleRefreshQuestion}
										className="btn btn-secondary"
									>
										<FaSync />
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default DisplayRandomQuestion;

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
