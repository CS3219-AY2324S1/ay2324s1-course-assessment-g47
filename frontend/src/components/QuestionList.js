import { useQuestionsContext } from "../hooks/useQuestionsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "../App.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import "./css/QuestionList.css";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { ca } from "date-fns/locale";

const QuestionList = ({ id, question, onClick, onDelete }) => {
	const { dispatch } = useQuestionsContext();
	const { user } = useAuthContext();
	const [upvoted, setUpvoted] = useState(false);
  	const [upvoteCount, setUpvoteCount] = useState(question.upvotes.length);

	useEffect(() => {
		if (user) {
			if (question.upvotes.includes(user.user.email)) {
				setUpvoted(true);
			}
		}
	}, [user]);

	const handleClick = async () => {
		if (!user) {
			return;
		}

		let questionId = question._id;
		const response = await fetch(`/api/questions/` + question._id, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${user.tokens.accessToken}`,
			},
		});
		const json = await response.json();

		if (response.ok) {
			dispatch({ type: "DELETE_QUESTION", payload: json });
			onDelete(questionId);
		}
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
					const response = await fetch(`/api/questions/` + question._id, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.tokens.accessToken}`,
						},
						body: JSON.stringify({ upvotes: question.upvotes }),
					});
		
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
					question.upvotes = question.upvotes.filter((email) => email !== user.user.email);
				
					const response = await fetch(`/api/questions/` + question._id, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.tokens.accessToken}`,
						},
						body: JSON.stringify({ upvotes: question.upvotes}),
					});
				
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
		<tr className="table-row">
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
				<button id="upvoteButton">
				{upvoted ? (
    				<i className="fas fa-arrow-down"></i>
				) : (
					<i className="fas fa-arrow-up"></i>
				)}
				{upvoted ? 'Unvote' : 'Upvote'}
				</button>
				<div class="mini-upvote-box">
        			<span class="popularity">Popularity:{upvoteCount}</span>
    			</div>
			</td>
			{user.user.account_type !== "user" ? (
				<td
					className="delete-button material-symbols-outlined"
					onClick={handleClick}
				>
					delete
				</td>
			) : null}
		</tr>
	);
};

export default QuestionList;
