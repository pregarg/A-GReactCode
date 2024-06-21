import React, { useEffect, useState, useMemo, useRef } from "react";
import useGetDBTables from "../../../Components/CustomHooks/useGetDBTables";
import { useAxios } from "../../../api/axios.hook";
import FooterComponent from "../../../Components/FooterComponent";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Formik, Field, ErrorMessage } from "formik";
import Switch from "react-switch";
import SpecialityTable from "../../../Components/SelfServiceTiles/TileFormsTables/SpecialityTable";
import LicenseTable from "../../../Components/SelfServiceTiles/TileFormsTables/LicenseTable";
import LocationTable from "../../../Components/SelfServiceTiles/TileFormsTables/LocationTable";
import PayToTable from "../../../Components/SelfServiceTiles/TileFormsTables/PayToTable";
import useUpdateDecision from "../../../Components/CustomHooks/useUpdateDecision";
import ReactDatePicker from "react-datepicker";
import Select, { components } from "react-select";
import { useSelector } from "react-redux";

import DocumentTab from "./DocumentTab";
import CompensationTab from "../../../Components/ContractingHome/ContractingTileForms/CompensationTab";

export default function Globalsearch(props) {
  const initState = {
    organizationName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    caqhId: "",
    caqhNpiId: "",
    ssn: "",
    medicareId: "",
    medicaidId: "",
    ecfmgNumber: "",
    attestationId: "",
    emailId: "",
    contractId: "",
    ProviderStatus: "",
  };

  //Added by Nidhi Gupta on 10/09/2023

  const [apiTestStateComp, setApiTestStateComp] = useState({
    pcpId: "",
    taxId: "",
    medicalLicense: "",
    groupRiskId: "",
    networkId: "",
    planValue: "",
    networkState: "",
    feeSchedule: "",
    riskState: "",
    riskAssignment: "",
    //Added by Nidhi Gupta on 10/06/2023
    starsIncentive: "",
    awvIncentive: "",
    medicalHome: "",
    criticalAccess: "",
    pricingAWP: "",
    pricingASP: "",
    annualEscl: "",
    sequesApplies: "",
    terminationClause: "",
    contractTypeComp: "",
    qualityFlagI: "",
    qualityFlagJ: "",
    qualityFlagK: "",
    qualityFlagL: "",
    qualityFlagM: "",
    qualityFlagN: "",
  });

  const [firlTableRowsData, setFirlTableRowsData] = useState([]);
  const [compensationTableRowsData, setCompensationTableRowsData] = useState(
    []
  );
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  const [apiCallOnce, setApiCallOnce] = useState(false);

  const tabRef = useRef("HomeView");
  const { customAxios } = useAxios();

  const [selectValues, setSelectValues] = useState({});

  const [licenseTableRowsData, setLicenseTableRowsData] = useState([]);

  const [locationTableRowsData, setLocationTableRowsData] = useState([]);

  const [payToTableRowsData, setPayToTableRowsData] = useState([]);

  const [educationTableRowsData, setEducationTableRowsData] = useState([]);

  const [trainingTableRowsData, setTrainingTableRowsData] = useState([]);

  const [workTableRowsData, setWorkTableRowsData] = useState([]);

  const [insuranceTableRowsData, setInsuranceTableRowsData] = useState([]);

  const [credentialTableRowsData, setCredentialTableRowsData] = useState([]);

  const hideandShow = useRef(null);

  const gridDataRef = useRef({});
  const fetchAutoPopulate = useRef(false);
  const [apiTestState, setApiTestState] = useState(initState);

  const { disableAllElements } = useUpdateDecision();

  const modifyValidatedAddressPayToRow = null;
  const modifyValidatedAddressRow = null;
  const subSpecialityOptions = null;
  const handleSelectSpecialityOnBlur = null;
  const handleGridOnBlur = null;
  const handleDateChange = null;
  const getGridDataValues = null;
  const handleLinearSelectChange = null;

  const [specialityTableRowsData, setspecialityTableRowsData] = useState([]);
  const setSubSpecialityOptions = null;
  const saveData = null;

  const { ValueContainer, Placeholder } = components;
  //const getData = null;
  const caqhId = null;
  const checkLuhn = null;
  const [formikInitializeState, setFormikInitializeState] = useState(false);
  const questionData = () => {};
  const mastersSelector = useSelector((masters) => masters);
  const [quesAnsListJson, setQuesAnsListJson] = useState([]);
  let quesAnsList = [];
  const { getTableDetails, getDatePartOnly, convertToCase } = useGetDBTables();

  //Added Newly by NG on 12/12/2023
  const handleTabSelect = (key) => {
    try {
      // Perform actions when the tab is selected
      if (key == "Compensation" && !apiCallOnce) {
        setApiCallOnce(true);
        let getApiJson = {};
        getApiJson["tableNames"] = getTableDetails()["pdmNetworkLinear"].concat(
          getTableDetails()["pdmNetworkGridTables"]
        );
        getApiJson["whereClause"] = {
          PROVIDERID: props.providerId,
          CONTRACTID: props.contractId,
        };

        customAxios
          .post("/generic/get", getApiJson)
          .then((res) => {
            const apiStat = res.data.Status;
            if (apiStat === -1) {
              alert("Error in fetching data");
            }
            if (apiStat === 0) {
              const respKeys = Object.keys(res.data["data"]);
              const respData = res.data["data"];
              respKeys.forEach((k) => {
                if (k === "pdmNetworkLinearTable") {
                  let apiResponse = {};
                  if (respData[k][0] !== undefined) {
                    apiResponse = mapLinearNetworkTab(respData[k][0]);

                    //Added by Nidhi Gupta on 10/06/23
                    if (apiResponse.hasOwnProperty("conEffectiveDate")) {
                      if (typeof apiResponse.conEffectiveDate === "string") {
                        const cfd = new Date(apiResponse.conEffectiveDate);
                        apiResponse.conEffectiveDate = cfd;
                      }
                    }
                    if (apiResponse.hasOwnProperty("mocAttestationDate")) {
                      if (typeof apiResponse.mocAttestationDate === "string") {
                        const mad = new Date(apiResponse.mocAttestationDate);
                        apiResponse.mocAttestationDate = mad;
                      }
                    }
                    if (apiResponse.hasOwnProperty("mocRenewalAttDate")) {
                      if (typeof apiResponse.mocRenewalAttDate === "string") {
                        const rad = new Date(apiResponse.mocRenewalAttDate);
                        apiResponse.mocRenewalAttDate = rad;
                      }
                    }
                    //Till Here
                    console.log("NetworkTab apiResponse", apiResponse);
                    apiResponse.networkState = {
                      label: apiResponse.networkState,
                      value: apiResponse.networkState,
                    };
                    apiResponse.feeSchedule = {
                      label: apiResponse.feeSchedule,
                      value: apiResponse.feeSchedule,
                    };
                    apiResponse.riskState = {
                      label: apiResponse.riskState,
                      value: apiResponse.riskState,
                    };
                    apiResponse.riskAssignment = {
                      label: apiResponse.riskAssignment,
                      value: apiResponse.riskAssignment,
                    };

                    //Added by Nidhi Gupta on 10/06/23
                    if (
                      apiResponse.sequesApplies !== undefined &&
                      apiResponse.sequesApplies.length > 0
                    ) {
                      if (apiResponse.sequesApplies === "Y") {
                        apiResponse.sequesApplies = {
                          label: "YES",
                          value: apiResponse.sequesApplies,
                        };
                      } else if (apiResponse.sequesApplies === "N") {
                        apiResponse.sequesApplies = {
                          label: "NO",
                          value: apiResponse.sequesApplies,
                        };
                      }
                    }

                    apiResponse.contractTypeComp = {
                      label: apiResponse.contractTypeComp,
                      value: apiResponse.contractTypeComp,
                    };
                    if (
                      apiResponse.criticalAccess !== undefined &&
                      apiResponse.criticalAccess.length > 0
                    ) {
                      if (apiResponse.criticalAccess === "Y") {
                        apiResponse.criticalAccess = {
                          label: "YES",
                          value: apiResponse.criticalAccess,
                        };
                      } else if (apiResponse.criticalAccess === "N") {
                        apiResponse.criticalAccess = {
                          label: "NO",
                          value: apiResponse.criticalAccess,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagI !== undefined &&
                      apiResponse.qualityFlagI.length > 0
                    ) {
                      if (apiResponse.qualityFlagI === "Y") {
                        apiResponse.qualityFlagI = {
                          label: "YES",
                          value: apiResponse.qualityFlagI,
                        };
                      } else if (apiResponse.qualityFlagI === "N") {
                        apiResponse.qualityFlagI = {
                          label: "NO",
                          value: apiResponse.qualityFlagI,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagJ !== undefined &&
                      apiResponse.qualityFlagJ.length > 0
                    ) {
                      if (apiResponse.qualityFlagJ === "Y") {
                        apiResponse.qualityFlagJ = {
                          label: "YES",
                          value: apiResponse.qualityFlagJ,
                        };
                      } else if (apiResponse.qualityFlagJ === "N") {
                        apiResponse.qualityFlagJ = {
                          label: "NO",
                          value: apiResponse.qualityFlagJ,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagK !== undefined &&
                      apiResponse.qualityFlagK.length > 0
                    ) {
                      if (apiResponse.qualityFlagK === "Y") {
                        apiResponse.qualityFlagK = {
                          label: "YES",
                          value: apiResponse.qualityFlagK,
                        };
                      } else if (apiResponse.qualityFlagK === "N") {
                        apiResponse.qualityFlagK = {
                          label: "NO",
                          value: apiResponse.qualityFlagK,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagL !== undefined &&
                      apiResponse.qualityFlagL.length > 0
                    ) {
                      if (apiResponse.qualityFlagL === "Y") {
                        apiResponse.qualityFlagL = {
                          label: "YES",
                          value: apiResponse.qualityFlagL,
                        };
                      } else if (apiResponse.qualityFlagL === "N") {
                        apiResponse.qualityFlagL = {
                          label: "NO",
                          value: apiResponse.qualityFlagL,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagM !== undefined &&
                      apiResponse.qualityFlagM.length > 0
                    ) {
                      if (apiResponse.qualityFlagM === "Y") {
                        apiResponse.qualityFlagM = {
                          label: "YES",
                          value: apiResponse.qualityFlagM,
                        };
                      } else if (apiResponse.qualityFlagM === "N") {
                        apiResponse.qualityFlagM = {
                          label: "NO",
                          value: apiResponse.qualityFlagM,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagN !== undefined &&
                      apiResponse.qualityFlagN.length > 0
                    ) {
                      if (apiResponse.qualityFlagN === "Y") {
                        apiResponse.qualityFlagN = {
                          label: "YES",
                          value: apiResponse.qualityFlagN,
                        };
                      } else if (apiResponse.qualityFlagN === "N") {
                        apiResponse.qualityFlagN = {
                          label: "NO",
                          value: apiResponse.qualityFlagN,
                        };
                      }
                    }

                    apiResponse = convertToDateObj(apiResponse);

                    //Till Here

                    setApiTestStateComp(apiResponse);
                  }
                }

                //Added by Nidhi Gupta on 10/06/2023
                if (k === "pdmFirlGrid") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const newJson = mapFirlTable(convertToDateObj(js));
                    console.log("Compensation Tab firlGrid newJson: ", newJson);
                    apiResponseArray.push(newJson);
                  });
                  setFirlTableRowsData(apiResponseArray);
                }

                if (k === "pdmCompensationGrid") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const apiResponse = mapCompensationTable(js);
                    if (apiResponse.hasOwnProperty("schedule")) {
                      apiResponse.schedule = {
                        label: apiResponse.schedule,
                        value: apiResponse.schedule,
                      };
                    }
                    if (apiResponse.hasOwnProperty("speciality")) {
                      apiResponse.speciality = {
                        label: apiResponse.speciality,
                        value: apiResponse.speciality,
                      };
                    }
                    apiResponseArray.push(apiResponse);

                  });
                  setCompensationTableRowsData(apiResponseArray);
                }

                //Till Here
              });
            }
          })
          .catch((err) => {
            console.log("Network Tab catch: ", err);
          });
      }
    } catch (error) {
      console.error("Network Tab handleTabSelect catch: ", error);
    }
  };
  //Till Here

  useEffect(() => {
    disableAllElements(props, "PDM");

    Globalsearch.displayName = "";

    let selectJson = {};
    let additionalQuesValues = [];

    let newArr = [];
      if (mastersSelector.hasOwnProperty("masterAgesSeen")) {
        let newAgesSeenArray = [];
        let orgAgesSeenArray =
          mastersSelector["masterAgesSeen"].length === 0
            ? []
            : mastersSelector["masterAgesSeen"][0];
        for (let i = 0; i < orgAgesSeenArray.length; i++) {
          newAgesSeenArray.push({
            label: convertToCase(orgAgesSeenArray[i].agesSeen),
            value: convertToCase(orgAgesSeenArray[i].agesSeen),
          });
        }
        selectJson.agesSeenArray = newAgesSeenArray;
      }

      if (mastersSelector.hasOwnProperty("masterLanguages")) {
        //selectJson.languageArray = mastersSelector['masterLanguages'][0].data;
        let languageArray =
          mastersSelector["masterLanguages"].length === 0
            ? []
            : mastersSelector["masterLanguages"][0];

            for (const item of languageArray) {
              newArr.push(convertToCase(item.displayName));
            }
          selectJson.languageArray = newArr;
          newArr = [];
      }



      if (mastersSelector.hasOwnProperty("masterGridLicenseType")) {
        let licenseTypeOptions =
          mastersSelector["masterGridLicenseType"].length === 0
            ? []
            : mastersSelector["masterGridLicenseType"][0];

            for (const item of licenseTypeOptions) {
              newArr.push(convertToCase(item.licenseType));
            }

            selectJson.licenseTypeOptions = newArr;
            newArr = [];
      }
      //  if(mastersSelector.hasOwnProperty('masterStateSymbol')){
      //     selectJson.stateOptions = ((mastersSelector['masterStateSymbol'].length===0) ? [] : (mastersSelector['masterStateSymbol'][0].data));
      //  }

      if (mastersSelector.hasOwnProperty("masterStateSymbol")) {
        let newstateOptions = [];
        let orgstateOptions =
          mastersSelector["masterStateSymbol"].length === 0
            ? []
            : mastersSelector["masterStateSymbol"][0];
        // for (let i = 0; i < orgstateOptions.length; i++) {
        //   newstateOptions.push({
        //     label: convertToCase(orgstateOptions[i].stateSymbol),
        //     value: convertToCase(orgstateOptions[i].stateSymbol),
        //   });

        // }


        for (const item of orgstateOptions) {
          newstateOptions.push({
            label: convertToCase(item.stateSymbol),
            value: convertToCase(item.stateSymbol),
          });
          newArr.push(convertToCase(item.stateSymbol));
        }
        selectJson.stateOptionsLinear = newstateOptions;
        selectJson.stateOptions = newArr;
        newArr = [];
      }


      if (mastersSelector.hasOwnProperty("masterAddressType")) {
        let addressTypeOptions =
          mastersSelector["masterAddressType"].length === 0
            ? []
            : mastersSelector["masterAddressType"][0];

            for (const item of addressTypeOptions) {
              newArr.push(convertToCase(item.addressType));
            }

            selectJson.addressTypeOptions = newArr;
            newArr = [];
      }


      if (mastersSelector.hasOwnProperty("masterLicenseType")) {
        selectJson.typeOptions =
          mastersSelector["masterLicenseType"].length === 0
            ? []
            : mastersSelector["masterLicenseType"][0].data;
      }

      if (mastersSelector.hasOwnProperty("masterSpeciality")) {
        selectJson.specialtyOptions =
          mastersSelector["masterSpeciality"].length === 0
            ? []
            : mastersSelector["masterSpeciality"][0];
      }

      if (mastersSelector.hasOwnProperty("masterGraduateType")) {
        let degreeOptions =
          mastersSelector["masterGraduateType"].length === 0
            ? []
            : mastersSelector["masterGraduateType"][0];

            for (const item of degreeOptions) {
              newArr.push(convertToCase(item.graduateType));
            }

            selectJson.degreeOptions = newArr;
            newArr = [];
      }

      if (mastersSelector.hasOwnProperty("masterDocumentList")) {
        let documentOptions =
          mastersSelector["masterDocumentList"].length === 0
            ? []
            : mastersSelector["masterDocumentList"][0];

            for (const item of documentOptions) {
              newArr.push(convertToCase(item.docList));
            }

            selectJson.documentOptions = newArr;
            newArr = [];
      }
      if (mastersSelector.hasOwnProperty("masterAdditionalQues")) {
        selectJson.additionalQues =
          mastersSelector["masterAdditionalQues"].length === 0
            ? []
            : mastersSelector["masterAdditionalQues"][0];
      }
      if (mastersSelector.hasOwnProperty("masterTaxonomyCode")) {
        selectJson.taxonomyOptions =
          mastersSelector["masterTaxonomyCode"].length === 0
            ? []
            : mastersSelector["masterTaxonomyCode"][0];
      }

    setTimeout(() => setSelectValues(selectJson), 1000);

    selectJson["additionalQues"]
      .filter(
        (data) =>
          data.TransactionType.toLowerCase() ==
          Globalsearch.displayName.toLowerCase()
      )
      .map((val) =>
        additionalQuesValues.push({
          questionId: val.QuestionId,
          label: val.QuesDescription,
        })
      );

    setTimeout(() => {
      if (quesAnsList === undefined || quesAnsList.length <= 0) {
        setQuesAnsListJson(additionalQuesValues);
      }
    }, 1000);

    hideandShow.show = true;

    let getApiJson = {};
    if (props.formName == "Provider") {
      getApiJson["tableNames"] = getTableDetails()["pdmProviderLinear"].concat(
        getTableDetails()["pdmGridTables"]
      );
      getApiJson["whereClause"] = {
        PROVIDERID: props.providerId,
        CONTRACTID: props.contractId,
      };
    } else {
      getApiJson["tableNames"] = getTableDetails()["pdmFacAncLinear"].concat(
        getTableDetails()["pdmGridTables"]
      );
      getApiJson["whereClause"] = {
        PROVIDERID: props.providerId,
        CONTRACTID: props.contractId,
      };
    }
    Globalsearch.displayName = props.formName;

    customAxios
      .post("/generic/get", getApiJson)
      .then((res) => {
        const apiStat = res.data.Status;
        if (apiStat === -1) {
          alert("Error in fetching data");
        }
        if (apiStat === 0) {
          const respKeys = Object.keys(res.data["data"]);
          const respData = res.data["data"];
          respKeys.forEach((k) => {
            if (k === "linearTable") {
              let apiResponse = {};
              if (respData[k][0] !== undefined) {
                if (props.formName == "Provider") {
                  apiResponse = mapLinearProviderTable(respData[k][0]);
                } else {
                  apiResponse = mapLinearFacAncilTable(respData[k][0]);
                }

                if (apiResponse.hasOwnProperty("dateOfBirth")) {
                  if (typeof apiResponse.dateOfBirth === "string") {
                    const dob = new Date(
                      getDatePartOnly(apiResponse.dateOfBirth)
                    );
                    apiResponse.dateOfBirth = dob;
                  }
                }
                if (apiResponse.hasOwnProperty("ecfmgIssueDate")) {
                  if (typeof apiResponse.ecfmgIssueDate === "string") {
                    const eid = new Date(
                      getDatePartOnly(apiResponse.ecfmgIssueDate)
                    );
                    apiResponse.ecfmgIssueDate = eid;
                  }
                }
                if (apiResponse.hasOwnProperty("ecfmgExpirationDate")) {
                  if (typeof apiResponse.ecfmgExpirationDate === "string") {
                    const eed = new Date(
                      getDatePartOnly(apiResponse.ecfmgExpirationDate)
                    );
                    apiResponse.ecfmgExpirationDate = eed;
                  }
                }
                if (apiResponse.hasOwnProperty("attestationDate")) {
                  if (typeof apiResponse.attestationDate === "string") {
                    const atd = new Date(
                      getDatePartOnly(apiResponse.attestationDate)
                    );
                    apiResponse.dateOfBirth = atd;
                  }
                }
                apiResponse.gender = {
                  label: apiResponse.gender,
                  value: apiResponse.gender,
                };
                apiResponse.newPatients = {
                  label: apiResponse.newPatients,
                  value: apiResponse.newPatients,
                };
                apiResponse.agesSeen = {
                  label: apiResponse.agesSeen,
                  value: apiResponse.agesSeen,
                };
                //apiResponse.placeInDirectory = { 'label': apiResponse.placeInDirectory, 'value': apiResponse.placeInDirectory };
                apiResponse.delegated = {
                  label: apiResponse.delegated,
                  value: apiResponse.delegated,
                };
                apiResponse.ecfmgQues = {
                  label: apiResponse.ecfmgQues,
                  value: apiResponse.ecfmgQues,
                };

                if (apiResponse.states !== undefined) {
                  apiResponse.states = apiResponse.states
                    .split(",")
                    .map((ele) => {
                      return { label: ele, value: ele };
                    });
                }

                apiResponse = convertToDateObj(apiResponse);
                setApiTestState(apiResponse);
                setFormikInitializeState(true);
              }
            }

            if (k === "licenseTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const apiResponse = mapLicenseTable(convertToDateObj(js));
                apiResponseArray.push(apiResponse);
              });
              setLicenseTableRowsData(apiResponseArray);
            }

            if (k === "locationTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const apiResponse = mapProviderAddressTable(js);
                if (apiResponse.hasOwnProperty("languages")) {
                  apiResponse.languages = apiResponse.languages
                    .split(",")
                    .map((ele) => {
                      return { label: ele, value: ele };
                    });
                }
                apiResponseArray.push(apiResponse);
              });
              setLocationTableRowsData(apiResponseArray);
            }

            if (k === "payToTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                // const newJson = convertToDateObj(js);
                const apiResponse = mapPayToTable(js);
                apiResponseArray.push(apiResponse);
              });
              setPayToTableRowsData(apiResponseArray);
            }

            if (k === "specialityTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const apiResponse = mapSpecialityTable(js);

                apiResponseArray.push(apiResponse);
              });
              setspecialityTableRowsData(apiResponseArray);
            }

            if (k === "educationTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const newJson = convertToDateObj(js);
                apiResponseArray.push(newJson);
              });
              setEducationTableRowsData(apiResponseArray);
            }

            if (k === "trainingTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const apiResponse = convertToDateObj(js);
                if (apiResponse.hasOwnProperty("programAtteneded")) {
                  if (apiResponse.programAtteneded === "Y") {
                    apiResponse.programAtteneded = {
                      label: "Yes",
                      value: apiResponse.programAtteneded,
                    };
                  } else if (apiResponse.programAtteneded === "N") {
                    apiResponse.programAtteneded = {
                      label: "No",
                      value: apiResponse.programAtteneded,
                    };
                  }
                }
                apiResponseArray.push(apiResponse);
                console.log("trainingTableRowsData apiResponse: ", apiResponse);
              });
              setTrainingTableRowsData(apiResponseArray);
            }
            if (k === "workTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const apiResponse = mapWorkHistoryTable(convertToDateObj(js));
                if (apiResponse.hasOwnProperty("currentEmp")) {
                  if (apiResponse.currentEmp === "Y") {
                    apiResponse.currentEmp = {
                      label: "Yes",
                      value: apiResponse.currentEmp,
                    };
                  } else if (apiResponse.currentEmp === "N") {
                    apiResponse.currentEmp = {
                      label: "No",
                      value: apiResponse.currentEmp,
                    };
                  }
                }
                apiResponseArray.push(apiResponse);
              });
              setWorkTableRowsData(apiResponseArray);
            }
            if (k === "insuranceTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const newJson = mapInsuranceTable(convertToDateObj(js));
                apiResponseArray.push(newJson);
              });
              setInsuranceTableRowsData(apiResponseArray);
            }
            if (k === "credentialTable") {
              let apiResponseArray = [];
              respData[k].forEach((js) => {
                const apiResponse = js;
                if (apiResponse.hasOwnProperty("status")) {
                  if (apiResponse.status === "Y") {
                    apiResponse.status = {
                      label: "Yes",
                      value: apiResponse.status,
                    };
                  } else if (apiResponse.status === "N") {
                    apiResponse.status = {
                      label: "No",
                      value: apiResponse.status,
                    };
                  }
                }
                apiResponseArray.push(apiResponse);

              });
              setCredentialTableRowsData(apiResponseArray);
            }

            if (k === "additionalQuesGrid") {
              const masterMap = new Map(
                additionalQuesValues.map((obj) => [obj.questionId, obj.label])
              );

              let caseID = 0;

              respData[k].forEach((js) => {
                const newJson = convertToDateObj(js);
                newJson.label = masterMap.get(Number(newJson.questionId)); //if we will give key it will give value , key-quesid, value-desc, label=desc
                newJson.response = {
                  label: newJson.response,
                  value: newJson.response,
                };
                quesAnsList.push(newJson);
                caseID = newJson.caseNumber;
              });

              const quesAnsMap = new Map(
                quesAnsList.map((obj) => [obj.questionId, obj])
              );

              for (const [key, value] of masterMap) {
                //we need this all the time
                if (quesAnsMap.get(key.toString()) !== undefined) {
                } else {
                  var newJson = {};
                  newJson.questionId = key.toString();
                  newJson.label = value;
                  newJson.response = "";
                  newJson.caseNumber = caseID;
                  newJson.rowNumber = key.toString();
                  quesAnsList.push(newJson);
                }
              }



              if (quesAnsList !== undefined && quesAnsList.length > 0) {
                setQuesAnsListJson(quesAnsList);
              }

            }

            //till here 02
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });



    return () => {
      let NodeColor = document.getElementsByTagName("Input");
      for (var j = 0; j < NodeColor.length; j++) {
        NodeColor[j].style.background = "";
      }
    };
  }, [disableAllElements(props, "PDM")]);

  //Added by Nidhi Gupta on 10/9/2023
  const mapLinearNetworkTab = (res) => {
    const transformed = {

      riskState: res["RISKSTATE"],
      riskAssignment: res["RISKASSIGNMENT"],
      taxId: res["TAXID"],
      groupRiskId: res["GROUPRISKID"],
      medicalLicense: res["MEDICALLICENSE"],
      pcpId: res["PCPID"],
      networkState: res["NETWORKSTATE"],
      planValue: res["PLANVALUE"],
      networkId: res["NETWORKID"],
      feeSchedule: res["FEESCHEDULE"],
      conEffectiveDate: res["CONEFFECTIVEDATE#date"]
        ? new Date(res["CONEFFECTIVEDATE#date"])
        : "",
      starsIncentive: res["STARSINCENTIVE"],
      awvIncentive: res["AWVINCENTIVE"],
      medicalHome: res["MEDICALHOME"],
      criticalAccess: res["CRITICALACCESS"],
      pricingAWP: res["PRICINGAWP"],
      pricingASP: res["PRICINGASP"],
      annualEscl: res["ANNUALESCL"],
      sequesApplies: res["SEQUESAPPLIES"],
      mocAttestationDate: res["MOCATTESTATIONDATE#date"]
        ? new Date(res["MOCATTESTATIONDATE#date"])
        : "",
      mocRenewalAttDate: res["MOCRENEWALATTDATE#date"]
        ? new Date(res["MOCRENEWALATTDATE#date"])
        : "",
      terminationClause: res["TERMINATIONCLAUSE"],
      contractTypeComp: res["CONTRACTTYPECOMP"],
      qualityFlagI: res["QUALITYFLAGI"],
      qualityFlagJ: res["QUALITYFLAGJ"],
      qualityFlagK: res["QUALITYFLAGK"],
      qualityFlagL: res["QUALITYFLAGL"],
      qualityFlagM: res["QUALITYFLAGM"],
      qualityFlagN: res["QUALITYFLAGN"],
      providerId: res["PROVIDERID"],
      contractId: res["CONTRACTID"],
    };

    return truncateUndefined(transformed);
  };

  const editTableRows = (index, triggeredFormName) => {
    let rowInput = {};
    if (triggeredFormName === "LicenseTable") {
      rowInput = licenseTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "SpecialityTable") {
      rowInput = specialityTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "LocationTable") {
      rowInput = locationTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "PayToTable") {
      rowInput = payToTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "EducationTable") {
      rowInput = educationTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "TrainingTable") {
      rowInput = trainingTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "WorkTable") {
      rowInput = workTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "InsuranceTable") {
      rowInput = insuranceTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "CredentialTable") {
      rowInput = credentialTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    /////
    if (triggeredFormName === "FIRLTable") {
      rowInput = firlTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "CompensationTable") {
      rowInput = compensationTableRowsData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const mapFirlTable = (res) => {
    const transformed = {
      providerNo: res["PROVIDERNO"],
      component: res["COMPONENT"],
      currentRate: res["CURRENTRATE"],
      newRate: res["NEWRATE"],
      comment: res["COMMENT"],
    };

    return truncateUndefined(transformed);
  };

  const mapCompensationTable = (res) => {
    const transformed = {
      rate: res["RATE"],
      schedule: res["SCHEDULE"],
      speciality: res["SPECIALITY"],
    };

    return truncateUndefined(transformed);
  };
  //Till Here

  const mapLinearProviderTable = (res) => {
    const transformed = {
      newPatients: res["NEWPATIENTS"],

      medicareId: res["MEDICAREID"],
      firstName: res["FIRSTNAME"],
      caqhNpiId: res["NPIID"],
      middleName: res["MIDDLENAME"],
      lastName: res["LASTNAME"],
      ecfmgNumber: res["ECFMGNUMBER"],
      ecfmgIssueDate: res["ECFMGISSUEDATE#date"]
        ? new Date(res["ECFMGISSUEDATE#date"])
        : "",
      gender: res["GENDER"],
      organizationName: res["ORGANIZATIONNAME"],
      caqhId: res["CAQHID"],
      ecfmgExpirationDate: res["ECFMGEXPIRATIONDATE#date"]
        ? new Date(res["ECFMGEXPIRATIONDATE#date"])
        : "",
      suffix: res["SUFFIX"],
      delegated: res["DELEGATED"],
      attestationId: res["ATTESTATIONID"],
      providerId: res["PROVIDERID"],
      attestationDate: res["ATTESTATIONDATE#date"]
        ? new Date(res["ATTESTATIONDATE#date"])
        : "",
      ecfmgFlag: res["ECFMGFLAG"],
      ssn: res["SSN"],
      contractId: res["CONTRACTID"],
      agesSeen: res["AGESSEEN"],
      medicaidId: res["MEDICAIDID"],
      emailId: res["EMAILID"],
      dateOfBirth: res["DATE_OF_BIRTH#date"]
        ? new Date(res["DATE_OF_BIRTH#date"])
        : "",
      ProviderStatus: res["PROVIDERSTATUS"],
      states: res["STATES"],
      Medicare: res["MEDICARE"],
    };

    return truncateUndefined(transformed);
  };

  const mapLinearFacAncilTable = (res) => {
    const transformed = {
      newPatients: res["NEWPATIENTS"],

      medicareId: res["MEDICAREID"],
      firstName: res["FIRSTNAME"],
      npiId: res["NPIID"],
      middleName: res["MIDDLENAME"],
      lastName: res["LASTNAME"],
      ecfmgNumber: res["ECFMGNUMBER"],
      ecfmgIssueDate: res["ECFMGISSUEDATE#date"]
        ? new Date(res["ECFMGISSUEDATE#date"])
        : "",
      gender: res["GENDER"],
      organizationName: res["ORGANIZATIONNAME"],
      caqhId: res["CAQHID"],
      ecfmgExpirationDate: res["ECFMGEXPIRATIONDATE#date"]
        ? new Date(res["ECFMGEXPIRATIONDATE#date"])
        : "",
      suffix: res["SUFFIX"],
      delegated: res["DELEGATED"],
      attestationId: res["ATTESTATIONID"],
      providerId: res["PROVIDERID"],
      attestationDate: res["ATTESTATIONDATE#date"]
        ? new Date(res["ATTESTATIONDATE#date"])
        : "",
      ecfmgFlag: res["ECFMGFLAG"],
      ssn: res["SSN"],
      contractId: res["CONTRACTID"],
      agesSeen: res["AGESSEEN"],
      medicaidId: res["MEDICAIDID"],
      emailId: res["EMAILID"],
      legalEntityName: res["LEGALENTITYNAME"],
      dbaName: res["DBANAME"],
      FaciAnciStatus: res["FACIANCISTATUS"],
      states: res["STATES"],
      Medicare: res["MEDICARE"],
    };

    return truncateUndefined(transformed);
  };

  const mapLicenseTable = (res) => {
    const transformed = {
      license: res["LICENSENO"],
      stateAbbreviation: res["STATEABBREVIATION"],
      type: res["TYPE"],
      licenseType: res["LICENSETYPE"],
      expirationDate: res["EXPIRATIONDATE"],
    };

    return truncateUndefined(transformed);
  };

  const mapSpecialityTable = (res) => {
    const transformed = {
      speciality: !!res["SPECIALITY"] ? res["SPECIALITY"] : undefined,
      subSpeciality: !!res["SUBSPECIALITY"] ? res["SUBSPECIALITY"] : undefined,

      //Added by Nidhi Gupta on 07/26/2023
      specPrimary: !!res["PRIMARYSPECIALITY"]
        ? res["PRIMARYSPECIALITY"] === "Y"
          ? "Yes"
          : res["PRIMARYSPECIALITY"] === "N"
          ? "No"
          : ""
        : undefined,
      //Till Here
      pcp: !!res["PCP"] ? (res["PCP"] == "Y" ? "Yes" : "No") : undefined,
      hsdCode: !!res["HSDCODE"] ? res["HSDCODE"] : undefined,
      taxonomyCode: !!res["TAXONOMYCODE"] ? res["TAXONOMYCODE"] : undefined,
      taxonomyDesc: !!res["TAXONOMYDESCRIPTION"]
        ? res["TAXONOMYDESCRIPTION"]
        : undefined,
      taxonomyGrp: !!res["TAXONOMYGROUP"] ? res["TAXONOMYGROUP"] : undefined,
      boardCerti: !!res["BOARDCERTIFICATE"]
        ? res["BOARDCERTIFICATE"] === "Y"
          ? "Yes"
          : res["BOARDCERTIFICATE"] === "N"
          ? "No"
          : ""
        : undefined,
    };

    return truncateUndefined(transformed);
  };
  const mapProviderAddressTable = (res) => {
    const transformed = {
      //Added by Nidhi Gupta on 07/26/2023
      locationName: res["LOCATIONNAME"],
      languages: res["LANGUAGES"],
      npi: res["NPI"],
      addressType: res["ADDRESSTYPE"],
      officePhoneNumber: res["OFFICEPHONENUMBER"],
      officeFaxNumber: res["OFFICEFAXNUMBER"],
      tddPhone: res["TDDPHONE"],
      electronicHealthRecord:
        res["ELECTRONICHEALTHRECORD"] === "Y"
          ? "YES"
          : res["ELECTRONICHEALTHRECORD"] === "N"
          ? "NO"
          : "",
      publicTransportation:
        res["PUBLICTRANSPORTATION"] === "Y"
          ? "YES"
          : res["PUBLICTRANSPORTATION"] === "N"
          ? "NO"
          : "",
      handicapAccess:
        res["HANDICAPACCESS"] === "Y"
          ? "YES"
          : res["HANDICAPACCESS"] === "N"
          ? "NO"
          : "",
      tddHearing:
        res["TDDHEARING"] === "Y"
          ? "YES"
          : res["TDDHEARING"] === "N"
          ? "NO"
          : "",
      // placeInDirectory:((res["PLACEINDIRECTORY"] === 'Y') ? 'YES' : res["PLACEINDIRECTORY"] === 'N' ?'NO' : ''),
      placeInDirectory: res["PLACEINDIRECTORY"],
      telemedicine: res["TELEMEDICINE"],
      //Till Here
      address1: res["ADDRESS1"],
      address2: res["ADDRESS2"],
      city: res["CITY"],
      zipCode: res["ZIPCODE"],
      county: res["COUNTY"],
      stateValue: res["STATEVALUE"],
    };

    return truncateUndefined(transformed);
  };

  const mapPayToTable = (res) => {
    const transformed = {
      //Added by Nidhi Gupta on 07/26/2023
      taxId: !!res["TAXID"] ? res["TAXID"] : undefined,
      locationName: !!res["LOCATIONNAME"] ? res["LOCATIONNAME"] : undefined,
      county: !!res["COUNTY"] ? res["COUNTY"] : undefined,
      payToNpi: !!res["PAYTONPI"] ? res["PAYTONPI"] : undefined,
      address1: !!res["ADDRESS1"] ? res["ADDRESS1"] : undefined,
      //Till Here

      address2: !!res["ADDRESS2"] ? res["ADDRESS2"] : undefined,
      city: !!res["CITY"] ? res["CITY"] : undefined,
      stateValue: !!res["STATEVALUE"] ? res["STATEVALUE"] : undefined,
      zipCode: !!res["ZIPCODE"] ? res["ZIPCODE"] : undefined,
    };

    return truncateUndefined(transformed);
  };

  const mapWorkHistoryTable = (res) => {
    const transformed = {
      empName: res["EMPNAME"],
      startDate: res["STARTDATE"],
      endDate: res["ENDDATE"],
      currentEmp: res["CURRENTEMP"],
      depReason: res["DEPREASON"],
    };

    return truncateUndefined(transformed);
  };

  const mapInsuranceTable = (res) => {
    const transformed = {
      policyNo: res["POLICYNO"],
      insuredName: res["INSUREDNAME"],
      effectiveDate: res["EFFECTIVEDATE"],
      expirationDate: res["EXPIRATIONDATE"],
      covAmount: res["COVAMOUNT"],
      covAmountAgg: res["COVAMOUNTAGG"],
    };

    return truncateUndefined(transformed);
  };

  const mapEducationTable = (res) => {
    const transformed = {
      graduateType: res["POLICYNO"],
      professionalSchool: res["INSUREDNAME"],
      degree: res["EFFECTIVEDATE"],
      graduationDate: res["EXPIRATIONDATE"],
      covAmount: res["COVAMOUNT"],
      covAmountAgg: res["COVAMOUNTAGG"],
    };

    return truncateUndefined(transformed);
  };

  const truncateUndefined = (transformed) => {
    console.log("truncateUndefined transformed;", transformed);

    let result = {};
    Object.keys(transformed).forEach((key) => {
      //console.log("truncateUndefined transformed location;", !!transformed[key]);
      if (!!transformed[key]) {
        result = {
          ...result,
          [key]: transformed[key],
        };
      }
    });

    return result;
  };

  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
    console.log("Inside handleGridFieldChange: ", triggeredFormName);
    let rowsInput = "";
    const { name, value } = evnt.target;
    if (triggeredFormName === "LicenseTable") {
      //console.log('Inside LicenseTable');
      rowsInput = [...licenseTableRowsData];
    }
    if (triggeredFormName === "SpecialityTable") {
      //console.log('Inside SpecialityTable');
      rowsInput = [...specialityTableRowsData];
    }

    if (triggeredFormName === "LocationTable") {
      //console.log('Inside LicenseTable');
      rowsInput = [...locationTableRowsData];
    }

    if (triggeredFormName === "PayToTable") {
      //console.log('Inside LicenseTable');
      rowsInput = [...payToTableRowsData];
    }
    if (triggeredFormName === "EducationTable") {
      //console.log('Inside EducationTable');
      rowsInput = [...educationTableRowsData];
    }

    if (triggeredFormName === "TrainingTable") {
      //console.log('Inside TrainingTable');
      rowsInput = [...trainingTableRowsData];
    }

    if (triggeredFormName === "WorkTable") {
      rowsInput = [...workTableRowsData];
    }

    if (triggeredFormName === "InsuranceTable") {
      rowsInput = [...insuranceTableRowsData];
    }

    if (triggeredFormName === "CredentialTable") {
      rowsInput = [...credentialTableRowsData];
    }
    //Added by Nidhi Gupta on 10/16/2023
    value = value.toUpperCase();
    /////
    rowsInput[index][name] = value;
    if (triggeredFormName === "LicenseTable") {
      setLicenseTableRowsData(rowsInput);
    }
    if (triggeredFormName === "SpecialityTable") {
      setspecialityTableRowsData(rowsInput);

      //Fixed by Nidhi Gupta
    }
    if (triggeredFormName === "LocationTable") {
      setLocationTableRowsData(rowsInput);
    }
    if (triggeredFormName === "PayToTable") {
      setPayToTableRowsData(rowsInput);
    }
    if (triggeredFormName === "EducationTable") {
      setEducationTableRowsData(rowsInput);
    }
    if (triggeredFormName === "TrainingTable") {
      setTrainingTableRowsData(rowsInput);
    }
    if (triggeredFormName === "WorkTable") {
      setWorkTableRowsData(rowsInput);
    }
    if (triggeredFormName === "InsuranceTable") {
      const regex = /^[0-9\b.]+$/;
      if (name === "covAmount" || name === "covAmountAgg") {
        if (value === "" || regex.test(value)) {
          rowsInput[index][name] = value;
        } else {
          let newVal = value;

          newVal = newVal.substring(0, newVal.length - 1);
          rowsInput[index][name] = newVal;
        }
      }
      setInsuranceTableRowsData(rowsInput);
    }

    if (triggeredFormName === "CredentialTable") {
      setCredentialTableRowsData(rowsInput);
    }
  };

  const handleGridSelectChange = (
    index,
    selectedValue,
    evnt,
    triggeredFormName
  ) => {
    let rowsInput = "";
    const { name } = evnt;
    if (triggeredFormName === "SpecialityTable") {
      rowsInput = [...specialityTableRowsData];
    }
    if (triggeredFormName === "LicenseTable") {
      rowsInput = [...licenseTableRowsData];
    }
    if (triggeredFormName === "LocationTable") {
      rowsInput = [...locationTableRowsData];
    }
    if (triggeredFormName === "PayToTable") {
      rowsInput = [...payToTableRowsData];
    }
    if (triggeredFormName === "EducationTable") {
      rowsInput = [...educationTableRowsData];
    }
    if (triggeredFormName === "TrainingTable") {
      rowsInput = [...trainingTableRowsData];
    }
    if (triggeredFormName === "WorkTable") {
      rowsInput = [...workTableRowsData];
    }
    if (triggeredFormName === "InsuranceTable") {
      rowsInput = [...insuranceTableRowsData];
    }
    if (triggeredFormName === "CredentialTable") {
      rowsInput = [...credentialTableRowsData];
    }

    if (evnt.action === "clear") {
      delete rowsInput[index][name];
    } else {
      rowsInput[index][name] = selectedValue;
    }
    if (triggeredFormName === "SpecialityTable") {
      //Added Newly by Nidhi Gupta on 05/22/2023
      if (
        evnt.name == "speciality" &&
        selectedValue &&
        selectValues.specialtyOptions &&
        selectValues.specialtyOptions.length > 0
      ) {
        console.log("Inside select change heloooooo");
        const foundOption = selectValues.specialtyOptions.find(
          (option) => option.speciality === selectedValue.value
        );
        console.log("Inside select change foundOption: ", foundOption);
        if (
          foundOption !== undefined &&
          "hsdCodeValue" in foundOption &&
          foundOption.hsdCodeValue !== null &&
          foundOption.hsdCodeValue !== undefined
        ) {

          rowsInput[index]["hsdCode"] = foundOption.hsdCodeValue;
        } else {
          rowsInput[index]["hsdCode"] = "";
        }
        const subSpecialityValues = selectValues.specialtyOptions
          .filter((el) => el.speciality === selectedValue.value)
          .map((elem) => {
            return { label: elem.subSpeciality, value: elem.subSpeciality };
          });

        setSubSpecialityOptions(subSpecialityValues);
        setspecialityTableRowsData(rowsInput);
      }
      //Till here
      setspecialityTableRowsData(rowsInput);
    }
    if (triggeredFormName === "LicenseTable") {
      setLicenseTableRowsData(rowsInput);
    }
    if (triggeredFormName === "LocationTable") {
      setLocationTableRowsData(rowsInput);
    }
    if (triggeredFormName === "PayToTable") {
      setPayToTableRowsData(rowsInput);
    }
    if (triggeredFormName === "EducationTable") {
      setEducationTableRowsData(rowsInput);
    }
    if (triggeredFormName === "TrainingTable") {
      setTrainingTableRowsData(rowsInput);
    }
    if (triggeredFormName === "WorkTable") {
      setWorkTableRowsData(rowsInput);
    }
    if (triggeredFormName === "InsuranceTable") {
      setInsuranceTableRowsData(rowsInput);
    }
    if (triggeredFormName === "CredentialTable") {
      setCredentialTableRowsData(rowsInput);
    }
  };

  const deleteTableRows = () => {};

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
    //console.log("Converted JSON: ",jsonObj);
    return jsonObj;
  };

  const renameKey = (obj, oldKey, newKey) => {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  };

  const RenderDatePicker = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Date of Birth" />
      <label htmlFor="datePicker">Date Of Birth</label>
    </div>
  );

  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null
        )}
      </ValueContainer>
    );
  };

  const RenderDatePicker02 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="ECFMG Issue Date" />
      <label htmlFor="datePicker">ECFMG Issue Date</label>
    </div>
  );

  const RenderDatePicker03 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="ECFMG Expiration Date" />
      <label htmlFor="datePicker">ECFMG Expiration Date</label>
    </div>
  );

  const RenderDatePicker04 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Attestation Date" />
      <label htmlFor="datePicker">Attestation Date</label>
    </div>
  );

  const populateForm = () => {
    return (
      <div className="col-xs-12">
        <div
          className="accordion AddProviderLabel"
          id="accordionPanelsStayOpenExample"
        >
          <Formik
            enableReinitialize={formikInitializeState}
            initialValues={apiTestState}
            onSubmit={async (values) => {
              await new Promise((resolve) => setTimeout(resolve, 500));
              saveData(values);
            }}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
              } = props;

              return (
                <form disabled={false} onSubmit={(e) => e.preventDefault()}>
                  <fieldset
                  // disabled  //Commented by Nidhi Gupta on 9/15/2023 as eye button was also getting disabled in grids
                  >
                    {Globalsearch.displayName == "Provider" && (
                      <div className="accordion-item" id="providerInformation">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Provider"
                        >
                          <button
                            className="accordion-button accordionButtonStyle disableElements"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseProvider"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            Provider Information
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseProvider"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Provider"
                        >
                          <div className="accordion-body">
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="organizationName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    //console.log("OrgName Field: ",field);
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Legal Entity Name
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="organizationName"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="firstName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        id="firstName"
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />

                                      <label htmlFor="floatingInputGrid">
                                        First Name
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="firstName"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="middleName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value ||
                                              field.value === null
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Middle Name
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="middleName"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="lastName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Last Name
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="lastName"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="suffix">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Suffix
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="suffix"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <div className="form-floating">
                                  <Select
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

                                      container: (provided, state) => ({
                                        ...provided,
                                        marginTop: 0,
                                      }),
                                      valueContainer: (provided, state) => ({
                                        ...provided,
                                        overflow: "visible",
                                      }),
                                      placeholder: (provided, state) => ({
                                        ...provided,
                                        position: "absolute",
                                        top:
                                          state.hasValue ||
                                          state.selectProps.inputValue
                                            ? -15
                                            : "50%",
                                        transition: "top 0.1s, font-size 0.1s",
                                        fontSize:
                                          (state.hasValue ||
                                            state.selectProps.inputValue) &&
                                          13,
                                      }),
                                    }}
                                    components={{
                                      ValueContainer: CustomValueContainer,
                                    }}
                                    name="gender"
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Male", value: "Male" },
                                      { label: "Female", value: "Female" },
                                    ]}
                                    id="genderDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event
                                      )
                                    }
                                    value={apiTestState.gender}
                                    placeholder="Gender"
                                    //styles={{...customStyles}}
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="caqhId" innerRef={caqhId}>
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        //oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        CAQH ID
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="caqhId"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="caqhNpiId" validate={checkLuhn}>
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        //oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        NPI ID
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="caqhNpiId"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <div>
                                  <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={apiTestState.dateOfBirth}
                                    name="dateOfBirth"
                                    onChange={(event) =>
                                      handleDateChange(event, "dateOfBirth")
                                    }
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    onKeyDown={(e) => {
                                      e.preventDefault();
                                    }}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    disabled
                                    //placeholder="Date Of Birth"
                                    customInput={<RenderDatePicker />}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="ssn">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="9"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        SSN
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="ssn"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <div className="form-floating">
                                  <Select
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

                                      container: (provided, state) => ({
                                        ...provided,
                                        marginTop: 0,
                                      }),
                                      valueContainer: (provided, state) => ({
                                        ...provided,
                                        overflow: "visible",
                                      }),
                                      placeholder: (provided, state) => ({
                                        ...provided,
                                        position: "absolute",
                                        top:
                                          state.hasValue ||
                                          state.selectProps.inputValue
                                            ? -15
                                            : "50%",
                                        transition: "top 0.1s, font-size 0.1s",
                                        fontSize:
                                          (state.hasValue ||
                                            state.selectProps.inputValue) &&
                                          13,
                                      }),
                                    }}
                                    components={{
                                      ValueContainer: CustomValueContainer,
                                    }}
                                    name="agesSeen"
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={selectValues.agesSeenArray}
                                    //options={[{label:selectValues.agesSeenArray, value:selectValues.agesSeenArray}]}

                                    id="agesSeenDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event
                                      )
                                    }
                                    value={apiTestState.agesSeen}
                                    placeholder="Ages Seen"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="medicareId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Medicare Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="medicareId"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>

                            <div className="row my-2"></div>

                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="medicaidId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="15"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Medicaid Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="medicaidId"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <div className="form-floating">
                                  <Select
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

                                      container: (provided, state) => ({
                                        ...provided,
                                        marginTop: 0,
                                      }),
                                      valueContainer: (provided, state) => ({
                                        ...provided,
                                        overflow: "visible",
                                      }),
                                      placeholder: (provided, state) => ({
                                        ...provided,
                                        position: "absolute",
                                        top:
                                          state.hasValue ||
                                          state.selectProps.inputValue
                                            ? -15
                                            : "50%",
                                        transition: "top 0.1s, font-size 0.1s",
                                        fontSize:
                                          (state.hasValue ||
                                            state.selectProps.inputValue) &&
                                          13,
                                      }),
                                    }}
                                    components={{
                                      ValueContainer: CustomValueContainer,
                                    }}
                                    name="newPatients"
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Yes", value: "Yes" },
                                      { label: "No", value: "No" },
                                    ]}
                                    id="newPatientsDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event
                                      )
                                    }
                                    value={apiTestState.newPatients}
                                    placeholder="Accepting New Patients"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="emailId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="50"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Email Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="emailId"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>

                            {/* New Nidhi */}
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <div className="form-floating">
                                  <Select
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

                                      container: (provided, state) => ({
                                        ...provided,
                                        marginTop: 0,
                                      }),
                                      valueContainer: (provided, state) => ({
                                        ...provided,
                                        overflow: "visible",
                                      }),
                                      placeholder: (provided, state) => ({
                                        ...provided,
                                        position: "absolute",
                                        top:
                                          state.hasValue ||
                                          state.selectProps.inputValue
                                            ? -15
                                            : "50%",
                                        transition: "top 0.1s, font-size 0.1s",
                                        fontSize:
                                          (state.hasValue ||
                                            state.selectProps.inputValue) &&
                                          13,
                                      }),
                                    }}
                                    components={{
                                      ValueContainer: CustomValueContainer,
                                    }}
                                    name="delegated"
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Yes", value: "Yes" },
                                      { label: "No", value: "No" },
                                    ]}
                                    id="delegatedDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event
                                      )
                                    }
                                    value={apiTestState.delegated}
                                    //   defaultValue={{ label: 'Yes', value: 'Yes' }}
                                    placeholder="Delegated"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="contractId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="9"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Contract Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                      {/* <p>Format: xxx-xxx-xxxx</p> */}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="contractId"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>
                            {/* here */}
                          </div>
                        </div>
                      </div>
                    )}
                    {Globalsearch.displayName == "Provider" && (
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Products"
                        >
                          <button
                            className="accordion-button accordionButtonStyle disableElements"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseProducts"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            Products
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseProducts"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Products"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-xs-6 col-md-3">
                                <label htmlFor="medicaidSwitch">Medicare</label>
                                <br />
                                <Switch
                                  id="medicareSwitch"
                                  name="medicare"
                                  onChange={(isChecked) => {
                                    if (formikInitializeState) {
                                      setFormikInitializeState(false);
                                    }
                                    setApiTestState({
                                      ...apiTestState,
                                      Medicare: isChecked,
                                    });
                                  }}
                                  checked={
                                    apiTestState.Medicare !== undefined
                                      ? apiTestState.Medicare
                                      : false
                                  }
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  disabled
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <div className="form-floating">
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        height: "58px",
                                        fontWeight: "lighter",
                                        overflowY: "scroll",
                                      }),
                                      menuList: (provided) => ({
                                        ...provided,
                                        maxHeight: 200,
                                      }),
                                      menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999,
                                      }),
                                      container: (provided, state) => ({
                                        ...provided,
                                        marginTop: 0,
                                      }),
                                      valueContainer: (provided, state) => ({
                                        ...provided,
                                        overflow: "visible",
                                      }),
                                      placeholder: (provided, state) => ({
                                        ...provided,
                                        position: "absolute",
                                        top:
                                          state.hasValue ||
                                          state.selectProps.inputValue
                                            ? -15
                                            : "50%",
                                        transition: "top 0.1s, font-size 0.1s",
                                        fontSize:
                                          (state.hasValue ||
                                            state.selectProps.inputValue) &&
                                          13,
                                      }),
                                    }}
                                    components={{
                                      ValueContainer: CustomValueContainer,
                                    }}
                                    name="states"
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={selectValues.stateOptionsLinear}
                                    id="statesDropdown"
                                    isMulti={true}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event
                                      )
                                    }
                                    value={apiTestState.states}
                                    placeholder="States"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="ProviderStatus">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    //console.log("OrgName Field: ",field);
                                    <div className="form-floating">
                                      <input
                                        maxLength="20"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Provider Status
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="ProviderStatus"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {Globalsearch.displayName !== "Provider" && (
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Provider"
                        >
                          <button
                            className="accordion-button accordionButtonStyle disableElements"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseProvider"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            {Globalsearch.displayName} Information
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseProvider"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Provider"
                        >
                          <div className="accordion-body">
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="legalEntityName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    //console.log("OrgName Field: ",field);
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      {/*  {formName.current==="Ancillary/Facility Demographic Modification"?disabled:''} */}

                                      <label htmlFor="floatingInputGrid">
                                        Legal Entity Name
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="legalEntityName"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="dbaName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        DBA Name
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="dbaName"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="npiId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        // oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"

                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        NPI ID
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="npiId"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>

                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="medicareId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Medicare Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="medicareId"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="medicaidId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Medicaid Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="medicaidId"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="emailId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="50"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Email Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="emailId"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>
                            <div className="row my-2">
                              {/* {formName.current != 'Add an Ancillary' ? (  */}
                              <div className="col-xs-6 col-md-4">
                                <div className="form-floating">
                                  <Select
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

                                      container: (provided, state) => ({
                                        ...provided,
                                        marginTop: 0,
                                      }),
                                      valueContainer: (provided, state) => ({
                                        ...provided,
                                        overflow: "visible",
                                      }),
                                      placeholder: (provided, state) => ({
                                        ...provided,
                                        position: "absolute",
                                        top:
                                          state.hasValue ||
                                          state.selectProps.inputValue
                                            ? -15
                                            : "50%",
                                        transition: "top 0.1s, font-size 0.1s",
                                        fontSize:
                                          (state.hasValue ||
                                            state.selectProps.inputValue) &&
                                          13,
                                      }),
                                    }}
                                    components={{
                                      ValueContainer: CustomValueContainer,
                                    }}
                                    name="delegated"
                                    isDisabled="true"
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Yes", value: "Yes" },
                                      { label: "No", value: "No" },
                                    ]}
                                    id="delegatedDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                        values
                                      )
                                    }
                                    value={apiTestState.delegated}
                                    placeholder="Delegated"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>

                              {/* ): (<div/>)} */}

                              <div className="col-xs-6 col-md-4">
                                <Field name="contractId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="9"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Contract Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                      {/* <p>Format: xxx-xxx-xxxx</p> */}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="contractId"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {Globalsearch.displayName !== "Provider" && (
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Products"
                        >
                          <button
                            className="accordion-button accordionButtonStyle disableElements"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseProducts"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            Products
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseProducts"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Products"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-xs-6 col-md-3">
                                <label htmlFor="medicaidSwitch">Medicare</label>
                                <br />
                                <Switch
                                  id="medicareSwitch"
                                  name="medicare"
                                  onChange={(isChecked) => {
                                    if (formikInitializeState) {
                                      setFormikInitializeState(false);
                                    }
                                    setApiTestState({
                                      ...apiTestState,
                                      Medicare: isChecked,
                                    });
                                  }}
                                  checked={
                                    apiTestState.Medicare !== undefined
                                      ? apiTestState.Medicare
                                      : false
                                  }
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  disabled
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <div className="form-floating">
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        height: "58px",
                                        fontWeight: "lighter",
                                        overflowY: "scroll",
                                      }),
                                      menuList: (provided) => ({
                                        ...provided,
                                        maxHeight: 200,
                                      }),
                                      menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999,
                                      }),
                                      container: (provided, state) => ({
                                        ...provided,
                                        marginTop: 0,
                                      }),
                                      valueContainer: (provided, state) => ({
                                        ...provided,
                                        overflow: "visible",
                                      }),
                                      placeholder: (provided, state) => ({
                                        ...provided,
                                        position: "absolute",
                                        top:
                                          state.hasValue ||
                                          state.selectProps.inputValue
                                            ? -15
                                            : "50%",
                                        transition: "top 0.1s, font-size 0.1s",
                                        fontSize:
                                          (state.hasValue ||
                                            state.selectProps.inputValue) &&
                                          13,
                                      }),
                                    }}
                                    components={{
                                      ValueContainer: CustomValueContainer,
                                    }}
                                    name="states"
                                    isDisabled="true"
                                    //isDisabled={(tabRef.current === 'DashboardView' && (props.lockStatus !== undefined && props.lockStatus === 'Y') ? true : false)}
                                    className="basic-multi-select"
                                    options={selectValues.stateOptionsLinear}
                                    id="statesDropdown"
                                    isMulti={true}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event
                                      )
                                    }
                                    value={apiTestState.states}
                                    placeholder="States"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="FaciAnciStatus">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="20"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        {Globalsearch.displayName} Status
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="FaciAnciStatus"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-License"
                      >
                        <button
                          className="accordion-button accordionButtonStyle disableElements"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseLicense"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          Profession
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseLicense"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-License"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-xs-6 col-md-12">
                              <LicenseTable
                                licenseTableRowsData={licenseTableRowsData}
                                //addTableRows={addTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                //handleGridDateChange={handleGridDateChange}
                                handleGridFieldChange={handleGridFieldChange}
                                //gridRowsFinalSubmit={gridRowsFinalSubmit}
                                selectJson={selectValues}
                                gridFieldTempState={gridFieldTempState}
                                editTableRows={editTableRows}
                                lockStatus={"V"}
                                fetchAutoPopulate={fetchAutoPopulate}
                              ></LicenseTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-Speciality"
                      >
                        <button
                          className="accordion-button accordionButtonStyle disableElements"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseSpeciality"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          Specialty
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseSpeciality"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Speciality"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-xs-6 col-md-12">
                              <SpecialityTable
                                specialityTableRowsData={
                                  specialityTableRowsData
                                }
                                //addTableRows={addTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                handleGridFieldChange={handleGridFieldChange}
                                //gridRowsFinalSubmit={gridRowsFinalSubmit}
                                selectJson={selectValues}
                                gridFieldTempState={gridFieldTempState}
                                editTableRows={editTableRows}
                                lockStatus={"V"}
                                handleGridOnBlur={handleGridOnBlur}
                                handleSelectSpecialityOnBlur={
                                  handleSelectSpecialityOnBlur
                                }
                                fetchAutoPopulate={fetchAutoPopulate}
                                subSpecialityOptions={subSpecialityOptions}
                              ></SpecialityTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-Address"
                      >
                        <button
                          className="accordion-button accordionButtonStyle disableElements"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseAddress"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          {Globalsearch.displayName} Address
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseAddress"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Address"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-xs-6 col-md-12">
                              <LocationTable
                                locationTableRowsData={locationTableRowsData}
                                //addTableRows={addTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                handleGridFieldChange={handleGridFieldChange}
                                //gridRowsFinalSubmit={gridRowsFinalSubmit}
                                selectJson={selectValues}
                                //calledFormName={GlobalsearchProvider.validate}
                                modifyValidatedAddressRow={
                                  modifyValidatedAddressRow
                                }
                                lockStatus={"V"}
                                gridFieldTempState={gridFieldTempState}
                                editTableRows={editTableRows}
                                //lockStatus={(prop.state !== null && prop.state.lockStatus !== undefined) ? prop.state.lockStatus : 'N'}
                                fetchAutoPopulate={fetchAutoPopulate}
                              ></LocationTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="panelsStayOpen-Pay">
                        <button
                          className="accordion-button accordionButtonStyle disableElements"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapsePay"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          Pay To
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapsePay"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Pay"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-xs-6 col-md-12">
                              <PayToTable
                                payToTableRowsData={payToTableRowsData}
                                //addTableRows={addTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                handleGridFieldChange={handleGridFieldChange}
                                //gridRowsFinalSubmit={gridRowsFinalSubmit}
                                selectJson={selectValues}
                                //calledFormName={GlobalsearchProvider.validate}
                                modifyValidatedAddressPayToRow={
                                  modifyValidatedAddressPayToRow
                                }
                                gridFieldTempState={gridFieldTempState}
                                editTableRows={editTableRows}
                                lockStatus={"V"}
                                //lockStatus={(prop.state !== null && prop.state.lockStatus !== undefined) ? prop.state.lockStatus : 'N'}
                                fetchAutoPopulate={fetchAutoPopulate}
                              ></PayToTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 30,
                        marginBottom: 20,
                      }}
                    >
                      <button
                        id="mainFormSubmit"
                        type="button"
                        className="providerPageButton button"
                        onClick={(event) => {
                          handleSubmit(event);
                        }}
                        style={{ display: "none" }}
                      >
                        {isSubmitting ? "Saving" : "Save"}
                      </button>
                    </div>
                  </fieldset>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    );
  };

  const populateFormBasisOnType = () => {
    return (
      <>
        <Tabs
          defaultActiveKey={props.formName}
          id="justify-tab-example"
          className="mb-3"
          justify
          onSelect={(key) => handleTabSelect(key)}
        >
          <Tab eventKey={props.formName} title={props.formName}>
            {populateForm()}
          </Tab>

          {/*Added by Nidhi Gupta on 10/09/2023*/}
          <Tab eventKey="Compensation" title="Network">
            <CompensationTab
              apiTestStateComp={apiTestStateComp}
              firlTableRowsData={firlTableRowsData}
              compensationTableRowsData={compensationTableRowsData}
              deleteTableRows={deleteTableRows}
              editTableRows={editTableRows}
              gridFieldTempState={gridFieldTempState}
              lockStatus={"V"}
              type={"ShowEye"}
            ></CompensationTab>
          </Tab>

                    <Tab eventKey="Document" title="Document">
                        <DocumentTab providerId = {props.providerId} contractId = {props.contractId}
                        caseNumber = {props.caseNumber} selectedType={props.selectedType} searchType={'SelfService'}/>
                    </Tab>
                </Tabs>
            </>
        )

    }

  return (
    <>
      {!!Globalsearch.displayName && (
        <div
          className="AddProvider backgroundColor"
          style={{ minHeight: "100vh" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-xs-6" style={{ textAlign: "center" }}>
                <br />
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  onClick={(event) => props.navigateHome()}
                  style={{ float: "left", marginLeft: "10px" }}
                >
                  Go To Home
                </button>
                <label
                  id="tileFormLabel"
                  className="HeadingStyle"
                  style={{ marginRight: "99px" }}
                >
                  {Globalsearch.displayName}
                </label>
              </div>
            </div>
          </div>
          <br />
          <div className="container">
            <div className="row">{populateFormBasisOnType()}</div>
          </div>
          <FooterComponent />
        </div>
      )}
    </>
  );
}
