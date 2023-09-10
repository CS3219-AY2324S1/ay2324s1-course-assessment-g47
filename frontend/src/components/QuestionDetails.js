import { useQuestionsContext } from "../hooks/useQuestionsContext"

//date
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const QuestionDetails = ({ id, question,  onClick, onDelete }) => {
    const {dispatch} = useQuestionsContext()

    const handleClick = async() => {
        const response = await fetch(`/api/questions/` + question._id, {
            method: 'DELETE'
        })
        const json = await response.json()
        
        if(response.ok){
            dispatch({type: 'DELETE_QUESTION', payload: json})
            onDelete(question._id);
        }
    }
    return (
        <tr className="table-row"> {/* Use table row element */}
        <td>{id}</td>
          <td className="clickable-cell" onClick={() => onClick(question)}>{question.title}</td>
          <td>{question.complexity}</td>
          <td>{question.category.join(', ')}</td>
          <td>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</td>
          <td className="delete-button material-symbols-outlined" onClick={handleClick}>delete</td>
        </tr>
      )      
}

export default QuestionDetails