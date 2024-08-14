import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function FileUpload(prop) {
  return (
    <>
      <Modal
        show={prop.modalShow}
        onHide={() => {
          prop.handleModalShowHide(prop.currIndex, false);
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
            id="BulkHealthFileUploadCancel"
            style={{ float: "right", marginLeft: "650px" }}
            onClick={() => {
              prop.handleModalShowHide(prop.currIndex, false, "Close");
            }}
          >
            Close
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-md">
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    onChange={(event) =>
                      prop.handleFileUpload(event, prop.currIndex)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() =>
                    prop.uploadFile(prop.documentData, prop.currIndex)
                  }
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
