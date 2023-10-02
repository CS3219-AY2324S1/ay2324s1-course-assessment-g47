import React from 'react';

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

const QuestionDetails = ({ selectedQuestion }) => {
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
      <p><strong>Description:</strong></p>
      <div className="card-description">
        {parseDescription(selectedQuestion.description)}
      </div>
      <p className='question-btm-subtext'>Created at: {format(new Date(selectedQuestion.createdAt), 'dd MMM yyyy HH:mm:ss')}</p>
    </div>
  );
};

export default QuestionDetails;
