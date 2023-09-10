// QuestionInfo.js
import React from 'react';

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
        <img src={imgSrc} alt="Embedded Image" />
      );
    }
  });
  return <div dangerouslySetInnerHTML={{ __html: formattedDescription }} />;
};

const QuestionInfo = ({ selectedQuestion }) => {
  if (!selectedQuestion) {
    return (
      <div className="question-info">
      <h4>Click a question to view</h4>
    </div>
    );
  }

  return (
    <div className="question-info">
    <h4>{selectedQuestion.title}</h4>
    <p>Complexity: {selectedQuestion.complexity}</p>
    <p>Category: {selectedQuestion.category.join(', ')}</p>
    <div className="card-description">
      {parseDescription(selectedQuestion.description)}
    </div>
    <p>Created at: {selectedQuestion.createdAt}</p>
  </div>
  );
};

export default QuestionInfo;
