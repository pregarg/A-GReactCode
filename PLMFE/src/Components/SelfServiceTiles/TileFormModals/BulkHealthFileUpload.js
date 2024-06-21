import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function (prop) {
  return (
    <>
        <Modal
            show={prop.modalShow}
            onHide={()=>{prop.handleModalShowHide(false,prop.clickedIndex);}}
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
            style={{float:"right", marginLeft: "650px"}} onClick={()=>{prop.handleModalShowHide(false,prop.clickedIndex,'close');}}>
            Close</Button>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
                <div className="col-md">
                    <div class="mb-3">
                        <input class="form-control" type="file" id="formFile" onChange={(event)=>prop.handleFileUpload(event,prop.clickedIndex)}/>
                    </div>
                    <button type="button" class="btn btn-success" onClick={()=>prop.handleModalShowHide(false,prop.clickedIndex,'upload')}>Upload</button>
                </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
        </Modal>
    </>
  )
}
