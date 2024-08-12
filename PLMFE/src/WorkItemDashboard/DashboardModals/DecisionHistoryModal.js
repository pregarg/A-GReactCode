import { Button, Modal } from "react-bootstrap";
import useGetDBTables from "../../Components/CustomHooks/useGetDBTables";

export default function DecisionHistoryModal(prop) {

    const handleModalShowHide = (flagValue) => {
        prop.setModalShow({...prop.modalShow,'HistoryModal':flagValue});
    }

    const {convertToCase} = useGetDBTables();

    const gridData = () => {
        let data = [...prop.decisionGrid];
        data = data[prop.clickedIndex];
        return (
            <form>
                <fieldset disabled>
                    <div className="container">
                            <div className="row my-2">
                                <div className="col-xs-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="userName" placeholder="" name="userName"
                                        value={(('userName' in data) && (data.userName.value !== undefined)) ? (convertToCase(data.userName.value)) : (convertToCase(data.userName))}/>
                                        <label htmlFor="userName">User Name</label>
                                    </div>
                                </div>

                                <div className="col-xs-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="workstepName" placeholder="" name="workstepName"
                                        value={(('workstepName' in data) && (data.workstepName.value !== undefined)) ? (convertToCase(data.workstepName.value)) : (convertToCase(data.workstepName))}/>
                                        <label htmlFor="workstepName">Workstep Name</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row my-2">
                                <div className="col-xs-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="caseDec" placeholder=""  name="caseDec"
                                        value={(('caseDecision' in data) && (data.caseDecision.value !== undefined)) ? (convertToCase(data.caseDecision.value)) : (convertToCase(data.caseDecision))}/>
                                        <label htmlFor="caseDec">Case Decision</label>
                                    </div>
                                </div>

                                <div className="col-xs-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="entryDateTime" placeholder="" name="entryDateTime"
                                        value={(('entryDateTime' in data) && (data.entryDateTime.value !== undefined)) ? (prop.formatDecHistDate(data.entryDateTime.value)) : (prop.formatDecHistDate(data.entryDateTime))}/>
                                        <label htmlFor="entryDateTime">Entry Date Time</label>
                                    </div>
                                </div>




                                <div className="col-xs-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="exitDateTime" placeholder="" name="exitDateTime"
                                        value={(('exitDateTime' in data) && (data.exitDateTime.value !== undefined)) ? (prop.formatDecHistDate(data.exitDateTime.value)) : (prop.formatDecHistDate(data.exitDateTime))}/>
                                        <label htmlFor="exitDateTime">Exit Date Time</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row my-2">
                                <div className="col-xs-6 col-md-12">
                                    <div className="form-floating">
                                        <textarea type="text" className="form-control" id="caseNotes" name="caseNotes"
                                        value={(('caseDecNotes' in data) && (data.caseDecNotes.value !== undefined)) ? (data.caseDecNotes.value) : (data.caseDecNotes)}
                                        style={{height:"auto",width:"100%"}}/>
                                        <label htmlFor="caseNotes">Case Decision Notes</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                </fieldset>
            </form>
        )
    }
    return(
        <>
            <Modal
                show={prop.modalShow.HistoryModal}
                onHide={()=>{prop.handleModalShowHide(prop.currIndex,false);}}
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
                style={{float:"right", marginLeft: "650px"}} onClick={()=>{handleModalShowHide(false);}}>
                Close</Button>
            </Modal.Header>
            <Modal.Body>
                {gridData()}
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
            </Modal>
        </>
    )
}