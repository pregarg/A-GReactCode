import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";

export default function Provider360(modalProps) {
  return (
    <>
      <Modal
        show={modalProps.showProvider360}
        onHide={() => {
          modalProps.handleCloseProvider360(false);
        }}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog custom-modal"
        size="xl"
        style={{ width: "100%", margin: "auto" }}
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title className="text-center w-100">Provider 360</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              {modalProps.provider360TableComponent(true)}
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => window.print()}>Print Summary</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
