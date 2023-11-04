import React, { useState, useEffect  } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useQuestionsContext } from "../hooks/useQuestionsContext"
import { format } from 'date-fns';

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

const observeDescriptionChanges = (descriptionElement) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      // Perform necessary actions on mutation
      // You may need to handle changes to the description here
    });
  });

  observer.observe(descriptionElement, {
    childList: true,
    subtree: true,
  });
};

const QuestionDetails = ({ selectedQuestion, onUpdate }) => {
  const { dispatch } = useQuestionsContext();
  const [editMode, setEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState(selectedQuestion ? selectedQuestion.description : "");



  useEffect(() => {
    if (selectedQuestion) {
      setEditMode(false);
      setEditedDescription(selectedQuestion.description);
    }
  }, [selectedQuestion]);

  const handleSave = () => {
    handleUpdateQuestion(selectedQuestion._id, { description: editedDescription });
    setEditMode(false);
  };

  const handleUpdateQuestion = async (questionId, updatedFields) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });
      const updatedQuestion = await response.json();
  
      if (response.ok) {
        dispatch({ type: 'UPDATE_QUESTION', payload: updatedQuestion });
        onUpdate(questionId, updatedQuestion);
      } else {
        const error = await response.json();
        // Handle the error accordingly
        console.error('Error updating question:', error);
      }
    } catch (error) {
      // Handle any network errors
      console.error('Network error:', error);
    }
  };

  const handleCancel = () => {
    setEditedDescription(selectedQuestion.description);
    setEditMode(false);
  };

  if (!selectedQuestion) {
    return (
      <div className="question-details">
        <h4>Click a question to view</h4>
      </div>
    );
  }

  return (
    <div className="question-details">
      <h4>{selectedQuestion.title}</h4>
      <p><strong>Complexity:</strong>  {selectedQuestion.complexity}</p>
      <p><strong>Category:</strong> {selectedQuestion.category.join(', ')}</p>
      {editMode ? (
        <div>
          <ReactQuill
            value={editedDescription}
            onChange={setEditedDescription}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button> {/* Add the cancel button */}
        </div>
      ) : (
        <div>
          <p><strong>Description:</strong></p>
          <div className="card-description">
            {parseDescription(selectedQuestion.description)}
          </div>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
      <p className='question-btm-subtext'>Created at: {format(new Date(selectedQuestion.createdAt), 'dd MMM yyyy HH:mm:ss')}</p>
    </div>
  );
};

export default QuestionDetails;
