import { Modal, Button } from "react-bootstrap";
import "./ViewDeleteModal.css";

export default function DeleteModal(show) {
  let [pk, isIdvalue] = (show.pk[0]?.split("~") || [])?.slice(0, 2);

  const cancelHandler = () => {
    show.onCancel();
    show.setDeleteModal(false);
  };

  const deleteHandler = () => {
    const req = {
      dmlType: "DELETE",
      tableName: show.selectedTable,
      pk: pk,
      pkValue: show.selectedData[pk],
    };

    console.log(req);
    show.onDelete(req);
    show.setDeleteModal(false);
    //show.onDelete(show.deleteModal.id);
  };

  return (
    <Modal
      show={show.deleteModal}
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
        <p>Are you sure you want to delete this record from table?</p>
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
