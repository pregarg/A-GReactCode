import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";

export default function Member360(modalProps) {
  return (
    <>
      <Modal
        show={modalProps.showMember360}
        onHide={() => {
          modalProps.handleCloseMember360(false);
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
          <Modal.Title className="text-center w-100">Member 360</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              {modalProps.member360TableComponent("member360")}
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
