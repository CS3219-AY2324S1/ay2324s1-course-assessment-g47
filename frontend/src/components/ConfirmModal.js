import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, handleClose, handleConfirm, title, body, leftBtn = "Cancel", rightBtn = "Delete" }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {leftBtn}
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          {rightBtn}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
