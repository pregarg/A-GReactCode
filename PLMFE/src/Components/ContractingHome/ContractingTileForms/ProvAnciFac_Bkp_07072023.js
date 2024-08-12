import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getMasterStateSymbol,getMasterSpeciality,getMasterContractType, signIn } from '../../../actions';
import "react-datepicker/dist/react-datepicker.css";
import './Forms.css';
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import axios from 'axios';
import {useAxios} from '../../../api/axios.hook';
import { baseURL } from '../../../api/baseURL';
import Select, {components} from 'react-select';
import Switch from "react-switch";
import TypeTable from '../../SelfServiceTiles/TileFormsTables/TypeTable';
import PaymentTable from '../../SelfServiceTiles/TileFormsTables/PaymentTable';
import DecisionAnciTab from './DecisionAnciTab';
import DecisionTab from '../../../WorkItemDashboard/DecisionTab'
import useValidateForm from '../../CustomHooks/useValidateForm';
import useUpdateDecision from '../../CustomHooks/useUpdateDecision.js';
import { useDispatch, useSelector } from "react-redux";
import CaseInformation from '../../../WorkItemDashboard/CaseInformation';
import customAxios from "../../../api/axios";
import useGetDBTables from '../../CustomHooks/useGetDBTables';
import CompensationTab from './CompensationTab';
import ReferenceTab from '../../../WorkItemDashboard/ReferenceTab';
import FooterComponent from '../../FooterComponent';


