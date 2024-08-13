import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function GridModal(show) {
  const [modalState, setModalState] = useState(show.modalShow);
  //console.log("Inside GridModal: ",show);
  return (
    <>
      <Modal
        show={show.modalShow ? show.modalShow : modalState}
        //onHide={()=>console.log("Modal Hide getting called")}
        //onHide={()=>{console.log("Hide"); show.handleModalChange(false); setModalState(false); show.deleteTableRows(show.dataIndex,show.gridName,show.operationValue); show.decreaseDataIndex();}}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog"
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        animation={false}
        centered
      >
        <Modal.Header style={{ background: "var(--primary)" }}>
          <label
            style={{
              color: "var(--white-shade)",
              fontSize: "var(--font-size-large)",
              fontWeight: 600,
            }}
          >
            {show.name ? show.name : ""}
          </label>
        </Modal.Header>
        <Modal.Body>
          {(show.operationValue === "Add" || show.operationValue === "Edit") &&
            show.tdDataReplica(show.dataIndex)}
        </Modal.Body>
        <Modal.Footer
          style={{
            display:
              show?.handleValidateAddressModalChange === true ? "none" : "",
          }}
        >
          {show.lockStatus !== "V" && (
            <button
              className="providerPageButton button"
              onClick={() => {
                if (
                  Object.values(show.validationObject).keys() &&
                  Object.values(show.validationObject).some(
                    (val) => val === true,
                  )
                ) {
                  console.log("Inside validation error");
                  if (show.gridName === "TypeTable") {
                    alert("Please enter NPI to save the Data");
                  }
                } else {
                  show.handleModalChange(false);
                  setModalState(false);
                  show.gridRowsFinalSubmit(
                    show.gridName,
                    show.dataIndex,
                    show.operationValue,
                  );
                }
              }}
              style={{ float: "left" }}
            >
              Save & Close
            </button>
          )}

          <button
            className="providerPageButton button"
            onClick={() => {
              show.handleModalChange(false);
              setModalState(false);
              show.deleteTableRows(
                show.dataIndex,
                show.gridName,
                show.operationValue,
              );
              show.decreaseDataIndex();
            }}
            style={{ float: "left" }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
