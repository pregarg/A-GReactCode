import React, { useState, useRef, useEffect } from "react";
// import axios from 'axios';
import { useAxios } from "../../../api/axios.hook";
import Select from "react-select";
import GridModal from "./GridModal";
import { Button } from "react-bootstrap";
import ValidateAddressModal from "../TileFormModals/ValidateAddressModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { baseURL } from "../../../api/baseURL";
import { BeatLoader } from "react-spinners";
import { Modal } from "react-bootstrap";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";

const override = {
  display: "block",
  position: "fixed",
  top: "40%",
  left: "40%",
  zIndex: "1000",
  margin: "0 auto",
};

export default function LocationTable({
  locationTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridFieldChange,
  modifyValidatedAddressRow,
  calledFormName,
  gridRowsFinalSubmit,
  selectJson,
  lockStatus,
  fetchAutoPopulate,
  editTableRows,
  gridFieldTempState,
  dbaNameFacAnci,
  transactionType,
  apiTestState,
}) {
  LocationTable.displayName = "LocationTable";

  const { customAxios: axios } = useAxios();

  const [dataIndex, setDataIndex] = useState();

  const [isInvalid, setIsInvalid] = useState(false);

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const [validateAddressModal, setValidateAddressModalShow] = useState(false);

  const [locationSelection, setLocationSelection] = useState();

  const { getGridJson, convertToCase, acceptNumbersOnly } = useGetDBTables();
  const { getCountyFromMaster, handlePhoneNumber } = useUpdateDecision();
  const [showLoader, setShowLoader] = useState(false);
  const [isTouched, setIsTouched] = useState({});

  let oldAdd = useRef({});

  let validatedAdd = useRef({});

  let stateOptions = [];

  const electronicHealthOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  const publicTransportationOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  const handicapAccessOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  // const placeInDirectoryOptions = [
  //     { value: 'Y', label: 'Yes' },
  //     { value: 'N', label: 'No' }
  // ];
  const addressTypeOptions = [];
  const tddHearingOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];
  const telemedicineOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];
  let languagesOptions = [];

  let hourOptions = [];

  // let endpoints = [
  //     apiUrl+'/master/languages',
  //     apiUrl+'/master/stateSymbol',
  //     apiUrl+'/master/gridHours'
  //   ];
  const [tdd, setTdd] = useState(null);
  const [tddPhone, setTddPhone] = useState(null);

  // useEffect(()=>{
  //     if(!!tdd && tdd.value == 'Y'){
  //         setIsTouched({...isTouched, ttyPhone: true})
  //     }else{
  //         setIsTouched({...isTouched, ttyPhone: false})
  //     }
  // },[tdd])

  useEffect(() => {
    if (
      !!tdd &&
      tdd.value == "Y" &&
      (!tddPhone || acceptNumbersOnly(tddPhone) === "")
    ) {
      setIsInvalid(true);
      setIsTouched({ ...isTouched, tddPhone: true });
    } else {
      setIsInvalid(false);
      setIsTouched({ ...isTouched, tddPhone: false });
    }
  }, [tdd, tddPhone]);
  useEffect(() => {
    const data = getGridJson(gridFieldTempState);
    if (
      apiTestState?.delegated?.value === "Yes" &&
      (transactionType === "Add a Provider" ||
        transactionType === "Add a Facility" ||
        transactionType === "Add an Ancillary")
    ) {
      let validateAddressDataFields = {
        // locationName:
        //   data?.hasOwnProperty("locationName") &&
        //   data?.locationName?.value !== ""
        //     ? false
        //     : true,
        address1:
          data?.hasOwnProperty("address1") && data?.address1?.value !== ""
            ? false
            : true,
        city:
          data?.hasOwnProperty("city") && data?.city?.value !== ""
            ? false
            : true,
        county:
          data?.hasOwnProperty("county") && data?.county?.value !== ""
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
        officePhoneNumber:
          data?.hasOwnProperty("officePhoneNumber") &&
          data?.officePhoneNumber?.value !== ""
            ? false
            : true,
      };
      setIsTouched(validateAddressDataFields);
    } else {
      setIsTouched({
        ...isTouched,
        locationName: false,
        address1: false,
        city: false,
        county: false,
        stateValue: false,
        zipCode: false,
        officePhoneNumber: false,
      });
    }
  }, [modalShow]);

  const handleFieldBlur = (fieldName, fieldValue) => {
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

  const handleValidateAddressModalChange = (flag) => {
    setValidateAddressModalShow(flag);
  };

  const validateAddress = (index, flag) => {
    let locationState = locationTableRowsData;
    //let oldAddress = locationTableRowsData[index];
    let oldAddress = { ...gridFieldTempState };
    oldAdd.current = oldAddress;
    let Arrayofnames = [
      "address1~Address",
      "city~City",
      "stateValue~State",
      "zipCode~ZipCode",
    ];
    var ValidateFlag = false;
    var MissingFields = [];
    console.log("oldAddress: ", oldAddress);
    Arrayofnames.map((elem) => {
      console.log("missing", oldAddress);
      let el = elem.split("~");
      console.log("missing1", el[0], oldAddress[el[0]]);
      if (!(el[0] in oldAddress) || oldAddress[el[0]].value === "") {
        ValidateFlag = true;
        console.log("missing2", el[1]);
        MissingFields.push(el[1]);
      }
    });

    if (ValidateFlag) {
      alert("Please enter " + MissingFields + " details.");
    } else {
      /*if ((!('address1' in oldAddress) || oldAddress['address1'].value === '') ||
            (!('city' in oldAddress) || oldAddress['city'].value === '') ||
            (!('stateValue' in oldAddress) || oldAddress['stateValue'].value === '') ||
            (!('zipCode' in oldAddress) || oldAddress['zipCode'].value === '')) {
            alert("Enter address details");
        }*/
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
      //     let validateAddressDetails2 = {};
      //     validateAddressDetails2.address1 ='4201 w rochelle ave';
      //     validateAddressDetails2.city = 'las vegas';
      //     validateAddressDetails2.state = 'nv';
      //     validateAddressDetails2.zipCode = '89103';
      setShowLoader(true);
      axios
        .post(validateApiUrl, validateAddressDetails, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("all workItems: ", res.data);
          setShowLoader(false);
          if (res.status === 200) {
            if (res.data["address1"] === null || res.data["city"] === null) {
              alert(
                "Address can not be validated. Please enter correct address details."
              );
            } else {
              validateAddressDetails.address1 = res.data["address1"];
              validateAddressDetails.city = res.data["city"];
              validateAddressDetails.stateValue = res.data["state"];
              validateAddressDetails.zipCode = res.data["zipCode"];
              validateAddressDetails.address2 =
                res.data["address2"] !== "" ? res.data["address2"] : "";
              let newZipCode = res.data["zipCode"].split("-");
              //validateAddressDetails.county = (oldAddress['county'].value !== '') ? oldAddress['county'].value: getCountyFromMaster(res.data['state'],newZipCode[0]);
              validateAddressDetails.county =
                "county" in oldAddress &&
                oldAddress.county.value !== undefined &&
                oldAddress["county"].value !== ""
                  ? oldAddress.county.value
                  : getCountyFromMaster(res.data["state"], newZipCode[0]);

              //locationState[index] = validateAddressDetails;
              console.log(
                "newValidatedAddress locationState: ",
                validateAddressDetails
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

  const callModifyValidatedAddressRow = (index, flag) => {
    console.log("Inside callModifyValidatedAddressRow flag: ", flag);
    console.log("Inside callModifyValidatedAddressRow: ", validatedAdd.current);
    const oldAdd = { ...gridFieldTempState };
    console.log("thid------>", oldAdd);
    const mappedoldAdd = {};

    if (locationSelection == "new") {
      modifyValidatedAddressRow(index, { ...oldAdd, ...validatedAdd.current });
    } else {
      modifyValidatedAddressRow(index, oldAdd);
    }

    setValidateAddressModalShow(flag);
  };

  const validateAddressData = () => {
    const oldAd = oldAdd.current;
    const newAdd = validatedAdd.current;
    console.log("Inside validateAddressData oldAddress: ", oldAdd.current);
    console.log(
      "Inside validateAddressData newAddress: ",
      validatedAdd.current
    );
    return (
      <>
        <label className="validatAddressLabel">Form Address:</label>
        <table class="table table-striped table-bordered dashboardTableBorder ">
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
        <table class="table table-striped table-bordered dashboardTableBorder ">
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

  const tdDataReplica = (index) => {
    const data = getGridJson(gridFieldTempState);
    console.log("Location Data: ", data);

    selectJson["languageArray"].map((val) =>
      languagesOptions.push({ value: val, label: val })
    );
    selectJson["stateOptions"].map((val) =>
      stateOptions.push({ value: val, label: val })
    );
    selectJson["addressTypeOptions"].map((val) =>
      addressTypeOptions.push({ value: val, label: val })
    );

    return (
      <>
        <form novalidate>
          <div className="container AddProviderLabel AddModalLabel">
            <div className="row">
              <div className="col-xs-6 col-md-6">
                <label>Medical Group Name</label>

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
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    );
                    handleFieldBlur("locationName", evnt?.target?.value);
                  }}
                  //Added by NG on 01/24/2023 to make locationName mandatory and should be as DBA Name
                  onBlur={() => {
                    if (
                      ((transactionType == "Add a Facility" ||
                        transactionType == "Add an Ancillary" ||
                        transactionType == "Ancillary/Facility Modification") &&
                        !!data.locationName &&
                        !!dbaNameFacAnci &&
                        data.locationName.value != dbaNameFacAnci) ||
                      data.locationName === ""
                    ) {
                      setIsTouched({ ...isTouched, locationName: true });
                    } else {
                      setIsTouched({ ...isTouched, locationName: false });
                    }
                  }}
                  //Till here
                  name="locationName"
                  className="form-control"
                  disabled={lockStatus !== "N"}
                />
                {(transactionType == "Add a Facility" ||
                  transactionType == "Add an Ancillary" ||
                  transactionType == "Ancillary/Facility Modification") &&
                  (isTouched.locationName ||
                    !data.locationName ||
                    data.locationName === "") && (
                    <div style={{ color: "black" }}>
                      It is required and should be same as DBA Name.
                    </div>
                  )}

                {transactionType == "Add a Provider" &&
                  isTouched.locationName && (
                    <div style={{ color: "red", fontSize: "80%" }}>
                      Medical Group Name is required.
                    </div>
                  )}
              </div>

              <div className="col-xs-6 col-md-6">
                <label>Languages Spoken</label>

                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  value={
                    "languages" in data && data.languages.value !== undefined
                      ? data.languages.value
                      : data.languages
                  }
                  onChange={(selectValue, event) =>
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    )
                  }
                  options={languagesOptions}
                  name="languages"
                  id="languagesDropDown"
                  isDisabled={lockStatus !== "N"}
                  isClearable
                  isMulti={true}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-xs-6 col-md-6">
                <label>NPI</label>

                <input
                  maxLength="10"
                  type="text"
                  value={
                    "npi" in data && data.npi.value !== undefined
                      ? acceptNumbersOnly(data.npi.value)
                      : acceptNumbersOnly(data.npi)
                  }
                  onChange={(evnt) =>
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    )
                  }
                  name="npi"
                  className="form-control"
                  disabled={lockStatus !== "N"}
                />
              </div>

              <div className="col-xs-6 col-md-6">
                <label>Address Type</label>

                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  value={data.addressType}
                  onChange={(selectValue, event) =>
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    )
                  }
                  options={addressTypeOptions}
                  name="addressType"
                  id="addressTypeDropDown"
                  isDisabled={lockStatus !== "N"}
                  isClearable
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-xs-6 col-md-6">
                <label>Address</label>

                <input
                  maxLength="100"
                  type="text"
                  value={
                    "address1" in data && data.address1.value !== undefined
                      ? convertToCase(data.address1.value)
                      : convertToCase(data.address1)
                  }
                  onChange={(evnt) => {
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    );
                    handleFieldBlur("address1", evnt?.target?.value);
                  }}
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

                <input
                  maxLength="100"
                  type="text"
                  value={
                    "address2" in data && data.address2.value !== undefined
                      ? convertToCase(data.address2.value)
                      : convertToCase(data.address2)
                  }
                  onChange={(evnt) =>
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    )
                  }
                  name="address2"
                  className="form-control"
                  disabled={lockStatus !== "N"}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-xs-6 col-md-3">
                <label>City</label>

                <input
                  maxLength="50"
                  type="text"
                  value={
                    "city" in data && data.city.value !== undefined
                      ? convertToCase(data.city.value)
                      : convertToCase(data.city)
                  }
                  onChange={(evnt) => {
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    );
                    handleFieldBlur("city", evnt?.target?.value);
                  }}
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

              <div className="col-xs-6 col-md-3">
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
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    );
                    handleFieldBlur("county", evnt?.target?.value);
                  }}
                  name="county"
                  className="form-control"
                  disabled={lockStatus !== "N"}
                />
                {isTouched.county && (
                  <div style={{ color: "red", fontSize: "80%" }}>
                    County is Mandatory.
                  </div>
                )}
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
                  onChange={(selectValue, event) => {
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    );

                    handleFieldBlur("stateValue", selectValue?.value);
                  }}
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

              <div className="col-xs-6 col-md-3">
                <label>Zip Code</label>

                <input
                  maxLength="10"
                  type="text"
                  value={
                    "zipCode" in data && data.zipCode.value !== undefined
                      ? acceptNumbersOnly(data.zipCode.value)
                      : acceptNumbersOnly(data.zipCode)
                  }
                  onChange={(evnt) => {
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    );

                    handleFieldBlur(
                      "zipCode",
                      acceptNumbersOnly(evnt?.target?.value)
                    );
                  }}
                  name="zipCode"
                  className="form-control"
                  disabled={lockStatus !== "N"}
                />
                {isTouched.zipCode && (
                  <div style={{ color: "red", fontSize: "80%" }}>
                    ZipCode is Mandatory.
                  </div>
                )}
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-xs-6 col-md-3">
                <label>Electronic Health Record</label>

                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  value={
                    data.electronicHealthRecord !== undefined
                      ? data.electronicHealthRecord.value === "Y"
                        ? {
                            label: "YES",
                            value: data.electronicHealthRecord.value,
                          }
                        : data.electronicHealthRecord.value === "N"
                        ? {
                            label: "NO",
                            value: data.electronicHealthRecord.value,
                          }
                        : data.electronicHealthRecord
                      : data.electronicHealthRecord
                  }
                  onChange={(selectValue, event) =>
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    )
                  }
                  options={electronicHealthOptions}
                  name="electronicHealthRecord"
                  id="electronicHealthRecordDropDown"
                  isDisabled={lockStatus !== "N"}
                  isClearable
                />
              </div>
              <div className="col-xs-6 col-md-3">
                <label>Office Phone Number</label>
                <br />
                <input
                  maxLength="14"
                  autoComplete="off"
                  type="text"
                  onChange={(evnt) => {
                    console.log("On change of Office phone number")
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    );
                    handleFieldBlur(
                      "officePhoneNumber",
                      acceptNumbersOnly(evnt?.target?.value)
                    );
                  }}
                  onBlur={(evnt) => {
                    handleGridFieldChange(index, evnt, LocationTable.displayName) 
                  }}

                  value={
                    "officePhoneNumber" in data &&
                    data.officePhoneNumber.value !== undefined
                      ? handlePhoneNumber(data.officePhoneNumber.value)
                      : handlePhoneNumber(data.officePhoneNumber)
                  }
                  // onBlur={() =>
                  //   handleFieldBlur(
                  //     "officePhoneNumber",
                  //     data?.officePhoneNumber?.value
                  //   )
                  // }
                  name="officePhoneNumber"
                  id="officePhoneNumber"
                  className="form-control"
                  disabled={lockStatus !== "N"}
                />
                {isTouched.officePhoneNumber && (
                  <div style={{ color: "red", fontSize: "80%" }}>
                    PhoneNumber is Mandatory.
                  </div>
                )}
              </div>

              <div className="col-xs-6 col-md-3">
                <label>Office Fax Number</label>
                <br />
                <input
                  maxLength="14"
                  autoComplete="off"
                  type="text"
                  value={
                    "officeFaxNumber" in data &&
                    data.officeFaxNumber.value !== undefined
                      ? handlePhoneNumber(data.officeFaxNumber.value)
                      : handlePhoneNumber(data.officeFaxNumber)
                  }
                  onChange={(evnt) =>
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    )
                  }
                  onBlur={(evnt) =>
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    )
                  }
                  name="officeFaxNumber"
                  
                  className="form-control"
                  disabled={lockStatus !== "N"}
                />
              </div>

              <div className="col-xs-6 col-md-3">
                <label>Public Transportation</label>
                <br />
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  value={
                    data.publicTransportation !== undefined
                      ? data.publicTransportation.value === "Y"
                        ? {
                            label: "YES",
                            value: data.publicTransportation.value,
                          }
                        : data.publicTransportation.value === "N"
                        ? {
                            label: "NO",
                            value: data.publicTransportation.value,
                          }
                        : data.publicTransportation
                      : data.publicTransportation
                  }
                  onChange={(selectValue, event) =>
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    )
                  }
                  options={publicTransportationOptions}
                  name="publicTransportation"
                  id="publicTransportationDropDown"
                  isDisabled={lockStatus !== "N"}
                  isClearable
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-xs-6 col-md-3">
                <label>Handicap Access</label>
                <br />
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  value={
                    data.handicapAccess !== undefined
                      ? data.handicapAccess.value === "Y"
                        ? { label: "YES", value: data.handicapAccess.value }
                        : data.handicapAccess.value === "N"
                        ? { label: "NO", value: data.handicapAccess.value }
                        : data.handicapAccess
                      : data.handicapAccess
                  }
                  onChange={(selectValue, event) =>
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    )
                  }
                  options={handicapAccessOptions}
                  name="handicapAccess"
                  id="handicapAccessDropDown"
                  isDisabled={lockStatus !== "N"}
                  isClearable
                />
              </div>
              <div className="col-xs-6 col-md-3">
                <label>TTY Hearing</label>
                <br />
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  value={
                    data.tddHearing !== undefined
                      ? data.tddHearing.value === "Y"
                        ? { label: "YES", value: data.tddHearing.value }
                        : data.tddHearing.value === "N"
                        ? { label: "NO", value: data.tddHearing.value }
                        : data.tddHearing
                      : data.tddHearing
                  }
                  onChange={(selectValue, event) => {
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    );
                    setTdd(selectValue);
                    setTddPhone(data?.tddPhone?.value);
                  }}
                  options={tddHearingOptions}
                  name="tddHearing"
                  id="tddHearingDropDown"
                  isDisabled={lockStatus !== "N"}
                  isClearable
                />
              </div>

              <div
                className={`col-xs-6 col-md-3 needs-validation ${
                  isInvalid ? "was-validated" : ""
                }`}
              >
                <label>TTY Phone</label>
                <br />
                <input
                  maxLength="14"
                  type="text"
                  value={
                    "tddPhone" in data && data.tddPhone.value !== undefined
                      ? handlePhoneNumber(data.tddPhone.value)
                      : handlePhoneNumber(data.tddPhone)
                  }
                  //Added by NG on 12/13/2023 to make tddPhone mandatory on Edit too if tddHearing is Y
                  onBlur={() => {
                    if (
                      !!data.tddHearing &&
                      data.tddHearing.value === "Y" &&
                      (!data?.tddPhone?.value || acceptNumbersOnly(data?.tddPhone?.value) === "")
                    ) {
                      setIsInvalid(true);
                      setIsTouched({ ...isTouched, tddPhone: true });
                     // handleGridFieldChange(index, evnt, LocationTable.displayName)
                    }
                    // else{
                    //   console.log("inside elese");
                    // handleGridFieldChange(index, evnt, LocationTable.displayName)
                    // }
                  }}
                  //Till here
                  onChange={(evnt) => {
                    handleGridFieldChange(
                      index,
                      evnt,
                      LocationTable.displayName
                    );
                    setTddPhone(evnt.target.value);
                  }}
                  name="tddPhone"
                  className="form-control"
                  autoComplete="off"
                  //Changed by NG on 12/13/2023
                  //required={(!!tdd && tdd.value == 'Y') ? true : false}
                  required={
                    !!data.tddHearing &&
                    data.tddHearing.value === "Y" &&
                    (!tddPhone || acceptNumbersOnly(tddPhone) === "")
                  }
                  disabled={lockStatus !== "N"}
                />
                <div className="invalid-feedback">This field is required</div>
              </div>

              <div className="col-xs-6 col-md-3">
                <label>Tele Medicine</label>
                <br />
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  value={
                    data.telemedicine !== undefined
                      ? data.telemedicine.value === "Y"
                        ? { label: "YES", value: data.telemedicine.value }
                        : data.telemedicine.value === "N"
                        ? { label: "NO", value: data.telemedicine.value }
                        : data.telemedicine
                      : data.telemedicine
                  }
                  options={telemedicineOptions}
                  onChange={(selectValue, event) => {
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    );
                  }}
                  name="telemedicine"
                  id="teleMedicine"
                  isDisabled={lockStatus !== "N"}
                  isClearable
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-xs-6 col-md-3">
                <label>Place In Directory</label>

                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontWeight: "lighter",
                    }),
                  }}
                  name="placeInDirectory"
                  isClearable
                  className="basic-multi-select"
                  options={[
                    { label: "Yes", value: "Y" },
                    { label: "No", value: "N" },
                  ]}
                  id="placeInDirectoryDropdown"
                  onChange={(selectValue, event) =>
                    handleGridSelectChange(
                      index,
                      selectValue,
                      event,
                      LocationTable.displayName
                    )
                  }
                  //   value={data.placeInDirectory}
                  value={
                    data.placeInDirectory !== undefined
                      ? data.placeInDirectory.value === "Y"
                        ? { label: "YES", value: data.placeInDirectory.value }
                        : data.placeInDirectory.value === "N"
                        ? { label: "NO", value: data.placeInDirectory.value }
                        : data.placeInDirectory
                      : data.placeInDirectory
                  }
                  //   defaultValue={{ label: "YES", value: "YES" }}
                  //   placeholder="Place In Directory"

                  isDisabled={lockStatus !== "N"}
                  isSearchable={
                    document.documentElement.clientHeight >
                    document.documentElement.clientWidth
                      ? false
                      : true
                  }
                />
              </div>
            </div>

            <br />

            {/* <br/>
            </div>
            <br/> */}
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
            {/* <br/>
            <br/>
             <div className = "container bg-light border border-5 rounded border border-primary">
               <br/>
               <div className = "row">
                   <div className="col-xs-6 col-md-3">
                   <label>Monday From</label>

                   <Select
                       value={data.mondayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "mondayFrom"
                       id = "mondayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Monday To</label>

                   <Select
                       value={data.mondayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "mondayTo"
                       id = "mondayToDropDown"
                   />
                   </div>
                    <div className="col-xs-6 col-md-3">
                   <label>Tuesday From</label>

                   <Select
                       value={data.tuesdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "tuesdayFrom"
                       id = "tuesdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Tuesday To</label>

                   <Select
                       value={data.tuesdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "tuesdayTo"
                       id = "tuesdayToDropDown"
                   />
                   </div>
               </div>
               <br/>

               <div className = "row">


                   <div className="col-xs-6 col-md-3">
                   <label>Wednesday From</label>

                   <Select
                       value={data.wednesdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "wednesdayFrom"
                       id = "wednesdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Wednesday To</label>

                   <Select
                       value={data.wednesdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "wednesdayTo"
                       id = "wednesdayToDropDown"
                   />
                   </div>
                     <div className="col-xs-6 col-md-3">
                   <label>Thursday From</label>

                   <Select
                       value={data.thursdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "thursdayFrom"
                       id = "thursdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Thursday To</label>

                   <Select
                       value={data.thursdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "thursdayTo"
                       id = "thursdayToDropDown"
                   />
                   </div>
               </div>
               <br/>

               <div className = "row">

                   <div className="col-xs-6 col-md-3">
                   <label>Friday From</label>

                   <Select
                       value={data.fridayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "fridayFrom"
                       id = "fridayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Friday To</label>

                   <Select
                       value={data.fridayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "fridayTo"
                       id = "fridayToDropDown"
                   />
                   </div>
                     <div className="col-xs-6 col-md-3">
                   <label>Saturday From</label>

                   <Select
                       value={data.saturdayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "saturdayFrom"
                       id = "saturdayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Saturday To</label>

                   <Select
                       value={data.saturdayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "saturdayTo"
                       id = "saturdayToDropDown"
                   />
                   </div>
               </div>
               <br/>

               <div className = "row">

                   <div className="col-xs-6 col-md-3">
                   <label>Sunday From</label>
                   <br />
                   <Select
                       value={data.sundayFrom}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "sundayFrom"
                       id = "sundayFromDropDown"
                   />
                   </div>
                   <div className="col-xs-6 col-md-3">
                   <label>Sunday To</label>

                   <Select
                       value={data.sundayTo}
                       onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, LocationTable.displayName))}
                       options={hourOptions}
                       name = "sundayTo"
                       id = "sundayToDropDown"
                   />
                   </div>
               </div>
           <br/>
          </div> */}
          </div>
        </form>
      </>
    );
    //}
  };

  const tdData = () => {
    // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
    //     if(res[0].status === 200){
    //         res[0].data.map(element => languagesOptions.push({value : element, label: element}));
    //     }
    //     if(res[1].status === 200){
    //         res[1].data.map(element => stateOptions.push({value : element, label: element}));
    //     }
    //     if(res[2].status === 200){
    //         res[2].data.map(element => hourOptions.push({value : element, label: element}));
    //     }
    //  })
    //  .catch((err) => {
    //     console.log(err.message);
    //     alert("Error in getting data");
    //  });
    //console.log('Inside tdData specialityArray',specialityArray);
    if (
      locationTableRowsData !== undefined &&
      locationTableRowsData.length > 0
    ) {
      return locationTableRowsData.map((data, index) => {
        //const {fullName, emailAddress, salary, specialityDefault}= data;
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
                  {" "}
                  <button
                    className="deleteBtn"
                    style={{ float: "left" }}
                    onClick={() => {
                      deleteTableRows(
                        index,
                        LocationTable.displayName,
                        "Force Delete"
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
                          editTableRows(index, LocationTable.displayName);
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
                      editTableRows(index, LocationTable.displayName);
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
            {/* <td className='tableData'>
                        {(('tddHearing' in data) && (data.tddHearing.value !== undefined)) ? (data.tddHearing.label) : (data.tddHearing)}
                    </td>
                    <td className='tableData'>
                        {(('tddPhone' in data) && (data.tddPhone.value !== undefined)) ? (data.tddPhone.value) : (data.tddPhone)}
                    </td> */}
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
    setIsInvalid(false);
    setTdd(null);
    setTddPhone(null);
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    //console.log("Inside setDataIndex: ",index);
    setDataIndex(index);
  };

  return (
    <>
      <table className="table table-bordered tableLayout" id="LocationTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus == "N" ? (
              <th style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(LocationTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(locationTableRowsData.length);
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
            <th scope="col">Medical Group Name</th>
            <th scope="col">Address 1</th>
            <th scope="col">Address 2</th>
            <th scope="col">City</th>
            <th scope="col">County</th>
            <th scope="col">State</th>
            <th scope="col">Zip Code</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows LocationTableRowsData={LocationTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>
      {modalShow && (
        <GridModal
          name={"Location Details"}
          validationObject={isTouched}
          modalShow={modalShow}
          handleModalChange={handleModalChange}
          dataIndex={dataIndex}
          tdDataReplica={tdDataReplica}
          deleteTableRows={deleteTableRows}
          gridName={LocationTable.displayName}
          decreaseDataIndex={decreaseDataIndex}
          operationValue={operationValue}
          gridRowsFinalSubmit={gridRowsFinalSubmit}
          handleValidateAddressModalChange={validateAddressModal}
          lockStatus={lockStatus}
        ></GridModal>
      )}

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
