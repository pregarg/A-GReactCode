import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import ReactDatePicker from "react-datepicker";

export default function ClaimSearch(modalProps) {
  console.log("Modal props==== ",modalProps);
  const navigate = useNavigate();
  //const [tableVisible,setTableVisible] = useState(false);
  // const [selectedCriteria, setSelectedCriteria] = useState("claimNumber");

  const handleCriteriaChange = (event) => {
    modalProps.setSelectedCriteria(event.target.value);
    modalProps.setSelectSearchValues([]);
    modalProps.setResponseData([]);
    
  };
  const handleCriteriaChangeValue = (evnt) => {
    // modalProps.setSelectSearchValues(event.target.value);
    
    const {name , value} = evnt.target;
    console.log("event---->",name,value )
    modalProps.setSelectSearchValues({...modalProps.selectSearchValues,[name]:value});
  };
  const handleDateChange = (date, name) => {
    console.log("service_start_date-->",date,name )
    modalProps.setSelectSearchValues({ ...modalProps.selectSearchValues, [name]: date });
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
        onHide={() => { modalProps.handleCloseClaimSearch(false); }}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog"
        size="xl"
               //     fullscreen={true}
                    style={{width: '100%', margin: 'auto' }}
                    aria-labelledby="example-custom-modal-styling-title"
                    centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Claim Search</Modal.Title>
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
                   onChange={(event)=>handleCriteriaChange(event)}
                />
                <label className="form-check-label" htmlFor="claimNumberCriteria">
                  Claim Number
                </label>
              </div>
              {modalProps.selectedCriteria === "claimNumber" && (
                <div className="row my-2">
                  <div className="col-xs-12 col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control uppercase-input"
                        id="claimNumberVal"
                        placeholder="Enter Claim Number"
                        name="claimNumber"
                       // value={modalProps.selectedCriteria?.claimNumber}
                        onChange={(event)=>handleCriteriaChangeValue(event)}
                      />
                      <label htmlFor="claimNumber">Claim Number</label>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="sequentialMemberCriteria"
                  value="sequentialMember"
                  checked={modalProps.selectedCriteria === "sequentialMember"}
                  onChange={(event)=>handleCriteriaChange(event)}
                />
                <label className="form-check-label" htmlFor="sequentialMemberCriteria">
                  Sequential Member ID, Service Start Date, Service End Date
                </label>
              </div>
              {modalProps.selectedCriteria === "sequentialMember" && (
                <>
                  <div className="row my-2">
                    <div className="col-xs-12 col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="sequentialMemberId"
                          placeholder="Enter Sequential Member ID"
                          name="sequentialMemberId"
                          onChange={(event)=>handleCriteriaChangeValue(event)}
                        />
                        <label htmlFor="sequentialMemberId">Sequential Member ID</label>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <div className="form-floating mb-3">
                       
                                    <div style={{}}>
                                    <ReactDatePicker
                                        id="serviceStartDate"
                                        className="form-control example-custom-input-provider"
                                        selected={modalProps.selectSearchValues.Service_Start_Date}
                                        name="serviceStartDate"
                                        onChange={(date) => {handleDateChange(date, "Service_Start_Date")}}
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerServiceStartDate />}
                                    />
                                </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <div className="form-floating mb-3">
                      <div style={{}}>
                                    <ReactDatePicker
                                        id="serviceEndDate"
                                        className="form-control example-custom-input-provider"
                                        selected={modalProps.selectSearchValues.Service_End_Date}
                                        name="serviceEndDate"
                                        onChange={(date, event) => {

                                            handleDateChange(date, "Service_End_Date")
                                            
                                        }}
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerServiceEndDate />}
                                    />
                                </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchCriteria"
                  id="providerCriteria"
                  value="provider"
                  checked={modalProps.selectedCriteria === "provider"}
                  onChange={(event)=>handleCriteriaChange(event)}
                />
                <label className="form-check-label" htmlFor="providerCriteria">
                  Provider ID, Service Start Date, Service End Date
                </label>
              </div>
              {modalProps.selectedCriteria === "provider" && (
                <>
                  <div className="row my-2">
                    <div className="col-xs-12 col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="providerId"
                          placeholder="Enter Provider ID"
                          name="providerId"
                          //value={modalProps.selectedCriteria?.providerId}
                          onChange={(event)=>handleCriteriaChangeValue(event)}
                        />
                        <label htmlFor="providerId">Provider ID</label>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <div className="form-floating mb-3">
                        <div style={{}}>
                                    <ReactDatePicker
                                        id="providerServiceStartDate"
                                        className="form-control example-custom-input-provider"
                                        selected={modalProps.selectSearchValues.Service_Start_Date}
                                        name="providerServiceStartDate"
                                        onChange={(date, event) => {

                                            handleDateChange(date, "Service_Start_Date")
                                            
                                        }}
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerServiceStartDate />}
                                    />
                                </div>
                        
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <div className="form-floating mb-3">
            
                        <div style={{}}>
                                    <ReactDatePicker
                                        id="providerServiceEndDate"
                                        className="form-control example-custom-input-provider"
                                        selected={modalProps.selectSearchValues.Service_End_Date}
                                        name="providerServiceEndDate"
                                        onChange={(date, event) => {

                                            handleDateChange(date, "Service_End_Date")
                                            
                                        }}
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerServiceEndDate />}
                                    />
                                </div>
                      </div>
                    </div>
                  </div>
                 
                </>
              )}
            </div>
            
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button
            className='btn btn-outline-primary btnStyle'
            id='searchButton'
            style={{ float: "right" }}
            onClick={() => { 
              modalProps.showAddresses();
            }}
          >
            Search
            
          </Button>
          <Button
            className='btn btn-outline-secondary btnStyle'
            id='closeButton'
            style={{ float: "right", marginLeft: "10px" }}
            onClick={() => { modalProps.handleClearClaimSearch(false); }}
          >
            Clear
          </Button>     
        </Modal.Footer>
        <div style={{overflowX:'auto',maxWidth:'100%'}}>{modalProps.responseData.length>0 &&
                      modalProps.showTableComponent()
                    }</div>
          <br></br>
            {modalProps.responseData.length>0 && 
                  <Button className='btn btn-outline-primary btnStyle' id='selectedAddressCancel'
                style={{display: 'flex', justifyContent: 'center',width:'20%',marginLeft:'450px'}} onClick={()=>{modalProps.handleSelectedAddress(false);}}>
                Populate Data</Button>
             }

                <br></br>
                <br></br>
      </Modal>
    </>
  );
}
