import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";

export default function MemberSearch(modalProps) {
  console.log("Modal props==== ", modalProps);
  const navigate = useNavigate();

  const handleCriteriaChange = (event) => {
    modalProps.setSelectedCriteria(event.target.value);
    modalProps.setSelectSearchValues({});
    modalProps.setResponseData([]);
  };

  const handleCriteriaChangeValue = (evnt) => {
    const { name, value } = evnt.target;
    console.log("event---->", name, value);
    modalProps.setSelectSearchValues({ ...modalProps.selectSearchValues, [name]: value });
  };

  const handleDateChange = (date, name) => {
    console.log("service_start_date-->", date, name);
    modalProps.setSelectSearchValues({ ...modalProps.selectSearchValues, [name]: date });
  };
  

  const RenderDatePickerdateOfBirth = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Date Of Birth" />
      <label htmlFor="datePicker">Date Of Birth</label>
    </div>
  );

  return (
    <>
      <Modal
        show={modalProps.showMemberSearch}
        onHide={() => {
          modalProps.handleCloseSearch(false);
        }}
        backdrop="static"
        keyboard={false}
         dialogClassName="modal-dialog custom-modal"
        size="xl"
        style={{ width: "100%", margin: "auto" }}
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton className="justify-content-center">
        <Modal.Title className="text-center w-100">Member Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row my-2">
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="memberIDCriteria"
                  value="memberID"
                  checked={modalProps.selectedCriteria === "memberID"}
                  onChange={(event) => handleCriteriaChange(event)}
                  
                />
               
                 <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                 
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="memberIDVal"
                    placeholder="Member ID"
                    name="memberID"
                    value={modalProps.selectSearchValues?.memberID || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "memberID"}
                    
                  />
                  <label htmlFor="memberIDVal">Member ID</label>
                </div>
              </div>
                  </div>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="medicareIDCriteria"
                  value="medicareID"
                  checked={modalProps.selectedCriteria === "medicareID"}
                  onChange={(event) => handleCriteriaChange(event)}
                  
                />
               
                 <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                 
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="medicareIDVal"
                    placeholder="Claim Number"
                    name="medicareID"
                    value={modalProps.selectSearchValues?.medicareID || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "medicareID"}
                    
                  />
                  <label htmlFor="medicareIDVal">Medicare ID</label>
                </div>
              </div>
                  </div>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="medicaidIDCriteria"
                  value="medicaidID"
                  checked={modalProps.selectedCriteria === "medicaidID"}
                  onChange={(event) => handleCriteriaChange(event)}
                  
                />
               
                 <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                 
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="medicaidIDVal"
                    placeholder="Medicaid ID"
                    name="medicaidID"
                    value={modalProps.selectSearchValues?.medicaidID || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "medicaidID"}
                    
                  />
                  <label htmlFor="medicaidIDVal">Medicaid ID</label>
                </div>
              </div>
                  </div>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="memberFirstNameCriteria"
                  value="memberFirstName"
                  checked={modalProps.selectedCriteria === "memberFirstName"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
              
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="memberFirstNameId"
                        placeholder="Enter Member Fisrt Name"
                        name="memberFirstNameId"
                        value={modalProps.selectSearchValues?.memberFirstNameId || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "memberFirstName"}
                      />
                      <label htmlFor="memberFirstNameId">Member Fisrt Name</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="memberLastNameId"
                        placeholder="Enter Member Last Name"
                        name="memberLastNameId"
                        value={modalProps.selectSearchValues?.memberLastNameId || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "memberFirstName"}
                      />
                      <label htmlFor="memberLasttNameId">Member Last Name</label>
                    </div>
                  </div>
                 
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="dateOfBirth"
                        className="form-control example-custom-input-provider"
                        selected={modalProps.selectSearchValues?.Date_Of_Birth}
                        name="dateOfBirth"
                        onChange={(date) => {
                          handleDateChange(date, "Date_Of_Birth");
                        }}
                        disabled={modalProps.selectedCriteria !== "memberFirstName"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickerdateOfBirth />}
                      />
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="btn btn-outline-primary btnStyle"
            id="searchButton"
            style={{ float: "right" }}
            onClick={() => {
              modalProps.showMembers();
            }}
          >
            Search
          </Button>
          <Button
            className="btn btn-outline-secondary btnStyle"
            id="closeButton"
            style={{ float: "right", marginLeft: "10px" }}
            onClick={() => {
              modalProps.handleClearMemberSearch(false);
            }}
          >
            Clear
          </Button>
        </Modal.Footer>
        <div style={{overflowX:'auto',maxWidth:'100%'}}>{modalProps.responseData.length>0 &&
                      modalProps.memberSearchTableComponent()
                    }</div>
          <br></br>
        {modalProps.responseData.length>0 && (
          <Button
            className="btn btn-outline-primary btnStyle" id="selectedAddressCancel"
            style={{ display: "flex", justifyContent: "center", width: "20%", margin: "auto" }}
            onClick={() => { modalProps.handleSelectedMembers(false);
            }}>
            Populate Data
          </Button>
        )}
        <br />
        <br />
      </Modal>
    </>
  );
}
