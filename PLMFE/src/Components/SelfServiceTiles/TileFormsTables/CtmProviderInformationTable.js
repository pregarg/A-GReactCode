import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

export default function CtmProviderInformationTable({
  ctmProviderInformationGridData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  lockStatus,
  editTableRows,
  gridFieldTempState,
  validationSchema,
}) {
  CtmProviderInformationTable.displayName = "CtmProviderInformationTable";

  const [dataIndex, setDataIndex] = useState();
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const location = useLocation();
 const [validationErrors, setValidationErrors] = useState({});
 const [portalEnrolledValues, setPortalEnrolledValues] = useState([]);
 const [commPrefValues, setCommPrefValuesValues] = useState([]);
 const [providerRoleValues, setProviderRoleValues] = useState([]);
//const [participatingProviderValues, setParticipatingProviderValues] = useState([]);
const [isTouched, setIsTouched] = useState({});
const { convertToCase } = useGetDBTables();
// const [mailToAddressValues, setMailToAddressValues] = useState([]);
 const [participatingProviderValues, setParticipatingProviderValues] = useState([]);
  const [mailToAddressValues, setMailToAddressValues] = useState([]);

  const masterAngPortalEnrolledSelector = useSelector(
      (state) => state?.masterAngPortalEnrolled,
    );
    console.log("masterAngPortalEnrolledSelector",masterAngPortalEnrolledSelector)
    const masterAngMailToAddressSelector = useSelector(
      (state) => state?.masterAngMailToAddress,
    );
 useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const portalEnrolled = masterAngPortalEnrolledSelector?.[0] || [];
    setPortalEnrolledValues(
      portalEnrolled.map((e) => e.Portal_Enrolled).map(kvMapper),
    );

//    const providerType = masterAngProviderTypeSelector?.[0] || [];
//    setProviderTypeValues(
//      providerType.map((e) => e.Provider_Type).map(kvMapper),
//    );
//
//    const commPref = masterAngCommPrefSelector?.[0] || [];
//    setCommPrefValuesValues(
//      commPref.map((e) => e.Comm_Pref).map(kvMapper),
//    );
//
//    const ParProvider = masterAngParProviderSelector?.[0] || [];
//    setParticipatingProviderValues(
//      ParProvider.map((e) => e.Par_Provider).map(kvMapper),
//    );

    const mailToAdd = masterAngMailToAddressSelector?.[0] || [];
    setMailToAddressValues(
      mailToAdd.map((e) => e.Mail_to_Address).map(kvMapper),
    );
//    const providerRole = masterAngProviderRoleSelector?.[0] || [];
//    setProviderRoleValues(
//      providerRole.map((e) => e.Provider_Role).map(kvMapper),
//    );

}, []);



const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CTMHEADER_DETAILS || "{}",
  );


  let prop = useLocation();

