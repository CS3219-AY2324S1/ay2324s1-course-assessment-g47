import { createContext, useReducer } from 'react';

export const QuestionContext = createContext()

export const questionsReducer = (state, action) => {
    switch(action.type){
        case 'SET_QUESTIONS':
            return {
                questions: action.payload
            }
        case 'CREATE_QUESTION':
            return {
                questions: [...state.questions, action.payload]
            }
        case 'DELETE_QUESTION':
            return {
                questions: state.questions.filter(q => q._id !== action.payload._id)
            }
        case 'UPDATE_QUESTION':
            const updatedQuestion = action.payload
            const updatedQuestions = state.questions.map(question => {
                if(question._id === updatedQuestion._id){
                    return updatedQuestion
                }
                return question
            })
            return {
                ...state,
                questions: updatedQuestions
            }
        default:
            return state
    }
}

export const QuestionsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(questionsReducer, {
        questions: null
    })

    return (
        <QuestionContext.Provider value={{...state,dispatch}}>
            { children }
        </QuestionContext.Provider>
    )
}

//dispatch function:  to update state of questions using questionsReducer
// state object: questions
