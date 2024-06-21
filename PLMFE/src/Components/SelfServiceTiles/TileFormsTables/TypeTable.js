import React, { useEffect, useState } from "react";

import axios from "axios";
import Select from "react-select";
import GridModal from "./GridModal";
import { useSelector } from "react-redux";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function TypeTable({
  typeTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  provJson,
  handleGridFieldChange,
  lockStatus,
  editTableRows,
  gridRowsFinalSubmit,
  gridFieldTempState,
}) {
  TypeTable.displayName = "TypeTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const { getNPIFromMaster } = useUpdateDecision();
  const { getGridJson, convertToCase, acceptNumbersOnly } = useGetDBTables();

  const token = useSelector((state) => state.auth.token);

  const apiUrl = "http://localhost:8081/api";

  let providerTypeOptions = [];
  let specialtyOptions = [];

  //Added newly by Nidhi Gupta on 05/22/2023
  const [isTouched, setIsTouched] = useState({});
  const [isInvalid, setIsInvalid] = useState(false);
  const [providerNpi, setProviderNpi] = useState(null);
  useEffect(() => {
    if (!!providerNpi && providerNpi.length == 10) {
      setIsInvalid(false);
      setIsTouched({ ...isTouched, providerNpi: false });
    } else {
      setIsInvalid(true);
      setIsTouched({ ...isTouched, providerNpi: true });
    }
  }, [providerNpi]);

  //till here

  // let endpoints = [
  //     // apiUrl+'/master/gridProviderType',
  // 	apiUrl+'/master/speciality'
  //   ];

  const speciality = useSelector((store) => store.masterSpeciality);
  const providerTypeArray = useSelector((store) => store.masterProviderType);
  console.log("speciality: ", speciality);
  //console.log("providerTypeArray: ", providerTypeArray);

  //   Added by SHivani to check NPI for contracting
  const validateNpi = (ent, index) => {
    let npiId = ent.target.value;
    //console.log("Inside validateNpi npiId: ", npiId);
    // console.log(
    //   "Inside validateNpi getNPIFromMaster value: ",
    //   getNPIFromMaster(npiId)
    // );
    if (getNPIFromMaster(npiId)) {
      ent.target.value = "";
      handleGridFieldChange(index, ent, TypeTable.displayName);
      setProviderNpi("");
      alert(
        "NPI ID " +
          npiId +
          " is in exclusion list.Please contact your provider and enter correct NPI ID"
      );
    }
  };

  const tdDataReplica = (index) => {
    //console.log("Type before if: ",typeTableRowsData);
    //if(typeTableRowsData!==undefined && typeTableRowsData.length>0){
    const data = getGridJson(gridFieldTempState);

    //console.log("License after if: ",typeTableRowsData);
    //  const data = typeTableRowsData[index];

    //console.log("Type Data: ",data);
    //console.log("Type Data value: ",type.license.value);
    //console.log("tdDataReplica index: ",index);
    //console.log("tdDataReplica data: ",data);
    // axios.all(endpoints.map((endpoint) => axios.get(endpoint, {headers: {'Authorization' : `Bearer ${token}`}}))).then((res) => {
    //     if(res[0].status === 200){

    //       res[0].data.map(element => specialtyOptions.push({value : element, label: element}));
    //     }
    //     // if(res[1].status === 200){
    //     //     res[1].data.map(element => providerTypeOptions.push({value : element, label: element}));
    //     // }
    //  })
    //  .catch((err) => {
    //     console.log(err.message);
    //     alert("Error in getting data");
    //  });

    // speciality[0].data.map(element => specialtyOptions.push({value : element, label: element}));
    //Changed by Nidhi Gupta on 5/25/2023
    speciality?.[0]?.map((element) =>
      specialtyOptions.push({
        value: element["speciality"],
        label: element["speciality"],
      })
    );
    //till here
    providerTypeArray[0]?.map((element) =>
      providerTypeOptions.push({
        value: element["displayName"],
        label: element["displayName"],
      })
    );
    //console.log("providerTypeOptions: ",providerTypeOptions);

    return (
      <>
        <div className="container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-4">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Provider Type
              </label>
              <br />
              <Select
                classNames={{
                  control: (state) => {
                    console.log(state);
                    return `select-control-selector-1 ${
                      !data.providerType && isTouched.providerType
                        ? "is-invalid"
                        : ""
                    }`;
                  },
                }}
                //onBlur={()=>{setIsTouched({...isTouched, providerType: true})}}
                //onBlur={()=>{ if(!isTouched.providerType){setIsTouched({...isTouched, providerType: true})}}}
                value={data.providerType}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    TypeTable.displayName
                  )
                }
                options={providerTypeOptions}
                name="providerType"
                id="providerTypeDropDown"
                isClearable
                isDisabled={lockStatus !== "N"}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    height: "58px",
                    fontWeight: "lighter",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: 200,
                  }),
                }}
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <label
                style={{ marginBottom: 3, fontSize: "var(--font-size-small)" }}
              >
                Specialty
              </label>
              <br />
              <Select
                classNames={{
                  control: (state) =>
                    `select-control-selector-1 ${
                      !data.speciality && isTouched.speciality
                        ? "is-invalid"
                        : ""
                    }`,
                }}
                //onBlur={()=>{setIsTouched({...isTouched, speciality: true})}}
                //onBlur={()=>{ if(!isTouched.speciality){setIsTouched({...isTouched, speciality: true})}}}
                value={data.speciality}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    TypeTable.displayName
                  )
                }
                options={specialtyOptions}
                name="speciality"
                id="specialityDropDown"
                isClearable
                isDisabled={lockStatus !== "N"}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    height: "58px",
                    fontWeight: "lighter",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: 200,
                  }),
                }}
              />
            </div>

            <div
              className={`col-xs-6 col-md-4 needs-validation ${
                isInvalid ? "was-validated" : ""
              }`}
            >
              <label>Provider NPI</label>
              <br />
              <input
                maxLength="10"
                style={{ height: "59px" }}
                type="text"
                value={
                  "provNpi" in data && data.provNpi.value !== undefined
                    ? acceptNumbersOnly(data.provNpi.value)
                    : acceptNumbersOnly(data.provNpi)
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, TypeTable.displayName);
                  setProviderNpi(evnt.target.value);
                }}
                onBlur={(evnt) => validateNpi(evnt, index)}
                disabled={lockStatus !== "N"}
                name="provNpi"
                className="form-control"
                // required={(!!providerNpi && providerNpi.length==10) ? true : false}
              />
              {!!providerNpi && providerNpi.length !== 10 ? (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  Provider NPI should be exactly 10-digit
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
    if (typeTableRowsData !== undefined && typeTableRowsData.length > 0) {
      //console.log("Type Data: ",typeTableRowsData);

      return typeTableRowsData.map((data, index) => {
        // console.log("Type exists: ",'providerType' in data);
        // console.log("Type existing value: ",data.providerType);
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
                        TypeTable.displayName,
                        "Force Delete"
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
                      editTableRows(index, TypeTable.displayName);
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
                      editTableRows(index, TypeTable.displayName);
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
              {"providerType" in data && data.providerType.value !== undefined
                ? convertToCase(data.providerType.value)
                : convertToCase(data.providerType)}
            </td>

            <td>
              {"speciality" in data && data.speciality.value !== undefined
                ? convertToCase(data.speciality.value)
                : convertToCase(data.speciality)}
            </td>
            <td>
              {"provNpi" in data && data.provNpi.value !== undefined
                ? convertToCase(data.provNpi.value)
                : convertToCase(data.provNpi)}
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
    //Newly added by Nidhi Gupta on 05/22/2023
    setIsTouched({});
    setIsInvalid(false);
    setProviderNpi(null);
    //till here
    setModalShow(flag);
  };
  const handleDataIndex = (index) => {
    //console.log("Inside setDataIndex: ",index);
    setDataIndex(index);
  };

  return (
    <>
      <table className="table table-bordered tableLayout" id="TypeTable">
        <thead>
          <tr className=" ">
            {lockStatus == "N" ? (
              <th scope="col" style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(TypeTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(typeTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            ) : (
              <th style={{ width: "6%" }}></th>
            )}
            <th scope="col">Provider Type</th>
            <th scope="col">Specialty</th>
            <th scope="col">Provider NPI</th>
          </tr>
        </thead>
        <tbody>{tdData()}</tbody>
      </table>
      {typeTableRowsData !== undefined && typeTableRowsData.length <= 0 ? (
        <div className="invalid-feedback" style={{ display: "block" }}>
          Atleast one entry is required
        </div>
      ) : null}
      <GridModal
        name={"Type Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={TypeTable.displayName}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
      ></GridModal>
    </>
  );
}
