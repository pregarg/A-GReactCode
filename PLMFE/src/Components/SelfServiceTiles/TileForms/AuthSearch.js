import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";

export default function AuthSearch(modalProps) {
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
    modalProps.setSelectSearchValues({
      ...modalProps.selectSearchValues,
      [name]: value,
    });
  };

  const handleDateChange = (date, name) => {
    console.log("service_start_date-->", date, name);
    modalProps.setSelectSearchValues({
      ...modalProps.selectSearchValues,
      [name]: date,
    });
  };

  const RenderDatePickerfromDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="From Date" />
      <label htmlFor="datePicker">From Date</label>
    </div>
  );

  const RenderDatePickertoDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="To Date" />
      <label htmlFor="datePicker">To Date</label>
    </div>
  );

  const RenderDatePickeradmitPrimaryFromDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Admit Primary From Date" />
      <label htmlFor="datePicker">Admit Primary From Date</label>
    </div>
  );

  const RenderDatePickeradmitPrimaryToDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Admit Primary To Date " />
      <label htmlFor="datePicker">Admit Primary To Date</label>
    </div>
  );

  return (
    <>
      <Modal
        show={modalProps.showAuthSearch}
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
          <Modal.Title className="text-center w-100">Auth Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row my-2">
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="authorizationNumberCriteria"
                  value="authorizationNumber"
                  checked={
                    modalProps.selectedCriteria === "authorizationNumber"
                  }
                  onChange={(event) => handleCriteriaChange(event)}
                />
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="authorizationNumberVal"
                        placeholder="Authorization Number"
                        name="authorizationNumber"
                        value={
                          modalProps.selectSearchValues?.authorizationNumber ||
                          ""
                        }
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={
                          modalProps.selectedCriteria !== "authorizationNumber"
                        }
                      />
                      <label htmlFor="authorizationNumberVal">
                        Authorization Number
                      </label>
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
                        id="fromDate"
                        className="form-control example-custom-input-provider"
                        selected={modalProps.selectSearchValues?.fromDate}
                        name="fromDate"
                        onChange={(date) => {
                          handleDateChange(date, "fromDate");
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
                        customInput={<RenderDatePickerfromDate />}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="toDate"
                        className="form-control example-custom-input-provider"
                        selected={modalProps.selectSearchValues?.toDate}
                        name="toDate"
                        onChange={(date) => {
                          handleDateChange(date, "toDate");
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
                        customInput={<RenderDatePickertoDate />}
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
                  value="provider2"
                  checked={modalProps.selectedCriteria === "provider2"}
                  onChange={(event) => handleCriteriaChange(event)}
                />

                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="providerId"
                        placeholder="Enter Provider ID"
                        name="providerId2"
                        value={modalProps.selectSearchValues?.providerId2 || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "provider2"}
                      />
                      <label htmlFor="providerId2">Provider ID</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="admitPrimaryFromDate"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.admitPrimaryFromDate
                        }
                        name="admitPrimaryFromDate"
                        onChange={(date) => {
                          handleDateChange(date, "admitPrimaryFromDate");
                        }}
                        disabled={modalProps.selectedCriteria !== "provider2"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickeradmitPrimaryFromDate />}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="admitPrimaryToDate"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.admitPrimaryToDate
                        }
                        name="admitPrimaryToDate"
                        onChange={(date) => {
                          handleDateChange(date, "admitPrimaryToDate");
                        }}
                        disabled={modalProps.selectedCriteria !== "provider2"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickeradmitPrimaryToDate />}
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
                  id="sequentialIDCriteria"
                  value="sequentialID"
                  checked={modalProps.selectedCriteria === "sequentialID"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="sequentialIDCriteria">
                  2.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="sequentialIDId"
                        placeholder="Enter Sequential ID"
                        name="sequentialIDId"
                        value={
                          modalProps.selectSearchValues?.sequentialIDId || ""
                        }
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={
                          modalProps.selectedCriteria !== "sequentialID"
                        }
                      />
                      <label htmlFor="sequentialIDId">Sequential ID</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="fromDate2"
                        className="form-control example-custom-input-provider"
                        selected={modalProps.selectSearchValues?.fromDate2}
                        name="fromDate2"
                        onChange={(date) => {
                          handleDateChange(date, "fromDate2");
                        }}
                        disabled={
                          modalProps.selectedCriteria !== "sequentialID"
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
                        customInput={<RenderDatePickerfromDate />}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="toDate2"
                        className="form-control example-custom-input-provider"
                        selected={modalProps.selectSearchValues?.toDate2}
                        name="toDate2"
                        onChange={(date) => {
                          handleDateChange(date, "toDate2");
                        }}
                        disabled={
                          modalProps.selectedCriteria !== "sequentialID"
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
                        customInput={<RenderDatePickertoDate />}
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
                  id="sequentialIDCriteria2"
                  value="sequential2"
                  checked={modalProps.selectedCriteria === "sequential2"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="sequentialIDCriteria2">
                  2.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="sequentialIDId2"
                        placeholder="Enter Sequential ID"
                        name="sequentialID2"
                        value={
                          modalProps.selectSearchValues?.sequentialID2 || ""
                        }
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "sequential2"}
                      />
                      <label htmlFor="sequentialID">Sequential ID</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="admitPrimaryFromDate2"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.admitPrimaryFromDate2
                        }
                        name="admitPrimaryFromDate2"
                        onChange={(date) => {
                          handleDateChange(date, "admitPrimaryFromDate2");
                        }}
                        disabled={modalProps.selectedCriteria !== "sequential2"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickeradmitPrimaryFromDate />}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-2">
                      <ReactDatePicker
                        id="admitPrimaryToDate2"
                        className="form-control example-custom-input-provider"
                        selected={
                          modalProps.selectSearchValues?.admitPrimaryToDate2
                        }
                        name="admitPrimaryToDate2"
                        onChange={(date) => {
                          handleDateChange(date, "admitPrimaryToDate2");
                        }}
                        disabled={modalProps.selectedCriteria !== "sequential2"}
                        dateFormat="MM/dd/yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        isClearable
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        style={{ position: "relative", zIndex: "999" }}
                        customInput={<RenderDatePickeradmitPrimaryToDate />}
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
              modalProps.showAuths();
            }}
          >
            Search
          </Button>
          <Button
            className="btn btn-outline-secondary btnStyle"
            id="closeButton"
            style={{ float: "right", marginLeft: "10px" }}
            onClick={() => {
              modalProps.handleClearAuthSearch(false);
            }}
          >
            Clear
          </Button>
        </Modal.Footer>
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          {modalProps.responseData.length > 0 &&
            modalProps.authSearchTableComponent()}
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
              modalProps.handleSelectedAuth(false);
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
