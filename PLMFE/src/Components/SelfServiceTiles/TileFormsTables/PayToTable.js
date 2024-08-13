import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
//import axios from 'axios';
import { useAxios } from "../../../api/axios.hook";
import Select from "react-select";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { Button } from "react-bootstrap";
import ValidateAddressModal from "../TileFormModals/ValidateAddressModal";
import { baseURL } from "../../../api/baseURL";
import { BeatLoader } from "react-spinners";
import { Modal } from "react-bootstrap";
import "./PayToTable.css";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";

const override = {
  display: "block",
  position: "fixed",
  top: "40%",
  left: "40%",
  zIndex: "1000",
  margin: "0 auto",
};

export default function PayToTable({
  payToTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  selectJson,
  lockStatus,
  calledFormName,
  modifyValidatedAddressPayToRow,
  fetchAutoPopulate,
  editTableRows,
  gridFieldTempState,
  apiTestState,
  transactionType,
}) {
  PayToTable.displayName = "PayToTable";
  const { customAxios: axios } = useAxios();
  const [dataIndex, setDataIndex] = useState({ operation: "", modalIndex: 0 });
  const [isTouched, setIsTouched] = useState({});
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [locationSelection, setLocationSelection] = useState();
  const { getGridJson, convertToCase, acceptNumbersOnly } = useGetDBTables();
  const { getCountyFromMaster } = useUpdateDecision();
  const [showLoader, setShowLoader] = useState(false);

  let stateOptions = [];
  const [validateAddressModal, setValidateAddressModalShow] = useState(false);
  let oldAdd = useRef({});
  let validatedAdd = useRef({});
  const token = useSelector((state) => state.auth.token);

  const handleValidateAddressModalChange = (flag) => {
    setValidateAddressModalShow(flag);
  };

  const callModifyValidatedAddressRow = (index, flag) => {
    console.log("Inside callModifyValidatedAddressRow flag: ", flag);
    console.log("Inside callModifyValidatedAddressRow: ", validatedAdd.current);
    const oldAdd = { ...gridFieldTempState };
    console.log("thid------>" + oldAdd);
    const mappedoldAdd = {};
    /*Object.keys(oldAdd).forEach(key => {
            mappedoldAdd[key] = oldAdd[key].value;
        });*/
    if (locationSelection == "new") {
      modifyValidatedAddressPayToRow(index, {
        ...oldAdd,
        ...validatedAdd.current,
      });
    } else {
      modifyValidatedAddressPayToRow(index, oldAdd);
    }

    setValidateAddressModalShow(flag);
  };
  const handleFieldBlur = (fieldName, fieldValue) => {
    console.log(fieldValue, "ffff");
    if (
      apiTestState?.delegated?.value === "Yes" &&
      (transactionType === "Add a Provider" ||
        transactionType === "Add a Facility" ||
        transactionType === "Add an Ancillary")
    ) {
      const touched = fieldValue?.trim("") === "" || fieldValue === undefined;
      setIsTouched({ ...isTouched, [fieldName]: touched });
    }
  };
  useEffect(() => {
    const data = getGridJson(gridFieldTempState);
    if (
      apiTestState?.delegated?.value === "Yes" &&
      (transactionType === "Add a Provider" ||
        transactionType === "Add a Facility" ||
        transactionType === "Add an Ancillary")
    ) {
      let validateAddressDataFields = {
        locationName:
          data?.hasOwnProperty("locationName") &&
          data?.locationName.value !== ""
            ? false
            : true,
        taxId:
          data?.hasOwnProperty("taxId") && data?.taxId.value !== ""
            ? false
            : true,
        address1:
          data?.hasOwnProperty("address1") && data?.address1.value !== ""
            ? false
            : true,
        city:
          data?.hasOwnProperty("city") && data?.city?.value !== ""
            ? false
            : true,
        stateValue:
          data?.hasOwnProperty("stateValue") && data?.stateValue?.value !== ""
            ? false
            : true,
        zipCode:
          data?.hasOwnProperty("zipCode") && data?.zipCode?.value !== ""
            ? false
            : true,
        payToNpi:
          data?.hasOwnProperty("payToNpi") && data?.payToNpi?.value !== ""
            ? false
            : true,
      };
      setIsTouched(validateAddressDataFields);
    } else {
      setIsTouched({
        ...isTouched,
        locationName: false,
        taxId: false,
        address1: false,
        city: false,
        stateValue: false,
        zipCode: false,
        payToNpi: false,
      });
    }
  }, [modalShow]);

  const validateAddressData = () => {
    const oldAd = oldAdd.current;
    const newAdd = validatedAdd.current;
    console.log("Inside validateAddressData oldAddress: ", oldAdd.current);
    console.log(
      "Inside validateAddressData newAddress: ",
      validatedAdd.current,
    );
    return (
      <>
        <label className="validatAddressLabel">Form Address:</label>
        <table className="table table-striped table-bordered dashboardTableBorder ">
          <thead>
            <tr className="dashboardTableHeader">
              <th></th>
              <th scope="col">Address</th>
              <th scope="col">Apt/Suite</th>
              <th scope="col">City</th>
              <th scope="col">County</th>
              <th scope="col">State</th>
              <th scope="col">Zip Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "5%" }}>
                <input
                  style={{ padding: 1, margin: 1 }}
                  type="checkbox"
                  className="form-check-input"
                  onChange={() => {
                    setLocationSelection("old");
                  }}
                  checked={locationSelection == "old"}
                />
              </td>
              <td className="tableData">{oldAd.address1.value}</td>
              <td className="tableData">
                {"address2" in oldAd ? oldAd.address2.value : ""}
              </td>
              <td className="tableData">{oldAd.city.value}</td>
              <td className="tableData">
                {"county" in oldAd && oldAd.county.value !== null
                  ? oldAd.county.value
                  : ""}
              </td>
              <td className="tableData">
                {"stateValue" in oldAd && oldAd.stateValue.value !== undefined
                  ? oldAd.stateValue.value
                  : oldAd.stateValue}
              </td>
              <td className="tableData">{oldAd.zipCode.value}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />

        <label className="validatAddressLabel">USPS Address:</label>
        <table className="table table-striped table-bordered dashboardTableBorder ">
          <thead>
            <tr className="dashboardTableHeader">
              <th></th>
              <th scope="col">Address</th>
              <th scope="col">Apt/Suite</th>
              <th scope="col">City</th>
              <th scope="col">County</th>
              <th scope="col">State</th>
              <th scope="col">Zip Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "5%" }}>
                <input
                  style={{ padding: 1, margin: 1 }}
                  type="checkbox"
                  className="form-check-input"
                  onChange={() => {
                    setLocationSelection("new");
                  }}
                  checked={locationSelection == "new"}
                />
              </td>
              <td className="tableData">{newAdd.address1}</td>
              <td className="tableData">{newAdd.address2}</td>
              <td className="tableData">{newAdd.city}</td>
              <td className="tableData">{newAdd.county}</td>
              <td className="tableData">{newAdd.stateValue}</td>
              <td className="tableData">{newAdd.zipCode}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  };
  const validateAddress = (index, flag) => {
    let payToState = payToTableRowsData;
    // let oldAddress = payToTableRowsData[index];
    let oldAddress = { ...gridFieldTempState };
    oldAdd.current = oldAddress;
    console.log("oldAddress: ", oldAddress);
    let Arrayofnames = [
      "address1~Address",
      "city~City",
      "stateValue~State",
      "zipCode~ZipCode",
    ];
    var ValidateFlag = false;
    var MissingFields = [];
    Arrayofnames.map((elem) => {
      let el = elem.split("~");
      if (!(el[0] in oldAddress) || oldAddress[el[0]].value === "") {
        ValidateFlag = true;
        MissingFields.push(el[1]);
      }
    });
    if (ValidateFlag) {
      alert("Please enter " + MissingFields + " details.");
    } else {
      let validateAddressDetails = {};
      validateAddressDetails.address1 = oldAddress["address1"].value;
      validateAddressDetails.city = oldAddress["city"].value;
      validateAddressDetails.stateValue = oldAddress["stateValue"].value;
      validateAddressDetails.zipCode = oldAddress["zipCode"].value;
      if (!("address2" in oldAddress)) {
        validateAddressDetails.address2 = "";
      } else {
        validateAddressDetails.address2 = oldAddress["address2"].value;
      }
      const validateApiUrl = baseURL + "/master/validateAddress";

      setShowLoader(true);
      axios.post(validateApiUrl, validateAddressDetails).then((res) => {
        console.log("all workItems: ", res.data);
        setShowLoader(false);
        if (res.status === 200) {
          if (res.data["address1"] === null || res.data["city"] === null) {
            alert(
              "Address can not be validated. Please enter correct address details.",
            );
          } else {
            validateAddressDetails.address1 = res.data["address1"];
            validateAddressDetails.city = res.data["city"];
            validateAddressDetails.stateValue = res.data["state"];
            validateAddressDetails.zipCode = res.data["zipCode"];
            let newZipCode = res.data["zipCode"].split("-");
            //validateAddressDetails.county = (oldAddress['county'].value !== undefined && oldAddress['county'].value !== '') ? oldAddress['county'].value: getCountyFromMaster(res.data['state'],newZipCode[0]);
            validateAddressDetails.county =
              "county" in oldAddress &&
              oldAddress.county.value !== undefined &&
              oldAddress["county"].value !== ""
                ? oldAddress.county.value
                : getCountyFromMaster(res.data["state"], newZipCode[0]);

            // validateAddressDetails.address2 = res.data['address2'];
            //locationState[index] = validateAddressDetails;
            console.log(
              "newValidatedAddress locationState: ",
              validateAddressDetails,
            );
            validatedAdd.current = validateAddressDetails;
            setValidateAddressModalShow(flag);
            //modifyValidatedAddressRow(index,validateAddressDetails);
          }
        }
      });
      console.log("newValidatedAddress: ", validateAddressDetails);
    }
  };
  const tdDataReplica = (index) => {
    const data = getGridJson(gridFieldTempState);

    selectJson["stateOptions"].map((val) =>
      stateOptions.push({ value: val, label: val }),
    );

    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>Tax ID</label>
              <br />
              <input
                maxLength="10"
                type="text"
                value={
                  "taxId" in data && data.taxId.value !== undefined
                    ? convertToCase(data.taxId.value)
                    : convertToCase(data.taxId)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PayToTable.displayName);

                  handleFieldBlur("taxId", evnt?.target?.value);
                }}
                name="taxId"
                // onBlur={() => handleFieldBlur("taxId", data?.taxId?.value)}
                className="form-control"
                disabled={lockStatus !== "N"}
              />
              {isTouched.taxId && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  TaxId is Mandatory.
                </div>
              )}
            </div>
            <div className="col-xs-6 col-md-6">
              <label>Pay To Name</label>
              <br />
              <input
                maxLength="100"
                type="text"
                value={
                  "locationName" in data &&
                  data.locationName.value !== undefined
                    ? convertToCase(data.locationName.value)
                    : convertToCase(data.locationName)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PayToTable.displayName);
                  handleFieldBlur("locationName", evnt?.target?.value);
                }}
                // onBlur={() =>
                //   handleFieldBlur("locationName", data?.locationName?.value)
                // }
                name="locationName"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
              {isTouched.locationName && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  Location Name is Mandatory.
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>Address 1</label>
              <br />
              <input
                maxLength="100"
                type="text"
                value={
                  "address1" in data && data.address1.value !== undefined
                    ? convertToCase(data.address1.value)
                    : convertToCase(data.address1)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PayToTable.displayName);
                  handleFieldBlur("address1", evnt?.target?.value);
                }}
                // onBlur={() =>
                //   handleFieldBlur("address1", data?.address1?.value)
                // }
                name="address1"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
              {isTouched.address1 && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  Address is Mandatory.
                </div>
              )}
            </div>
            <div className="col-xs-6 col-md-6">
              <label>Apt/Suite</label>
              <br />
              <input
                maxLength="100"
                type="text"
                value={
                  "address2" in data && data.address2.value !== undefined
                    ? convertToCase(data.address2.value)
                    : convertToCase(data.address2)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, PayToTable.displayName)
                }
                name="address2"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>City</label>
              <br />
              <input
                maxLength="50"
                type="text"
                value={
                  "city" in data && data.city.value !== undefined
                    ? convertToCase(data.city.value)
                    : convertToCase(data.city)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PayToTable.displayName);
                  handleFieldBlur("city", evnt?.target?.value);
                }}
                // onBlur={() => handleFieldBlur("city", data?.city?.value)}
                name="city"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
              {isTouched.city && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  City is Mandatory.
                </div>
              )}
            </div>
            <div className="col-xs-6 col-md-6">
              <label>County</label>
              <br />
              <input
                maxLength="25"
                type="text"
                value={
                  "county" in data &&
                  data.county.value !== undefined &&
                  (data.county.value !== null || data.county !== null)
                    ? convertToCase(data.county.value)
                    : convertToCase(data.county)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PayToTable.displayName);
                }}
                // onBlur={() => handleFieldBlur("county", data?.county?.value)}
                name="county"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>State</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.stateValue}
                onChange={(selectValue, event) => {
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    PayToTable.displayName,
                  );
                  handleFieldBlur("stateValue", selectValue?.value);
                }}
                // onBlur={() =>
                //   handleFieldBlur("stateValue", data?.stateValue?.value)
                // }
                options={stateOptions}
                name="stateValue"
                id="stateValueDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
              {isTouched.stateValue && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  StateValue is Mandatory.
                </div>
              )}
            </div>
            <div className="col-xs-6 col-md-6">
              <label>Zip Code</label>
              <br />
              <input
                maxLength="5"
                type="text"
                value={
                  "zipCode" in data && data.zipCode.value !== undefined
                    ? acceptNumbersOnly(data.zipCode.value)
                    : acceptNumbersOnly(data.zipCode)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PayToTable.displayName);

                  handleFieldBlur(
                    "zipCode",
                    acceptNumbersOnly(evnt?.target?.value),
                  );
                }}
                name="zipCode"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
              {isTouched.zipCode && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  Zipcode is Mandatory.
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>Pay To NPI</label>
              <br />
              <input
                maxLength="10"
                type="text"
                value={
                  "payToNpi" in data && data.payToNpi.value !== undefined
                    ? acceptNumbersOnly(data.payToNpi.value)
                    : acceptNumbersOnly(data.payToNpi)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, PayToTable.displayName);

                  handleFieldBlur(
                    "payToNpi",
                    acceptNumbersOnly(evnt?.target?.value),
                  );
                }}
                name="payToNpi"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
              {isTouched.payToNpi && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  PayToNpi is Mandatory.
                </div>
              )}
            </div>
          </div>

          <br />
          <div className="row mt-2">
            <div className="col-xs-6 col-md-3">
              {calledFormName === "shouldValidate" && lockStatus == "N" && (
                <Button
                  className="btn btn-outline-primary btnStyle"
                  onClick={() => {
                    validateAddress(index, true);
                  }}
                >
                  Validate Address
                </Button>
              )}
            </div>
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    if (payToTableRowsData !== undefined && payToTableRowsData.length > 0) {
      return payToTableRowsData.map((data, index) => {
        return (
          <tr
            key={index}
            className={
              data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
            }
          >
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
                        PayToTable.displayName,
                        "Force Delete",
                      );
                      handleOperationValue("Force Delete");
                      decreaseDataIndex();
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  {fetchAutoPopulate.current === false ? (
                    <div>
                      <button
                        className="editBtn"
                        style={{ float: "right" }}
                        type="button"
                        onClick={() => {
                          editTableRows(index, PayToTable.displayName);
                          handleModalChange(true);
                          handleDataIndex(index);
                          handleOperationValue("Edit");
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </span>
              </td>
            ) : (
              // }
              // {lockStatus == 'V'
              //     &&
              <td>
                <div>
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, PayToTable.displayName);
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
            <td className="tableData">
              {"taxId" in data && data.taxId.value !== undefined
                ? convertToCase(data.taxId.value)
                : convertToCase(data.taxId)}
            </td>
            <td className="tableData">
              {"locationName" in data && data.locationName.value !== undefined
                ? convertToCase(data.locationName.value)
                : convertToCase(data.locationName)}
            </td>
            <td className="tableData">
              {"address1" in data && data.address1.value !== undefined
                ? convertToCase(data.address1.value)
                : convertToCase(data.address1)}
            </td>
            <td className="tableData">
              {"address2" in data && data.address2.value !== undefined
                ? convertToCase(data.address2.value)
                : convertToCase(data.address2)}
            </td>
            <td className="tableData">
              {"city" in data && data.city.value !== undefined
                ? convertToCase(data.city.value)
                : convertToCase(data.city)}
            </td>
            <td className="tableData">
              {"county" in data && data.county.value !== undefined
                ? convertToCase(data.county.value)
                : convertToCase(data.county)}
            </td>
            <td className="tableData">
              {"stateValue" in data && data.stateValue.value !== undefined
                ? convertToCase(data.stateValue.value)
                : convertToCase(data.stateValue)}
            </td>
            <td className="tableData">
              {"zipCode" in data && data.zipCode.value !== undefined
                ? acceptNumbersOnly(data.zipCode.value)
                : acceptNumbersOnly(data.zipCode)}
            </td>
            <td className="tableData">
              {"payToNpi" in data && data.payToNpi.value !== undefined
                ? acceptNumbersOnly(data.payToNpi.value)
                : acceptNumbersOnly(data.payToNpi)}
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
      <table className="table table-bordered tableLayout" id="PayToTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus == "N" ? (
              <th style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(PayToTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(payToTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            ) : (
              // }
              // {lockStatus == 'V'
              //     &&
              <th style={{ width: "6%" }}></th>
            )}
            <th scope="col">Tax ID</th>
            <th scope="col">Pay To Name</th>
            <th scope="col">Address 1</th>
            <th scope="col">Address 2</th>
            <th scope="col">City</th>
            <th scope="col">County</th>
            <th scope="col">State</th>
            <th scope="col">Zip Code</th>
            <th scope="col">Pay To NPI</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows PayToTableRowsData={PayToTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>
      <GridModal
        name={"Pay To Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={PayToTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        handleValidateAddressModalChange={validateAddressModal}
        lockStatus={lockStatus}
      ></GridModal>
      <Modal
        show={showLoader}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
        size="sm"
        dialogClassName="modal-dialog loader-dialog"
        centered
      >
        <BeatLoader loading={true} size={50} cssOverride={override} />
      </Modal>

      <ValidateAddressModal
        validateAddressModal={validateAddressModal}
        handleValidateAddressModalChange={handleValidateAddressModalChange}
        dataIndex={dataIndex}
        validateAddressData={validateAddressData}
        callModifyValidatedAddressRow={callModifyValidatedAddressRow}
        validAddress={validatedAdd.current}
      ></ValidateAddressModal>
    </>
  );
}

//   return (
//     <>
//         <table className="table" id="PayToTable">
//             <thead>
//                 <tr>
//                     <th><button className="btn btn-outline-success" onClick={() => (addTableRows(PayToTable.displayName))} >+</button></th>
//                     <th>Tax ID</th>
//                     <th>Location Name</th>
//                     <th>Address 1</th>
//                     <th>Address 2</th>
//                     <th>City</th>
//                     <th>State</th>
//                     <th>Zipcode</th>
//                     <th>Pay To NPI</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {/* <TableRows PayToTableRowsData={PayToTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
//                 {tdData()}
//             </tbody>
//         </table>

//     </>
//   )

// }
