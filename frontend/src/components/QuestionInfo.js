// QuestionInfo.js
import React from 'react';

const QuestionInfo = ({ selectedQuestion }) => {
  if (!selectedQuestion) {
    return (<h4>test</h4>)
  }

  return (
    <div className="question-info">
      <h4>{selectedQuestion.title}</h4>
      <p>Complexity: {selectedQuestion.complexity}</p>
      <p>Category: {selectedQuestion.category.join(', ')}</p>
      <p>Description: {selectedQuestion.description}</p>
      <p>Created at: {selectedQuestion.createdAt}</p>
    </div>
  );
};

export default QuestionInfo;
