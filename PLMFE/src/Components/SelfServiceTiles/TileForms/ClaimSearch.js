import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";

export default function ClaimSearch(modalProps) {
  console.log("Modal props==== ", modalProps);
  const navigate = useNavigate();

  const handleCriteriaChange = (event) => {
    modalProps.setSelectedCriteria(event.target.value);
    modalProps.setSelectSearchValues({});
    modalProps.setResponseData([]);
    modalProps.setSelectedAddress([]);
  };

  const handleCriteriaChangeValue = (evnt) => {
    const { name, value } = evnt.target;
    console.log("event---->", name, value);
    modalProps.setSelectSearchValues({
      ...modalProps.selectSearchValues,
      [name]: value,
    });
  };

  const handleDateChange = (date, name) => {
    console.log(name, "changed to", date);
    if (!date) {
      modalProps.setSelectSearchValues({
        ...modalProps.selectSearchValues,
        [name]: date,
      });
      return; 
    }
    const serviceStartDate = modalProps.selectSearchValues?.Service_Start_Date;
    const serviceEndDate = modalProps.selectSearchValues?.Service_End_Date;
    const serviceStartDate2 = modalProps.selectSearchValues?.Service_Start_Date2;
    const serviceEndDate2 = modalProps.selectSearchValues?.Service_End_Date2;
    const newDate = new Date(date);

    if (name === "Service_End_Date" && serviceStartDate) {
      const startDate = new Date(serviceStartDate);
      if (newDate < startDate) {
        alert("Service End Date cannot be earlier than Service Start Date.");
        return;
      }
    } else if (name === "Service_Start_Date" && serviceEndDate) {
      const endDate = new Date(serviceEndDate);
      if (newDate > endDate) {
        alert("Service Start Date cannot be later than Service End Date.");
        return;
      }
    }
  
    if (name === "Service_End_Date2" && serviceStartDate2) {
      const startDate2 = new Date(serviceStartDate2);
      if (newDate < startDate2) {
        alert("Service End Date cannot be earlier than Service Start Date.");
        return;
      }
    } else if (name === "Service_Start_Date2" && serviceEndDate2) {
      const endDate2 = new Date(serviceEndDate2);
      if (newDate > endDate2) {
        alert("Service Start Date cannot be later than Service End Date.");
        return;
      }
    }
    modalProps.setSelectSearchValues({
      ...modalProps.selectSearchValues,
      [name]: date,
    });
  };
  
 
  const RenderDatePickerServiceStartDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Service Start Date" />
      <label htmlFor="datePicker">Service Start Date</label>
    </div>
  );

  const RenderDatePickerServiceEndDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Service End Date" />
      <label htmlFor="datePicker">Service End Date</label>
    </div>
  );

  return (
    <>
      <Modal
        show={modalProps.showClaimSearch}
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
          <Modal.Title className="text-center w-100">Claim Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row my-2">
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="claimNumberCriteria"
                  value="claimNumber"
                  checked={modalProps.selectedCriteria === "claimNumber"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="claimNumberCriteria">
                  1.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="claimNumberVal"
                        placeholder="Claim Number"
                        name="claimNumber"
                        value={modalProps.selectSearchValues?.claimNumber || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "claimNumber"}
                      />
                      <label htmlFor="claimNumberVal">Claim Number</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="sequentialMemberCriteria"
                  value="sequentialMember"
                  checked={modalProps.selectedCriteria === "sequentialMember"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="sequentialMemberCriteria">
                  2.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="sequentialMemberId"
                        placeholder="Enter Sequential Member ID"
                        name="sequentialMemberId"
                        value={
                          modalProps.selectSearchValues?.sequentialMemberId ||
                          ""
                        }
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={
                          modalProps.selectedCriteria !== "sequentialMember"
                        }
                      />
                      <label htmlFor="sequentialMemberId">
                        Sequential Member ID
                      </label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="serviceStartDate"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.Service_Start_Date
                        }
                        name="serviceStartDate"
                        onChange={(date) => {
                          handleDateChange(date, "Service_Start_Date");
                        }}
                        disabled={
                          modalProps.selectedCriteria !== "sequentialMember"
                        }
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickerServiceStartDate />}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="serviceEndDate"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.Service_End_Date
                        }
                        name="serviceEndDate"
                        onChange={(date) => {
                          handleDateChange(date, "Service_End_Date");
                        }}
                        disabled={
                          modalProps.selectedCriteria !== "sequentialMember"
                        }
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickerServiceEndDate />}
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
                  id="providerCriteria"
                  value="provider"
                  checked={modalProps.selectedCriteria === "provider"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="providerCriteria">
                  3.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="providerId"
                        placeholder="Enter Provider ID"
                        name="providerId"
                        value={modalProps.selectSearchValues?.providerId || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "provider"}
                      />
                      <label htmlFor="providerId">Provider ID</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="providerServiceStartDate"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.Service_Start_Date2
                        }
                        name="providerServiceStartDate"
                        onChange={(date) => {
                          handleDateChange(date, "Service_Start_Date2");
                        }}
                        disabled={modalProps.selectedCriteria !== "provider"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickerServiceStartDate />}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="providerServiceEndDate"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.Service_End_Date2
                        }
                        name="providerServiceEndDate"
                        onChange={(date) => {
                          handleDateChange(date, "Service_End_Date2");
                        }}
                        disabled={modalProps.selectedCriteria !== "provider"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickerServiceEndDate />}
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
              modalProps.showClaims();
            }}
          >
            Search
          </Button>
          <Button
            className="btn btn-outline-secondary btnStyle"
            id="closeButton"
            style={{ float: "right", marginLeft: "10px" }}
            onClick={() => {
              modalProps.handleClearSearch(false);
            }}
          >
            Clear
          </Button>
        </Modal.Footer>
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          {modalProps.responseData.length > 0 &&
            modalProps.claimSearchTableComponent()}
        </div>
        <br></br>
        {modalProps.responseData.length > 0 && (
          <Button
            className="btn btn-outline-primary btnStyle"
            id="selectedAddressCancel"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "20%",
              margin: "auto",
            }}
            onClick={() => {
              modalProps.handleSelectedAddress(false);
            }}
          >
            Populate Data
          </Button>
        )}
        <br />
        <br />
      </Modal>
    </>
  );
}
