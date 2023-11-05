import React from 'react';
import { Modal } from 'react-bootstrap';

const ErrorMessage = ({ show, errorMessage, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>{errorMessage}</Modal.Body>
    </Modal>
  );
};

export default ErrorMessage;