import React from 'react';
import { format } from 'date-fns';
import { FaSync } from 'react-icons/fa';
import "./css/DisplayRandomQuestion.css";

function DisplayRandomQuestion({ randomQuestion, handleRefreshQuestion }) {
  return (
    <div>
      <div className="question-details">
        {randomQuestion && (
          <>
            <button onClick={handleRefreshQuestion} className="refresh-button">
        <FaSync /> 
      </button>
            <h4 className="question-header">{randomQuestion.title}</h4>
            <p>
              <strong>Complexity:</strong> {randomQuestion.complexity}
            </p>
            <p>
              <strong>Category:</strong> {randomQuestion.category.join(', ')}
            </p>
            <p>
              <strong>Description:</strong>
            </p>
            <div className="card-description">
              {parseDescription(randomQuestion.description)}
            </div>
            <p className="question-btm-subtext">
              Created at:{' '}
              {format(new Date(randomQuestion.createdAt), 'dd MMM yyyy HH:mm:ss')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DisplayRandomQuestion;

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
