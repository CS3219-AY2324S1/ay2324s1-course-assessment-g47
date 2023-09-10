import { useState } from "react"
import { useQuestionsContext } from '../hooks/useQuestionsContext'
import MultiSelect from "multiselect-react-dropdown";

const complexityOptions = ["Easy", "Medium", "Hard"];
const categoryOptions = ["String", "Algorithm", "Database", "Other"]; // Define your category options here


const QuestionForm = () => {

    const { dispatch } = useQuestionsContext()

    const [title, setTitle] = useState('')
    const [complexity, setComplexity] = useState('')
    const [selectedCategories, setSelectedCategories] = useState([])
    //const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const mutilselectStyle = {
        multiselectContainer: {
            backgroundColor: 'white',
        },
        searchBox: {
            borderColor: '#ddd',
            padding: '0px',
            paddingTop: '5px',
            marginTop: '10px',
            marginBottom: '10px',
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            backgroundColor: '#e6f2f1',
        },
        inputField: {
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            margin: '0px',
        },
        chips: {
            backgroundColor: '#1aac83',
            marginLeft: '5px',
            color: 'white',
        },
        optionContainer: {
            border: '1px solid #ccc',
            alignItems: 'center',
        },
        option: {
            color: 'black',
            display: 'inline-block',
            borderRadius: '4px',
            alignItems: 'center',
            padding: '5px',
            margin: '0px',
        },
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault() //prevent page refresh

        const category = selectedCategories;
        console.log(category)

        const question = { title, complexity, category, description }

        console.log(JSON.stringify(question))

        const response = await fetch('/api/questions', {
            method: 'POST',
            body: JSON.stringify(question), //converts to JSON string
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        } else {
            setTitle('')
            setComplexity('')
            setSelectedCategories([])
            setDescription('')
            setError(null)
            setEmptyFields([])
            console.log('new question added', json)
            dispatch({ type: 'CREATE_QUESTION', payload: json })
        }
    }

    const handleCategoryChange = (e) => {
        const selectedCategory = e;
        // if (selectedCategories.includes(selectedCategory)) {
        //     // If the category is already selected, remove it from the selectedCategories array
        //     setSelectedCategories(selectedCategories.filter((category) => category !== selectedCategory));
        // } else {
        //     // If the category is not selected, add it to the selectedCategories array
        //     setSelectedCategories([...selectedCategories, selectedCategory]);
        // }
        setSelectedCategories(e)
        console.log(e)
        console.log(selectedCategories)
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>
                Add a New Question
            </h3>
            <label>Question title:</label>
            <input
                type="text"
                placeholder="Question Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label>Complexity:</label>
            <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className={emptyFields.includes('complexity') ? 'error' : ''}
            >
                <option value="">Select Complexity</option>
                {complexityOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <label>Category:</label>
            <MultiSelect
                isObject={false}
                options={categoryOptions}
                onRemove={handleCategoryChange}
                onSelect={handleCategoryChange}
                selectedValues={selectedCategories}
                placeholder='Select Category'
                showCheckbox
                showArrow
                style={mutilselectStyle} />
            <label>Description:</label>
            <input
                type="text"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className={emptyFields.includes('description') ? 'error' : ''}
            />
            <button> Add Question </button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default QuestionForm