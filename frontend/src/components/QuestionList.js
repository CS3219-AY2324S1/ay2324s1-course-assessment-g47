import { useQuestionsContext } from "../hooks/useQuestionsContext"

import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const QuestionList = ({ id, question, onClick, onDelete, user }) => {
    const { dispatch } = useQuestionsContext()

    const handleClick = async () => {

        let questionId = question._id
        const response = await fetch(`/api/questions/` + question._id, {
            method: 'DELETE'
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: 'DELETE_QUESTION', payload: json })
            onDelete(questionId);
        }
    }
    return (
        <tr className="table-row">
            <td>{id}</td>
            <td className="clickable-cell" onClick={() => onClick(question)}>{question.title}</td>
            <td>{question.complexity}</td>
            <td>{question.category.join(', ')}</td>
            <td>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</td>
            {   user.account_type !== "user" ? (
                <td className="delete-button material-symbols-outlined" onClick={handleClick}>delete</td>
            ) : null}
        </tr>
    )
}

export default QuestionList