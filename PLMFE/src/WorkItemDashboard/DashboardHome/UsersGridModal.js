import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function UsersGridModal(show) {
  return (
    <>
      <Modal
        show={show.modalShow}
        onHide={() => {
          show.handleModalChange(false, show.dataIndex.modalOperation);
          show.deleteTableRows(
            show.dataIndex,
            show.gridName,
            show.operationValue,
          );
          show.decreaseDataIndex();
        }}
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
              show.handleModalChange(false);
              show.deleteTableRows(
                show.dataIndex,
                show.gridName,
                show.operationValue,
              );
              show.decreaseDataIndex();
            }}
            style={{ float: "right", marginLeft: "650px" }}
          >
            Close
          </Button>
          <Button
            className="btn btn-outline-primary btnStyle"
            onClick={() => show.handleModalChange(false)}
          >
            Save & Close
          </Button>
        </Modal.Header>
        <Modal.Body>
          {(show.operationValue === "Add" || show.operationValue === "Edit") &&
            show.tdDataReplica(show.dataIndex)}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