const renderSimpleInputField = (name, label, maxLength, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleInputField
          name={name}
          label={label}
          maxLength={maxLength}
          data={gridFieldTempState}
          onChange={(event) =>
            handleGridFieldChange(
              index,
              event,
               CtmProviderInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}

        />
      </div>
    );
  };
  const renderSimpleSelectField = (name, label, options, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleSelectField
          name={name}
          label={label}
          options={options}
          data={gridFieldTempState}
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              CtmProviderInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}

        />
      </div>
    );
  };
  const renderSimpleDatePickerField = (name, label, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleDatePickerField
          name={name}
          label={label}
          data={gridFieldTempState}
          onChange={(selectValue) =>
            handleGridDateChange(
              index,
              selectValue,
              name,
               CtmProviderInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}

        />
      </div>
    );
  };

  const tdDataReplica = (index) => {
    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row mt-3">
            {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
            {renderSimpleInputField("Provider_ID", "Provider ID", 50, index)}
            {renderSimpleInputField("Provider_Name", "Provider Name", 100, index)}
            {renderSimpleInputField("Provider_TIN", "Provider TIN", 50, index)}
              </div>
            <div className="row mt-3">
             {renderSimpleInputField("Provider_IPA", "Provider IPA", 50, index)}
             {renderSimpleInputField("CRM_Ticket", "CRM Ticket #", 100, index)}
            {renderSimpleInputField("Provider_Vendor_Specialty", "Provider/Vendor Specialty", 100, index)}
            {renderSimpleInputField("Provider_NPI", "Provider NPI", 50, index)}
             </div>
        <div className="row mt-3">
          {renderSimpleInputField("Email_ID", "Email ID", 100, index)}
            {renderSimpleInputField("Phone_Number", "Phone Number", 50, index)}
            {renderSimpleInputField("Fax_Number", "Fax Number", 50, index)}
            {renderSimpleSelectField("Participating_Provider", "Participating Provider?", portalEnrolledValues, index)}
          </div>

          <div className="sub-title mt-4 mb-3"
          style={{
                            fontSize: "19 px",        // Increase font siz
                            color: "#007bff",       // Eye-catching blue color (customizable)
                        }}>Contracts Details</div>

          <div className="row mt-3">
            {renderSimpleDatePickerField("Provider_Contract_Effective_Date", "Provider Contract Effective Date", index)}
            {renderSimpleDatePickerField("Provider_Contract_Termination_Date", "Provider Contract Termination Date", index)}
            {renderSimpleInputField("Provider_Contract_Type", "Provider Contract Type", 50, index)}
            {renderSimpleInputField("Provider_Contract_LOB", "Provider Contract LOB", 50, index)}
            </div>
            <div className="row mt-3">
            {renderSimpleInputField("Provider_Contract_IPA", "Provider Contract IPA", 50, index)}
            {renderSimpleInputField("PCP_Flag", "PCP Flag", 50, index)}
            {renderSimpleInputField("Accept_New_Patients", "Accept New Patients", 50, index)}
          </div>

          <div className="sub-title mt-4 mb-3"
          style={{
                            fontSize: "19 px",        // Increase font siz
                            color: "#007bff",       // Eye-catching blue color (customizable)
                        }}>Vendor Details</div>
          <div className="row mt-3">
            {renderSimpleInputField("Vendor_ID", "Vendor ID", 50, index)}
            {renderSimpleInputField("Vendor_Full_Name", "Vendor Full Name", 100, index)}
            {renderSimpleInputField("Vendor_Short_Name", "Vendor Short Name", 50, index)}
            {renderSimpleInputField("Vendor_Address", "Vendor Address", 200, index)}
          </div>

          <div className="row mt-3">
            {renderSimpleSelectField("Associate_Provider_with_Issue", "Associate Provider with Issue", portalEnrolledValues, index)}
          </div>

          <div className="sub-title mt-4 mb-3"
          style={{
                            fontSize: "19 px",        // Increase font siz
                            color: "#007bff",       // Eye-catching blue color (customizable)
                        }}>Provider Address of Record</div>
          <div className="row mt-3">
            {renderSimpleSelectField("Mail_to_Address", "Mail to Address?", mailToAddressValues, index)}
            {renderSimpleInputField("Address_Line_1", "Address (line 1)", 100, index)}
            {renderSimpleInputField("Address_Line_2", "Address (line 2)", 100, index)}
            {renderSimpleInputField("Zip_Code", "Zip Code", 50, index)}
            </div>
             <div className="row mt-3">

            {renderSimpleInputField("City", "City", 50, index)}
            {renderSimpleInputField("County", "County", 50, index)}
            {renderSimpleInputField("Region", "Region", 50, index)}
            {renderSimpleInputField("State", "State", 50, index)}
          </div>

          <div className="sub-title mt-4 mb-3"
          style={{
                  fontSize: "19 px",        // Increase font siz
                  color: "#007bff",       // Eye-catching blue color (customizable)
              }}>Alternate Provider Contact Information</div>
          <div className="row mt-3">
            {renderSimpleInputField("Provider_Contact_Name", "Provider Contact Name", 100, index)}
            {renderSimpleInputField("Alternate_Address_Line_1", " Address (line 1)", 100, index)}
            {renderSimpleInputField("Alternate_Address_Line_2", "Address (line 2)", 100, index)}
            {renderSimpleInputField("Alternate_Zip_Code", " Zip Code", 50, index)}
            </div>
            <div className="row mt-3">
            {renderSimpleInputField("Alternate_City", "City", 50, index)}
            {renderSimpleInputField("Alternate_County", " County", 50, index)}
            {renderSimpleInputField("Alternate_Region", "Region", 50, index)}
            {renderSimpleInputField("Alternate_State", " State", 50, index)}
            </div>
            <div className="row mt-3">
            {renderSimpleInputField("Alternate_Phone_Number", "Alternate Phone Number", 50, index)}
            {renderSimpleInputField("Alternate_Fax_Number", " Alternate Fax Number", 50, index)}
            {renderSimpleInputField("Alternate_Email_ID", " Alternate Email ID", 100, index)}
            {renderSimpleInputField("Communication_Preference", "Communication Preference", 100, index)}
          </div>
        </div>
      </>
    );
  };

