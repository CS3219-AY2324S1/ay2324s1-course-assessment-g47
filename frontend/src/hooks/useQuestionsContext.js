import { QuestionContext } from "../context/QuestionContext";
import { useContext } from "react";

export const useQuestionsContext = () => {
    const context = useContext(QuestionContext)

    if (!context) {
        throw new Error('useQuestionsContext must be used within a QuestionsContextProvider')
    }

    return context
}