export default function ProvAnciFac() {
    const mastersSelector = useSelector((masters) => masters);
    console.log("Masters Selector: ",mastersSelector);
    const authData = useSelector((state) => state.auth)
    const token = useSelector((state) => state.auth.token);
    const [buttonDisableFlag,setButtonDisableFlag] = useState(false);
    const {customAxios} = useAxios();
    const dispatch=useDispatch();
    const [loadForm, setLoadForm]=useState(false);
    const [formikInitializeState,setFormikInitializeState] = useState(false);
    const validationSchema = Yup.object().shape({
        mgrEmail: Yup.string()
            .email("Please enter valid Email Id")
            .required("Please enter Email Id")
            .max(50,"Email Id max length exceeded"),
        mgrPhone: Yup.string()
                .required("Please enter Phone Number")
                .max(10, "Phone Number max length exceeded")
                .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
                // .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,"Please enter valid phone number"),
        provZipCode: Yup.string()
                // .typeError('Amount must be a number')
                .required("Please enter Zip Code")
                .max(5, "Zip Code max length exceeded")
                .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
        entityName:  Yup.string()
                .required('Please enter Legal Entity Name')
                .max(100,"Legal Entity Name max length exceeded"),
         mgrFax:   Yup.string()
        //         .required('Please enter Fax Number')
                 .max(10,"Fax Number max length exceeded")
                 .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
        mgrFirstName: Yup.string()
                    .required('Please enter First Name')
                    .max(30,"First Name max length exceeded"),
        mgrLastName: Yup.string()
                    .required('Please enter Last Name')
                    .max(70,"Max length exceeded"),
        provAddress: Yup.string()
                    .required('Please enter Address')
                    .max(150,"Address max length exceeded"),
         provAddress2: Yup.string()
        //             .required('Please enter Address2')
                    .max(100,"Address2 max length exceeded"),
        proCity: Yup.string()
                    .required('Please enter City')
                    .max(50,"City max length exceeded"),
    //Newest by Nidhi
credContactName:  Yup.string()
    //.required('Please enter Credentialing Contact Name')
    .max(100,"Credentialing Contact Name max length exceeded"),
credEmail: Yup.string()
    .email("Please enter valid Credentialing Email Id")
    //.required("Please enter Credentialing Email Id")
    .max(50,"Credentialing Email Id max length exceeded"),
credPhone: Yup.string()
        //.required("Please enter Credentialing Phone#")
        .max(10, "Credentialing Phone# max length exceeded")
        .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
credFax:  Yup.string()
        //.required('Please enter Credentialing Fax#')
        .max(10," Credentialing Fax# max length exceeded")
        .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
    //Till here


    })
    const {getTableDetails} = useGetDBTables();
    const [selectData, setSelectData] = useState({});

    // const { validate, errors, handleSubmit } = useValidateForm();
    const {submitCase,updateLockStatus} = useUpdateDecision(); //Changed by Nidhi


    const formName = useRef(null);

    let prop = useLocation();
    const navigate = useNavigate();

    const navigateContractingHome = async () => {
        setButtonDisableFlag(false);
        if (prop.state.caseNumber !== undefined) {
            const promise = new Promise((resolve, reject) =>{
                resolve(updateLockStatus('N',prop.state.caseNumber,0,''));
            });

            await promise
            .then(() => {
                setTimeout(() => {
                    navigate('/DashboardLogin/Home',{replace: true});
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
            });
        }

        if (prop.state.caseNumber === undefined) {
            navigate('/ContractingHome', { replace: true });
        }
    };


    // const navigateContractingHome = () => {
    //     navigate('/ContractingHome', {replace: true});
    // }

    const stateRef = React.createRef();
    const prodstatesRef = React.createRef();

    let getEndpoints = [
        baseURL + '/master/stateSymbol'
    ];

    const [selectValues, setSelectValues] = useState({});
    const [masterValues, setMasterValues] = useState({});

//Newly Added by Nidhi 5/4/23

const [apiTestStateComp,setApiTestStateComp] = useState({

    contractNo 		:'',
    medicareNo 	:'',
    pcpId 		:'',
    taxId 		:'',
    medicalGrpNo 	:'',
    capitationAmount:'',
    awpFee 		:'',
    medicalHomeFee :'',
    careMgmtFee 	:'',
    qualityBonus 	:'',
    qualityFee 	:'',
    contractTypeComp:'',
    state1 		:'',
    contract 		:'',
    medicalLicense :'',
    state2 		:'',
    riskAttribute :'',
    capitationType :'',
    capitationTerm :'',
    criticalAccess :''


});
const [firlTableRowsData, setFirlTableRowsData] = useState([]);
const [compensationTableRowsData, setCompensationTableRowsData] = useState([]);

const renameKey = (obj,oldKey,newKey) => {
    if(obj.hasOwnProperty(oldKey)){
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }
    return obj;
};

const convertToDateObj = (jsonObj) => {
    const jsonKeys = Object.keys(jsonObj);
    jsonKeys.forEach((elem) => {
        if(elem.includes("#date")){
            const date = new Date(jsonObj[elem]);
            const oldKey = elem;
            const newKey = elem.split('#')[0];
            jsonObj = renameKey(jsonObj,oldKey,newKey)
            jsonObj[newKey] = date;
        }
    })
    console.log("Hello convertToDateObj JSON: ",jsonObj);
    return jsonObj
}


const handleMedicalGrpNoShow = (evt) => {

    let medicalGrpNoValue = apiTestStateComp.medicalGrpNo;
    let state2Value='';
    let riskValue='';
    let taxValue='';

    state2Value=((apiTestStateComp.state2.value!==undefined && apiTestStateComp.state2.value!=='' )?apiTestStateComp.state2.value:'--');
    riskValue=((apiTestStateComp.riskAttribute.value!==undefined && apiTestStateComp.riskAttribute.value!=='')?apiTestStateComp.riskAttribute.value.substring(0,2):'--');
    taxValue=((apiTestStateComp.taxId!==undefined && apiTestStateComp.taxId!=='')?
    (apiTestStateComp.taxId.substring(apiTestStateComp.taxId.length-5)):'-----'
    )

    console.log('Inside handleMedicalGrpNoShow state2Value: ',state2Value);
    console.log('Inside handleMedicalGrpNoShow riskValue: ',riskValue);
    console.log('Inside handleMedicalGrpNoShow taxValue: ',taxValue);
    medicalGrpNoValue=state2Value+riskValue+taxValue;
    console.log('Inside handleMedicalGrpNoShow medicalGrpNoValue: ',medicalGrpNoValue);

      setApiTestStateComp({
            ...apiTestStateComp,
            medicalGrpNo: medicalGrpNoValue
        })
    }

// till here


    const [apiTestState, setApiTestState] = useState({
        contractType:"",
        mgrFirstName: "",
        mgrLastName: "",
        mgrEmail: "",
        mgrPhone: "",
        mgrFax: "",
        entityName: "",
        provCount: "",
        provAddress: "",
        provAddress2: "",
        proCity: "",
        provState: "",
        provZipCode: "",
        prodStates: "",
        medicaid: false,
        medicare: false,
        exchange: false,
        commercial: false,
        bhvrHealth: false,
        stateDefault: [],
        prodStatesDefault: [],

        //Newest by Nidhi
        credEmail: "",
        credPhone: "",
        credFax: "",
        credContactName: "",
        contractId:"",
        //Till Here
    });

    let contractOptions=[];
    const [typeTableRowsData, setTypeTableRowsData] = useState([]);
    const [paymentTableRowsData, setPaymentTableRowsData] = useState([]);
    const tabRef = useRef("HomeView");

    const onErr=(response, typeOfRequest="")=>{
        //console.log(response, typeOfRequest);
        if(typeOfRequest="masterStateSymbol"){
            //do something on failed request
        }
    }

    const onSuccess=(response, typeOfRequest="")=>{
        //console.log(response, typeOfRequest);
        //if(typeOfRequest="masterStateSymbol"){
            let apiArray = [];
            let selectJson = {};
            if (response.status === 200) {
                //apiTestState.stateArray = [];
                //response.data.map(element => apiArray.push(element));
                //selectJson.stateArray = apiArray;
                selectJson.stateArray = response.data.map(ele => { return {label: ele, value: ele}})
                //setSelectValues({...selectValues,stateArray:apiArray});
            }
            setSelectValues(selectJson);
        //}
    }
//Added by Nidhi on 04/06/2023



    const navigateHome = async () => {
        if(prop.state !== null){
            //const userId = ((mastersSelector.hasOwnProperty('auth')?(mastersSelector.auth.hasOwnProperty('userId')?mastersSelector.auth.userId:0):0));
            const promise = new Promise((resolve, reject) =>{
                resolve(updateLockStatus('N',prop.state.caseNumber,0,''));
            });

            await promise
            .then(() => {
                setTimeout(() => {
                    navigate('/DashboardLogin/Home',{replace: true});
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
            });
        }

        if(prop.state === null){
            navigate('/Home', {replace: true});
        }
      };
      //till here
    useEffect(() => {




        /*TO DO: Need to uncomment this*/
        // if(!authData.isSignedIn){
        //     navigate('/', { replace: true });
        // }

        //console.log("Inside useeffect()");
        if (prop.state.caseNumber !== undefined) {

            //console.log("Prop: ", prop);
            // console.log("prop.state: ",prop.state);
            //console.log("prop.state.caseNumber: ", prop.state.caseNumber);

            //prop.state.formNames= "Provider";
            //console.log("formName.current= ",formName.current);
            //console.log("Here= ",prop.state.formNames);
            ProvAnciFac.displayName = prop.state.formNames;
            tabRef.current = "DashboardView";
            //console.log("tabRef.current= ",tabRef.current);
        }

        if (prop.state.caseNumber === undefined) {
            //console.log("Prop: ", prop);
            // console.log(prop.state.caseNumber);
            // console.log("formName.current= ", formName.current)
            // console.log("Here= ", prop.state.formNames.trim());

            if (prop.state.formNames.includes('Provider')) {
                ProvAnciFac.displayName = "Provider Contracting";
            }
            if (prop.state.formNames.includes('FacAncHealthSystem')) {
                ProvAnciFac.displayName = "Facility/Ancillary/Health Systems Contracting";
            }
            tabRef.current = "HomeView";

            setLoadForm(true);
            // setFormikInitializeState(false);
        }
        //console.log(ProvAnciFac.displayName)
        formName.current = ProvAnciFac.displayName;

//Added by Nidhi on 4/12/2023
let selectJson = {};
const transType = String(formName.current);
console.log("transType:",transType);
if(mastersSelector.hasOwnProperty('masterContractType')){
    selectJson.contracts = ((mastersSelector['masterContractType'].length===0) ? [] : (mastersSelector['masterContractType'][0].data));
}
    selectJson['contracts'].filter(data => data.transactionType == transType).map
    (val => contractOptions.push({value : val.displayName, label: val.displayName}));





setTimeout(
    () => setMasterValues(contractOptions),
    1000
);


//till here

if(mastersSelector.hasOwnProperty('masterStateSymbol')){
    const stateArray = ((mastersSelector['masterStateSymbol'].length===0) ? [] : (mastersSelector['masterStateSymbol'][0].data.map(ele => { return {label: ele, value: ele}})));
    setSelectValues({stateArray})}


        // axios.all(getEndpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
        //     if (res[0].status === 200) {
        //         //apiTestState.stateArray = [];
        //         res[0].data.map(element => apiArray.push(element));
        //         selectJson.stateArray = apiArray;
        //         //setSelectValues({...selectValues,stateArray:apiArray});
        //     }
        //     setSelectValues(selectJson);

        // })
        //     .catch((err) => {
        //         console.log(err.message);
        //         //alert("Error in getting data");
        //     });
        //console.log("Call")

        //dispatch(getMasterStateSymbol(token, false, onErr, onSuccess));
        //dispatch(getMasterContractType(token, false, onErr, onSuccess));
        //dispatch(getMasterContractType(token, false, ()=>{}, ()=>{}))

        //dispatch(getMasterSpeciality(token, false, ()=>{}, ()=>{}));

        if (prop.state.caseNumber !== undefined) {
            let gridApiArray = [];
            // let getCaseNumberEndpoints = [
            //     baseURL + '/provAnciFac/getCase/' + prop.state.caseNumber,
            //     baseURL + '/type/getCase/' + prop.state.caseNumber,
            //     baseURL + '/payment/getCase/' + prop.state.caseNumber,

            // ];
            let getApiJson = {};
            getApiJson['tableNames'] = getTableDetails()['provAnciFac'];
            getApiJson['whereClause'] = {'caseNumber':prop.state.caseNumber};
            customAxios.post('/generic/get', getApiJson, {headers:{'Authorization':`Bearer ${token}`}}).then(res => {
                console.log("hiuhihihihihi0000000000"+JSON.stringify(res));
                if(res.data.Status == 0){
                    const apiResponse = res.data.data.contProvFaciAnci[0];
               

                    //console.log("ApiTestState: ", apiResponse);
                    //Nidhi 04-24-2023
                    prop.state.contractType=apiResponse.contractType;
                    console.log("prop.state.contracttype:",prop.state.contractType);
                    //till here
                    apiResponse.stateDefault = apiResponse.provState.split(",").map(ele => {return {label: ele, value: ele}});
                    apiResponse.prodStatesDefault = apiResponse.prodStates.split(",").map(ele => {return {label: ele, value: ele}});


                    setApiTestState(apiResponse);
                    //setFormikInitializeState(true);
                    setLoadForm(true);
                    console.log("------"+JSON.stringify(res.data.data.contTypeGrid[0]));
                    gridApiArray = [];
                    res.data.data.contTypeGrid.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setTypeTableRowsData(...typeTableRowsData, gridApiArray);
                    gridApiArray = [];
                    res.data.data.contPaymentGrid.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setPaymentTableRowsData(...paymentTableRowsData, gridApiArray);

                }
            }).catch(err => {console.log(err)});

            // axios.all(getCaseNumberEndpoints.map((endpoint) => axios.get(endpoint,{headers:{'Authorization':`Bearer ${token}`}}))).then((res) => {
            //     if (res[0].status === 200) {
            //         // const apiResponse = res[0].data;
            //         // //console.log(typeof apiResponse.dateOfBirth);
            //         // // if(typeof apiResponse.dateOfBirth === 'string'){
            //         // //     const dob = new Date(apiResponse.dateOfBirth);
            //         // //     apiResponse.dateOfBirth = dob;
            //         // // }

            //         // //console.log("ApiTestState: ", apiResponse);
            //         // apiResponse.stateDefault = apiResponse.provState.split(",").map(ele => {return {label: ele, value: ele}});
            //         // apiResponse.prodStatesDefault = apiResponse.prodStates.split(",").map(ele => {return {label: ele, value: ele}});


            //         // setApiTestState(apiResponse);
            //         // setLoadForm(true);
            //     }
            //     if (res[1].status === 200) {
            //         //apiArray = [...res[1].data];
            //         // console.log("License api 00000: ", res[1].data);
            //         // res[1].data.map((apiKey) => {
            //         //     gridApiArray.push(getGridData(apiKey));
            //         // })
            //         // setTypeTableRowsData(...typeTableRowsData, gridApiArray);
            //     }
            //     gridApiArray = [];
            //     if (res[2].status === 200) {
            //         //apiArray = [...res[2].data];
            //         // res[2].data.map((apiKey) => {
            //         //     gridApiArray.push(getGridData(apiKey));
            //         // })
            //         // setPaymentTableRowsData(...paymentTableRowsData, gridApiArray);
            //     }
            // })
            //     .catch((err) => {
            //         //console.log(err.message);
            //     });


            // console.log("Api Array: ", gridApiArray);
            // console.log("TypeTable Values: ", typeTableRowsData);
            // console.log("PaymentTable Values: ", paymentTableRowsData);

        }
        console.log("Inside useEffect, just before compensation get");
     if(true){
          let getApiJson= {};
          getApiJson['tableNames'] = getTableDetails()['compensationLinear'].concat(getTableDetails()['compGridTables']);
          getApiJson['whereClause'] = {'caseNumber':prop.state.caseNumber};

          customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
            console.log("Generic get api response compensation Nidhi: ",res);
            const apiStat = res.data.Status;
            if(apiStat === -1){
                alert("Error in fetching data")
            }
            if(apiStat === 0){
                const respKeys = Object.keys(res.data['data']);
                const respData = res.data['data'];
                respKeys.forEach(k => {
                    console.log("Response key Nidhi: ",k);
                    if(k === 'compLinearTable'){
                        let apiResponse = {};
                        if(respData[k][0]!==undefined){
                            apiResponse = respData[k][0];
                            console.log("Hello apiResponse compensation Nidhi: ",apiResponse);
                            if(apiResponse.hasOwnProperty('conEffectiveDate')){
                                console.log("Hello 01: ");
                                if(typeof apiResponse.conEffectiveDate === 'string'){
                                    console.log("Hello 02: ");
                                    const cfd = new Date(apiResponse.conEffectiveDate);
                                    apiResponse.conEffectiveDate = cfd;
                                }
                            }
                            apiResponse.contractTypeComp = {'label':apiResponse.contractTypeComp,'value':apiResponse.contractTypeComp};
                            apiResponse.state1 = {'label':apiResponse.state1,'value':apiResponse.state1};
                            apiResponse.contract = {'label':apiResponse.contract,'value':apiResponse.contract};
                            apiResponse.medicalLicense = {'label':apiResponse.medicalLicense,'value':apiResponse.medicalLicense};
                            apiResponse.state2 = {'label':apiResponse.state2,'value':apiResponse.state2};
                            apiResponse.riskAttribute = {'label':apiResponse.riskAttribute,'value':apiResponse.riskAttribute};
                            apiResponse.capitationType = {'label':apiResponse.capitationType,'value':apiResponse.capitationType};
                            apiResponse.capitationTerm = {'label':apiResponse.capitationTerm,'value':apiResponse.capitationTerm};
                            //apiResponse.criticalAccess = {'label':apiResponse.criticalAccess,'value':apiResponse.criticalAccess};
                            if (apiResponse.criticalAccess.length>0) {
                                if ( apiResponse.criticalAccess === 'Y')
                                {apiResponse.criticalAccess = {'label':'Yes','value':apiResponse.criticalAccess};}
                                else if ( apiResponse.criticalAccess === 'N')
                                { apiResponse.criticalAccess = {'label':'No','value':apiResponse.criticalAccess};}
                            }
                            console.log("locationTableRowsData apiResponse: ", apiResponse)
                            apiResponse = convertToDateObj(apiResponse);
                            setApiTestStateComp(apiResponse);
                            //setFormikInitializeState(true);
                        }

                    }

                    if(k === 'firlGrid'){
                        let apiResponseArray = [];
                        respData[k].forEach((js) => {
                            const newJson = convertToDateObj(js);
                            console.log("Compensation Tab firlGrid newJson;", newJson);
                            apiResponseArray.push(newJson);
                        });
                        setFirlTableRowsData(apiResponseArray);
                    }

                    if(k === 'compensationGrid'){
                        let apiResponseArray = [];
                        respData[k].forEach((js) => {
                            const newJson = convertToDateObj(js);
                            console.log("Compensation Tab compensationGrid newJson;", newJson);
                            apiResponseArray.push(newJson);
                        });
                        setCompensationTableRowsData(apiResponseArray);
                    }

                })
            }
          }).catch((err) => {
            console.log(err.message);
         });

          console.log("getApiJson compensation: ",getApiJson);

     }

        return()=>{
            //console.log("UNMOUNT")
        }
    }, []);

    // useEffect(()=>{
    //     //console.log(formName);
    //     setSelectValues({});
    // },[formName]);

    const handleApiTestChange = (evt) => {
        const value = evt.target.value;
        // validate(evt);
        // console.log("Erros: ", errors);
        setApiTestState({
            ...apiTestState,
            [evt.target.name]: evt.target.value
        })
    }
    const gridDataRef = useRef({});

    const gridRowsFinalSubmit = (triggeredFormName,index,operationType) => {
        console.log('Inside gridRowsFinalSubmit with view: ',tabRef);
        if(tabRef.current === 'DashboardView'){
            //let gridRow = getGridDataArray(triggeredFormName);
            //console.log('gridRowsFinalSubmit gridRow: ',gridRow);
            let oprtn;
            let gridRowJson = {};
            //alert('Operation type: ',operationType);
            console.log('Operation type: ',operationType);
            if(operationType === 'Add'){
                oprtn =  'I';
        }

            if(operationType === 'Edit'){
                oprtn =  'U';
            }

            if(operationType === 'Delete'){
                oprtn =  'D';
            }
            let gridRowArray = [];
            if(triggeredFormName === 'TypeTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('typeTable'))?[...gridDataRef.current.typeTable]:[];
                gridRowJson = {...typeTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.typeTable = getGridDataValues(gridRowArray);

                console.log("gridDataRef.current: ",gridDataRef.current);
            }

            if(triggeredFormName === 'PaymentTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('paymentTable'))?[...gridDataRef.current.paymentTable]:[];
                gridRowJson = {...paymentTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.paymentTable = getGridDataValues(gridRowArray);
                console.log("gridDataRef.current: ",gridDataRef.current);
            }
            //Newly Added by Nidhi on 5/4/23
            if(triggeredFormName === 'FIRLTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('firlTable'))?[...gridDataRef.current.firlTable]:[];
                gridRowJson = {...firlTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //firlTableRowsData[index].operation = oprtn;
                gridDataRef.current.firlTable = getGridDataValues(gridRowArray);

                console.log("gridDataRef.current: ",gridDataRef.current);
            }
            if(triggeredFormName === 'CompensationTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('compensationTable'))?[...gridDataRef.current.compensationTable]:[];
                gridRowJson = {...compensationTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //compensationTableRowsData[index].operation = oprtn;
                gridDataRef.current.compensationTable = getGridDataValues(gridRowArray);

                console.log("gridDataRef.current: ",gridDataRef.current);
            }
            //till here

        }
    }

    const addTableRows = (triggeredFormName,index)=>{
       // console.log("rowData: ",specialityTableRowsData);
       let rowsInput = {};
        if(triggeredFormName === 'TypeTable'){
            rowsInput.rowNumber = typeTableRowsData.length+1;
            setTypeTableRowsData([...typeTableRowsData, rowsInput]);
        }

        if(triggeredFormName === 'PaymentTable'){
            rowsInput.rowNumber = paymentTableRowsData.length+1;
            setPaymentTableRowsData([...paymentTableRowsData, rowsInput]);
        }
        //Newly Added by Nidhi on 5/4/23
        if(triggeredFormName === 'FIRLTable'){
            rowsInput.rowNumber = firlTableRowsData.length+1;
            setFirlTableRowsData([...firlTableRowsData, rowsInput]);
        }
        if(triggeredFormName === 'CompensationTable'){
           rowsInput.rowNumber = compensationTableRowsData.length+1;
           setCompensationTableRowsData([...compensationTableRowsData, rowsInput]);
       }
       //till here
    }

    const deleteTableRows = (index, triggeredFormName, operationValue) => {
        if (operationValue !== 'Edit' && (operationValue === 'Add' || operationValue === 'Force Delete')) {
            gridRowsFinalSubmit(triggeredFormName, index, 'Delete');
            if (triggeredFormName === 'TypeTable') {
                const rows = [...typeTableRowsData];
                rows.splice(index, 1);
                setTypeTableRowsData(rows);
            }
            if (triggeredFormName === 'PaymentTable') {
                const rows = [...paymentTableRowsData];
                rows.splice(index, 1);
                setPaymentTableRowsData(rows);
            }
             //Newly Added by Nidhi on 5/4/23
             if(triggeredFormName === 'FIRLTable'){
                const rows = [...firlTableRowsData];
                rows.splice(index, 1);
                setFirlTableRowsData(rows);
            }
            if(triggeredFormName === 'CompensationTable'){
                const rows = [...compensationTableRowsData];
                rows.splice(index, 1);
                setCompensationTableRowsData(rows);
            }
             //till here

        }
    }
    const handleGridFieldChange = (index, evnt, triggeredFormName) => {
        //console.log('Inside handleGridFieldChange: ', triggeredFormName);
        let rowsInput = '';
        const { name, value } = evnt.target;
        if (triggeredFormName === 'TypeTable') {
            //console.log('Inside TypeTable');
            rowsInput = [...typeTableRowsData];
        }
        if (triggeredFormName === 'PaymentTable') {
            //console.log('Inside PaymentTable');
            rowsInput = [...paymentTableRowsData];
        }
         //Newly Added by Nidhi on 5/4/23
         if(triggeredFormName === 'FIRLTable'){
            //console.log('Inside FIRLTable');
            rowsInput = [...firlTableRowsData];
        }
        if(triggeredFormName === 'CompensationTable'){
            //console.log('Inside FIRLTable');
            rowsInput = [...compensationTableRowsData];
        }
         //till here

        //console.log('Inside handleGridFieldChange: ',rowsInput);
        rowsInput[index][name] = value;
        if (triggeredFormName === 'TypeTable') {
            setTypeTableRowsData(rowsInput);
        }
        if (triggeredFormName === 'PaymentTable') {
            setPaymentTableRowsData(rowsInput);
        }
         //Newly Added by Nidhi on 5/4/23
         rowsInput[index][name] = value;
         if(triggeredFormName === 'FIRLTable'){
             setFirlTableRowsData(rowsInput);
         }
         if(triggeredFormName === 'CompensationTable'){
             setCompensationTableRowsData(rowsInput);
         }
         //till here

    }

    //Newly Added by Nidhi on 5/4/23
    const handleLinearSelectChange = (selectValue, evnt) => {
        console.log(" handleLinearSelectChange evnt.name: ",evnt.name);
        console.log(" handleLinearSelectChange selectValue: ",selectValue.value);
        const {name} = evnt;
        // setApiTestStateComp({...apiTestStateComp,
        //     [name] : selectValue});
        console.log(" handleLinearSelectChange name: ",name);
       // console.log("handleLinearSelectChange apiTestStateComp: ",apiTestStateComp);

        let medicalGrpNoValue = apiTestStateComp.medicalGrpNo;
        let pcpIdValue = apiTestStateComp.pcpId;

        if (name ==='state2' || name==='riskAttribute' )
        {
        let state2Value='';
        let riskValue='';
        let taxValue='';

        state2Value=(name ==='state2'?selectValue.value:((apiTestStateComp.state2.value!==undefined && apiTestStateComp.state2.value!=='' )?apiTestStateComp.state2.value:'--'));
        riskValue=(name ==='riskAttribute'?selectValue.value.substring(0,2):((apiTestStateComp.riskAttribute.value!==undefined && apiTestStateComp.riskAttribute.value!=='')?apiTestStateComp.riskAttribute.value.substring(0,2):'--'));
        taxValue=((apiTestStateComp.taxId!==undefined && apiTestStateComp.taxId!=='')?
        (apiTestStateComp.taxId.substring(apiTestStateComp.taxId.length-5)):'-----'
        )

        console.log('Inside handleMedicalGrpNoShow state2Value: ',state2Value);
        console.log('Inside handleMedicalGrpNoShow riskValue: ',riskValue);
        console.log('Inside handleMedicalGrpNoShow taxValue: ',taxValue);
        medicalGrpNoValue=state2Value+riskValue+taxValue;
        console.log('Inside handleMedicalGrpNoShow medicalGrpNoValue: ',medicalGrpNoValue);
        }


        if(name==='state1' || name === 'medicalLicense'|| name==='contract'){
        let state1Value='';
        let contractValue='';
        let medicalLicenseValue='';

        state1Value=(name ==='state1'?selectValue.value:((apiTestStateComp.state1.value!==undefined && apiTestStateComp.state1.value!=='' )?apiTestStateComp.state1.value:'--'));
        contractValue=(name ==='contract'?selectValue.value:((apiTestStateComp.contract.value!==undefined && apiTestStateComp.contract.value!=='' )?apiTestStateComp.contract.value:'--'));
        medicalLicenseValue=(name ==='medicalLicense'?selectValue.value:((apiTestStateComp.medicalLicense.value!==undefined && apiTestStateComp.medicalLicense.value!=='' )?apiTestStateComp.medicalLicense.value:'---'));

        console.log('Inside handlePcpIdShow state1Value: ',state1Value);
        console.log('Inside handlePcpIdShow contractValue: ',contractValue);
        console.log('Inside handlePcpIdShow medicalLicenseValue: ',medicalLicenseValue);
        pcpIdValue=state1Value+contractValue+medicalLicenseValue;
        console.log('Inside handlePcpIdShow pcpIdValue: ',pcpIdValue);
    }

          setApiTestStateComp({
                ...apiTestStateComp,
                medicalGrpNo: medicalGrpNoValue,
                [name] : selectValue, pcpId : pcpIdValue
            })

             console.log("handleLinearSelectChange apiTestStateComp: ",apiTestStateComp);

   }

   const handleLinearFieldChange = (evt) => {

    setApiTestStateComp({
        ...apiTestStateComp,
        [evt.target.name]: evt.target.value
    })
    //console.log(" handleLinearFieldChange apiTestStateComp: ",apiTestStateComp);
}
    //till here


    const handleDateChange = (date, dateName) => {
        console.log("handleDateChange date: ",date )
        console.log("handleDateChange dateName: ",dateName )
       if(dateName === 'conEffectiveDate'){
           
            setApiTestStateComp({
                ...apiTestStateComp,
                conEffectiveDate: date
              });
              console.log("handleDateChange conEffectiveDate: ",apiTestStateComp);
    }

    }
    const handleGridSelectChange = (index, selectedValue, evnt, triggeredFormName) => {
        //console.log("Inside select change trigeredFormName: ", triggeredFormName);
        let rowsInput = '';
        const { name } = evnt;
        if (triggeredFormName === 'TypeTable') {
            //console.log('Inside SpecialityTable');
            rowsInput = [...typeTableRowsData];
        }
        if (triggeredFormName === 'PaymentTable') {
            //console.log('Inside SpecialityTable');
            rowsInput = [...paymentTableRowsData];
        }
         //Newly Added by Nidhi on 5/4/23

    if(triggeredFormName === 'FIRLTable'){
        //console.log('Inside FIRLTable');
        rowsInput = [...firlTableRowsData];
    }
    if(triggeredFormName === 'CompensationTable'){
        //console.log('Inside CompensationTable');
        rowsInput = [...compensationTableRowsData];
    }
         //till here
        //console.log("Inside select change event: ",rowsInput);
         //rowsInput[index][name] = selectedValue;
         if(evnt.action==='clear'){
            //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
            delete rowsInput[index][name];
            //printConsole('Inside selectvalue null after delete: ',rowsInput[index]);
        }
        else
        {
        rowsInput[index][name] = selectedValue;
        }
        //console.log("rowsInput: ",rowsInput);
        if (triggeredFormName === 'TypeTable') {
            setTypeTableRowsData(rowsInput);
        }
        if (triggeredFormName === 'PaymentTable') {
            setPaymentTableRowsData(rowsInput);
        }
         //Newly Added by Nidhi on 5/4/23
         if(triggeredFormName === 'FIRLTable'){
            setFirlTableRowsData(rowsInput);
        }
        if(triggeredFormName === 'CompensationTable'){
            setCompensationTableRowsData(rowsInput);
        }
         //till here

    }
    const getNextSequence = async (path) => {
        let sequenceNumber;
        try {
            const response = await customAxios.get(path,{headers:{'Authorization':`Bearer ${token}`}});
            if (response.status === 200) {
                sequenceNumber = response.data;
            }
            console.log("getNextSequence sequenceNumber",sequenceNumber);
            return sequenceNumber;

        }
        catch (error) {
            console.log(error);
        }
    }

    const getGridData = (jsonObj) => {
        let gridObj = {};
        //console.log("GetGridData: ",jsonObj);
        Object.keys(jsonObj).map((key) => {
            gridObj[key] = { value: jsonObj[key], label: jsonObj[key] };
        });
        return gridObj;
    }





    const saveFormData = (values) => {
        // if(handleSubmit()){
        if (true) {
            setButtonDisableFlag(true);

            // const path = baseURL + '/master/nextSeqValue';
            // let caseNumber;
            //let awaitOut = getNextSequence(path);
            //awaitOut.then((caseId) => {
                //caseNumber = caseId;
                //console.log("CaseNumber before: ", caseNumber);
                //let requestBody = apiTestState;
                //console.log(requestBody);
                //requestBody.provState = stateRef.current.getSelectedItems().toString();
                //requestBody.prodStates = prodstatesRef.current.getSelectedItems().toString();
                //requestBody.userName = 'gaurav';
               // requestBody.caseNumber = caseNumber;

                //delete requestBody.stateDefault;
                //delete requestBody.prodStatesDefault;
                let contractingConfigData = JSON.parse(process.env.REACT_APP_CONTRACTING_DETAILS);
                const flowId = contractingConfigData['FlowId'];
                const stageId = contractingConfigData['StageId'];
                const stageName = contractingConfigData['StageName'];

                  //Newly Added by Nidhi 0n 05/04/23
                  let requestBody = {};
                  requestBody.caseNumber = prop.state.caseNumber;
                  //till here

                const mainWIObject = {};
                //mainWIObject.caseID = caseNumber;
                mainWIObject.caseStatus = "Open";
                mainWIObject.createdByName = prop.state.userName;
                mainWIObject.flowId = flowId;
                mainWIObject.stageName = stageName;
                mainWIObject.stageId = stageId;
                mainWIObject.transactionType = ProvAnciFac.displayName;
                //mainWIObject.caseNumber = caseNumber;
                //mainWIObject.createdBy = "1";
                mainWIObject.firstName = values.mgrFirstName;
                mainWIObject.lastName = values.mgrLastName;
                //mainWIObject.npiId = '';
                //Added by Nidhi Gupta on 06/21/2023
                mainWIObject.legalEntityName = values.entityName;
                //Till Here

                const provObject = {};
                provObject.userName = prop.state.userName;
                provObject.mgrFirstName = values.mgrFirstName;
                provObject.mgrLastName = values.mgrLastName;
                provObject.mgrEmail = values.mgrEmail;
                provObject.mgrPhone = values.mgrPhone;
                provObject.mgrFax = values.mgrFax;
                provObject.mgrorg = values.mgrorg;
                provObject.entityName = values.entityName;
                provObject.provAddress= values.provAddress;
                provObject.provAddress2= values.provAddress2;
                provObject.proCity = values.proCity;
                provObject.provZipCode = values.provZipCode;

                //Newest by Nidhi
                provObject.credEmail = values.credEmail;
                provObject.credPhone = values.credPhone;
                provObject.credFax = values.credFax;
                provObject.credContactName = values.credContactName;
                provObject.contractId = values.contractId;
                //Till here
                //Changed by Nidhi Gupta
                //provObject.provState = selectData.selectOne.value.value;
                provObject.provState = ((selectData.selectOne!==undefined)?selectData.selectOne.value.value:'');
                //provObject.contractType = selectData.selectThree.value.value;
                provObject.contractType = ((selectData.selectThree!==undefined)?selectData.selectThree.value.value:'');
                //provObject.prodStates = selectData.selectTwo.value.map(el => el.value).toString();
                provObject.prodStates = ((selectData.selectTwo!==undefined)?selectData.selectTwo.value.map(el => el.value).toString():'');
                provObject.medicaid = values.medicaid;
                provObject.medicare = values.medicare;
                provObject.bhvrHealth = values.bhvrHealth;
                provObject.commercial = values.commercial;
                provObject.exchange = values.exchange;
                provObject.provCount = values.provCount;

            //    apiJson = saveGridData(apiJson);
                let  apiJson = {};
                apiJson["MainCaseTable"] = mainWIObject;
                apiJson["Cont_ProvFaciAnci_Details"] = provObject;
                apiJson["Cont_Compensation_Details"] = requestBody;
                console.log("Case JSON Insert Nidhi: ",apiJson);
                apiJson['Cont_Type_Grid'] = getGridDataValues(typeTableRowsData);
               // apiJson['Cont_Type_Grid'] = getGridDataValues(typeTableRowsData);
                apiJson['Cont_Payment_Grid'] = getGridDataValues(paymentTableRowsData);
                if((callProcRef.current === 'callProc') && (apiJson["Cont_ProvFaciAnci_Details"].contractType === undefined || apiJson["Cont_ProvFaciAnci_Details"].contractType === ''))
                {
                    setButtonDisableFlag(false);
                    alert("Please select Contract Type");
                    return;
                }
                customAxios.post(baseURL+"/generic/create",apiJson,{headers:{'Authorization':`Bearer ${token}`}})
                .then((res) => {
                        console.log("Data saved successfully: ",res);
                        const apiStat = res.data['CreateCase_Output']['Status']
                        if(apiStat === -1){
                            alert("Case is not created.");
                            setButtonDisableFlag(false);
                        }

                        if(apiStat === 0){
                            alert("Case created with case number: "+res.data['CreateCase_Output']['CaseNo']+" and Contract Id: "+values.contractId);
                            // alert("Contract Id generated is ",apiTestState.contractId);
                            navigateContractingHome(); //comment this after testing
                        }

                        // navigateContractingHome();   //uncomment after testing
                })
                .catch((err) => {
                    console.log(err.message);
                    setButtonDisableFlag(false);
                    //alert("Error in saving data");
                });

                // axios.post(baseURL + '/saveMainWorkitem',{mainWIObject},{headers:{'Authorization':`Bearer ${token}`}})
                //     .then((res) => {
                //         //console.log("api response: ", res.status);
                //         if (res.status === 200) {
                //             //alert("Data Saved Succesfully");
                //         }
                //     })
                //     .catch((err) => {
                //         //console.log(err.message);
                //         //alert("Error in saving data");
                //     });

                //console.log("requestBody: ", requestBody);
                // axios
                //     .post(baseURL + '/addProvAnciFac/provAnciFac', requestBody,{headers:{'Authorization':`Bearer ${token}`}})
                //     .then((res) => {
                //         //console.log("api response: ", res.status);
                //         if (res.status === 200) {
                //             //alert("Data Saved Succesfully");
                //         }
                //     })
                //     .catch((err) => {
                //         //console.log(err.message);
                //         //alert("Error in saving data");
                //     });

                // saveGridData(caseNumber);
                // alert("Data saved successfully." + "\n" + "Case number: " + caseNumber);
                // navigateContractingHome();
            //});
        }
    }
    const createContractId=(values)=>{
        let sequenceNumber;
        const path = baseURL + '/generic/contractIdSeq';
         let awaitOut = getNextSequence(path);
             awaitOut.then((seqId) => {
                sequenceNumber = seqId;
        console.log("createContractId sequenceNumber:",sequenceNumber);
         var zerofilled = ('000000'+sequenceNumber).slice(-6);
        console.log("createContractId zerofilled: ",zerofilled);
       let calContractId;
       let selectedStateVal=((selectData.selectOne!==undefined)?selectData.selectOne.value.value:'**');
       calContractId='C'+selectedStateVal+zerofilled;
       console.log("createContractId calContractId:",calContractId);
       values.contractId=calContractId;
      setApiTestState({
        ...apiTestState,
        contractId: calContractId});

    })


    }


    const saveData = async (values) => {
        console.log("values: ",values);
        console.log(typeTableRowsData);
        console.log(paymentTableRowsData);
        // if(typeTableRowsData.length<=0 && !typeTableRowsData[0]){
        //     alert("Table data required");
        //     return;
        // }
        // if(paymentTableRowsData.length<=0 && !paymentTableRowsData[0]){
        //     alert("Table data required");
        //     return;
        // }
        // e.preventDefault();
        // console.log("handleSubmit: ", handleSubmit());

        //SET values to state and then follow the same flow
        //    setApiTestState(prevState => {
        //     return {...prevState,
        //             mgrFirstName: values.mgrFirstName,
        //             mgrLastName: values.mgrLastName,
        //             mgrEmail: values.mgrEmail,
        //             mgrPhone: values.mgrPhone,
        //             mgrFax: values.mgrFax,
        //             entityName: values.entityName,
        //             provAddress: values.provAddress,
        //             provAddress2: values.provAddress2,
        //             proCity: values.proCity,
        //             provZipCode: values.provZipCode,
        //             provState: (selectData&&selectData.selectOne&&selectData.selectOne.value)?selectData.selectOne.value.value:"",
        //             prodStates: (selectData&&selectData.selectTwo&&selectData.selectTwo.value&&selectData.selectTwo.value[0])?selectData.selectTwo.value.map((item)=>item.value):[],
        //             // provCount: ""
        //     }
        // });
        // // setApiTestState(prevState => {
        //     return {...prevState,
        //             mgrFirstName: values.mgrFirstName?values.mgrFirstName:"",
        //             mgrLastName: values.mgrLastName?values.mgrLastName:"",
        //             mgrEmail: values.mgrEmail?values.mgrEmail:"",
        //             mgrPhone: values.mgrPhone?values.mgrPhone:"",
        //             mgrFax: values.mgrFax?values.mgrFax:"",
        //             entityName: values.entityName?values.entityName:"",
        //             provAddress: values.provAddress?values.provAddress:"",
        //             provAddress2: values.provAddress2?values.provAddress2:"",
        //             proCity: values.proCity?values.proCity:"",
        //             provZipCode: values.provZipCode?values.provZipCode:"",
        //             provState: (selectData&&selectData.selectOne&&selectData.selectOne.value)?selectData.selectOne.value.value:"",
        //             prodStates: (selectData&&selectData.selectTwo&&selectData.selectTwo.value&&selectData.selectTwo.value[0])?selectData.selectTwo.value.map((item)=>item.value):[],
        //             // provCount: ""
        //     }
        // });
        console.log(apiTestState);

        if (tabRef.current === "HomeView") {


            const promise = new Promise((resolve, reject) =>{
                resolve(createContractId(values));
            });

            await promise
            .then(() => {
                setTimeout(() => {
                    saveFormData(values);
                }, 1000);
                // saveFormData(values);

            })
            .catch((err) => {
                console.error(err);
            });

            // saveFormData(values);
        }

        if (tabRef.current === "DashboardView") {
            //submitCase(prop, apiUrl);
            updateFormData(values);

        }
    }

    const updateFormData = (values) => {
        setButtonDisableFlag(true);
        //Added by Nidhi
        delete values.caseNumber;
        
        //Till Here
        const mainWIObject = {};
        /*//mainWIObject.caseID = prop.state.caseNumber;
        mainWIObject.caseStatus = "Open";
        mainWIObject.createdByName = prop.state.userName;
        mainWIObject.flowId = "1";
        mainWIObject.stageName = "Network";
        mainWIObject.transactionType = ProvAnciFac.displayName;
        //mainWIObject.caseNumber = prop.state.caseNumber;
        //mainWIObject.createdBy = "1";
        mainWIObject.firstName = values.mgrFirstName;
        mainWIObject.lastName = values.mgrLastName;
        mainWIObject.npiId = '';*/
        //Added by Nidhi Gupta on 06/21/2023
        mainWIObject.legalEntityName = values.entityName;
        mainWIObject.firstName = values.mgrFirstName;
        mainWIObject.lastName = values.mgrLastName;
        //Till Here

        const updateProvState = (!!selectData && !!selectData.selectOne && !!selectData.selectOne.value) ?
        selectData.selectOne.value.value : apiTestState.provState;

        const updateContractType = (!!selectData && !!selectData.selectThree && !!selectData.selectThree.value) ?
        selectData.selectThree.value.value : apiTestState.contractType;

        const updateProvStates = (!!selectData && !!selectData.selectTwo && !!selectData.selectTwo.value) ?
        selectData.selectTwo.value.map(el => el.value).toString() : apiTestState.prodStates;

        const provObject = {};
        provObject.userName = prop.state.userName;
        provObject.mgrFirstName = values.mgrFirstName;
        provObject.mgrLastName = values.mgrLastName;
        provObject.mgrEmail = values.mgrEmail;
        provObject.mgrPhone = values.mgrPhone;
        provObject.mgrFax = values.mgrFax;
        provObject.mgrorg = values.mgrorg;
        provObject.entityName = values.entityName;
        provObject.provAddress= values.provAddress;
        provObject.provAddress2= values.provAddress2;
        provObject.proCity = values.proCity;
        provObject.provZipCode = values.provZipCode;
        provObject.provState = updateProvState;
        provObject.contractType =updateContractType;
        provObject.prodStates = updateProvStates;
        provObject.medicaid = values.medicaid;
        provObject.medicare = values.medicare;
        provObject.bhvrHealth = values.bhvrHealth;
        provObject.commercial = values.commercial;
        provObject.exchange = values.exchange;
        provObject.provCount = values.provCount;

        //Newest by Nidhi
        provObject.credEmail = values.credEmail;
        provObject.credPhone = values.credPhone;
        provObject.credFax = values.credFax;
        provObject.credContactName = values.credContactName;
        provObject.contractId = values.contractId;
        // provObject.contractId = values.contractId.replace(values.contractId.substring(1,2),updateProvState);
        // console.log("provObject.contractId: ",provObject.contractId);
        //Till here
          //Newly Added by Nidhi 0n 05/04/23
          console.log("Nidhi apiTestStateComp Update: ",apiTestStateComp);

          let requestBody = {}
          requestBody.contractNo = ((apiTestStateComp.contractNo!==undefined)?apiTestStateComp.contractNo:'');
          requestBody.medicareNo = ((apiTestStateComp.medicareNo!==undefined)?apiTestStateComp.medicareNo:'');
          requestBody.pcpId = ((apiTestStateComp.pcpId!==undefined)?apiTestStateComp.pcpId:'');
          requestBody.taxId = ((apiTestStateComp.taxId!==undefined)?apiTestStateComp.taxId:'');
          requestBody.medicalGrpNo = ((apiTestStateComp.medicalGrpNo!==undefined)?apiTestStateComp.medicalGrpNo:'');
          requestBody.capitationAmount = ((apiTestStateComp.capitationAmount!==undefined)?apiTestStateComp.capitationAmount:'');
          requestBody.awpFee = ((apiTestStateComp.awpFee!==undefined)?apiTestStateComp.awpFee:'');
          requestBody.medicalHomeFee = ((apiTestStateComp.medicalHomeFee!==undefined)?apiTestStateComp.medicalHomeFee:'');
          requestBody.careMgmtFee = ((apiTestStateComp.careMgmtFee!==undefined)?apiTestStateComp.careMgmtFee:'');
          requestBody.qualityBonus = ((apiTestStateComp.qualityBonus!==undefined)?apiTestStateComp.qualityBonus:'');
          requestBody.qualityFee = ((apiTestStateComp.qualityFee!==undefined)?apiTestStateComp.qualityFee:'');
          requestBody.contractTypeComp = ((apiTestStateComp.contractTypeComp!==undefined)?apiTestStateComp.contractTypeComp.value:'');
          requestBody.state1 = ((apiTestStateComp.state1!==undefined)?apiTestStateComp.state1.value:'');
          requestBody.contract = ((apiTestStateComp.contract!==undefined)?apiTestStateComp.contract.value:'');
          requestBody.medicalLicense = ((apiTestStateComp.medicalLicense!==undefined)?apiTestStateComp.medicalLicense.value:'');
          requestBody.state2 = ((apiTestStateComp.state2!==undefined)?apiTestStateComp.state2.value:'');
          requestBody.riskAttribute = ((apiTestStateComp.riskAttribute!==undefined)?apiTestStateComp.riskAttribute.value:'');
          requestBody.capitationType = ((apiTestStateComp.capitationType!==undefined)?apiTestStateComp.capitationType.value:'');
          requestBody.capitationTerm = ((apiTestStateComp.capitationTerm!==undefined)?apiTestStateComp.capitationTerm.value:'');
          requestBody.criticalAccess = ((apiTestStateComp.criticalAccess!==undefined)?apiTestStateComp.criticalAccess.value:'');
          requestBody.conEffectiveDate = apiTestStateComp.conEffectiveDate ? apiTestStateComp.conEffectiveDate.toLocaleDateString() : null;
          //requestBody.conEffectiveDate = apiTestStateComp.conEffectiveDate;
          console.log("Nidhi requestBody Update: ",requestBody);
          //till here


    //    apiJson = saveGridData(apiJson);
        let  apiJson = {};
        apiJson['caseNumber'] = prop.state.caseNumber;
        apiJson["MainCaseTable"] = mainWIObject;
        apiJson["Cont_ProvFaciAnci_Details"] = provObject;
        //Added Newly byNidhi on 5/4/23
        apiJson["Cont_Compensation_Details"] = requestBody;
        apiJson['Cont_Compensation_Grid'] = gridDataRef.current.compensationTable;
        apiJson['Cont_Firl_Grid'] = gridDataRef.current.firlTable;
        //till here
        console.log("Case JSON Update Nidhi: ",apiJson);
        apiJson['Cont_Type_Grid'] = gridDataRef.current.typeTable;
       // apiJson['Cont_Type_Grid'] = getGridDataValues(typeTableRowsData);
        apiJson['Cont_Payment_Grid'] = gridDataRef.current.paymentTable;
        // if((callProcRef.current === 'callProc')){
        //if((prop.state.decision === undefined || prop.state.decision === ''))
        console.log("Nidhi apiJson: ", apiJson);
        var todaydate = new Date();
        if(((callProcRef.current === 'callProc') && (apiTestState.contractType === undefined || apiTestState.contractType === '')))
        {
            setButtonDisableFlag(false);
            alert("Please select Contract Type");
            return;
        }
        if((apiTestStateComp.conEffectiveDate !== '') && (apiTestStateComp.conEffectiveDate !== undefined))
        {if(apiTestStateComp.conEffectiveDate.getTime()<todaydate.getTime() )
        {
            setButtonDisableFlag(false);
            alert("Contract Effective Date should be greater or equals to today's date");
            return;
        }}
        if(((callProcRef.current === 'callProc') && (prop.state.decision === undefined || prop.state.decision === '')))
        {
            setButtonDisableFlag(false);
            alert("Please select Decision");
        }
        //Newly added on 5/8/2023
        /*else if((callProcRef.current === 'callProc') && ((requestBody.state1 === undefined || requestBody.state1 === '')
        ||(requestBody.contract === undefined || requestBody.contract === '')
        ||(requestBody.medicalLicense === undefined || requestBody.medicalLicense === '')
        ||(requestBody.pcpId === undefined || requestBody.pcpId === '')
        ||(requestBody.state2 === undefined || requestBody.state2 === '')
        ||(requestBody.riskAttribute === undefined || requestBody.riskAttribute === '')
        ||(requestBody.taxId === undefined || requestBody.taxId === '')
        ||(requestBody.medicalGrpNo === undefined || requestBody.medicalGrpNo === '')
         ))
        {
            alert("Please fill mandatory fields in Compensation Tab: States, Contract, Medical License, PCP ID, Risk Attribution, Tax ID, Medical Group No.");
        }*/
        //till here

        // }
        else{
        customAxios.post("/generic/update", apiJson,{headers:{'Authorization':`Bearer ${token}`}})
        .then((res) => {
            console.log(res);
        //Added by Nidhi on 04/06/2023
        console.log("Data Update result: ",res);
        const apiStat = res.data['UpdateCase_Output']['Status']
        if(apiStat === -1){
            alert("Data not updated.");
            setButtonDisableFlag(false);
        }

        if(apiStat === 0){
            alert("Case Data Updated Successfully");
            let procInput = {};
            procInput.input1 = 'testing';
            customAxios.post('/updateQueueVariableProcedure',procInput,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
                console.log("Update Queue Variable Proc output: ",res);
                if(res.status === 200){
                    console.log("Update Queue Variable Proc executed successully");
                }
            })
            if(callProcRef.current === 'callProc'){
                // submitCase(prop,function() {
                //     console.log('After submitcase finished');
                //     navigateHome();
                //   });
                    //navigateHome();
                    console.log("Inside updateFormData prop sending in submitCase",prop);

                submitCase(prop,navigateHome);
                console.log("Executing after await");
            }
            if(callProcRef.current !== 'callProc'){
                navigateHome();
            }
        }
        //till here

        })
        .catch(err => {
            setButtonDisableFlag(false);
            console.log(err);
        })

    }
    }


    // const saveGridData1 = (apiJson) => {
    //     let apiUrlArray = [];
    //     //let apiStr = apiUrl;
    //     let apiUrlObject = {};
    //     const specialityResponse = getGridDataValues(specialityTableRowsData);
    //     const licenseResponse = getGridDataValues(licenseTableRowsData);
    //     const locationResponse = getGridDataValues(locationTableRowsData);
    //     const payToResponse = getGridDataValues(payToTableRowsData);
    //     const educationResponse = getGridDataValues(educationTableRowsData);
    //     const trainingResponse = getGridDataValues(trainingTableRowsData);
    //     const workResponse = getGridDataValues(workTableRowsData);
    //     const insuranceResponse = getGridDataValues(insuranceTableRowsData);
    //     const credentialResponse = getGridDataValues(credentialTableRowsData);
    //     //console.log("specialityResponse: ",licenseResponse);
    //     if(specialityResponse.length>0){
    //         //apiUrlObject["name"] = 'Speciality Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_Speciality_Grid"] = specialityResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(licenseResponse.length>0){
    //         //apiUrlObject["name"] = 'Speciality Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_License_Grid"] = licenseResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(locationResponse.length>0){
    //         //apiUrlObject["name"] = 'Speciality Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_Location_Grid"] = locationResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(payToResponse.length>0){
    //         //apiUrlObject["name"] = 'Speciality Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_PayTo_Grid"] = payToResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(educationResponse.length>0){
    //         //apiUrlObject["name"] = 'Education Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_Education_Grid"] = educationResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(trainingResponse.length>0){
    //         //apiUrlObject["name"] = 'Training Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_Training_Grid"] = trainingResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(workResponse.length>0){
    //         //apiUrlObject["name"] = 'Speciality Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_WorkHistory_Grid"] = workResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(insuranceResponse.length>0){
    //         //apiUrlObject["name"] = 'Insurance Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_Insurance_Grid"] = insuranceResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }
    //     if(credentialResponse.length>0){
    //         //apiUrlObject["name"] = 'Speciality Table';
    //         //apiStr = apiStr + 'addSpeciality/speciality';
    //         //apiUrlObject["apiKey"] = apiStr;
    //         apiJson["SelfServ_Credential_Grid"] = credentialResponse;
    //         //apiUrlArray.push(apiUrlObject);
    //         //apiStr = apiUrl;
    //         //apiUrlObject = {};
    //     }

    //     /*if(apiUrlArray.length>0){
    //         console.log("apiUrlArray: ",apiUrlArray);
    //         axios.all(apiUrlArray.map((endpoint) => axios.post(endpoint["apiKey"],endpoint["apiValue"]))).then((res) => {
    //             for(let i=0;i<apiUrlArray.length;i++){
    //                 if(res[i].status === 200){
    //                    //alert(apiUrlArray[i]["name"] + " data saved successfuly");
    //                 }
    //                 else{
    //                     //alert("Error in saving "+apiUrlArray[i]["name"] + " data");
    //                 }
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //             //alert("Error in saving data");
    //         });
    //     }*/
    //     return apiJson;
    // }

    const saveGridData = (caseNumber) => {
        let apiUrlArray = [];
        let apiStr = baseURL;
        let apiUrlObject = {};
        const typeResponse = getGridDataValues(typeTableRowsData, caseNumber);
        const paymentResponse = getGridDataValues(paymentTableRowsData, caseNumber);

        if (typeResponse.length > 0) {
            apiUrlObject["name"] = 'Type Table';
            apiStr = apiStr + 'addType/type';
            apiUrlObject["apiKey"] = apiStr;
            apiUrlObject["apiValue"] = typeResponse;
            apiUrlArray.push(apiUrlObject);
            apiStr = baseURL;
            apiUrlObject = {};
        }
        if (paymentResponse.length > 0) {
            apiUrlObject["name"] = 'Payment Table';
            apiStr = apiStr + 'addPayment/payment';
            apiUrlObject["apiKey"] = apiStr;
            apiUrlObject["apiValue"] = paymentResponse;
            apiUrlArray.push(apiUrlObject);
            apiStr = baseURL;
            apiUrlObject = {};
        }

        if (apiUrlArray.length > 0) {
            //console.log("apiUrlArray: ", apiUrlArray);
            customAxios.all(apiUrlArray.map((endpoint) => customAxios.post(endpoint["apiKey"], endpoint["apiValue"],{headers:{'Authorization':`Bearer ${token}`}}))).then((res) => {
                for (let i = 0; i < apiUrlArray.length; i++) {
                    if (res[i].status === 200) {
                        //alert(apiUrlArray[i]["name"] + " data saved successfuly");
                    }
                    else {
                        //alert("Error in saving "+apiUrlArray[i]["name"] + " data");
                    }
                }
            })
                .catch((err) => {
                    //console.log(err.message);
                    //alert("Error in saving data");
                });
        }
    }

    const getGridDataValues = (tableData, caseNumber) => {
        //var headers = document.getElementById(tableId).headers;
        let returnArray = [];
        tableData.map((data) => {
            const dataObject = {};
            const dataKeys = Object.keys(data);
            dataKeys.forEach((dataValue) => {
                const dataKeyType = typeof (data[dataValue]);
                if (dataKeyType === 'object') {
                    console.log("Nidhi Inside dataObject:", dataObject[dataValue]);
                    dataObject[dataValue] =
                    data[dataValue].value !== undefined ? data[dataValue].value : "";
                }
                if (dataKeyType !== 'object') {
                    dataObject[dataValue] = data[dataValue];
                }
            })
            dataObject.caseNumber = caseNumber;
            returnArray.push(dataObject);
        })
        return returnArray;
    }

    const { ValueContainer, Placeholder } = components;
    const CustomValueContainer = ({ children, ...props }) => {
        return (
          <ValueContainer {...props}>
            <Placeholder {...props} isFocused={props.isFocused}>
              {props.selectProps.placeholder}
            </Placeholder>
            {React.Children.map(children, child =>
              child && child.type !== Placeholder ? child : null
            )}
          </ValueContainer>
        );
      };


    const populateFormBasisOnType = () => {
        // console.log("Inside populateFormBasisOnType")
        // console.log("formName.current= ", formName.current)
        // console.log("tabRef.current= ", tabRef.current)
        if (tabRef.current === "DashboardView") {
            //console.log("Inside DashboardView")
            return (
                <>
                    <Tabs
                        defaultActiveKey="Provider Contracting"
                        id="justify-tab-example"
                        className="mb-3"
                        justify
                    >
                        {/* <Tab eventKey={prop.state.formNames} title={ProvAnciFac.displayName}>
                         {populateForm()}
                    </Tab> */}


                        <Tab eventKey="Provider Contracting" title="Provider Contracting">
                            {populateForm()}
                        </Tab>
                        <Tab eventKey="Compensation" title="Compensation">
                            <CompensationTab
                                                apiTestStateComp={apiTestStateComp}
                                                firlTableRowsData={firlTableRowsData}
                                                compensationTableRowsData={compensationTableRowsData}
                                                addTableRows={addTableRows}
                                                deleteTableRows={deleteTableRows}
                                                handleGridSelectChange={handleGridSelectChange}
                                                /*handleGridDateChange={handleGridDateChange}*/
                                                handleGridFieldChange={handleGridFieldChange}
                                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                                handleLinearSelectChange={handleLinearSelectChange}
                                                handleLinearFieldChange={handleLinearFieldChange}
                                                handleMedicalGrpNoShow={handleMedicalGrpNoShow}
                                                handleDateChange={handleDateChange}
                                                /*selectJson={selectValues}*/
                                                lockStatus={(prop.state!==null && prop.state.lockStatus!==undefined)?prop.state.lockStatus:'N'}>
                        </CompensationTab>/
                        </Tab>
                        <Tab eventKey="Decision" title="Decision">
                            <DecisionTab />
                        </Tab>
                        <Tab eventKey="Reference" title="Reference">
                            < ReferenceTab />
                        </Tab>
                    </Tabs>
                </>
            )
        }
        if (tabRef.current === "HomeView") {
            //console.log("Inside HomeView")
            return (
                <>
                    {populateForm()}
                </>
            )
        }

        //populateForm();
    }


    const populateForm = () => {
        //console.log(apiTestState)
        return (
            <>
                <div className="col-xs-12">
                    <div className="accordion AddProviderLabel" id="accordionPanelsStayOpenExample">
                        <Formik
                            //enableReinitialize = {formikInitializeState}
                             initialValues={apiTestState}

                            onSubmit={async values => {
                                await new Promise(resolve => setTimeout(resolve, 500));
                                //alert(JSON.stringify(values, null, 2));
                                saveData(values);
                            }}
                            validationSchema={validationSchema}
                        >
                            {props => {
                                const {
                                    values,
                                    touched,
                                    errors,
                                    dirty,
                                    isSubmitting,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    handleReset
                                } = props;
                                //console.log(values)
                                return (
                                    <form onSubmit={e=>{e.preventDefault();}}>
                                        <fieldset
                                        disabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                    Instructions
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                                <div className="accordion-body">
                                                    <div className="row my-2">
                                                        <div className="col-xs-12">
                                                            <label id="instructionHeading" className='instructionHeading'>Please provide the following information below and to review all information to confirm the accuracy to proceed with network acceptance and contracting.</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
                                                    Administrative Information
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwo">
                                                <div className="accordion-body">
                                                    <div className="row my-2">
                                                        <div className="col-xs-6 col-md-4">
                                                             <div className="form-floating">

                                                             <Select
                                                              classNames={{
                                                                control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectThree&&!selectData.selectThree.value)?"is-invalid":""}`
                                                            }}
                                                                  styles={{
                                                                    control: (provided) => ({
                                                                        ...provided,
                                                                        height: '58px'
                                                                    }),
                                                                    menuList: (provided) => ({
                                                                        ...provided,
                                                                        maxHeight: 200,
                                                                    }),

                                                                    container: (provided, state) => ({
                                                                        ...provided,
                                                                        marginTop: 0
                                                                      }),
                                                                      valueContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        overflow: "visible"
                                                                      }),
                                                                      placeholder: (provided, state) => ({
                                                                        ...provided,
                                                                        position: "absolute",
                                                                        top: state.hasValue || state.selectProps.inputValue ? -15 : "50%",
                                                                         transition: "top 0.1s, font-size 0.1s",
                                                                        fontSize: (state.hasValue || state.selectProps.inputValue) && 13
                                                                          })

                                                                        }}
                                                    components={{
                                                    ValueContainer: CustomValueContainer
                                                  }}
                                                name = "contractType"
                                                    //isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                                    isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                                     className="basic-multi-select"
                                                    options={masterValues}
                                                     id='contractTypeDropdown'
                                                     isMulti={false}
                                                     onChange={value => {
                                                        //console.log(value);
                                                        //if("value is selected"){
                                                            setSelectData({...selectData, selectThree: {value: value}});
                                                            //Nidhi 04-24-2023
                                                            prop.state.contractType=value.value;
                                                            //till here
                                                        //}
                                                    }}
                                                    //  onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                                                     value={(selectData&&selectData.selectThree&&selectData.selectThree.value)?
                                                        (selectData&&selectData.selectThree&&selectData.selectThree.value):
                                                        {label:apiTestState.contractType, value:apiTestState.contractType}
                                                        }
                                                    onFocus={()=>{
                                                    }}
                                                    onBlur={event => {
                                                        if(selectData&&(!selectData.selectThree||(selectData.selectThree&&!selectData.selectThree.value))){
                                                            setSelectData({...selectData, selectThree: {value: ""}});
                                                        }
                                                    }}
                                                     //value={apiTestState.contractType}
                                                     placeholder ="Contract Type"
                                                //styles={{...customStyles}}
                                                    isSearchable = {document.documentElement.clientHeight>document.documentElement.clientWidth?false:true}
                                            />
                                            {(selectData&&selectData.selectThree&&!selectData.selectThree.value)?<div className="invalid-feedback" style={{display:'block'}}>Please select Contract Type</div>:null}
                                                             </div>
                                                        </div>
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="mgrFirstName">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                // console.log("----->"+JSON.stringify(apiTestState))
                                                                <div className="form-floating">
                                                                    <input maxLength="30" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Administrator First Name</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="mgrLastName">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="70" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Administrator Last Name</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>




                                                    </div>

                                                    <div className="row my-2">
                                                    <div className="col-xs-6 col-md-4">
                                                            <Field name="mgrEmail">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="50" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Administrator Email</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="mgrPhone">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="10" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Contact Phone#</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="mgrFax">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="10" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Contact Fax#</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                    {/* <p>Format: xxx-xxx-xxxx</p> */}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>


                                                    </div>
                                                    <div className="row my-2">
                                                    <div className="col-xs-6 col-md-4">
                                                            <Field name="entityName">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="100" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Legal Entity Name</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                    </div>
                                                    <div className="col-xs-6 col-md-4">
													      <Field name="credContactName">
														{({
															field, // { name, value, onChange, onBlur }
															form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
															meta,
														}) => (
                                                        //console.log("OrgName Field: ",field);
														<div className="form-floating">
															<input maxLength="100" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
															<label htmlFor="floatingInputGrid">Credentialing Contact Name</label>
															{meta.touched && meta.error && (
																<div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
															)}
														</div>
														)}
                                                          </Field>

                                                    </div>
                                                    <div className="col-xs-6 col-md-4">
                                                            <Field name="credEmail">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="50" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John"  {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Credentialing Email</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>
                                                    </div>

                                                    <div className="row my-2">

                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="credPhone">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="10" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Credentialing Phone#</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="credFax">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="10" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Credentialing Fax#</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                    {/* <p>Format: xxx-xxx-xxxx</p> */}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>

                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="contractId">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="9" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field} disabled/>
                                                                    <label htmlFor="floatingInputGrid">Contract Id</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                    {/* <p>Format: xxx-xxx-xxxx</p> */}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>


                                                    </div>

                                                    {/* <div className="row my-2">
                                                <div className="col-xs-6 col-md-4">

                                                        <label>How many Providers need to be contracted?</label>
                                                        <br/>

                                                        <input type="text" style={{width:'400px'}} name="provCount" onChange={event => handleApiTestChange(event)} value={apiTestState.provCount}/>

                                                </div>

                                            </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                                    Please Provide Contract Address of Notice
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingThree">
                                                <div className="accordion-body">
                                                    <div className="row my-2">
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="provAddress">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="150" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Address</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="provAddress2">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="100" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Address 2</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>

                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="proCity">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="50" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">City</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>
                                                    </div>


                                                    <div className="row my-2">
                                                        {/* <div className="col-xs-6 col-md-4">
                                                    <div className="form-floating" >
                                                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example" name="State" onChange={event => handleApiTestChange(event)} value={apiTestState.State}>
                                                        <option selected>Select</option>
                                                        <option value="1">AL</option>
                                                        <option value="2">FL</option>
                                                        <option value="3">AU</option>
                                                        <option value="3">ZL</option>
                                                        </select>
                                                        <label for="floatingSelect">State</label>
                                                    </div>
                                                </div> */}
                                                        <div className="col-xs-6 col-md-4">
                                                            <div className="form-floating">
                                                                {/* <label htmlFor="state">State</label>  */}
                                                                <Select
                                                                    // classNames={{
                                                                    //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
                                                                    // }}
                                                                    placeholder="State"
                                                                    id='stateDropdown'
                                                                    isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                                                    styles={{

                                                                        control: (provided) => ({
                                                                            ...provided,
                                                                            height: '58px'
                                                                        }),
                                                                        menuList: (provided) => ({
                                                                            ...provided,
                                                                            maxHeight: 200,
                                                                        }),

                                                                        container: (provided, state) => ({
                                                                            ...provided,
                                                                            marginTop: 0
                                                                          }),
                                                                          valueContainer: (provided, state) => ({
                                                                            ...provided,
                                                                            overflow: "visible"
                                                                          }),
                                                                        placeholder: (provided, state) => ({

                                                                            ...provided,
                                                                            position: "absolute",
                                                                            top: state.hasValue || !!state.selectProps.inputValue ? -15 : "50%",
                                                                            transition: "top 0.1s, font-size 0.1s",
                                                                            fontSize: (state.hasValue || state.selectProps.inputValue) && 13
                                                                          })
                                                                    }}
                                                                    components={{
                                                                        ValueContainer: CustomValueContainer
                                                                    }}
                                                                    name = "state"
                                                                    className="basic-multi-select"
                                                                    isMulti={false}
                                                                    onChange={value => {
                                                                        //console.log(value);
                                                                        //if("value is selected"){
                                                                            setSelectData({...selectData, selectOne: {value: value}});
                                                                        //}
                                                                    }}
                                                                    // onChange={value =>{
                                                                    //   if(input.value.length<8){
                                                                    //     input.onChange(value);
                                                                    //   }
                                                                    //   else if(currentValue[0]&&(input.value.length>currentValue[0].length)){
                                                                    //     input.onChange(value);
                                                                    //   }
                                                                    //   currentValue=[value]
                                                                    // }}
                                                                    value={(selectData&&selectData.selectOne&&selectData.selectOne.value)?
                                                                        (selectData&&selectData.selectOne&&selectData.selectOne.value):
                                                                        {label:apiTestState.provState, value:apiTestState.provState}
                                                                        }
                                                                    onFocus={()=>{

                                                                    }}
                                                                    ref={stateRef}
                                                                   onBlur={event => {
                                                                        if(selectData&&(!selectData.selectOne||(selectData.selectOne&&!selectData.selectOne.value))){
                                                                            setSelectData({...selectData, selectOne: {value: ""}});
                                                                        }
                                                                        // event.preventDefault()
                                                                    }}

                                                                     options={selectValues.stateArray?selectValues.stateArray:[{label:"option", value:"option"}]}



                                                                    // styles={{...customStyles}}
                                                                    isSearchable = {document.documentElement.clientHeight>document.documentElement.clientWidth?false:true}
                                                                />
                                                                {(selectData&&selectData.selectOne&&!selectData.selectOne.value)?<div className="invalid-feedback" style={{display:'block'}}>Please select atleast one option</div>:null}
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-6 col-md-4">
                                                            <Field name="provZipCode">
                                                                {({
                                                                    field, // { name, value, onChange, onBlur }
                                                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                                                    meta,
                                                                }) => (
                                                                <div className="form-floating">
                                                                    <input maxLength="5" type="text" className={`form-control ${(meta.touched && meta.error)?" is-invalid":field.value?"is-valid":""}`} placeholder="John" {...field}/>
                                                                    <label htmlFor="floatingInputGrid">Zip Code</label>
                                                                    {meta.touched && meta.error && (
                                                                        <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                                    )}
                                                                </div>
                                                                )}
                                                            </Field>
                                                        </div>


                                                        {/* <div className="col-xs-6 col-md-4">

                                                <div className="form-floating">
                                                    <ReactDatePicker
                                                    id = "datePicker"
                                                    className='example-custom-input-provider'
                                                    selected={apiTestState.startDate}
                                                    name="startDate"
                                                    onChange={event => handleDateChange(event)}
                                                        dateFormat="MM/dd/yyyy"
                                                    />
                                                <label htmlFor="datePicker">Date</label>
                                                </div>
                                            </div> */}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                                                    Select a Product(s) & State(s)
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingFour">
                                                <div className="accordion-body">
                                                    <div className="row my-2">
                                                        {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Medicaid</label>
                                                            <br />
                                                            <Switch id="medicaidSwitch" name="medicaid" onChange={isChecked => {
                                                                values.medicaid = isChecked;
                                                                setApiTestState(prevState =>{
                                                                    return{
                                                                        ...prevState,
                                                                        medicaid: isChecked
                                                                    }
                                                                });
                                                            }} checked={apiTestState.medicaid}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />

                                                        </div> */}
                                                        <div className="col-xs-6 col-md-4">
                                                            <label htmlFor="medicaidSwitch">Medicare</label>
                                                            <br />
                                                            <Switch id="medicareSwitch" name="medicare" onChange={isChecked => {
                                                                values.medicare = isChecked;
                                                                setApiTestState({
                                                                    ...apiTestState,
                                                                    medicare: isChecked
                                                                });
                                                            }} checked={apiTestState.medicare}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />
                                                            {/* <div className="form-floating">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="medicareSwitch" name="medicare" onChange={event => handleSwitchChange(event)} value={apiTestState.medicare}/>
                                                            </div>
                                                            </div> */}
                                                        </div>
                                                        {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Exchange</label>
                                                            <br />
                                                            <Switch id="exchangeSwitch" name="exchange" onChange={isChecked => {
                                                                setApiTestState({
                                                                    ...apiTestState,
                                                                    exchange: isChecked
                                                                });
                                                            }} checked={apiTestState.exchange}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />
                                                            {/* <div className="form-floating">
                                                            <div className="form-check form-switch">

                                                                <input className="form-check-input" type="checkbox" id="exchangeSwitch" name="exchange" onChange={event => handleSwitchChange(event)} value={apiTestState.exchange}/>
                                                            </div>
                                                            </div> }
                                                        </div> */}
                                                        {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Commercial</label>
                                                            <br />
                                                            <Switch id="commercialSwitch" name="commercial" onChange={isChecked => {
                                                                setApiTestState({
                                                                    ...apiTestState,
                                                                    commercial: isChecked
                                                                });
                                                            }} checked={apiTestState.commercial}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />
                                                            {/* <div className="form-floating">
                                                            <div className="form-check form-switch">

                                                                <input className="form-check-input" type="checkbox" id="commercialSwitch" name="commercial" onChange={event => handleSwitchChange(event)} value={apiTestState.commercial}/>
                                                            </div>
                                                            </div> s}
                                                        </div> */}
                                                        {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Behavioral Health</label>
                                                            <br />
                                                            <Switch id="medicaidSwitch" name="bhvrHealth" onChange={isChecked => {
                                                                setApiTestState({
                                                                    ...apiTestState,
                                                                    bhvrHealth: isChecked
                                                                });
                                                            }} checked={apiTestState.bhvrHealth}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />
                                                            {/* <div className="form-floating">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="medicaidSwitch" name="medicaid" onChange={event => handleApiTestChange(event)} value={apiTestState.medicaid}/>
                                                            </div>
                                                            </div> }
                                                        </div> */}
                                                    {/* </div>
                                                    <div className="row my-4"> */}
                                                        <div className="col-xs-6 col-md-4">
                                                            <div className="">
                                                                <label htmlFor="state">States</label>
                                                                <Select
                                                                    classNames={{
                                                                        control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectTwo&&!selectData.selectTwo.value)?"is-invalid":""}`
                                                                    }}
                                                                    id='stateDropdown'
                                                                    placeholder="State"
                                                                    isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                                                    styles={{
                                                                        control: (provided) => ({
                                                                            ...provided,
                                                                            height: '58px'
                                                                        }),
                                                                        menuList: (provided) => ({
                                                                            ...provided,
                                                                            maxHeight: 200,
                                                                        })
                                                                    }}
                                                                    className="basic-multi-select"
                                                                    isMulti={true}
                                                                    onChange={value => {
                                                                        //console.log(value);
                                                                        //if("value is selected"){
                                                                            setSelectData({...selectData, selectTwo: {value: value}});
                                                                        //}
                                                                    }}
                                                                    value={
                                                                        !!selectData && !!selectData.selectTwo && !!selectData.selectTwo.value ?
                                                                        selectData.selectTwo.value :
                                                                        apiTestState.prodStatesDefault}
                                                                    onFocus={()=>{

                                                                    }}
                                                                    onBlur={event => {
                                                                        if(selectData&&(!selectData.selectTwo||(selectData.selectTwo&&!selectData.selectTwo.value))){
                                                                            setSelectData({...selectData, selectTwo: {value: ""}});
                                                                        }
                                                                        // event.preventDefault()
                                                                    }}

                                                                    options={(!!selectValues.stateArray && selectValues.stateArray.length>0)?selectValues.stateArray:[{label:"option", value:"option"}]}


                                                                    // styles={{...customStyles}}

                                                                    isSearchable = {document.documentElement.clientHeight>document.documentElement.clientWidth?false:true}
                                                                />
                                                                {(selectData&&selectData.selectTwo&&!selectData.selectTwo.value)?<div className="invalid-feedback" style={{display:'block'}}>Please select atleast one option</div>:null}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingFive">
                                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFive" aria-expanded="true" aria-controls="panelsStayOpen-collapseFive">
                                                    Type
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseFive" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingFive">
                                                <div className="accordion-body">
                                                    <div className="row my-2">
                                                        <div className="col-xs-6 col-md-12">
                                                            <TypeTable typeTableRowsData={typeTableRowsData} addTableRows={addTableRows}
                                                                deleteTableRows={deleteTableRows} handleGridSelectChange={handleGridSelectChange}
                                                                handleGridFieldChange={handleGridFieldChange} gridRowsFinalSubmit={gridRowsFinalSubmit}
                                                                lockStatus={(prop.state!==null && prop.state.lockStatus!==undefined)?prop.state.lockStatus:'N'}></TypeTable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingSix">
                                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseSix" aria-expanded="true" aria-controls="panelsStayOpen-collapseSix">
                                                    Payment Information
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseSix" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingSix">
                                                <div className="accordion-body">
                                                    <div className="row my-2">
                                                        <div className="col-xs-6 col-md-12">
                                                            <PaymentTable paymentTableRowsData={paymentTableRowsData} addTableRows={addTableRows}
                                                                deleteTableRows={deleteTableRows} handleGridSelectChange={handleGridSelectChange}
                                                                handleGridFieldChange={handleGridFieldChange} gridRowsFinalSubmit={gridRowsFinalSubmit}
                                                                lockStatus={(prop.state!==null && prop.state.lockStatus!==undefined)?prop.state.lockStatus:'N'}></PaymentTable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        
                                        <div style={{display:'flex', alignItems: 'center', justifyContent:'center', marginTop: 30, marginBottom: 20}}>
                                            {/* <button type="submit" id='mainFormSubmit' style={{'display':'none'}} className="providerPageButton button" onClick={event => {handleSubmit()}}>{isSubmitting?"Saving":"Save"}</button> */}
                                            <button type="submit" id='mainFormSubmit' style={{'display':'none'}} className="providerPageButton button"
                                            onClick={event => {handleSubmit(event)}}>{isSubmitting?"Saving":"Save"}</button>
                                        </div>
                                        </fieldset>
                                    </form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </>
        )
    }

    const callProcRef = useRef(null);
    const callFormSubmit = (evnt) => {
        //console.log(evnt);
        if(evnt.target.name == 'saveSubmit'){
            callProcRef.current = 'callProc';
        }

        if(evnt.target.name == 'saveExit'){
            callProcRef.current = 'notCallProc';
        }
        document.getElementById('mainFormSubmit').click();
        console.log("Inside callFormSubmit callProcRef.current", callProcRef.current);
    }
    return ( loadForm &&
        <>
            <div className="ProvAnciFac backgroundColor" style={{ minHeight: "100vh" }}>
                {tabRef.current==='DashboardView' &&
                    <CaseInformation/>
                }
                <div className="container">
                    <div className="row mb-2">
                        <div className="col-xs-6" style={{ textAlign: "center" }}>
                            <br />
                            <button type="button" className="providerPageButton button" onClick={event => navigateContractingHome(event)} style={{ float: "left" }}>Go To Home</button>
                            {formName&&formName.current?<label id="tileFormLabel" className='HeadingStyle'>{formName.current}</label>:null}
                            <button type="button" className="providerPageButton button" onClick={event => navigateContractingHome(event)} style={{ visibility:'hidden', background: 'transparent', border:'unset' }}></button>
                            {tabRef.current==='DashboardView' &&
                                <button type="button" className="btn btn-outline-primary btnStyle" name="saveExit" onClick={event => {callFormSubmit(event)}} style={{float:"right",marginRight:"10px"}}
                                disabled={buttonDisableFlag || ((tabRef.current==='DashboardView')&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                >Save & Exit</button>
                            }

                            {/* Changed by Nidhi */}
                            {/* <button type="button" className="btn btn-outline-primary btnStyle" name="saveSubmit" onClick={event => {callFormSubmit(event)}} style={{float:"right",marginRight:"10px"}}

                            >{(tabRef.current==='DashboardView')?'Save & Submit':'Submit'}</button> */}
                            <button type="button" className="btn btn-outline-primary btnStyle" name="saveSubmit" onClick={event => {callFormSubmit(event)}} style={{float:"right",marginRight:"10px"}}
                            disabled={buttonDisableFlag || ((tabRef.current==='DashboardView')&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                            >{(tabRef.current==='DashboardView')?'Save & Submit':'Submit'}</button>
                            {/* //Till here */}
                            {/* <button type="button" className="btn btn-outline-primary btnStyle" name="saveSubmit" onClick={event => {callFormSubmit(event)}} style={{float:"right",marginRight:"10px"}}>Submit</button> */}
                            {/* <label id="tileFormLabel" className='HeadingStyle'>Provider Contracting</label> */}

                        </div>
                    </div>
                </div>
                <br />
                <div className="container" style={{ overflow: "auto", height: "auto", minHeight: "100%", paddingBottom: 60 }}>
                    <div className="row">
                        {populateFormBasisOnType()}
                    </div>
                </div>
                {/* <footer className='footerStyle'>
                    <div className="content-wrapper">
                        <div className='float-left'>
                            <h6 style={{paddingTop: 5, borderTop: '1px solid lightgray'}}></h6>
                        </div>
                    </div>
                </footer> */}
                   <FooterComponent/>
            </div>
        </>
    )
}
