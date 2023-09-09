import { useQuestionsContext } from "../hooks/useQuestionsContext"

//date
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const QuestionDetails = ({ question,  onClick }) => {
    const {dispatch} = useQuestionsContext()

    const handleClick = async() => {
        const response = await fetch(`/api/questions/` + question._id, {
            method: 'DELETE'
        })
        const json = await response.json()
        
        if(response.ok){
            dispatch({type: 'DELETE_QUESTION', payload: json})
        }
    }
    return (
        <div className="question-details">
            <h4 onClick={() => onClick(question)}>{question.title}</h4>
            <p>Complexity: {question.complexity}</p>
            <p>Category: {question.category}</p>
            <p>Description: {question.description}</p>
            <p>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>    
    )
}

export default QuestionDetails