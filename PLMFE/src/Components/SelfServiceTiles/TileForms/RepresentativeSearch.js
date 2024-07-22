import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";

export default function RepresentativeSearch(modalProps) {
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
  
  const RenderDatePickerforDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="For Date" />
      <label htmlFor="datePicker">For Date</label>
    </div>
  );

 
  return (
    <>
      <Modal
        show={modalProps.showRepresentativeSearch}
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
        <Modal.Title className="text-center w-100">Representative Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row my-2">
            <div className="col-12">
            <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="SequentialMemberCriteria"
                  value="SequentialMember"
                  checked={modalProps.selectedCriteria === "SequentialMember"}
                  onChange={(event) => handleCriteriaChange(event)}
                  
                />
                 <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                 
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="SequentialMemberIDVal"
                    placeholder="Authorization Number"
                    name="SequentialMemberID"
                    value={modalProps.selectSearchValues?.SequentialMemberID || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "SequentialMember"}
                    
                  />
                  <label htmlFor="SequentialMemberIDVal">Sequential Member ID</label>
                </div>
              </div>
                  </div>
                  </div>

                  <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="searchTypeCriteria"
                  value="searchType"
                  checked={modalProps.selectedCriteria === "searchType"}
                  onChange={(event) => handleCriteriaChange(event)}
                  
                />
                 <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                 
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="searchTypeIDVal"
                    placeholder="Search Type"
                    name="searchTypeID"
                    value={modalProps.selectSearchValues?.searchTypeID || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "searchType"}
                    
                  />
                  <label htmlFor="searchTypeIDVal">Search Type</label>
                </div>
              </div>
                  </div>
                  </div>
                  <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="fordateCriteria"
                  value="fordate"
                  checked={modalProps.selectedCriteria === "fordate"}
                  onChange={(event) => handleCriteriaChange(event)}
                  
                />
                 <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                  <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="fordateID"
                        className="form-control example-custom-input-provider"
                        selected={modalProps.selectSearchValues?.fordateID}
                        name="fordateID"
                        onChange={(date) => {
                          handleDateChange(date, "fordateID");
                        }}
                        disabled={modalProps.selectedCriteria !== "fordate"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickerforDate />}
                      />
                    </div>
              </div>
                  </div>
                  </div>

                  <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="AddressTypeCriteria"
                  value="AddressType"
                  checked={modalProps.selectedCriteria === "AddressType"}
                  onChange={(event) => handleCriteriaChange(event)}
                  
                />
                 <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                 
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="AddressTypeIDVal"
                    placeholder="Address Type"
                    name="AddressTypeID"
                    value={modalProps.selectSearchValues?.AddressTypeID || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "AddressType"}
                    
                  />
                  <label htmlFor="AddressTypeIDVal">Address Type</label>
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
              modalProps.showRepresentatives();
            }}
          >
            Search
          </Button>
          <Button
            className="btn btn-outline-secondary btnStyle"
            id="closeButton"
            style={{ float: "right", marginLeft: "10px" }}
            onClick={() => {
              modalProps.handleClearRepresentativeSearch(false);
            }}
          >
            Clear
          </Button>
        </Modal.Footer>
        <div style={{overflowX:'auto',maxWidth:'100%'}}>{modalProps.responseData.length>0 &&
                      modalProps.representativeSearchTableComponent()
                    }</div>
          <br></br>
        {modalProps.responseData.length>0 && (
          <Button
            className="btn btn-outline-primary btnStyle" id="selectedAddressCancel"
            style={{ display: "flex", justifyContent: "center", width: "20%", margin: "auto" }}
            onClick={() => { modalProps.handleSelectedRepresentatives(false);
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
