import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function DocumentVersionModal(modalProps) {
  console.log("Inside DocumentVersionModal: ", modalProps);
  return (
    <>
      <Modal
        show={modalProps.modalshow}
        onHide={() => {
          modalProps.handleModalShowHide(false);
        }}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog"
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header>
          <Modal.Title></Modal.Title>
          <Button
            className="btn btn-outline-primary btnStyle"
            id="BulkHealthFileUploadCancel"
            style={{ float: "right", marginLeft: "650px" }}
            onClick={() => {
              modalProps.handleModalShowHide(false);
            }}
          >
            Close
          </Button>
        </Modal.Header>
        <Modal.Body>
          {modalProps.showDocVersion()}
          {/* <TableComponent columnName={modalProps.columnNames} rowValues={modalProps.arr} 
                isDownload={modalProps.isDownload} downloadFile={modalProps.downloadFile}/> */}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
