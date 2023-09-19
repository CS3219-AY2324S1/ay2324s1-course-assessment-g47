import { useQuestionsContext } from "../hooks/useQuestionsContext"
import { useAuthContext } from '../hooks/useAuthContext'

import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const QuestionList = ({ id, question, onClick, onDelete, user }) => {
    const { dispatch } = useQuestionsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {

        if (!user) {
            return
        }
        
        let questionId = question._id
        const response = await fetch(`/api/questions/` + question._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.tokens.accessToken}`
            }
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