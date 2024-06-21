import React, { useState } from 'react'
//import axios from 'axios';
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import useGetDBTables from './useGetDBTables';
import { useAxios } from '../../api/axios.hook';

export default function useUpdateDecision() {

  const [decisionState, setDecisionState] = useState({ decisionNotes: '' });
  const token = useSelector((state) => state.auth.token);
  const { getTableDetails, acceptNumbersOnly, extractDate } = useGetDBTables();

  const { customAxios } = useAxios();

  const handleSelectChange = (selectedValue, evnt) => {
    console.log("Decision Value selectedValue: ", selectedValue);
    console.log("Decision Value event: ", evnt);
    const { name } = evnt;
    setDecisionState({ ...decisionState, [name]: selectedValue });
  }

  const handleLinearFieldChange = (evt) => {
    const value = evt.target.value;
    setDecisionState({
      ...decisionState,
      [evt.target.name]: evt.target.value
    })
  }

  const updateDecision = (prop, saveType, transactionType) => {
    const decsn = (prop.state.decision === undefined) ? '' : prop.state.decision;
    let procInput = {};
    if (transactionType === 'Case Header') {
      procInput['descisionReason'] = (prop.state.decisionReason) ? prop.state.decisionReason:'';
    }        /*procInput.input1 = "testing";
        procInput.input2 = AddProvider.displayName;
        procInput.input3 = prop.state.caseNumber;*/
    procInput.option = 'UPDATEQUEUEVARIABLES';
    procInput.DecisionNotes = (prop.state.decisionNotes != undefined ) ? (prop.state.decisionNotes.trim()) : '';
    procInput.DECISION = decsn;
    procInput.StageName = prop.state.stageName;
    procInput.FlowId = prop.state.flowId;
    procInput.CaseNumber = prop.state.caseNumber;
    procInput.UserName = prop.state.userName;
    procInput.Type = saveType;
    procInput.Input2 = transactionType
    /*customAxios
      .post("/updateQueueVariableProcedure", procInput, {
        headers: { Authorization: `Bearer ${token}` },
      })*/
    printConsole("Update queue variable proc input===== ", procInput);
    customAxios
      .post("/generic/callProcedure", procInput, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Update Queue Variable Proc output: ", res);
        if (res.status === 200) {
          console.log(
            "Update Queue Variable Proc executed successully"
          );
        }
      })
      .catch((err) => {
        console.log(
          "Caught in update queue variable api call: ",
          err.message
        );
        alert("Error occured in updating queue variables.");
      });
  }

  const submitCase = (prop, navigateHome) => {
"Ready For Processing"
    console.log('Inside useUpdateDecision Decisionprav: ', prop.state);
    // console.log('Inside  useUpdateDecision Decision state: ',decisionState);
    let resJson = {};
    if ((prop.state.decision !== undefined && prop.state.decision !== '')) {
      const decsn = prop.state.decision;
      const updateInputs = new FormData();
      updateInputs.append('CaseId', Number(prop.state.caseNumber));
      //updateInputs.append('FlowId',2);
      updateInputs.append('FlowId', Number(prop.state.flowId));
      updateInputs.append('Decision', decsn);
      if (prop.state.formNames === 'Case Header') {
        updateInputs.append('descisionReason' , (prop.state.decisionReason) ?  prop.state.decisionReason:'');
      }  

                //const putApi =  + 'updateCaseDecision';
                axios.put('/updateCaseDecision', updateInputs, { headers: { 'Authorization': `Bearer ${token}` } }).then((res) => {
        console.log("updateCaseDecision put api data: ", res.data);
        if (res.status === 200) {
          let procInput = {};
          procInput.stageName = prop.state.stageName;
          procInput.userName = prop.state.userName;
          procInput.transactionType = prop.state.formNames;
          procInput.caseID = prop.state.caseNumber;
          procInput.decision = decsn;
          procInput.decNotes = (prop.state.decisionNotes === undefined) ? '' : prop.state.decisionNotes;
          procInput.flowId = prop.state.flowId;
          console.log("Final proc Input: ", procInput);
          //const procApi = apiUrl + "callProcedure";
          //console.log("procApi: ",procApi);
          axios.post('/callProcedure', procInput, { headers: { 'Authorization': `Bearer ${token}` } }).then((res) => {
            resJson = { ...res };
            console.log("resJson: ", resJson);
            if (res.status === 200) {
              console.log("Proc executed successully");
            }
            navigateHome();
            // return resJson;
          })
        }
      });

    }
    //const procInput = new FormData();
    //return resJson;
  }

  const updateLockStatus = (stat, caseNumber, userId, whereValue, apiToken) => {
    console.log('Inside updateLockStatus token value: ', apiToken);
    let loginToken = (apiToken !== undefined) ? apiToken : token;
    let gridData = {};
    let gridKeys = getTableDetails()['mainTable'][0];
    const tableName = gridKeys.substring(0, gridKeys.lastIndexOf('~'));
    let apiJs = {
      'LockStatus': stat,
      'LockedBy': (userId !== undefined || userId !== null) ? userId : 0
    };
    if (whereValue !== '') {
      apiJs.whereClause = whereValue;
    }
    let apiInputArr = [];
    apiInputArr.push(apiJs);
    gridData[tableName] = apiInputArr;
    if (caseNumber !== '') {
      gridData.caseNumber = caseNumber;
    }
    console.log("Inside updateLockStatus input params: ", gridData);
    axios.post("/generic/update", gridData, { headers: { 'Authorization': `Bearer ${loginToken}` } })
      .then((res) => {
        console.log("Data Update result: ", res);
        const apiStat = res.data['UpdateCase_Output']['Status']
      })
      .catch((err) => {
        console.log(err.message);
        //alert("Error in saving data");
      });
  }
  const validateGridData = (gridJson) => {
    console.log('Inside useUpdateDecision validateGridData: ', gridJson);
    let flag = true;
    gridJson.forEach((elem) => {
      const stat = ((elem?.status !== undefined && elem?.status !== null) ? ((elem.status.value !== undefined) ? elem.status.value : elem?.status) : elem?.status);
      // if((elem.status === undefined) || (elem.status === '')){
      if (elem?.status === undefined || elem?.status === null || stat === '') {
        flag = false;
      }
    })
    return flag
  }
  const validatePotentialDup = (gridJson) => {
    console.log('Inside useUpdateDecision validatePotentialDup: ', gridJson);
    let flag = true;
    gridJson.forEach((elem) => {
      if (elem.action === undefined || elem.action.value === undefined) {
        flag = false;
      }
    })
    return flag
  }

  const validatePotentialDupDec = (gridJson) => {
    console.log('Inside useUpdateDecision validatePotentialDup: ', gridJson);
    let flag = true;
    gridJson.forEach((elem) => {
      if (elem.action.value === 'Potential Duplicate') {
        flag = false;
      }
    })
    return flag
  }

  const printConsole = (msg, varToPrint) => {
    const consoleFlag = process.env.REACT_APP_CONSOLE_FLAG;
    if (consoleFlag === 'Y') {
      console.log(msg + ": ", varToPrint);
    }
  }

  const setContractIdDropDown = (mainTableData, secondData) => {
    let mainTableDataArr = [];
    if (mainTableData.length > 0) {
      mainTableData.forEach((elem) => {
        if (!mainTableDataArr.includes(elem.Field1)) {
          if (elem.Field1 !== null && elem.Field1 !== undefined && elem.Field1 !== '') {
            mainTableDataArr.push(elem.Field1);
          }

        }
      });

    }

    if (secondData.length > 0) {
      secondData.forEach((elem) => {
        if (!mainTableDataArr.includes(elem.contractid)) {
          if (elem.contractid !== null && elem.contractid !== undefined && elem.contractid !== '') {
            mainTableDataArr.push(elem.contractid);
          }
        }
      });
    }
    printConsole('Inside setContractIdDropDown mainTableDataArr after filtering: ', mainTableDataArr);
    let contArr = [];
    if (mainTableDataArr.length > 0) {
      mainTableDataArr.forEach((elem) => {
        contArr.push({ label: elem, value: elem });
      })
    }
    return contArr;
  }
  // Added by Shivani
  const mastersSelector = useSelector((masters) => masters);

  const getNPIFromMaster = (caqhNpiId, decision, callProc) => {
    let responseNPI = false;
    console.log("npimaster decision", decision, callProc);
    if (decision?.toLowerCase() !== 'discard' && callProc !== "notCallProc") {
      printConsole("Inside getNPIFromMaster master data", mastersSelector.masterExclusionList[0]);
      if (mastersSelector.masterExclusionList[0] !== undefined && mastersSelector.masterExclusionList[0] !== null) {

        let NPIres = mastersSelector.masterExclusionList[0].find(el => el.NPI === caqhNpiId);
        if (NPIres !== undefined) {
          responseNPI = true;
        }
      }
      return responseNPI;
    }
    else {
      return false;
    }
  }

  const getCountyFromMaster = (DataState, Zip) => {
    console.log("County data table", mastersSelector.masterCounty);
    console.log("DataState", DataState, Zip);
    let responseCounty = '';
    if (mastersSelector.masterCounty[0] !== undefined && mastersSelector.masterCounty[0] !== null) {
      mastersSelector.masterCounty[0].forEach((elem) => {
        if (elem.StateId === (DataState.trim()) && elem.ZipCodes.includes(Zip.trim())) {
          responseCounty = elem.CountyName.toUpperCase();
          return;
        }
      })
    }
    return responseCounty.trim();
  }

  const checkDecision = (decValue, curr) => {
    let isDiscard = true;
    if (curr !== 'callProc') {
      isDiscard = false;
      return isDiscard;
    }
    else {
      if (decValue !== '' && decValue !== undefined) {
        decValue = decValue.toUpperCase();
        if ((decValue === 'DISCARD') || (decValue === 'REJECT')) {
          isDiscard = true;
        }
        else {
          isDiscard = false;
        }
        return isDiscard;
      }
    }

  }

  const disableAllElements = (prop, View) => {
    console.log("Note Tab prop ", prop);
    let lockStat = 'N';
    if (View === 'PDM') {
      lockStat = 'Y';
    }
    else {
      if (prop.state.lockStatus === 'Y' || prop.state.stageName === 'Exit' || prop.state.stageName === 'Discard') {
        lockStat = 'Y';
      }
    }
    if (lockStat === 'Y') {
      let nodes = document.querySelectorAll('.disableElements');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].style.pointerEvents = "none";
        //   let NodeColor = document.getElementsByTagName('Input');
        //   for( var j=0;j<NodeColor.length;j++){
        //   NodeColor[j].style.background = '#D3D3D3';
        //   }

        let NodeColor = document.querySelectorAll('Input,textarea');
        //console.log("NodesColor8",NodeColor[8].id);

        for (var j = 0; j < NodeColor.length; j++) {
          let id = NodeColor[j].id;
          if (!id.includes("react-select")) {
            NodeColor[j].style.background = '#F0F0F0';
          }
        }
      }
    }
  }


  const formatPhoneNumber = (input) => {
    if (!input)
      return input;

    console.log("Input of phone number", input);
    input = acceptNumbersOnly(input);
    input = input.toString();
    const numberInput = input.replace(/[^\d]/g, "");
    const numberInputLength = numberInput.length;
    if (numberInputLength < 4) {
      return numberInput;
    } else if (numberInputLength < 7) {
      return `(${numberInput.slice(0, 3)}) ${numberInput.slice(3)}`;
    } else {
      return `(${numberInput.slice(0, 3)}) ${numberInput.slice(
        3,
        6
      )}-${numberInput.slice(6, 10)}`;
    }
    return "";
  }

  const handlePhoneNumber = (e) => {

    const formattedPhoneNumber = formatPhoneNumber(e);
    console.log("formatted number", formattedPhoneNumber);
    return formattedPhoneNumber;
  }

  const changeColorOfSelect = (prop, View) => {
    console.log("network prop ", prop);
    let lockStat = 'N';
    if (prop.state === null) {
      lockStat = 'Y';
    }
    else {
      if (prop.state.lockStatus === 'Y' || prop.state.stageName === 'Exit' || prop.state.stageName === 'Discard') {
        lockStat = 'Y';
      }
    }
    if (lockStat === 'Y') {
      console.log("color");
      return true;
    }
    else { return false };
  }

  //Added by Nidhi Gupta on 1/30/2024

  const CompareJSON = (Json1, Json2) => {
    console.log("JSon1,json2", Json1, Json2);
    //const combinedJson = {...Json2,...Json1,...Json3};
    //console.log("Combined Json==== ",combinedJson);
    try {
      let updatedLinearJson = {};
      const keys1 = Object.keys(Json1);
      const keys2 = Object.keys(Json2);
      //console.log("OBJECT1",keys1,keys2);
      keys1.filter((dataValue) => {
        if (Json2.hasOwnProperty(dataValue)) {

          const dataKeyType = typeof Json2[dataValue];
          //console.log("data key : ",dataValue, " type: ", dataKeyType,"Instance",Json2[dataValue] instanceof Date, "VALUE ",Json2[dataValue]);
          if (dataKeyType === "object" || dataKeyType === "string") {
            if (!!Json2[dataValue]) {
              if (Array.isArray(Json2[dataValue])) {
                let str = '';
                Json2[dataValue].forEach((elem) => {
                  try {
                    JSON.stringify(elem);
                    if (elem.hasOwnProperty('value')) {
                      str += elem.value + ',';
                    }
                  } catch (err) {
                    str += elem + ',';
                  }
                })
                str = str.substring(0, str.lastIndexOf(','));
                // Json2[dataValue] = Json2[dataValue].join(',')
                //console.log("Str==== ",str);
                Json2[dataValue] = str;
              }
              if (Json2[dataValue] instanceof Date) {
                Json2[dataValue] = extractDate(Json2[dataValue]);
              } else {
                if (Json2[dataValue].hasOwnProperty('value')) {
                  Json2[dataValue] = Json2[dataValue].value;
                }
              }
            }
          }
          //console.log("UPDATED JSON2",Json2);
          // if(!Json2.hasOwnProperty(dataValue)){
          //   updatedLinearJson[dataValue] = Json1[dataValue];
          // }

          // else{
          if (String(Json1[dataValue]).toLowerCase().trim() !== String(Json2[dataValue]).toLowerCase().trim()) {
            console.log("Inside if of compjson");
            updatedLinearJson[dataValue] = Json1[dataValue];
            console.log("updatedLinearJson", updatedLinearJson);

          }
          //}


        }
        else {
          if (!!Json1[dataValue]) {
            updatedLinearJson[dataValue] = Json1[dataValue];
          }

        }
      })
      //  console.log("differentKeys",differentKeys);
      //  return differentKeys;
      console.log("Final updatedLinearJson in function", updatedLinearJson);
      return updatedLinearJson;
    }

    catch (error) {
      console.error('Invalid JSON format', error);
    }
  }
  //Added by Nidhi Gupta on 1/30/2024
  function areAllLocationNameSame(locations, dba) {
    console.log("Hi dba: ", dba);
    console.log("Hi dba locations: ", locations);
    if (locations.length === 0 || !dba) {
      console.log("Hi dba1");
      return false; // Empty array or null, blank, undefined dba
    }
    //const firstLocationName = locations[0].locationName.value==undefined?locations[0].locationName: locations[0].locationName.value; // Assuming 'locationName' is the key for locations
    const firstLocationName = locations[0]?.locationName?.value ?? locations[0]?.locationName;
    for (let i = 1; i < locations.length; i++) {
      const templocation = locations[i]?.locationName?.value ?? locations[i]?.locationName;
      if (templocation !== firstLocationName) {
        console.log("Hi dba2");
        return false; // Found a different name, not all names are same
      }
    }
    if (!!dba && dba !== firstLocationName) {
      console.log("Hi dba3");
      return false;
    }
    return true; // All names are the same i.e. dbaName and all locations
  }
  //Till here


  return {
    submitCase,
    updateLockStatus,
    validateGridData,
    printConsole,
    validatePotentialDup,
    validatePotentialDupDec,
    setContractIdDropDown,
    getNPIFromMaster,
    getCountyFromMaster,
    updateDecision,
    checkDecision,
    disableAllElements,
    handlePhoneNumber,
    changeColorOfSelect,
    CompareJSON,
    areAllLocationNameSame
  }
}
