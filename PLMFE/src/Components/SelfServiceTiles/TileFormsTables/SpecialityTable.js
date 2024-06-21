import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function SpecialityTable({
  specialityTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  gridRowsFinalSubmit,
  handleGridFieldChange,
  selectJson,
  lockStatus,
  handleGridOnBlur,
  handleSelectSpecialityOnBlur,
  fetchAutoPopulate,
  subSpecialityOptions,
  editTableRows,
  gridFieldTempState,
  transactionType,
  apiTestState,
}) {
  SpecialityTable.displayName = "SpecialityTable";
  const [dataIndex, setDataIndex] = useState();
  //const dataIndex = useRef();
  const [isTouched, setIsTouched] = useState({});
  const [operationValue, setOperationValue] = useState("");
  //const operationValue = useRef("");
  const [modalShow, setModalShow] = useState(false);
  //const modalShow = useState(false);

  //const apiUrl = 'http://localhost:8081/api';

  let specialtyOptions = [];
  const pcpOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  const primaryOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];
  // const subSpecialityOptions =   [
  //     { value: 'AA', label: 'AA' },
  //     { value: 'BB', label: 'BB' },
  //     { value: 'CC', label: 'CC' },
  // ];

  // let taxonomyDescOptions = [];
  const boardCertiOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];
  // const taxonomyGrpOptions = [
  //     { value: '11', label: '11' },
  //     { value: '22', label: '22' }
  // ];

  const { getGridJson, convertToCase } = useGetDBTables();

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
  useEffect(() => {
    const data = getGridJson(gridFieldTempState);
    if (
      apiTestState?.delegated?.value === "Yes" &&
      (transactionType === "Add a Facility" ||
        transactionType === "Add an Ancillary")
    ) {
      let validateAddressDataFields = {
        speciality:
          data?.hasOwnProperty("speciality") && data?.speciality.value !== ""
            ? false
            : true,
        specPrimary:
          data?.hasOwnProperty("specPrimary") && data?.specPrimary?.value !== ""
            ? false
            : true,

        taxonomyCode:
          data?.hasOwnProperty("taxonomyCode") &&
          data?.taxonomyCode?.value !== ""
            ? false
            : true,
      };

      setIsTouched(validateAddressDataFields);
    } else {
      setIsTouched({
        ...isTouched,
        speciality: false,
        specPrimary: false,
        pcp: false,
        taxonomyCode: false,
      });
    }
    if (
      apiTestState?.delegated?.value === "Yes" &&
      transactionType === "Add a Provider"
    ) {
      let validateAddressDataFields = {
        speciality:
          data?.hasOwnProperty("speciality") && data?.speciality.value !== ""
            ? false
            : true,
        specPrimary:
          data?.hasOwnProperty("specPrimary") && data?.specPrimary?.value !== ""
            ? false
            : true,
        pcp:
          data?.hasOwnProperty("pcp") && data?.pcp?.value !== "" ? false : true,

        taxonomyCode:
          data?.hasOwnProperty("taxonomyCode") &&
          data?.taxonomyCode?.value !== ""
            ? false
            : true,
      };

      setIsTouched(validateAddressDataFields);
    }
  }, [modalShow, gridFieldTempState]);
  const tdDataReplica = (index) => {
    console.log(
      "Inside specialityTableRowsData tdDataReplica: ",
      specialityTableRowsData
    );
    //if (specialityTableRowsData!==undefined && specialityTableRowsData.length > 0) {
    const data = getGridJson(gridFieldTempState);

    console.log("tdDataReplica index: ", index);
    console.log("tdDataReplica data: ", data);
    selectJson["specialtyOptions"].map((val) =>
      specialtyOptions.push({
        value: val["speciality"],
        label: val["speciality"],
      })
    );
    //selectJson['taxonomyOptions'].map(val => taxonomyDescOptions.push({value : val.taxonomycode, label: val.taxonomydesc}))
    // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
    //     if(res[0].status === 200){
    //         res[0].data.map(element => specialtyOptions.push({value : element, label: element}));
    //     }
    //  })
    //  .catch((err) => {
    //     console.log(err.message);
    //     alert("Error in getting data");
    //  });
    return (
      <>
        <div className="container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Specialty</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.speciality}
                onChange={(selectValue, event) => {
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    SpecialityTable.displayName
                  );
                  handleFieldBlur("speciality", selectValue?.value);
                }}
                options={specialtyOptions}
                name="speciality"
                id="specialityDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
              {isTouched.speciality && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  Speciality is Mandatory.
                </div>
              )}
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Sub Specialty</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.subSpeciality}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    SpecialityTable.displayName
                  )
                }
                options={
                  data.speciality
                    ? subSpecialityOptions
                    : [{ value: "", label: "" }]
                }
                name="subSpeciality"
                id="subSpecialityDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Primary</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.specPrimary}
                onChange={(selectValue, event) => {
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    SpecialityTable.displayName
                  );
                  handleFieldBlur("specPrimary", selectValue?.value);
                }}
                options={primaryOptions}
                name="specPrimary"
                id="specPrimaryDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
              {isTouched.specPrimary && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  Primary Abbreviation is Mandatory.
                </div>
              )}
            </div>

            <div className="col-xs-6 col-md-3">
              <label>PCP</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.pcp}
                onChange={(selectValue, event) => {
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    SpecialityTable.displayName
                  );
                  handleFieldBlur("pcp", selectValue?.value);
                }}
                options={pcpOptions}
                name="pcp"
                id="pcpDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
              {isTouched.pcp && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  PCP is Mandatory.
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>HSD Code</label>
              <br />

              <input
                maxLength="20"
                type="text"
                value={
                  data && "hsdCode" in data && data.hsdCode.value !== undefined
                    ? convertToCase(data.hsdCode.value)
                    : convertToCase(data.hsdCode)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    SpecialityTable.displayName
                  )
                }
                name="hsdCode"
                className="form-control"
                disabled
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Taxonomy Code</label>
              <br />
              <input
                maxLength="10"
                type="text"
                value={
                  data &&
                  "taxonomyCode" in data &&
                  data.taxonomyCode.value !== undefined
                    ? convertToCase(data.taxonomyCode.value)
                    : convertToCase(data.taxonomyCode)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(
                    index,
                    evnt,
                    SpecialityTable.displayName
                  );
                  handleFieldBlur("taxonomyCode", evnt?.target?.value);
                }}
                onBlur={(evnt) => {
                  handleGridOnBlur(index, evnt, SpecialityTable.displayName);
                }}
                name="taxonomyCode"
                disabled={lockStatus !== "N"}
                className="form-control"
              />
              {isTouched.taxonomyCode && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  Taxonomy Code is Mandatory.
                </div>
              )}
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Taxonomy Description</label>
              <br />
              {/* <Select
                            // value={data.taxonomyDesc}
                            value={(selectTaxDec) }
                            onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, SpecialityTable.displayName))}
                            options={taxonomyDescOptions}
                            name = "taxonomyDesc"
                            id = "taxonomyDescDropDown"
                            isDisabled={true}
                         /> */}
              <input
                maxLength="100"
                type="text"
                //value={selectTaxDec}
                value={
                  data &&
                  "taxonomyDesc" in data &&
                  data.taxonomyDesc.value !== undefined
                    ? convertToCase(data.taxonomyDesc.value)
                    : convertToCase(data.taxonomyDesc)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    SpecialityTable.displayName
                  )
                }
                name="taxonomyDesc"
                className="form-control"
                disabled
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Taxonomy Group</label>
              <br />
              {/* <Select
                            value={data.taxonomyGrp}
                            onChange={(selectValue,event)=>(handleGridSelectChange(index, selectValue, event, SpecialityTable.displayName))}
                            options={taxonomyGrpOptions}
                            name = "taxonomyGrp"
                            id = "taxonomyGrpDropDown"
                         /> */}
              <input
                maxLength="100"
                type="text"
                value={
                  data &&
                  "taxonomyGrp" in data &&
                  data.taxonomyGrp.value !== undefined
                    ? convertToCase(data.taxonomyGrp.value)
                    : convertToCase(data.taxonomyGrp)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    SpecialityTable.displayName
                  )
                }
                name="taxonomyGrp"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Board Certified</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.boardCerti}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    SpecialityTable.displayName
                  )
                }
                options={boardCertiOptions}
                name="boardCerti"
                id="boardCertiDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
            </div>
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    if (
      specialityTableRowsData !== undefined &&
      specialityTableRowsData.length > 0
    ) {
      return specialityTableRowsData.map((data, index) => {
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
                        SpecialityTable.displayName,
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
                          editTableRows(index, SpecialityTable.displayName);
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
                      editTableRows(index, SpecialityTable.displayName);
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
              {"speciality" in data && data.speciality.value !== undefined
                ? convertToCase(data.speciality.value)
                : convertToCase(data.speciality)}
            </td>
            <td className="tableData">
              {"subSpeciality" in data && data.subSpeciality.value !== undefined
                ? convertToCase(data.subSpeciality.value)
                : convertToCase(data.subSpeciality)}
            </td>
            <td className="tableData">
              {"specPrimary" in data && data.specPrimary.value !== undefined
                ? convertToCase(data.specPrimary.label)
                : convertToCase(data.specPrimary)}
            </td>
            <td className="tableData">
              {"pcp" in data && data.pcp.value !== undefined
                ? convertToCase(data.pcp.label)
                : convertToCase(data.pcp)}
            </td>
            <td className="tableData">
              {"hsdCode" in data && data.hsdCode.value !== undefined
                ? convertToCase(data.hsdCode.value)
                : convertToCase(data.hsdCode)}
            </td>
            <td className="tableData">
              {"taxonomyCode" in data && data.taxonomyCode.value !== undefined
                ? convertToCase(data.taxonomyCode.value)
                : convertToCase(data.taxonomyCode)}
            </td>
            <td className="tableData">
              {"taxonomyDesc" in data && data.taxonomyDesc.value !== undefined
                ? convertToCase(data.taxonomyDesc.value)
                : convertToCase(data.taxonomyDesc)}
            </td>
            <td className="tableData">
              {"taxonomyGrp" in data && data.taxonomyGrp.value !== undefined
                ? convertToCase(data.taxonomyGrp.value)
                : convertToCase(data.taxonomyGrp)}
            </td>
            <td className="tableData">
              {"boardCerti" in data && data.boardCerti.value !== undefined
                ? convertToCase(data.boardCerti.label)
                : convertToCase(data.boardCerti)}
            </td>
          </tr>
        );
      });
    }
  };

  const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
    //operationValue.current = oprtnValue;
  };

  const decreaseDataIndex = () => {
    if (operationValue === "Add" || operationValue === "Force Delete") {
      const indx = dataIndex - 1;
      setDataIndex(indx);
      //dataIndex.current = indx;
      //console.log("dataIndex decrease: ",dataIndex.current);
    }
  };

  const handleModalChange = (flag) => {
    // setDataIndex({
    //     ...dataIndex,
    //     operation:opValue
    // })
    setModalShow(flag);
    // console.log("Inside handleModalChange before: ",modalShow.current);
    // modalShow.current = flag;
    // console.log("Inside handleModalChange after: ",modalShow.current);
  };

  const handleDataIndex = (index) => {
    setDataIndex(index);
    //dataIndex.current = index;
  };
  return (
    <>
      <table className="table table-bordered tableLayout" id="specialityTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus == "N" ? (
              <th style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(SpecialityTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(specialityTableRowsData.length);
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
            <th scope="col">Specialty</th>
            <th scope="col">Sub Specialty</th>
            <th scope="col">Primary</th>
            <th scope="col">PCP</th>
            <th scope="col">HSD Code</th>
            <th scope="col">Taxonomy Code</th>
            <th scope="col">Taxonomy Description</th>
            <th scope="col">Taxonomy Group</th>
            <th scope="col">Board Certified</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows specialityTableRowsData={specialityTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>
      <GridModal
        name={"Speciality Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={SpecialityTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
      ></GridModal>
    </>
  );
}
