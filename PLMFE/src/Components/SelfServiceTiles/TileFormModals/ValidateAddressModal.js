import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function ValidateAddressModal(prop) {
    console.log("Inside ValidateAddressModal: ",prop);
  return (
    <>
        <Modal
            show={prop.validateAddressModal}
            onHide={()=>{prop.handleValidateAddressModalChange(false);}}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-dialog"
            size="lg"
            aria-labelledby="example-custom-modal-styling-title"
            centered
        >
        <Modal.Header>
          <Modal.Title></Modal.Title>
          <Button className='btn btn-outline-primary btnStyle' id='BulkHealthFileUploadCancel'
            style={{float:"right", marginLeft: "650px"}} onClick={()=>{prop.handleValidateAddressModalChange(false);}}>
            Close</Button>
        </Modal.Header>
        <Modal.Body>
          {(prop.validateAddressModal) && prop.validateAddressData()}
        </Modal.Body>
        <Modal.Footer>
            <Button className='btn btn-outline-primary btnStyle' onClick={()=>{prop.callModifyValidatedAddressRow(prop.dataIndex,false)}}>
            Select</Button>
        </Modal.Footer>
        </Modal>
    </>
  )
}
