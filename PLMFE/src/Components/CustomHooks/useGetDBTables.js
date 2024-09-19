import React from "react";

export default function useGetDBTables() {
  const getTableDetails = () => {
    let tableJson = {
      mainTable: ["MainCaseTable~mainTable"],
      decisionTable: ["Decision_History~decisionTable"],
      caseDocumentsTable: ["Prov_CaseDocuments~caseDocumentsTable"],
      pdmCaseDocumentsTable: ["Pdm_CaseDocuments~pdmCaseDocumentsTable"],
      compensationLinear: ["Cont_Compensation_Details~compLinearTable"],
      compGridTables: [
        "Cont_Firl_Grid~firlGrid",
        "Cont_Compensation_Grid~compensationGrid",
      ],
      providerLinear: ["SelfServ_Prov_Details~linearTable"],
      multiPlanTable: ["MULTIPLAN_PUBLISHED~multiPlan"],
      facAncLinear: ["SelfServ_FaciAnci_Details~linearTable02"],
      gridTables: [
        "SelfServ_Speciality_Grid~specialityTable",
        "SelfServ_Location_Grid~locationTable",
        "SelfServ_License_Grid~licenseTable",
        "SelfServ_PayTo_Grid~payToTable",
        "SelfServ_Education_Grid~educationTable",
        "SelfServ_Training_Grid~trainingTable",
        "SelfServ_WorkHistory_Grid~workTable",
        "SelfServ_Insurance_Grid~insuranceTable",
        "SelfServ_Credential_Grid~credentialTable",
        "SelfServ_AdditionalQues_Grid~additionalQuesGrid",
      ],
      provAnciFac: [
        "Cont_ProvFaciAnci_Details~contProvFaciAnci",
        "Cont_Type_Grid~contTypeGrid",
        "Cont_Payment_Grid~contPaymentGrid",
        "Cont_Location_Grid~contLocationGrid",
      ],
      esignTable: ["DocuSignData~esignTable"],
      pdmProviderLinear: ["PDM_PROVIDER_DETAILS~linearTable"],
      pdmAncFacLinear: ["PDM_FACIANCI_DETAILS~linearTable"],
      pdmGridTables: [
        "PDM_SPECIALITY_DETAILS~specialityTable",
        "PDM_LICENSE_DETAILS~licenseTable",
        "PDM_ADDRESS_DETAILS_VIEW~locationTable",
        "PDM_PAYTO_DETAILS~payToTable",
        "PDM_TRAINING_DETAILS~trainingTable",
        "PDM_WORKHISTORY_DETAILS~workTable",
        "PDM_INSURANCE_DETAILS~insuranceTable",
        "PDM_CREDENTIAL_DETAILS~credentialTable",
        "PDM_ADDITIONALQUES_DETAILS~additionalQuesGrid",
      ],
      pdmFacAncLinear: ["PDM_FACIANCI_DETAILS~linearTable"],
      provContLinkTable: ["ProvContLinkTable~provContLinkData"],
      pdmAddressTable: ["PDM_ADDRESS_DETAILS_VIEW~pdmAddress"],
      pdmPayToTable: ["PDM_PAYTO_DETAILS~pdmPayTo"],
      contPotentialDuplicate: ["Cont_PotentialDuplicate~potentialDup"],
      moduleDetailsTable: ["MODULETABLE~moduleTable"],
      provPotentialDuplicate: ["SelfServ_PotentialDuplicate~potentialDup"],
      terminationData: ["SelfServ_Termination_Data~terminationGridValue"],
      networkLinear: ["SelfServ_Network_Details~networkLinearTable"],
      networkGridTables: [
        "SelfServ_HospitalComp_Grid~firlGrid",
        "SelfServ_ProviderComp_Grid~compensationGrid",
      ],
      pdmNetworkLinear: ["PDM_NETWORK_DETAILS~pdmNetworkLinearTable"],
      pdmNetworkGridTables: [
        "PDM_HOSPITALCOMP_DETAILS~pdmFirlGrid",
        "PDM_PROVIDERCOMP_DETAILS~pdmCompensationGrid",
      ],
      pdmSpecialityTable: ["PDM_SPECIALITY_DETAILS~pdmSpeciality"],
      reportPollingTable: ["REPORTPOLLING~ReportPolling"],
      reportDocuments: ["ReportDocuments~ReportDocuments"],
      pdmProvFacAnc: [
        "PDM_CONT_PROVFACIANCI_DETAILS~contPdmLinearTable",
        "PDM_CONT_LOCATION_DETAILS~contPdmLocation",
        "PDM_CONT_PAYMENT_DETAILS~contPdmPayment",
        "PDM_CONT_TYPE_DETAILS~contPdmType",
      ],
      pdmContNetworkLinear: ["PDM_CONT_NETWORK_DETAILS~contPdmNetwork"],
      pdmContCompGridTables: [
        "PDM_CONT_HOSPITALCOMP_DETAILS~contPdmHospital",
        "PDM_CONT_PROVIDERCOMP_DETAILS~contPdmProviderComp",
      ],
      angTables: [
        "ANG_Case_Header~angCaseHeader",
        "ANG_Case_Timelines~angCaseTimelines",
        "ANG_Case_Information~angCaseInformation",
        "ANG_Claim_Information~angClaimInformation",
        "ANG_Claim_Information_Grid~angClaimInformationGrid",
        "ANG_Provider_Information_Grid~angProviderInformationGrid",
        "ANG_Member_Information~angMemberInformation",
        "ANG_Representative_Information_Grid~angRepresentativeInformationGrid",
        "ANG_Authorization_Information~angAuthorizationInformation",
        "ANG_Authorization_Information_Grid~angAuthorizationInformationGrid",
        "ANG_Expedited_Request~angExpeditedRequest",
        "ANG_Notes~angNotes",
        "ANG_DOCS_NEEDED~angDocNeededGrid",
        "ANG_Case_Decision~angCaseDecision",
        "ANG_Case_Decision_Details~angCaseDecisionDetails",
        "PD_CASE_HEADER~pdCaseHeader",
        "PD_Case_Timelines~pdCaseTimelines",
        "PD_MEMBER_ADD_OF_RECORDS~pdMemberAddRecord",
        "PD_MEMBER_ALTERNATIVE_CONTACT_INFO~pdMemberAltContact"

      ],
      angCaseStatusTable: ["ANG_MASTER_CASE_STATUS~angCaseStatus"],
    };
    return tableJson;
  };

  const getGridJson = (jsonObj) => {
    if (jsonObj && typeof jsonObj === "object") {
      const jsonKeys = Object.keys(jsonObj);
      jsonKeys.forEach((elem) => {
        const dataKeyType = typeof jsonObj[elem];

        if (
          (dataKeyType === "object" &&
            !jsonObj[elem]?.hasOwnProperty("label") &&
            !jsonObj[elem]?.hasOwnProperty("value")) ||
          dataKeyType !== "object"
        ) {
          jsonObj[elem] = { label: jsonObj[elem], value: jsonObj[elem] };
        } else if (
          dataKeyType === "object" &&
          jsonObj[elem].hasOwnProperty("label") &&
          typeof jsonObj[elem]["label"] === "object"
        ) {
          jsonObj[elem] = jsonObj[elem]["label"];
        }
      });
      return jsonObj;
    } else {
      console.error(
        "Invalid input in getGridJson: jsonObj is null or not an object",
      );
      return {};
    }
  };

  const convertToDateObj = (jsonObj) => {
    const jsonKeys = Object.keys(jsonObj);
    jsonKeys.forEach((elem) => {
      if (elem.includes("#date")) {
        const date = new Date(jsonObj[elem]);
        const oldKey = elem;
        const newKey = elem.split("#")[0];
        jsonObj = renameKey(jsonObj, oldKey, newKey);
        jsonObj[newKey] = date;
      }
    });
    return jsonObj;
  };

  const renameKey = (obj, oldKey, newKey) => {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  };

  const formatDate = (dateObj) => {
    if (dateObj) {
      if (typeof dateObj === "string") {
        const localDate = new Date(Date.parse(dateObj));

        dateObj = localDate;
      } else if (typeof dateObj === "number") {
        const localDate2 = new Date(dateObj);
        dateObj = localDate2;
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
      let formattedDate = mm + "/" + dd + "/" + yyyy;
      return formattedDate;
    }
    return null;
  };

  const trimJsonValues = (inJson) => {
    const dataKeys = Object.keys(inJson);
    dataKeys.forEach((value) => {
      if (inJson[value] !== undefined && typeof inJson[value] === "string") {
        inJson[value] = inJson[value].trim();
      }
    });
    return inJson;
  };

  const getDatePartOnly = (dt) => {
    const formattedDt = dt.replace(/-/g, "/").replace(/T.+/, "");
    return formattedDt;
  };

  const convertToCase = (value) => {
    if (value !== undefined && value !== null) {
      value = value.toString();
      let val = value.toUpperCase();
      return val;
    }
  };

  const checkGridJsonLength = (json) => {
    let flag = false;
    if (Object.keys(json).length === 1) {
      if (json.hasOwnProperty("rowNumber")) {
        flag = true;
      }
    }
    return flag;
  };

  const acceptNumbersOnly = (e) => {
    if (e !== undefined && e !== null) {
      let Value = e.toString();
      var newValue = Value.replace(new RegExp(/[^\d]/, "ig"), "");
      return newValue;
    }
  };

  const extractDate = (dateVal) => {
    let retDate = "";
    if (dateVal instanceof Date) {
      let day = dateVal.getDate();
      day = day < 10 ? "0" + day : day;
      let month = dateVal.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      const year = dateVal.getFullYear();

      retDate = `${year}-${month}-${day}`;
    }
    return retDate;
  };

  const getJsonFromFormikState = (initState, formikState) => {
    let retJson = {};
    Object.keys(initState).forEach((elem) => {
      if (formikState.hasOwnProperty(elem)) {
        retJson[elem] = formikState[elem];
      }
    });
    return retJson;
  };

  return {
    getTableDetails,
    getGridJson,
    convertToDateObj,
    formatDate,
    trimJsonValues,
    getDatePartOnly,
    convertToCase,
    checkGridJsonLength,
    acceptNumbersOnly,
    extractDate,
    getJsonFromFormikState,
  };
}
