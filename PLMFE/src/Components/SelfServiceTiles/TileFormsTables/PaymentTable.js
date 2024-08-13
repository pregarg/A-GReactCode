import React, { useState } from "react";
// import axios from 'axios';
import { useAxios } from "../../../api/axios.hook";
import Select from "react-select";
import GridModal from "./GridModal";
import { getAuthToken } from "../../../util/auth";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";

export default function PaymentTable({
  paymentTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridFieldChange,
  lockStatus,
  gridRowsFinalSubmit,
  editTableRows,
  gridFieldTempState,
}) {
  PaymentTable.displayName = "PaymentTable";
  //const [dataIndex,setDataIndex] = useState({operation:'',modalIndex:0});
  const [dataIndex, setDataIndex] = useState();
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  //const apiUrl = 'http://localhost:8081/api';
  const { customAxios: axios } = useAxios();
  console.log("Lockstatus of Payment Table", lockStatus);

  let stateOptions = [];
  const [isTouched, setIsTouched] = useState({});

  const validateGridInputs = (evnt) => {
    console.log("GRIDNPI", evnt.target.value.length);
    let inputLength = evnt.target.value.length;
    console.log("Inside validateGridInputs isTouched==== ", isTouched);
    if (inputLength > 9 || inputLength === 0) {
      console.log("Inside validateGridInputs isTouched if1==== ", isTouched);
      //if(isTouched.npi)
      //{
      console.log("Inside validateGridInputs isTouched if2==== ", isTouched);
      setIsTouched({ ...isTouched, npi: false });
      //}
    }
  };

  const { getGridJson, convertToCase, acceptNumbersOnly } = useGetDBTables();
  const { handlePhoneNumber } = useUpdateDecision();
  // let endpoints = [
  //     //apiUrl+'/master/stateSymbol'
  //   ];
  const stateMaster = useSelector((store) => store.masterStateSymbol);
  //console.log("stateMaster :",stateMaster);
  const tdDataReplica = (index) => {
    //if(paymentTableRowsData!==undefined && paymentTableRowsData.length>0){
    const data = getGridJson(gridFieldTempState);
    stateMaster?.[0]?.map((val) =>
      stateOptions.push({ value: val.stateSymbol, label: val.stateSymbol }),
    ); //Added by Nidhi

    // axios.all(endpoints.map((endpoint) => axios.get(endpoint, {headers:{'Authorization': 'Bearer ' + getAuthToken()}}))).then((res) => {
    //     // if(res[0].status === 200){
    //     //     res[0].data.map(element => stateOptions.push({value : element, label: element}));
    //     // }
    //  })
    //  .catch((err) => {
    //     console.log(err.message);
    //     alert("Error in getting data");
    //  });

    //console.log("Hiiiiiiiiii",isTouched, (!data.orgName||(data.orgName&&!data.orgName.value)), (isTouched.orgName===true), ((!data.orgName||(data.orgName&&!data.orgName.value))&&(isTouched.orgName===true)));
    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Organization Name
              </label>
              <br />
              <input
                maxLength="100"
                type="text"
                value={
                  "orgName" in data && data.orgName.value !== undefined
                    ? convertToCase(data.orgName.value)
                    : convertToCase(data.orgName)
                }
                onBlur={() => {
                  if (!isTouched.orgName) {
                    setIsTouched({ ...isTouched, orgName: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, orgName: evnt.target.value });
                }}
                name="orgName"
                className={`form-control ${(!data.orgName || (data.orgName && !data.orgName.value)) && isTouched.orgName === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Organization Name"
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Facility Name
              </label>
              <br />
              <input
                maxLength="100"
                type="text"
                value={
                  "facilityName" in data &&
                  data.facilityName.value !== undefined
                    ? convertToCase(data.facilityName.value)
                    : convertToCase(data.facilityName)
                }
                onBlur={() => {
                  if (!isTouched.facilityName) {
                    setIsTouched({ ...isTouched, facilityName: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({
                    ...isTouched,
                    facilityName: evnt.target.value,
                  });
                }}
                name="facilityName"
                className={`form-control ${(!data.facilityName || (data.facilityName && !data.facilityName.value)) && isTouched.facilityName === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Facility Name"
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                TIN
              </label>
              <br />
              <input
                maxLength="9"
                type="tel"
                value={
                  "tin" in data && data.tin.value !== undefined
                    ? convertToCase(data.tin.value)
                    : convertToCase(data.tin)
                }
                onBlur={() => {
                  if (!isTouched.tin) {
                    setIsTouched({ ...isTouched, tin: true });
                  }
                }}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, tin: evnt.target.value });
                }}
                id="tin"
                disabled={lockStatus !== "N"}
                //  placeholder="9xx-xx-xxxx" pattern="[9]{1}[0-9]{2}-[0-9]{2}-[0-9]{4}"
                name="tin"
                className={`form-control ${(!data.tin || (data.tin && !data.tin.value)) && isTouched.tin === true ? "is-invalid" : ""}`}
                title="Please Enter Valid TIN"
              />
              {/* <small>Format: 9xx-xx-xxxx</small> */}
            </div>
            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Group NPI
              </label>
              <br />
              <input
                maxLength="10"
                type="tel"
                value={
                  "groupNPI" in data && data.groupNPI.value !== undefined
                    ? convertToCase(data.groupNPI.value)
                    : convertToCase(data.groupNPI)
                }
                onBlur={() => {
                  if (!isTouched.groupNPI) {
                    setIsTouched({ ...isTouched, groupNPI: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, groupNPI: evnt.target.value });
                }}
                id="groupNPI"
                name="groupNPI"
                className={`form-control ${(!data.groupNPI || (data.groupNPI && !data.groupNPI.value)) && isTouched.groupNPI === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Group NPI"
              />
              {/* <small>Format: xxxxxxxxxx</small> */}
            </div>
          </div>
          <br />

          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Address
              </label>
              <br />
              <input
                maxLength="100"
                type="text"
                value={
                  "address1" in data && data.address1.value !== undefined
                    ? convertToCase(data.address1.value)
                    : convertToCase(data.address1)
                }
                onBlur={() => {
                  if (!isTouched.address1) {
                    setIsTouched({ ...isTouched, address1: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, address1: evnt.target.value });
                }}
                id="address1"
                name="address1"
                className={`form-control ${(!data.address1 || (data.address1 && !data.address1.value)) && isTouched.address1 === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Address"
              />
            </div>

            <div className="col-xs-6 col-md-6">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Address2
              </label>
              <br />
              <input
                maxLength="100"
                type="text"
                value={
                  "address2" in data && data.address2.value !== undefined
                    ? convertToCase(data.address2.value)
                    : convertToCase(data.address2)
                }
                //onBlur={()=>{ if(!isTouched.address2){setIsTouched({...isTouched, address2: true})}}}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, address2: evnt.target.value });
                }}
                id="address2"
                name="address2"
                disabled={lockStatus !== "N"}
                className={`form-control ${(!data.address2 || (data.address2 && !data.address2.value)) && isTouched.address2 === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Address"
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                City
              </label>
              <br />
              <input
                maxLength="50"
                type="text"
                value={
                  "city" in data && data.city.value !== undefined
                    ? convertToCase(data.city.value)
                    : convertToCase(data.city)
                }
                onBlur={() => {
                  if (!isTouched.city) {
                    setIsTouched({ ...isTouched, city: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, city: evnt.target.value });
                }}
                id="city"
                name="city"
                className={`form-control ${(!data.city || (data.city && !data.city.value)) && isTouched.city === true ? "is-invalid" : ""}`}
                title="Please Enter Valid City"
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>State</label>
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.stateValue}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    PaymentTable.displayName,
                  )
                }
                options={stateOptions}
                name="stateValue"
                id="stateValueDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Zip Code
              </label>
              <br />
              <input
                maxLength="5"
                type="text"
                value={
                  "zipCode" in data && data.zipCode.value !== undefined
                    ? acceptNumbersOnly(data.zipCode.value)
                    : acceptNumbersOnly(data.zipCode)
                }
                onBlur={() => {
                  if (!isTouched.zipCode) {
                    setIsTouched({ ...isTouched, zipCode: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, zipCode: evnt.target.value });
                }}
                id="zipCode"
                name="zipCode"
                className={`form-control ${(!data.zipCode || (data.zipCode && !data.zipCode.value)) && isTouched.zipCode === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Zip Code"
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Phone Number
              </label>
              <br />
              <input
                maxLength="14"
                type="text"
                value={
                  "phoneNo" in data && data.phoneNo.value !== undefined
                    ? handlePhoneNumber(data.phoneNo.value)
                    : handlePhoneNumber(data.phoneNo)
                }
                onBlur={() => {
                  if (!isTouched.phoneNo) {
                    setIsTouched({ ...isTouched, phoneNo: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, phoneNo: evnt.target.value });
                }}
                id="phoneNo"
                name="phoneNo"
                className={`form-control ${(!data.phoneNo || (data.phoneNo && !data.phoneNo.value)) && isTouched.phoneNo === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Phone Number"
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Medicare Number
              </label>
              <br />
              <input
                maxLength="10"
                type="tel"
                value={
                  "medicareNo" in data && data.medicareNo.value !== undefined
                    ? data.medicareNo.value
                    : data.medicareNo
                }
                onBlur={() => {
                  if (!isTouched.medicareNo) {
                    setIsTouched({ ...isTouched, medicareNo: true });
                  }
                }}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, medicareNo: evnt.target.value });
                }}
                id="medicareNo"
                name="medicareNo"
                className={`form-control ${(!data.medicareNo || (data.medicareNo && !data.medicareNo.value)) && isTouched.medicareNo === true ? "is-invalid" : ""}`}
                title="Please Enter Valid Medicare Number"
              />
            </div>
            {/* <div className="col-xs-6 col-md-3">
                   <label style={{marginBottom: 3, fontSize: 'var(--font-size-small)'}}>NPI</label>
                            <br />
                            <input maxLength="10" type="text" value={(('npi' in data) && (data.npi.value !== undefined)) ? (acceptNumbersOnly(data.npi.value)) : (acceptNumbersOnly(data.npi))}
                                onBlur={()=>{ if(!isTouched.npi){setIsTouched({...isTouched, npi: true})}}}
                                onChange={(evnt)=>{handleGridFieldChange(index, evnt,PaymentTable.displayName); setIsTouched({...isTouched, npi: evnt.target.value})}}
                                id="npi" name="npi" className={`form-control ${((!data.npi||(data.npi&&!data.npi.value))&&(isTouched.npi===true))?"is-invalid":""}`}
                                title="Please Enter Valid Phone Number"/>
                   </div> */}

            <div className="col-xs-6 col-md-3">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                NPI
              </label>
              <br />
              <input
                maxLength="10"
                type="text"
                value={
                  "npi" in data && data.npi.value !== undefined
                    ? acceptNumbersOnly(data.npi.value)
                    : acceptNumbersOnly(data.npi)
                }
                onBlur={(evnt) => validateGridInputs(evnt)}
                disabled={lockStatus !== "N"}
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PaymentTable.displayName);
                  setIsTouched({ ...isTouched, npi: true });
                }}
                id="npi"
                name="npi"
                className={`form-control ${(!data.npi || (data.npi && !data.npi.value)) && isTouched.npi === true ? "is-invalid" : ""}`}
                title="Please Enter NPI number"
              />
              {!!data.npi &&
              data.npi.value.length < 10 &&
              data.npi.value.length > 0 ? (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  NPI should be exactly 10-digit
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    //console.log("Inside tdData");
    if (paymentTableRowsData !== undefined && paymentTableRowsData.length > 0) {
      //console.log("PaymentTable Data: ",paymentTableRowsData);
      return paymentTableRowsData.map((data, index) => {
        //const {fullName, emailAddress, salary, specialityDefault}= data;
        return (
          <tr key={index}>
            {lockStatus == "N" ? (
              <td>
                <span
                  style={{
                    display: "flex",
                  }}
                >
                  <button
                    className="deleteBtn"
                    style={{ float: "left" }}
                    onClick={() => {
                      deleteTableRows(
                        index,
                        PaymentTable.displayName,
                        "Force Delete",
                      );
                      handleOperationValue("Force Delete");
                      decreaseDataIndex();
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, PaymentTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(index);
                      handleOperationValue("Edit");
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </span>
              </td>
            ) : (
              <td>
                <div>
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, PaymentTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(index);
                      handleOperationValue("Edit");
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                </div>
              </td>
            )}
            <td>
              {"orgName" in data && data.orgName.value !== undefined
                ? convertToCase(data.orgName.value)
                : convertToCase(data.orgName)}
            </td>
            <td>
              {"facilityName" in data && data.facilityName.value !== undefined
                ? convertToCase(data.facilityName.value)
                : convertToCase(data.facilityName)}
            </td>
            <td>
              {"tin" in data && data.tin.value !== undefined
                ? convertToCase(data.tin.value)
                : convertToCase(data.tin)}
            </td>
            <td>
              {"groupNPI" in data && data.groupNPI.value !== undefined
                ? convertToCase(data.groupNPI.value)
                : convertToCase(data.groupNPI)}
            </td>
          </tr>
        );
      });
    }
  };

  const decreaseDataIndex = () => {
    if (operationValue === "Add" || operationValue === "Force Delete") {
      const indx = dataIndex - 1;
      setDataIndex(indx);
    }
  };

  const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
  };

  const handleModalChange = (flag) => {
    // setDataIndex({
    //     ...dataIndex,
    //     ...opertnData
    // });
    //console.log("Handle Modal Change Data Index After: ",dataIndex);
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    //console.log("Inside setDataIndex: ",index);
    setDataIndex(index);
  };

  return (
    <>
      <table className="table table-bordered tableLayout" id="PaymentTable">
        <thead>
          <tr>
            {lockStatus == "N" ? (
              <th scope="col" style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(PaymentTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(paymentTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            ) : (
              <th style={{ width: "6%" }}></th>
            )}
            <th scope="col">Organization Name</th>
            <th scope="col">Facility Name</th>
            <th scope="col">TIN</th>
            <th scope="col">Group NPI</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows PaymentTableRowsData={PaymentTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>
      {paymentTableRowsData !== undefined &&
      paymentTableRowsData.length <= 0 ? (
        <div className="invalid-feedback" style={{ display: "block" }}>
          Atleast one entry is required
        </div>
      ) : null}
      <GridModal
        name={"Payment Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={PaymentTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
      ></GridModal>
    </>
  );
}
