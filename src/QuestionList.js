import React from 'react';

// Function to display question details when a question title is clicked
function displayQuestionDetails(question) {
    if (question) {
      const questionDetails = document.getElementById("question-details");
      const formattedDescription = question.description.replace(/\n/g, '<br>');
      questionDetails.innerHTML = `
              <h2><u>${question.title}</u></h2>
              <p>Category: ${question.category || "N/A"}</p>
              <p>Complexity: ${question.complexity || "N/A"}</p>
              <p>${formattedDescription}</p>
          `;
    }
}

function QuestionList({ questions, deleteQuestion }) {
  return (
    <table className="question-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Complexity</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <tr key={question.id}>
            <td>{question.id}</td>
            <td>
              <a href="#"
                onClick={() => displayQuestionDetails(questions.find(q => q.id === question.id))}>
                {question.title}
              </a>
            </td>
            <td>{question.complexity}</td>
            <td>{question.category}</td>
            <td>
              <button
                className="delete-button"
                onClick={() => deleteQuestion(question.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default QuestionList;
