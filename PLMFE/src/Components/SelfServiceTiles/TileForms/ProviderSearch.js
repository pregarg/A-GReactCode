import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

export default function ProviderSearch(modalProps) {
    const handleCriteriaChange = (event) => {
        modalProps.setSelectedCriteria(event.target.value);
        modalProps.setSelectSearchValues({});
       // modalProps.setResponseData([]);
      };
    
      const handleCriteriaChangeValue = (evnt) => {
        const { name, value } = evnt.target;
        console.log("event---->", name, value);
        modalProps.setSelectSearchValues({ ...modalProps.selectSearchValues, [name]: value });
      };

    return (
        <>
          <Modal
            show={modalProps.showProviderSearch}
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
            <Modal.Title className="text-center w-100">Provider Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row my-2">
                <div className="col-12">
                <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="searchCriteria"
                      id="ProviderIDCriteria"
                      value="ProviderID"
                      checked={modalProps.selectedCriteria === "ProviderID"}
                      onChange={(event) => handleCriteriaChange(event)}
                      
                    />
                    
                     <div className="row my-2">
                     <div className="col-xs-12 col-md-3"> 
                      <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="ProviderIDVal"
                        placeholder="Claim Number"
                        name="providerID"
                        value={modalProps.selectSearchValues?.providerID || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "ProviderID"}
                        
                      />
                      <label htmlFor="ProviderIDVal">Provider ID</label>
                    </div>
                  </div>
                      </div>
                      </div>
                      <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="searchCriteria"
                      id="NPICriteria"
                      value="NPI"
                      checked={modalProps.selectedCriteria === "NPI"}
                      onChange={(event) => handleCriteriaChange(event)}
                      
                    />
                    
                     <div className="row my-2">
                     <div className="col-xs-12 col-md-3"> 
                      <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="NPIDVal"
                        placeholder="NPI"
                        name="NPI"
                        value={modalProps.selectSearchValues?.NPI || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "NPI"}
                        
                      />
                      <label htmlFor="NPIDVal">NPI</label>
                    </div>
                  </div>
                      </div>
                      </div>
                      <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="searchCriteria"
                      id="TaxIDCriteria"
                      value="TAXID"
                      checked={modalProps.selectedCriteria === "TAXID"}
                      onChange={(event) => handleCriteriaChange(event)}
                      
                    />
                    
                     <div className="row my-2">
                     <div className="col-xs-12 col-md-3"> 
                      <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="TAXIDVal"
                        placeholder="Tax ID"
                        name="TaxID"
                        value={modalProps.selectSearchValues?.TaxID || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "TAXID"}
                        
                      />
                      <label htmlFor="TAXIDVal">Tax ID</label>
                    </div>
                  </div>
                      </div>
                      </div>
                      <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="providerFirstNameCriteria"
                  value="providerFirstName"
                  checked={modalProps.selectedCriteria === "providerFirstName"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="sequentialMemberCriteria">
                  2.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="providerFirstNameVal"
                        placeholder="Enter Provider First Name"
                        name="providerFirstName"
                        value={modalProps.selectSearchValues?.providerFirstName || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "providerFirstName"}
                      />
                      <label htmlFor="providerFirstNameVal">Provider First Name</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="providerLastNameVal"
                    placeholder="Enter Provider Last Name"
                    name="providerLastName"
                    value={modalProps.selectSearchValues?.providerLastName || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "providerFirstName"}
                    
                  />
                  <label htmlFor="providerLastNameVal">Provider Last Name</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="cityVal"
                    placeholder="Enter City"
                    name="city"
                    value={modalProps.selectSearchValues?.city || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "providerFirstName"}
                    
                  />
                  <label htmlFor="cityVal">City</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="stateVal"
                    placeholder="Enter State"
                    name="state"
                    value={modalProps.selectSearchValues?.state || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "providerFirstName"}
                  />
                  <label htmlFor="stateVal">State</label>
                    </div>
                  </div>
                </div>
                    </div>
                    <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="providerFirstNameCriteria2"
                  value="providerFirstName2"
                  checked={modalProps.selectedCriteria === "providerFirstName2"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="sequentialMemberCriteria">
                  2.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="providerFirstNameVal2"
                        placeholder="Enter Provider First Name"
                        name="providerFirstName2"
                        value={modalProps.selectSearchValues?.providerFirstName2 || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "providerFirstName2"}
                      />
                      <label htmlFor="providerFirstNameVal2">Provider First Name</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="providerLastNameVal2"
                    placeholder="Enter Provider Last Name"
                    name="providerLastName2"
                    value={modalProps.selectSearchValues?.providerLastName2 || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "providerFirstName2"}
                    
                  />
                  <label htmlFor="providerLastNameVal2">Provider Last Name</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="stateVal2"
                    placeholder="Enter State"
                    name="state2"
                    value={modalProps.selectSearchValues?.state2 || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "providerFirstName2"}
                  />
                  <label htmlFor="stateVal2">State</label>
                    </div>
                  </div>
                </div>
                    </div>
                    <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="facilityNameCriteria"
                  value="facilityName"
                  checked={modalProps.selectedCriteria === "facilityName"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="sequentialMemberCriteria">
                  2.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="facilityNameVal"
                        placeholder="Enter Provider First Name"
                        name="facilityName"
                        value={modalProps.selectSearchValues?.facilityName || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "facilityName"}
                      />
                      <label htmlFor="facilityNameVal">Facility Name</label>
                    </div>
                  </div>
                  
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="facilityCityVal"
                    placeholder="Enter City"
                    name="facilitycity"
                    value={modalProps.selectSearchValues?.facilitycity || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "facilityName"}
                    
                  />
                  <label htmlFor="facilityCityVal">City</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="facilityStateVal"
                    placeholder="Enter State"
                    name="facilityState"
                    value={modalProps.selectSearchValues?.facilityState || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "facilityName"}
                  />
                  <label htmlFor="facilityStateVal">State</label>
                    </div>
                  </div>
                </div>
                    </div>
                    <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="facilityNameCriteria2"
                  value="facilityName2"
                  checked={modalProps.selectedCriteria === "facilityName2"}
                  onChange={(event) => handleCriteriaChange(event)}
                />
                {/* <label className="form-check-label" htmlFor="sequentialMemberCriteria">
                  2.
                </label> */}
                <div className="row my-2">
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="facilityNameVal2"
                        placeholder="Enter Facility Name"
                        name="facilityName2"
                        value={modalProps.selectSearchValues?.facilityName2 || ""}
                        onChange={(event) => handleCriteriaChangeValue(event)}
                        disabled={modalProps.selectedCriteria !== "facilityName2"}
                      />
                      <label htmlFor="facilityNameVal2">Facility Name</label>
                    </div>
                  </div>
                  
                  <div className="col-xs-12 col-md-3">
                    <div className="form-floating mb-3">
                    <input
                    type="text"
                    className="form-control"
                    id="facilityStateVal2"
                    placeholder="Enter State"
                    name="facilityState2"
                    value={modalProps.selectSearchValues?.facilityState2 || ""}
                    onChange={(event) => handleCriteriaChangeValue(event)}
                    disabled={modalProps.selectedCriteria !== "facilityName2"}
                  />
                  <label htmlFor="facilityStateVal2">State</label>
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
              modalProps.showProviders();
            }}
          >
            Search
          </Button>
          <Button
            className="btn btn-outline-secondary btnStyle"
            id="closeButton"
            style={{ float: "right", marginLeft: "10px" }}
            onClick={() => {
              modalProps.handleClearClaimSearch(false);
            }}
          >
            Clear
          </Button>
        </Modal.Footer>
        {/* <div style={{overflowX:'auto',maxWidth:'100%'}}>{modalProps.responseData.length>0 &&
                      modalProps.claimSearchTableComponent()
                    }</div> */}
          <br></br>
        {/* {modalProps.responseData.length>0 && (
          <Button
            className="btn btn-outline-primary btnStyle" id="selectedAddressCancel"
            style={{ display: "flex", justifyContent: "center", width: "20%", margin: "auto" }}
            onClick={() => { modalProps.handleSelectedAddress(false);
            }}>
            Populate Data
          </Button>
        )} */}
        <br />
        <br />
      </Modal>
    </>
  );
}