const tdData = () => {
  if (ctmProviderInformationGridData !== undefined && ctmProviderInformationGridData.length > 0) {
    return ctmProviderInformationGridData.map((data, index) => {
      return (
        <>
          <tr key={index} className={data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""}>
            {lockStatus === "N" && (
              <td>
                <span style={{ display: "flex" }}>
                  <button
                    className="deleteBtn"
                    style={{ width: "75%", float: "left" }}
                    onClick={() => {
                      deleteTableRows(index, CtmProviderInformationTable.displayName, "Force Delete");
                      handleOperationValue("Force Delete");
                      decreaseDataIndex();
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  <button
                    className="editBtn"
                    style={{ width: "75%", float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, CtmProviderInformationTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(index);
                      handleOperationValue("Edit");
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </span>
              </td>
            )}
            {lockStatus === "V" && (
              <td>
                <button
                  className="editBtn"
                  style={{ float: "right" }}
                  type="button"
                  onClick={() => {
                    handleModalChange(true);
                    handleDataIndex(index);
                    handleOperationValue("Edit");
                  }}
                >
                  <i className="fa fa-eye"></i>
                </button>
              </td>
            )}

            {[
              "Issue_Number",
              "Provider_ID",
              "Provider_Name",
              "Provider_TIN",
              "Provider_Vendor_Specialty",
              "Provider_NPI",
              "Provider_IPA",
              "CRM_Ticket",
              "Email_ID",
              "Phone_Number",
              "Fax_Number",
              "Participating_Provider",
              "Provider_Contract_Effective_Date",
              "Provider_Contract_Termination_Date",
              "Provider_Contract_Type",
              "Provider_Contract_LOB",
              "Provider_Contract_IPA",
              "PCP_Flag",
              "Accept_New_Patients",
              "Vendor_ID",
              "Vendor_Full_Name",
              "Vendor_Short_Name",
              "Vendor_Address",
              "Associate_Provider_with_Issue",
              "Mail_to_Address",
              "Address_Line_1",
              "Address_Line_2",
              "Zip_Code",
              "City",
              "County",
              "Region",
              "State",
              "Provider_Contact_Name",
              "Alternate_Address_Line_1",
              "Alternate_Address_Line_2",
              "Alternate_Zip_Code",
              "Alternate_City",
              "Alternate_County",
              "Alternate_Region",
              "Alternate_State",
              "Alternate_Phone_Number",
              "Alternate_Fax_Number",
              "Alternate_Email_ID",
              "Communication_Preference"
            ].map((e) => (
              <td className="tableData" key={e}>
                {e.endsWith("_Date")
                  ? data?.[e]?.value
                    ? formatDate(data[e].value)
                    : formatDate(data[e])
                  : data?.[e]?.value
                  ? convertToCase(data[e].value)
                  : convertToCase(data[e])}
              </td>
            ))}
          </tr>
        </>
      );
    });
  }
};

  const formatDate = (dateObj) => {
    if (dateObj) {
      if (typeof dateObj === "string") {
        dateObj = new Date(Date.parse(dateObj));
      } else if (typeof dateObj === "number") {
        dateObj = new Date(dateObj);
      }
      let dd = dateObj.getDate();
      let mm = dateObj.getMonth() + 1;
      let yyyy = dateObj.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      return mm + "/" + dd + "/" + yyyy;
    }
    return null;
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
      setModalShow(flag);
    };

    const handleDataIndex = (index) => {
      setDataIndex(index);
    };
 return (
   <>
     <div className="claimTable-container">
       <table className="table table-bordered tableLayout" id="CtmProviderInformationTable">
         <thead>
           <tr className="tableRowStyle tableHeaderColor">
             {lockStatus === "N" && (
               <th style={{ width: "100px" }}>
                 <button
                   className="addBtn"
                   onClick={() => {
                     addTableRows(CtmProviderInformationTable.displayName);
                     handleModalChange(true);
                     handleDataIndex(ctmProviderInformationGridData.length);
                     handleOperationValue("Add");
                   }}
                 >
                   <i className="fa fa-plus"></i>

                 </button>
               </th>
             )}
             {lockStatus === "V" && <th style={{ width: "100px" }}></th>}
             <th scope="col"  style={{ width: "110px" }}>Issue Number</th>
             <th scope="col"  style={{ width: "100px" }}>Provider ID</th>
             <th scope="col"  style={{ width: "100px" }}>Provider Name</th>
             <th scope="col"  style={{ width: "100px" }}>Provider TIN</th>
             <th scope="col"  style={{ width: "150px" }}>Provider/Vendor Specialty</th>
             <th scope="col"  style={{ width: "100px" }}>Provider NPI</th>
             <th scope="col"  style={{ width: "100px" }}>Provider IPA</th>
             <th scope="col"  style={{ width: "100px" }}>CRM Ticket #</th>
             <th scope="col"  style={{ width: "100px" }}>Email ID</th>
             <th scope="col"  style={{ width: "100px" }}>Phone Number</th>
             <th scope="col"  style={{ width: "100px" }}>Fax Number</th>
             <th scope="col"  style={{ width: "150px" }}>Participating Provider</th>
             <th scope="col"  style={{ width: "100px" }}>Provider Contract Effective Date</th>
             <th scope="col"  style={{ width: "100px" }}>Provider Contract Termination Date</th>
             <th scope="col"  style={{ width: "100px" }}>Provider Contract Type</th>
             <th scope="col"  style={{ width: "100px" }}>Provider Contract LOB</th>
             <th scope="col"  style={{ width: "100px" }}>Provider Contract IPA</th>
             <th scope="col"  style={{ width: "100px" }}>PCP Flag</th>
             <th scope="col"  style={{ width: "100px" }}>Accept New Patients</th>
             <th scope="col"  style={{ width: "100px" }}>Vendor ID</th>
             <th scope="col"  style={{ width: "100px" }}>Vendor Full Name</th>
             <th scope="col"  style={{ width: "100px" }}>Vendor Short Name</th>
             <th scope="col"  style={{ width: "100px" }}>Vendor Address</th>
             <th scope="col"  style={{ width: "100px" }}>Associate Provider with Issue</th>
             <th scope="col"  style={{ width: "100px" }}>Mail to Address?</th>
             <th scope="col"  style={{ width: "100px" }}>Address (line 1)</th>
             <th scope="col"  style={{ width: "100px" }}>Address (line 2)</th>
             <th scope="col"  style={{ width: "100px" }}>Zip Code</th>
             <th scope="col"  style={{ width: "100px" }}>City</th>
             <th scope="col"  style={{ width: "100px" }}>County</th>
             <th scope="col"  style={{ width: "100px" }}>Region</th>
             <th scope="col"  style={{ width: "100px" }}>State</th>
             <th scope="col"  style={{ width: "100px" }}>Provider Contact Name</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate Address (line 1)</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate Address (line 2)</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate Zip Code</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate City</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate County</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate Region</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate State</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate Phone Number</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate Fax Number</th>
             <th scope="col"  style={{ width: "100px" }}>Alternate Email ID</th>
             <th scope="col"  style={{ width: "150px" }}>Communication Preference</th>
           </tr>
         </thead>
         <tbody>{tdData()}</tbody>
       </table>
     </div>
     <GridModal

          name={" Provider Information"}
               validationObject={isTouched}
               modalShow={modalShow}
               handleModalChange={handleModalChange}
               dataIndex={dataIndex}
               tdDataReplica={tdDataReplica}
               deleteTableRows={deleteTableRows}
               gridName={CtmProviderInformationTable.displayName}
               decreaseDataIndex={decreaseDataIndex}
               operationValue={operationValue}
               gridRowsFinalSubmit={gridRowsFinalSubmit}
               lockStatus={lockStatus}
               validationErrors={validationErrors}
     />
   </>
 );

}
