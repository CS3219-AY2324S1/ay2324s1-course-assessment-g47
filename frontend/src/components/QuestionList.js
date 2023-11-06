import { useQuestionsContext } from "../hooks/useQuestionsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "../App.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import "./css/QuestionList.css";
import { useEffect, useState } from "react";
import ConfirmModal from './ConfirmModal';
import ErrorMessage from './ErrorMessage';

const QuestionList = ({ id, question, onClick, onDelete }) => {
	const { dispatch } = useQuestionsContext();
	const { user } = useAuthContext();
	let [upvoted, setUpvoted] = useState(false);
	let [upvoteCount, setUpvoteCount] = useState(question.upvotes.length);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [error, setError] = useState('');
	const [showErrorModal, setShowErrorModal] = useState(false);

	useEffect(() => {
		if (user) {
			if (question.upvotes.includes(user.user.email)) {
				setUpvoted(true);
			}
		}
	}, [user, question.upvotes]);

	const handleClick = () => {
		setShowConfirmModal(true);
	};

	const handleDelete = async () => {
		let questionId = question._id;
		const response = await fetch(`/api/questions/` + question._id, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${user.tokens.accessToken}`,
			},
		});

		if (response.ok) {
			const json = await response.json();
			dispatch({ type: "DELETE_QUESTION", payload: json });
			onDelete(questionId);
			setShowConfirmModal(false);
		} else {
			// Show error message
			setError('Failed to delete the question. Please try again later.');
			setShowErrorModal(true); // Show the modal
		}
	};

	const hideErrorModal = () => {
		setError('');
		setShowErrorModal(false);
	  };


	const handleUpvote = async () => {
		if (!user) {
			return;
		}
		console.log("upvote clicked");
		console.log(question.upvotes);
		try {
			if (!upvoted) {
				console.log("upvoted");
				if (!question.upvotes.includes(user.user.email)) {
					question.upvotes.push(user.user.email);
					console.log(user.user.email);
					const response = await fetch(
						`/api/questions/vote/` + question._id,
						{
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${user.tokens.accessToken}`,
							},
							body: JSON.stringify({ upvotes: question.upvotes }),
						}
					);

					const json = await response.json();

					if (response.ok) {
						dispatch({ type: "UPDATE_QUESTION", payload: json });
						setUpvoteCount(upvoteCount + 1);
						setUpvoted(true);
					} else {
						console.log("Question update error");
					}
				}
			} else {
				// User is undoing the upvote
				console.log("unvoted");
				if (question.upvotes.includes(user.user.email)) {
					question.upvotes = question.upvotes.filter(
						(email) => email !== user.user.email
					);

					const response = await fetch(
						`/api/questions/vote/` + question._id,
						{
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${user.tokens.accessToken}`,
							},
							body: JSON.stringify({ upvotes: question.upvotes }),
						}
					);

					const json = await response.json();

					if (response.ok) {
						dispatch({ type: "UPDATE_QUESTION", payload: json });
						setUpvoteCount(upvoteCount - 1);
						setUpvoted(false);
					} else {
						console.log("Question update error");
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<tr className={`table-row ${question.complexity.toLowerCase()}`}>
			<td>{id}</td>
			<td className="clickable-cell" onClick={() => onClick(question)}>
				{question.title}
			</td>
			<td>{question.complexity}</td>
			<td>{question.category.join(", ")}</td>
			<td>
				{formatDistanceToNow(new Date(question.createdAt), {
					addSuffix: true,
				})}
			</td>
			<td onClick={handleUpvote}>
				<div className={`upvote-container ${question.complexity.toLowerCase()}`}>
					<button
						id="upvoteButton"
						className={upvoted ? "unvote-button" : "upvote-button"}
					>
						<i className="fas fa-arrow-up"></i>
					</button>
					<div className="mini-upvote-box">
						<span className="popularity">
							Upvotes: {upvoteCount}
						</span>
					</div>
				</div>
			</td>
			{user.user.account_type !== "user" && (
				<td
					className="delete-button material-symbols-outlined"
					onClick={handleClick}
				>
					delete
				</td>
			)}
			<ConfirmModal
				show={showConfirmModal}
				handleClose={() => setShowConfirmModal(false)}
				handleConfirm={handleDelete}
				title="Confirm Deletion"
				body="Are you sure you want to delete this question?"
			/>
      <ErrorMessage
        show={showErrorModal}
        errorMessage={error}
        onHide={hideErrorModal}
      />
		</tr>
	);
};

export default QuestionList;
