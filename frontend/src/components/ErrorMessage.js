import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ errorMessage, clearError }) => {
  if (!errorMessage) return null;

  return (
    <Alert variant="danger" onClose={clearError} dismissible>
      <Alert.Heading>Error!</Alert.Heading>
      <p>
        {errorMessage}
      </p>
    </Alert>
  );
};

export default ErrorMessage;
