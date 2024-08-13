import { Modal, Button } from "react-bootstrap";

export default function DatamanagementModal({ modalShow, handleModalChange }) {
  return (
    <Modal
      show={modalShow}
      onHide={() => {}}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-dialog"
      size="lg"
      aria-labelledby="example-custom-modal-styling-title"
      centered
    >
      <Modal.Header>
        <Modal.Title></Modal.Title>
        <Button
          className="btn btn-outline-primary btnStyle"
          onClick={() => {
            handleModalChange(false);
          }}
          style={{ float: "right", marginLeft: "650px" }}
        >
          Close
        </Button>
        <Button
          className="btn btn-outline-primary btnStyle"
          onClick={() => {
            handleModalChange(false);
          }}
        >
          Save & Close
        </Button>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
