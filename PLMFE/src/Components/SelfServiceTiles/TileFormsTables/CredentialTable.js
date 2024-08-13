import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function CredentialTable({
  credentialTableRowsData,
  deleteTableRows,
  addTableRows,
  handleGridSelectChange,
  finalRowsAfterSave,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  selectJson,
  lockStatus,
  editTableRows,
  gridFieldTempState,
}) {
  CredentialTable.displayName = "CredentialTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  // const apiUrl = 'http://localhost:8081/api';
  const { getGridJson, convertToCase } = useGetDBTables();

  let documentOptions = [];

  const statusOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
    { value: "NA", label: "NA" },
  ];

  // let endpoints = [
  //     apiUrl+'/master/documentList'
  //   ];

  const tdDataReplica = (index) => {
    console.log("Credential before if: ", credentialTableRowsData);
    //if(credentialTableRowsData!==undefined && credentialTableRowsData.length>0){
    //console.log("Credential after if: ",credentialTableRowsData);
    const data = getGridJson(gridFieldTempState);
    //console.log("Credential Data: ",data);
    //console.log("License Data value: ",data.license.value);
    //console.log("tdDataReplica index: ",index);
    //console.log("tdDataReplica data: ",data);

    selectJson["documentOptions"].map((val) =>
      documentOptions.push({ value: val, label: val }),
    );

    // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
    //     if(res[0].status === 200){
    //         res[0].data.map(element => documentOptions.push({value : element, label: element}));
    //     }
    //  })
    //  .catch((err) => {
    //     console.log(err.message);
    //     alert("Error in getting data");
    //  });

    //console.log('Inside tdData specialityArray',specialityArray);
    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Document</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.document}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    CredentialTable.displayName,
                  )
                }
                options={documentOptions}
                name="document"
                id="documentDropDown"
                isDisabled={true}
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Status</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.status}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    CredentialTable.displayName,
                  )
                }
                options={statusOptions}
                name="status"
                id="statusDropDown"
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Source Verified</label>
              <br />
              <input
                type="text"
                value={
                  "srcVerified" in data && data.srcVerified.value !== undefined
                    ? convertToCase(data.srcVerified.value)
                    : convertToCase(data.srcVerified)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    CredentialTable.displayName,
                  )
                }
                name="srcVerified"
                className="form-control"
                maxLength="100"
                title="Please Enter Valid Source Verified"
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Expired</label>
              <br />
              <input
                type="text"
                value={
                  "expired" in data && data.expired.value !== undefined
                    ? convertToCase(data.expired.value)
                    : convertToCase(data.expired)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    CredentialTable.displayName,
                  )
                }
                name="expired"
                className="form-control"
                maxLength="100"
                title="Please Enter Valid Expired"
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>Remarks</label>
              <br />
              <textarea
                type="text"
                value={
                  "remarks" in data && data.remarks.value !== undefined
                    ? convertToCase(data.remarks.value)
                    : convertToCase(data.remarks)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    CredentialTable.displayName,
                  )
                }
                name="remarks"
                className="form-control"
                maxLength="100"
                title="Please Enter Valid Remarks"
              />
            </div>
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    console.log("Inside tdData credentialTable", finalRowsAfterSave);
    let tableRows =
      finalRowsAfterSave !== undefined
        ? finalRowsAfterSave
        : credentialTableRowsData;
    if (tableRows !== undefined && tableRows.length > 0) {
      console.log("Credential Data: ", tableRows);
      return tableRows.map((data, index) => {
        //const {fullName, emailAddress, salary, specialityDefault}= data;
        // console.log("License exists: ",'license' in data);
        //console.log("License exists value: ",data.license);
        return (
          <tr key={index}>
            {lockStatus !== "Y" && (
              <>
                <td>
                  {/* <button className="deleteBtn" style={{float:"left"}} onClick={()=> {deleteTableRows(index,CredentialTable.displayName,operationValue); handleOperationValue("Force Delete"); decreaseDataIndex();}}>
                        <i className="fa fa-trash"></i></button> */}
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, CredentialTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(index);
                      handleOperationValue("Edit");
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </td>
              </>
            )}
            <td className="tableData">
              {"document" in data && data.document.value !== undefined
                ? convertToCase(data.document.value)
                : convertToCase(data.document)}
            </td>
            <td className="tableData">
              {"status" in data && data.status.value !== undefined
                ? convertToCase(data.status.label)
                : convertToCase(data.status)}
            </td>
            <td className="tableData">
              {"srcVerified" in data && data.srcVerified.value !== undefined
                ? convertToCase(data.srcVerified.value)
                : convertToCase(data.srcVerified)}
            </td>
            <td className="tableData">
              {"expired" in data && data.expired.value !== undefined
                ? convertToCase(data.expired.value)
                : convertToCase(data.expired)}
            </td>
            <td className="tableData">
              {"remarks" in data && data.remarks.value !== undefined
                ? convertToCase(data.remarks.value)
                : convertToCase(data.remarks)}
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
      <table className="table table-bordered tableLayout" id="CredentialTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus !== "Y" && (
              <th style={{ width: "6%" }}>
                {/* <button className='addBtn' onClick={() => {addTableRows(CredentialTable.displayName); handleModalChange(true); handleDataIndex(credentialTableRowsData.length); handleOperationValue("Add")}}> */}
                {/* <i className="fa fa-plus"></i></button> */}
              </th>
            )}
            <th scope="col">Document</th>
            <th scope="col">Status</th>
            <th scope="col">Source Verified</th>
            <th scope="col">Expired</th>
            <th scope="col">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows CredentialTableRowsData={CredentialTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>

      <GridModal
        name={"Credential Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={CredentialTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
      ></GridModal>
    </>
  );
}
