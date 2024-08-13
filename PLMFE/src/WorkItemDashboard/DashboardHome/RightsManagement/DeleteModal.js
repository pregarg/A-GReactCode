import { Modal, Button } from "react-bootstrap";
import "./DeleteModal.css";

export default function DeleteModal(show) {
  const cancelHandler = () => {
    show.onCancel();
  };

  const deleteHandler = () => {
    show.onDelete(show.deleteModal.id);
  };

  return (
    <Modal
      show={show.deleteModal.show}
      onHide={cancelHandler}
      backdrop="static"
      keyboard={false}
      dialogClassName="delete-modal-dialog"
      size="sm"
      aria-labelledby="example-custom-modal-styling-title"
      centered
    >
      <Modal.Header>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Do you want to delete the data?</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="row">
          <div className="col-md-1 offset-md-10">
            <Button
              className="btn btn-outline-danger btnStyle"
              onClick={deleteHandler}
              style={{ float: "right", marginLeft: "650px" }}
            >
              Yes
            </Button>
          </div>
          <div className="col-md-1">
            <Button
              className="btn btn-outline-primary btnStyle"
              onClick={cancelHandler}
            >
              No
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
