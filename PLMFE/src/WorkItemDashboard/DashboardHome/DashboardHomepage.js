import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import healthCareLogo from "../../Images/healthCareLogo.png";
import lockIcon from "../../Images/unlock.png";
import advancedSearchIcon from "../../Images/AdvancedSearch.png";
import "./DashboardHomePage.css";
import axios from "../../api/axios";
import { FaAmbulance } from "react-icons/fa";
import { GoProject } from "react-icons/go";
import { GoProjectRoadmap } from "react-icons/go";
import { GoProjectSymlink } from "react-icons/go";
import { TbAmbulance } from "react-icons/tb";
import { BsTerminalX } from "react-icons/bs";
import { TbFileReport } from "react-icons/tb";
import { BiSolidReport } from "react-icons/bi";
import { CgPassword } from "react-icons/cg";
import { GoSignOut } from "react-icons/go";
import { useSelector, useDispatch } from "react-redux";
import ViewDatamanagement from "./Datamanagement/ViewData/ViewDatamanagement";
import ViewReport from "./Reports1/ViewReport/ViewReport";
import viewReportLogo from "../../Images/viewReportLogo.png";
import { TbAlignBoxRightStretch } from "react-icons/tb";
import ListUsers from "./ListUser/ListUser";
import ModuleRights from "./RightsManagement/ModuleRights/ModuleRights";
import StageRights from "./RightsManagement/StageRights/StageRights";
import ChangePasModal from "./ChangePassword/ChangePasModal";
import databaseLogo from "../../Images/datamangement.png";
import createCaseLogo from "../../Images/CreateCaseIcon.png";
import userRightsLogo from "../../Images/userRightlogo.png";
import loginUserLogo from "../../Images/loginUser.png";
import search from "../../Images/search.png";
import { useAxios } from "../../api/axios.hook";
import useGetDBTables from "../../Components/CustomHooks/useGetDBTables";
import { SIGN_OUT } from "../../actions/types";
import useUpdateDecision from "../../Components/CustomHooks/useUpdateDecision";
import { CLEAR_SIGN_IN } from "../../actions/types";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import FooterComponent from "../../../src/Components/FooterComponent";
import TableComponent from "../../util/TableComponent";
// import GlobalsearchContainer from './Globalsearch/GlobalsearchContainer';
import GroupTermination from "./Globalsearch/GroupTermination";
import DashboardBarChart from "../DashboardBarChart/DashboardBarChart";
import AdvancedSearchModal from "../Advance Search/AdvancedSearchModal";
import OfflineReports from "./Reports1/OfflineReports/OfflineReports";
import { Collapse, Grid, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { ListItemIcon, ListItemText } from "@mui/material";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { MdViewModule } from "react-icons/md";
import { styled } from "@mui/material/styles";
import ContractingSearch from "./Globalsearch/ContractingSearch";

const drawerWidth = 243;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  backgroundColor: "rgb(245,245,245) !important",
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DashboardHomepage() {
  //let apiUrl = 'http://localhost:8081/api/';
  const dispatch = useDispatch();

  //const DataTable = DataTables(window, $);

  const { updateLockStatus, printConsole } = useUpdateDecision();

  const [donutRender, setDonutRender] = useState(true);

  const [provChartData, setProvChartData] = useState({
    Provider: [],
    Contracting: [],
    Appealing: [],
  });

  const [advancedSearchState, setAdvancedSearchState] = useState(false);

  const navigate = useNavigate();

  const { getTableDetails } = useGetDBTables();

  // const allCaseTableRef = useRef();

  const [tableData, setTableData] = useState([]);
  const { customAxios } = useAxios();

  const [operationValue, setOperationValue] = useState("");

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const [changePasswordModal, setchangePasswordModal] = useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [isNavigated, setisNavigated] = React.useState(false);
  const [openDropdown, setOpenDropdown] = useState({
    dropdown1: false,
    dropdown2: false,
    dropdown3: false,
    dropdown4: false,
    dropdown5: false,
  });
  const LoggedInUser = useSelector((store) => store.auth.userName);
  const data = useSelector((store) => store.dashboardNavigationState);
  //const DataTable = DataTables(window, $);
  const $ = require("jquery");
  $.DataTable = require("datatables.net");
  //Added to enable pagination in all case table

  //Commented by Harshit Sharma wrt search container
  //const searchtext = useRef();

  const selectedColumn = useRef();

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  const onMasterLoadFail = (response, typeOfRequest) => {
    //Write code to handle master load errors
  };

  const onMasterLoadSuccess = (response, typeOfRequest) => {
    //Write code to execute after master load success
  };
  const cancelDeleteHandler = () => {
    setDeleteModal({ show: false, id: null });
  };
  const confirmDeleteHandler = (id) => {
    setDeleteModal({ show: true, id: id });
  };
  const deleteTableDataHandler = (id) => {
    // deleteTableRows(index,UserManagementTable.displayName,operationValue);
    handleOperationValue("Force Delete");
    customAxios
      .delete(`/deleteUserManagement/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        // setShallUdateListUser(true);
        setDeleteModal({ show: false, id: null });
      })
      .catch((err) => {
        console.log(err);
        setDeleteModal({ show: false, id: null });
      });
    // decreaseDataId();
  };
  const mastersSelector = useSelector((masters) => masters);
  //console.log("Inside Dashboard Home page mastersSelector: ",mastersSelector);
  const loggedInUserType =
    mastersSelector.hasOwnProperty("auth") &&
    mastersSelector.auth.hasOwnProperty("userType") &&
    mastersSelector.auth.userType === "A"
      ? "A"
      : "S";
  const [caseUnlockState, setCaseUnlockState] = useState([]);
  const [moduleRefs, setModuleRefs] = useState({
    rightsMgmnt: loggedInUserType === "A" ? true : false,
    userMgmnt: loggedInUserType === "A" ? true : false,
    mdmMgmnt: loggedInUserType === "A" ? true : false,
    searchMgmnt: loggedInUserType === "A" ? true : false,
  });

  /*const [moduleRefs, setModuleRefs] = useState({'rightsMgmnt':(loggedInUserType === 'A')?true:false,
                                'userMgmnt' : false, 'mdmMgmnt':false, 'searchMgmnt':false});*/

  const showGridCheckbox = loggedInUserType === "A" ? true : false;

  const handleCheckBoxChange = (evnt, ind) => {
    console.log("Inside handleCheckBoxChange event: ", evnt + " index: ", ind);
    let jsn = tableData[ind];
    printConsole("Inside handleCheckBoxChange value: ", jsn);
    jsn.isChecked = evnt.target.checked;
    setCaseUnlockState([...caseUnlockState, jsn]);
  };

  const adminUpdateLockStatus = () => {
    let unlckState = [...caseUnlockState];

    let apiArr = [];
    unlckState.forEach((e) => {
      if (e.isChecked) {
        let apiJson = {};
        apiJson.LockStatus = "N";
        apiJson.LockedBy = 0;
        apiJson.whereClause = { caseNumber: e.CaseNumber };
        apiArr.push(apiJson);
        //updateLockStatus('N',e.caseNumber,0,'')
      }
    });
    console.log(
      "Inside DashboardLoginPage adminUpdateLockStatus apiArr: ",
      apiArr,
    );
    setCaseUnlockState([]);
    if (apiArr.length > 0) {
      let gridData = {};
      let gridKeys = getTableDetails()["mainTable"][0];
      const tableName = gridKeys.substring(0, gridKeys.lastIndexOf("~"));
      gridData[tableName] = apiArr;
      console.log(
        "Inside DashboardLoginPage adminUpdateLockStatus input params: ",
        gridData,
      );
      axios
        .post("/generic/update", gridData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(
            "Inside DashboardLoginPage adminUpdateLockStatus Data Update result: ",
            res,
          );
          const apiStat = res.data["UpdateCase_Output"]["Status"];
          if (apiStat === 0) {
            alert("Cases Unlocked successfully");
          }

          if (apiStat === -1) {
            alert("Error in unlocking cases");
          }
        })
        .catch((err) => {
          console.log(err.message);
          //alert("Error in saving data");
        });
      //  document.getElementById("refreshIconButton").click();
    } else {
      alert("Please select case to unlock");
    }
  };

  useEffect(() => {
    console.log("stdpra is here");
    if (!isSignedIn) {
      navigate("/DashboardLogin", { replace: true });
    }
    printConsole("Inside Dashboard home page use effect: ", mastersSelector);
    if (loggedInUserType !== "A") {
      setAsPerModuleRights();
    }

    if (mastersSelector["masterStageRights"].length > 0) {
      getBarChartData();
    }

    if (data?.data?.length > 0) {
      setisNavigated(true);
      console.log("stdpra1", data.data);
      setTableData(data.data);

      if (data.caseSubmitted) {
        getBarChartData();
      }
    }
  }, [
    mastersSelector["masterStageRights"],
    mastersSelector["masterModuleRights"],
  ]);

  const setAsPerModuleRights = () => {
    //let getApiJson = {};

    //let moduleRightsArr = (mastersSelector['masterModuleRights'][0]!==undefined)?[...mastersSelector['masterModuleRights'][0]]:[];
    let moduleRightsArr = mastersSelector.hasOwnProperty("auth")
      ? mastersSelector.auth.hasOwnProperty("priviliges")
        ? mastersSelector.auth.priviliges
        : []
      : [];
    printConsole(
      "Inside setAsPerModuleRights get Table data moduleStageRights: ",
      moduleRightsArr,
    );
    if (moduleRightsArr.length > 0) {
      let moduleJson = { ...moduleRefs };
      /*let whereString = '=~'+moduleRightsArr[0].MODULEID;
            
            moduleRightsArr.splice(0,1);
            
            
            moduleRightsArr.forEach(element => {
                whereString += '&&'+element.MODULEID; 
            });
            getApiJson['tableNames'] = getTableDetails()['moduleDetailsTable'];
            getApiJson['whereClause'] = {'MODULEID':whereString};
            printConsole('Inside setAsPerModuleRights module rights get data api input: ',getApiJson);
            customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
                printConsole('Inside setAsPerModuleRights module rights get data api output: ',res);
                if(res.data.Status === 0){
                    let respArr = res.data.data.moduleTable;
                    
                    respArr.forEach((elem) => {
                        const moduleName = elem.MODULENAME;
                        if(moduleName !== null && moduleName !== undefined){
                            if((moduleName.localeCompare('Master Data Management', undefined, { sensitivity: 'accent' })) === 0){
                                moduleJson.mdmMgmnt = true;
                            }

                            if((moduleName.localeCompare('User Management', undefined, { sensitivity: 'accent' })) === 0){
                                moduleJson.userMgmnt = true;
                            }
                        }
                    })
                    printConsole('Inside setAsPerModuleRights module rights after for json: ',moduleJson);
                    setModuleRefs(moduleJson);
                    
                }
            });*/
      moduleRightsArr.forEach((moduleName) => {
        //const moduleName = elem.MODULENAME;
        //printConsole('Inside moduleRightsArr moduleName: ',moduleName);
        if (moduleName !== null && moduleName !== undefined) {
          if (
            moduleName.localeCompare("Master Data Management", undefined, {
              sensitivity: "accent",
            }) === 0
          ) {
            moduleJson.mdmMgmnt = true;
          }

          if (
            moduleName.localeCompare("User Management", undefined, {
              sensitivity: "accent",
            }) === 0
          ) {
            moduleJson.userMgmnt = true;
          }

          if (
            moduleName.localeCompare("Rights Management", undefined, {
              sensitivity: "accent",
            }) === 0
          ) {
            moduleJson.rightsMgmnt = true;
          }

          if (
            moduleName.localeCompare("Search Management", undefined, {
              sensitivity: "accent",
            }) === 0
          ) {
            moduleJson.searchMgmnt = true;
          }
        }
      });
      printConsole(
        "Inside setAsPerModuleRights module rights after for json: ",
        moduleJson,
      );
      setModuleRefs(moduleJson);
    }
  };

  const [page, setPage] = useState("cards");

  // const [dropDownState, setDropDownState] = useState(false);

  const [modalShow, setModalShow] = useState(false);

  const [usersTableRowsData, setUsersTableRowsData] = useState([
    {
      license: {
        value: "abc",
      },
      stateAbbreviation: {
        value: "anything",
      },
      licenseType: {
        value: "temp",
      },
    },
  ]);

  const SearchHeaders = [
    {
      name: "caseId",
      displayName: "CASE ID",
    },
    {
      name: "npiId",
      displayName: "NPI ID",
    },
    {
      name: "FirstName",
      displayName: "FIRST NAME",
    },
    {
      name: "LastName",
      displayName: "LAST NAME",
    },
    {
      name: "LegalEntityName",
      displayName: "LEGAL ENTITY NAME",
    },
  ];

  //Commented by Harshit Sharma wrt search container got commented.
  /*const getsearchTableData =  async (field, searchText)=>{
        try{

            const where = {[field]:searchText};
             let getApiJson= {};
            getApiJson['tableNames'] =getTableDetails()['mainTable'];
              getApiJson['whereClause'] =  where;
              customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
                console.log('Get data--------> Response: ',res)
                if(res.data.Status === 0){
                    const respData = [...res.data.data.mainTable];
                    console.log("respData: ",respData);
                    setTableData(respData);
                    // initialTableData = [...respData];
                    // setTableData(respData);
                }
                }).catch((err) => {
                console.log(err.message);
                });
            // const tableName='MainCaseTable';
            // const where = `${field}%3D'${searchText}'`;
            // const data = await customAxios.get(`/table/data/${tableName}?where=${where}`,{headers:{'Authorization':`Bearer ${token}`}});
            // console.log(data.data.rows);
            // setTableData(data.data.rows);
            //console.log("------"+JSON.stringify(data.data.rows));
            // const {modules, userRights} = data.data;
            // setDataRows(userRights);
            // console.log(dataRows);
            // getColumns(modules);
            // setupdatebtnshow(true);
           // const headers = mapColumns(columns);
           // console.log(headers);
           // setColumns(headers);
            //setDataRows(rows);

        }catch(err){
            console.log(err);
           // setupdatebtnshow(false);
            //setColumns([]);
            //setDataRows([]);

        }
    }*/

  const logout = () => {
    //  const conf = window.confirm('Your abhi has expired');
    //  if(conf){
    dispatch({ type: CLEAR_SIGN_IN, payload: null });
    navigate("/DashboardLogin", true);
    //  }
  };
  const saveData = (data) => {
    dispatch({
      type: "UPDATE_DATA",
      payload: {
        data: data,
      },
    });
  };
  //Commented by Harshit Sharma wrt Search container
  /*
    const searchHandler = ()=>{
       // alert(selectedColumn.current.value)
        getsearchTableData(selectedColumn.current.value, searchtext.current.value);

    }*/

  console.log("Masters Selector Dashboard Home Page: ", mastersSelector);
  const token = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("token")
      ? mastersSelector.auth.token
      : ""
    : "";
  const userName = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("userName")
      ? mastersSelector.auth.userName
      : ""
    : "";
  const [dataIndex, setDataIndex] = useState();

  const provChartRef = useRef([]);

  //const [provChartRef,setProvChartRef] = useState([]);
  // console.log("Dashboard Home Page provChartRef: ",provChartRef);
  // console.log("Dashboard Home Page provChartRef length: ",provChartRef.length);

  const provContChartRef = useRef([]);

  //const [provContChartRef,setProvContChartRef] = useState([]);

  // const provClosedRef = useRef([]);

  //const [provClosedRef,setProvClosedRef] = useState([]);

  // const provContClosedRef = useRef([]);

  //const [provContClosedRef,setProvContClosedRef] = useState([]);
  // const token = useSelector((state) => state.auth.token);
  const getBarChartData = () => {
    printConsole(
      "#############Inside getBarChartData() function##############",
    );

    let getApiJson = {};
    getApiJson["option"] = "GETDASHBOARDCHARTDATA";
    printConsole("Inside getBarChartData() function api input ", getApiJson);
    customAxios
      .post("/generic/callProcedure", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        printConsole("Get data Response for getBarChartData: ", res);
        if (res.data.CallProcedure_Output.Status === 0) {
          let chartData = {};
          let respData = [...res.data.CallProcedure_Output.data];
          let appealFiltered = respData.filter((elem) => elem.FLOWID === 3);
          chartData.Appealing = appealFiltered;
          setProvChartData(chartData);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getDashboardTableData = (stageName, flowId) => {
    printConsole("Inside getDashboardTableData stageName: ", stageName);
    printConsole("Inside getDashboardTableData flowId: ", flowId);

    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["mainTable"];
    getApiJson["whereClause"] = {
      StageName: "=~" + stageName,
      FlowId: "=~" + flowId,
    };
    console.log("dashboard api json ", getApiJson);
    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Get data Response: ", res);
        if (res.data.Status === 0) {
          const respData = [...res.data.data.mainTable];
          console.log("respData1: ", respData);
          console.log("stdpra2", respData);
          setTableData(respData);
          //setTableData(filterHomePageTable(respData));
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
    dispatch({
      type: "STORE_DATA",
      payload: {
        data: [],
        pageNumber: 0,
        searchString: "",
        caseSubmitted: false,
      },
    });
  };

  const openAdvancedSearch = () => {
    printConsole("Inside openAdvancedSearch ");
    setAdvancedSearchState(true);
  };

  const getAllCases = (fieldJson) => {
    console.log("Inside get All cases");

    //New process of Advanced Search by Harshit
    fieldJson["option"] = "GETADVANCEDSEARCHDATA";
    customAxios
      .post("/generic/callProcedure", fieldJson)
      .then((res) => {
        printConsole("Inside DocumentTab docFunction get api output: ", res);
        res = res.data.CallProcedure_Output;
        printConsole(
          "Inside DocumentTab docFunction after get api output: ",
          res,
        );
        if (res.Status === 0) {
          const respData = [...res.data];
          console.log("stdpra3", respData);
          setTableData(respData);
        }
      })
      .catch((err) => {
        // console.log(err.message);
      });
  };

  const filterHomePageTable = (respData) => {
    let filteredStageRightsArr = [];
    const userId = mastersSelector.hasOwnProperty("auth")
      ? mastersSelector.auth.hasOwnProperty("userId")
        ? mastersSelector.auth.userId
        : 0
      : 0;

    let stageRightsArr =
      mastersSelector["masterStageRights"].length === 0
        ? []
        : mastersSelector["masterStageRights"][0];

    if (stageRightsArr.length > 0) {
      let stageRightsStageIdArr = [];
      stageRightsArr.forEach((el) => {
        if (userId !== 0 && el.USERID === userId) {
          stageRightsStageIdArr.push(el.STAGEID);
        }
      });
      if (stageRightsStageIdArr.length > 0) {
        filteredStageRightsArr = respData.filter((elem) => {
          //console.log("StageRights Filtered Array: ",elem.StageName);
          if (stageRightsStageIdArr.includes(elem.StageId)) {
            return elem;
          }
        });
      }
    }
    return filteredStageRightsArr;
  };

  const closedCasesFilter = (processName, flowId) => {
    /*if(processName === 'Provider'){
            setTableData(provClosedRef.current);
        }

        if(processName === 'ProviderContracting'){
            setTableData(provContClosedRef.current);
        }*/

    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["mainTable"];
    getApiJson["whereClause"] = {
      StageName: "=~Exit||Discard",
      FlowId: "&&~=~" + flowId,
    };
    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Get data Response: ", res);
        if (res.data.Status === 0) {
          const respData = [...res.data.data.mainTable];
          printConsole("closedCasesFilter respData: ", respData);
          console.log("stdpra4", filterHomePageTable(respData));
          setTableData(filterHomePageTable(respData));
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const formNavigation = (formName) => {
    let navigateUrl = "/DashboardLogin/" + formName;
    console.log("Inside DashboardHomePage formNavigation: ", navigateUrl);
    /*if(formName === 'AddProvider'){
            navigateUrl = '/DashboardLogin/AddProvider';
        }

        if(formName === 'AddFacility'){
            navigateUrl = '/DashboardLogin/AddFacility';
        }

        if(formName === 'AddAncilary'){
            navigateUrl = '/DashboardLogin/AddAncillary';
        }*/

    navigate(navigateUrl, {
      replace: true,
      state: {
        formView: "DashboardHomeView",
        formOpenedFrom: "Dashboard",
        formNames: formName,
      },
    });
  };

  const navigateToForm = (index) => {
    printConsole("inside navigateToForm: ", tableData[index]);
    const obj = tableData[index];
    console.log("pravtest1234", obj);
    let navigateUrl = "";
    if (obj.CaseNumber !== undefined) {
      //Changed by NG on 12/8/2023

      const transactionTypeMappings = {
        "add a provider": "/DashboardLogin/AddProvider",
        "add a facility": "/DashboardLogin/AddFacility",
        "add an ancillary": "/DashboardLogin/AddAncillary",
        "provider modification": "/DashboardLogin/ProviderModification",
        "ancillary/facility modification":
          "/DashboardLogin/AncillaryFacilityModification",
        appeals: "/DashboardLogin/Appeals",
        "provider disputes": "/DashboardLogin/ProviderDisputes",
        "payto modification": "/DashboardLogin/GroupPayToModification",
        "address modification": "/DashboardLogin/GroupAddressModification",
        "provider contracting": "/ContractingHome/ProviderContracting",
        "facility/ancillary/health systems contracting":
          "/DashboardLogin/FacAncHealthSystem",
        termination: "/DashboardLogin/Termination",
      };

      if (obj.TransactionType !== undefined && obj.TransactionType !== "") {
        const lowercaseTransactionType = obj.TransactionType.toLowerCase();

        if (transactionTypeMappings.hasOwnProperty(lowercaseTransactionType)) {
          navigateUrl = transactionTypeMappings[lowercaseTransactionType];
        }
      }
      //tillhere
      //console.log("Case Number inside DashboardHomePage: ",obj.CaseNumber);
      //const addProviderUrl = '/DashboardLogin/AddProvider/'+obj.caseNumber;
      // console.log("Lock Status: ",obj.LockStatus);
      // console.log("master selector stage rights: ",mastersSelector['masterStageRights'][0]);
      let lockStat = (
        obj.LockStatus !== undefined ? obj.LockStatus : "N"
      ).trim();
      //console.log('Initial lockStat: ',lockStat);
      console.log("pravstatus4", lockStat);
      console.log("pravstatus3", mastersSelector);
      if (lockStat === undefined || lockStat === "N") {
        if (mastersSelector.hasOwnProperty("masterStageRights")) {
          let filteredStageRightsArr = [];
          let stageRightsArr =
            mastersSelector["masterStageRights"].length === 0
              ? []
              : mastersSelector["masterStageRights"][0];
          if (stageRightsArr.length > 0) {
            //console.log('stageRightsArr====  ',stageRightsArr);
            const userId = mastersSelector.hasOwnProperty("auth")
              ? mastersSelector.auth.hasOwnProperty("userId")
                ? mastersSelector.auth.userId
                : 0
              : 0;
            const stageId = obj.hasOwnProperty("StageId") ? obj.StageId : 0;
            // console.log('Main Case Table stage id==== ',obj.StageId);
            // console.log('user id==== ',userId);
            if (
              userId !== "" &&
              userId !== undefined &&
              userId !== 0 &&
              stageId !== 0 &&
              stageId !== undefined
            ) {
              // console.log('Inside if Main Case Table stage id==== ',obj.StageId);
              // console.log('Inside if user id==== ',userId);
              filteredStageRightsArr = stageRightsArr.filter((elem) => {
                // console.log('STAGERIGHTS Table stage id==== ',elem.STAGEID);
                // console.log('STAGERIGHTS Table user id==== ',elem.USERID);
                return elem.USERID === userId && elem.STAGEID === stageId;
              });
              console.log(
                "filteredStageRightsArr==== ",
                filteredStageRightsArr,
              );
              if (filteredStageRightsArr.length > 0) {
                updateLockStatus("Y", obj.CaseNumber, userId, "");
              }
              if (filteredStageRightsArr.length === 0) {
                lockStat = "Y";
              }
            }
            //filteredStageRightsArr = stageRightsArr.filter((elem) => )
          }
        }
      }
      if (obj.StageName === "Exit" || obj.StageName === "Discard") {
        printConsole("Inside exit/discard if: ", obj.StageName);
        lockStat = "Y";
      }
      printConsole("Final Lock status: ", lockStat);
      navigate(navigateUrl, {
        replace: true,
        state: {
          caseNumber: obj.CaseNumber,
          formNames: obj.TransactionType,
          userName: userName,
          // decisionNotes : '',Das
          // stageName : 'Open',
          // transactionType : 'Add Provider',
          formView: "DashboardView",
          stageName: obj.StageName,
          flowId: obj.FlowId,
          lockStatus: lockStat,
          Field1: obj.Field1,
          Field3: obj.Field3,
          decisionReason: obj.DECISON_REASON,
        },
      });
      //<AddProvider caseNumber={obj.caseNumber}></AddProvider>
    }
    saveData(tableData);
    setisNavigated(false);
  };

  const filterTableData = (caseStat, renderFlag, gridName) => {
    // console.log("Inside filterTable: ",caseStat);
    // console.log("Inside filterTable renderFlag: ",renderFlag);
    // console.log("Inside filterTable gridName: ",gridName);
    setDonutRender(renderFlag);
    if (gridName === "Provider") {
      filteringTableData(provChartRef.current, caseStat);
    }

    if (gridName === "ProviderContracting") {
      filteringTableData(provContChartRef.current, caseStat);
    }
    if (gridName === "Appealing") {
      filteringTableData(provContChartRef.current, caseStat);
    }
  };

  const filteringTableData = (tableArr, caseStat) => {
    //console.log('filteringTableData: ',tableArr);
    if (caseStat === "All Cases") {
      //console.log("Inside filterTable not allCases before: ",initialTableData);
      console.log("stdpra5", tableArr);
      setTableData(tableArr);
    }
    if (caseStat !== "All Cases") {
      const tmpTableData = [...tableArr];
      let filteredArray = tmpTableData.filter(
        (data) => data.StageName === caseStat,
      );
      //console.log("Inside filterTable not allCases after: ",filteredArray);
      console.log("stdpra6", filteredArray);
      setTableData(filteredArray);
      //console.log("Inside filterTable state: ",tableData);
    }
  };
  //Legal Entity Name~OrganizationName,
  const columnNames =
    "Case#~CaseNumber,Transaction Type~TransactionType,NPI~NpiId,First Name~FirstName,Last Name~LastName,Legal Entity Name~LegalEntityName,Status~CaseStatus,Stage Name~StageName, States~Field2";
  const tdData = () => {
    if (tableData.length > 0) {
      console.log("Table Data: ", tableData);
      return tableData.map((data, index) => {
        return (
          <tr key={index}>
            {mastersSelector.hasOwnProperty("auth") &&
              mastersSelector.auth.hasOwnProperty("userType") &&
              mastersSelector.auth.userType === "A" && (
                <td className="tableData">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={(event) => handleCheckBoxChange(event, index)}
                      value=""
                      id="caseCheckBox"
                      checked={
                        data.isChecked !== undefined ? data.isChecked : false
                      }
                    />
                  </div>
                </td>
              )}
            <td className="tableData">
              <a
                className="case-link"
                onClick={() => {
                  navigateToForm(index);
                }}
              >
                {"CaseNumber" in data
                  ? data.CaseNumber
                  : "CASENUMBER"
                    ? data.CASENUMBER
                    : ""}
              </a>
            </td>
            <td className="tableData">
              {"TransactionType" in data
                ? data.TransactionType
                : "TRANSACTIONTYPE"
                  ? data.TRANSACTIONTYPE
                  : ""}
            </td>
            <td className="tableData">
              {"NpiId" in data ? data.NpiId : "NPIID" ? data.NPIID : ""}
            </td>
            <td className="tableData">
              {"FirstName" in data
                ? data.FirstName
                : "FIRSTNAME"
                  ? data.FIRSTNAME
                  : ""}
            </td>
            <td className="tableData">
              {"LastName" in data
                ? data.LastName
                : "LASTNAME"
                  ? data.LASTNAME
                  : ""}
            </td>
            <td className="tableData">
              {"LegalEntityName" in data
                ? data.LegalEntityName
                : "LEGALENTITYNAME"
                  ? data.LEGALENTITYNAME
                  : ""}
            </td>
            <td className="tableData">
              {"CaseStatus" in data
                ? data.CaseStatus
                : "CASESTATUS"
                  ? data.CASESTATUS
                  : ""}
            </td>
            <td className="tableData">
              {"StageName" in data
                ? data.StageName
                : "STAGENAME"
                  ? data.STAGENAME
                  : ""}
            </td>
          </tr>
        );
      });
    }
  };

  const deleteTableRows = (index, operationValue) => {};

  const decreaseDataIndex = () => {};

  const tdUserData = () => {
    console.log(usersTableRowsData.length);
    if (usersTableRowsData.length > 0) {
      return usersTableRowsData.map((data, index) => {
        //const {fullName, emailAddress, salary, specialityDefault}= data;

        return (
          <tr key={index}>
            <td>
              <button
                className="deleteBtn"
                style={{ float: "left" }}
                onClick={() => {
                  deleteTableRows(index, operationValue);
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
                  handleModalChange(true);
                  handleDataIndex(index);
                  handleOperationValue("Edit");
                }}
              >
                <i className="fa fa-edit"></i>
              </button>
            </td>
            <td className="tableData">
              {"license" in data && data.license.value !== undefined
                ? data.license.value
                : data.license}
            </td>
            <td className="tableData">
              {"stateAbbreviation" in data &&
              data.stateAbbreviation.value !== undefined
                ? data.stateAbbreviation.value
                : data.stateAbbreviation}
            </td>
            <td className="tableData">
              {"licenseType" in data && data.licenseType.value !== undefined
                ? data.licenseType.value
                : data.licenseType}
            </td>
            <td className="tableData"></td>
          </tr>
        );
      });
    }
  };

  const handleModalChange = (flag) => {
    setModalShow(flag);
  };

  const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
  };
  const addTableRows = () => {
    const rowsInput = {};
    setUsersTableRowsData([...usersTableRowsData, rowsInput]);
  };

  const handleDataIndex = (index) => {
    setDataIndex(index);
  };

  const addRowHandler = () => {
    addTableRows();
    handleModalChange(true);
    handleDataIndex(usersTableRowsData.length);
    handleOperationValue("Add");
  };
  const changePasswordHandler = (row) => {
    console.log(row);

    setchangePasswordModal({ show: true, id: null });
  };

  const signout = () => {
    /*const promise = new Promise((resolve, reject) =>{
            resolve(updateLockStatus('N',prop.state.caseNumber));
        });

        await promise
        .then(() => {
            setTimeout(() => {
                dispatch({type: SIGN_OUT, payload: null});
            }, 1000);
        })
        .catch((err) => {
            console.error(err);
        });*/
    dispatch({ type: SIGN_OUT, payload: null });
    dispatch({
      type: "STORE_DATA",
      payload: {
        data: [],
        pageNumber: 0,
        searchString: "",
        caseSubmitted: false,
      },
    });
  };

  const handleKeypress = (e) => {
    //console.log("Inside handleKeyPress ",e);
    //it triggers by pressing the enter key
    if (e.charCode === 13) {
      //Commented by Harshit Sharma wrt search container
      //searchHandler();
    }
  };
  //for opening and closing drawer
  const handleDrawerOpen = () => {
    setOpenDrawer(!openDrawer);
    if (openDrawer == true) {
      setOpenDropdown({
        ...openDropdown,
        dropdown1: false,
        dropdown2: false,
        dropdown3: false,
        dropdown4: false,
        dropdown5: false,
      });
    }
  };
  const handleDropdownClick = (dropdown) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
    setOpenDrawer(true);
  };
  const typoGraphyStyles = {
    variant: "subtitle2",
    fontWeight: 550,
    color: "#434D5B",
    gutterBottom: true,
  };
  const innerTypoStyles = {
    variant: "subtitle2",
    fontWeight: 800,
    marginLeft: -2,
    fontSize: "12px",
    color: "#434D5B",
    gutterBottom: true,
  };
  function handleOpenDrawer() {
    setOpenDrawer(true);
  }
  function closeDrawer() {
    setOpenDrawer(false);
    setOpenDropdown({
      ...openDropdown,
      dropdown1: false,
      dropdown2: false,
      dropdown3: false,
      dropdown4: false,
      dropdown5: false,
    });
  }

  return (
    <Grid container>
      <Grid item md={12} sx={{ display: "flex", backgroundColor: "#F5FEFD" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          open={openDrawer}
          onMouseEnter={handleOpenDrawer}
          onMouseLeave={closeDrawer}
          PaperProps={{
            sx: {
              width: "25%",
              backgroundColor: "rgb(245, 247, 250)",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerOpen}>
              {openDrawer ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",
                }}
                onClick={() => setPage("cards")}
              >
                <Tooltip title="Dashboard" placement="left-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      color: page === "cards" ? "blue" : "",
                    }}
                  >
                    <img
                      src={healthCareLogo}
                      alt="..."
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                    />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  secondary={
                    <Typography {...typoGraphyStyles}>Dashboard</Typography>
                  }
                  variant="body2"
                  sx={{ opacity: openDrawer ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ display: !moduleRefs.userMgmnt ? "none" : "block" }}
            >
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",

                  // color: text.name === contentName.name ? "blue" : "",
                }}
                onClick={() => {
                  setPage("listUsers");
                }}
              >
                <Tooltip title="User Management" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      // color: text.name === contentName.name ? "blue" : "",
                    }}
                  >
                    <svg
                      className="svgHover"
                      height="30px"
                      width="30px"
                      viewBox="0 0 200.688 200.688"
                    >
                      <g>
                        <path
                          d="M190.985,111.644l-0.293-0.347c-1.399-1.729-4.459-4.187-8.922-5.891l-0.684-0.208
                                        c-4.649-2.144-8.861-3.582-10.096-3.987c-0.97-0.319-1.782-0.666-2.43-0.948c-5.128-2.53-5.708-4.008-5.791-4.237l-0.233-0.544
                                        l0.197-0.49c3.811-4.746,6.488-10.275,7.508-15.486l0.15-0.354c1.052-1.342,1.725-2.91,1.993-4.638
                                        c1.213-4.384,1.263-7.605,0.175-9.863l-0.097-0.2l0.05-0.222c1.353-5.665,2.656-16.277-3.847-23.681
                                        c-1.038-1.303-5.025-5.705-12.759-7.97l-3.772-1.292c-6.181-1.904-10.089-2.362-10.74-2.373c-0.412,0-0.78,0.05-1.317,0.168
                                        l-0.465,0.093c-0.272-0.043-0.555-0.068-0.873-0.068c-2.069,0-4.305,0.909-4.305,0.909c-2.18,0.916-13.252,6.023-16.763,16.874
                                        c-0.583,1.542-1.772,6.231-0.233,16.488l0.039,0.254l-0.161,0.215c-1.578,2.126-1.711,5.572-0.397,10.203
                                        c0.344,2.051,1.013,3.69,1.997,4.924l0.165,0.347c0.97,5.372,3.357,10.665,6.904,15.317l0.283,0.376l-0.265,0.376
                                        c-0.154,0.229-0.261,0.465-0.301,0.637c-0.544,1.553-4.706,4.012-11.159,6.596c-1.442-0.523-2.444-0.852-2.799-0.97
                                        c-1.306-0.437-2.398-0.905-3.282-1.292c-6.825-3.368-7.723-5.332-7.859-5.783l-0.358-0.798l0.315-0.741
                                        c5.121-6.381,8.715-13.811,10.096-20.843l0.211-0.483c1.417-1.8,2.323-3.905,2.663-6.199c1.628-5.866,1.714-10.182,0.247-13.192
                                        l-0.161-0.319l0.086-0.344c1.822-7.609,3.568-21.845-5.161-31.762c-1.385-1.736-6.703-7.641-17.096-10.683l-5.078-1.743
                                        C77.89,4.865,72.629,4.296,71.946,4.289c-0.558,0-1.041,0.061-1.746,0.229l-0.68,0.111c-2.813-0.455-6.27,0.88-6.896,1.124
                                        c-2.928,1.228-17.769,8.092-22.475,22.643c-0.784,2.061-2.373,8.346-0.308,22.114l0.061,0.415l-0.258,0.344
                                        c-2.104,2.813-2.265,7.412-0.501,13.621c0.451,2.734,1.346,4.917,2.673,6.589l0.233,0.49c1.285,7.208,4.491,14.326,9.266,20.593
                                        l0.447,0.583l-0.426,0.616c-0.208,0.304-0.347,0.616-0.379,0.812c-1.185,3.375-14.394,9.276-25.968,12.809
                                        c-8.332,3.157-11.989,8.271-12.011,8.303C1.503,132.72,0.05,169.292,0,170.863c0.179,9.513,4.499,11.445,5.329,11.724l0.73,0.319
                                        c25.385,11.077,62.462,13.235,66.61,13.446l1.296,0.039c1.238,0,2.494-0.068,3.672-0.132l0.104-0.004l0.383,0.029
                                        c0.308,0.075,0.558,0.115,0.816,0.115h0.004l0.175-0.007c1.678-0.086,41.486-2.348,66.327-13.496
                                        c1.356-0.358,5.737-2.24,6.131-11.488c8.858-0.766,30.048-3.207,44.439-9.659c1.066-0.279,4.556-1.761,4.674-9.273
                                        C200.527,149.587,199.142,123.776,190.985,111.644z M55.104,98.377l0.691-0.644l0.687,0.644c6.077,5.726,12.809,8.872,18.936,8.872
                                        c6.438,0,13.084-2.792,19.218-8.081l0.519-0.437L96.5,99.39c1.145,1.041,3.196,2.537,4.116,2.988l1.267,0.619l-0.136,0.129
                                        l0.487,0.293c1.16,0.684,2.394,1.353,3.804,2.054c1.428,0.633,2.652,1.109,3.951,1.539c0.254,0.086,6.317,2.044,13.227,5.243
                                        l1.235,0.383c6.567,2.502,9.344,6.027,9.445,6.148c10.193,15.131,11.907,48.157,12.075,51.85c-0.079,5.161-1.55,6.499-1.933,6.757
                                        c-22.844,10.225-57.355,12.884-64.033,13.31l-0.186,0.011l-0.19-0.057c-0.225-0.068-0.455-0.1-0.741-0.1h-0.007l-0.236,0.011
                                        c-1.825,0.125-3.335,0.186-4.746,0.186h-1.106c-4.159-0.251-41.372-2.688-65.189-13.285c-0.48-0.2-1.886-1.825-1.99-6.571
                                        c0.004-0.354,1.228-36.003,11.925-51.893c0.523-0.659,3.432-4.048,9.244-6.267c5.107-1.571,17.751-5.762,24.665-10.769
                                        c0.29-0.175,0.576-0.469,0.884-0.784C52.838,100.639,53.89,99.508,55.104,98.377z M126.273,107.299l-0.945-0.276
                                        c-1.553-0.716-3.182-1.424-4.867-2.115c2.38-1.113,4.327-2.205,5.773-3.26c0.233-0.136,0.465-0.372,0.684-0.601
                                        c0.523-0.562,1.228-1.317,2.051-2.086l0.44-0.404l0.422,0.412c4.549,4.273,9.573,6.617,14.144,6.617
                                        c4.817,0,9.781-2.083,14.351-6.027l0.326-0.276l0.923,0.447c0.841,0.784,2.373,1.886,3.056,2.226l0.798,0.379l-0.097,0.097
                                        l0.501,0.293c0.87,0.519,1.8,1.013,2.842,1.528c1.07,0.472,1.979,0.83,2.942,1.152c0.186,0.061,4.656,1.496,9.824,3.89l0.909,0.279
                                        c4.706,1.8,6.753,4.27,6.95,4.527c7.605,11.273,8.833,35.71,8.944,38.433c-0.054,3.779-1.102,4.746-1.364,4.917
                                        c-14.308,6.403-34.851,8.808-43.49,9.566c-0.777-11.216-3.547-37.632-12.787-51.371l-0.39-0.469
                                        C136.34,112.868,132.239,109.583,126.273,107.299z M120.922,66.479l0.161-0.19c0.723-0.53,1.077-1.349,0.941-2.197
                                        c-1.718-10.318-0.601-14.648-0.218-15.74c2.996-9.187,12.419-13.474,14.272-14.233c0.372-0.143,1.092-0.358,1.854-0.487
                                        l0.229-0.054l1.421-0.075l0.011,0.097l0.429-0.039c0.319-0.025,0.626-0.075,0.841-0.122l0.48-0.107
                                        c0.304,0.007,4.026,0.49,9.42,2.144l3.804,1.306c6.907,2.04,10.107,5.851,10.697,6.621c5.551,6.299,4.062,15.776,2.677,20.868
                                        c-0.157,0.626-0.061,1.27,0.297,1.797l0.308,0.397c0.39,0.523,0.744,2.602-0.458,7.083c-0.225,1.36-0.73,2.452-1.453,3.178
                                        c-0.293,0.308-0.49,0.709-0.562,1.167c-1.872,10.998-11.721,23.291-22.096,23.291c-8.811,0-18.857-11.316-20.664-23.291
                                        c-0.075-0.455-0.268-0.855-0.587-1.217c-0.737-0.762-1.213-1.875-1.507-3.554C120.35,70.008,120.253,67.492,120.922,66.479z
                                        M44.249,54.626l0.24-0.276c0.931-0.669,1.381-1.721,1.21-2.809c-2.33-13.986-0.809-19.805-0.286-21.266
                                        C49.46,17.853,62.215,12.045,64.72,11.014c0.523-0.2,1.496-0.494,2.527-0.662l0.276-0.064l2.101-0.115l0.007,0.132l0.451-0.043
                                        c0.419-0.039,0.83-0.104,1.31-0.2l0.48-0.111c0.39,0.004,5.315,0.623,12.741,2.899l5.107,1.757
                                        c9.334,2.759,13.682,7.924,14.48,8.958c7.508,8.521,5.504,21.344,3.643,28.234c-0.218,0.795-0.086,1.621,0.369,2.294l0.415,0.533
                                        c0.684,0.916,0.941,3.983-0.587,9.663c-0.308,1.854-0.998,3.357-2.008,4.355c-0.369,0.394-0.608,0.909-0.712,1.492
                                        c-2.541,14.87-15.869,31.497-29.905,31.497c-11.928,0-25.528-15.303-27.983-31.487c-0.082-0.583-0.322-1.109-0.744-1.568
                                        c-1.024-1.056-1.671-2.577-2.069-4.839C43.437,59.479,43.315,56.054,44.249,54.626z"
                        />
                      </g>
                    </svg>{" "}
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  secondary={
                    <Typography {...typoGraphyStyles}>
                      User Management
                    </Typography>
                  }
                  sx={{ opacity: openDrawer ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ display: !moduleRefs.mdmMgmnt ? "none" : "block" }}
            >
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",

                  // color: text.name === contentName.name ? "blue" : "",
                }}
                onClick={() => {
                  setPage("viewData");
                }}
              >
                <Tooltip title="Master Data Management" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      // color: text.name === contentName.name ? "blue" : "",
                    }}
                  >
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                      id="databaseLogoImage"
                      src={databaseLogo}
                      className="img-fluid"
                      alt="..."
                    />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  secondary={<Typography {...typoGraphyStyles}>MDM</Typography>}
                  sx={{ opacity: openDrawer ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ display: !moduleRefs.rightsMgmnt ? "none" : "block" }}
            >
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",

                  // color: text.name === contentName.name ? "blue" : "",
                }}
                onClick={() => handleDropdownClick("dropdown1")}
              >
                <Tooltip title="Rights Management" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      // color: text.name === contentName.name ? "blue" : "",
                    }}
                  >
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                      id="userRightsLogoImage"
                      src={userRightsLogo}
                      className="img-fluid"
                      alt="..."
                    />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  secondary={
                    <Typography {...typoGraphyStyles}>
                      Rights Management
                    </Typography>
                  }
                  sx={{ opacity: openDrawer ? 1 : 0 }}
                />
                {openDropdown.dropdown1 ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </ListItemButton>
              <Collapse
                in={openDropdown.dropdown1}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      setPage("moduleRights");
                    }}
                  >
                    <ListItemIcon>{<MdViewModule />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Module Rights
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      setPage("stageRights");
                    }}
                  >
                    <ListItemIcon>{<TbAlignBoxRightStretch />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Stage Rights
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",

                  // color: text.name === contentName.name ? "blue" : "",
                }}
                onClick={() => handleDropdownClick("dropdown2")}
              >
                <Tooltip title="Create Cases" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      // color: text.name === contentName.name ? "blue" : "",
                    }}
                  >
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                      id="userRightsLogoImage"
                      src={createCaseLogo}
                      className="img-fluid"
                      alt="..."
                    />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  secondary={
                    <Typography {...typoGraphyStyles}>Create Cases</Typography>
                  }
                  sx={{ opacity: openDrawer ? 1 : 0 }}
                />
                {openDropdown.dropdown2 ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </ListItemButton>
              <Collapse
                in={openDropdown.dropdown2}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      formNavigation("AddProvider");
                    }}
                  >
                    <ListItemIcon>{<GoProject />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Add a Provider
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      formNavigation("AddFacility");
                    }}
                  >
                    <ListItemIcon>{<GoProjectRoadmap />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Add Facility
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      formNavigation("AddAncillary");
                    }}
                  >
                    <ListItemIcon>{<FaAmbulance />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Add Ancillary
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      formNavigation("ProviderModification");
                    }}
                  >
                    <ListItemIcon>{<GoProjectSymlink />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Provider Modification
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      formNavigation("AncillaryFacilityModification");
                    }}
                  >
                    <ListItemIcon>{<TbAmbulance />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Anc/Fac Modification
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      formNavigation("Appeals");
                    }}
                  >
                    <ListItemIcon>{<TbAmbulance />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>Appeals</Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      formNavigation("ProviderDisputes");
                    }}
                  >
                    <ListItemIcon>{<TbAmbulance />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Provider Disputes
                        </Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => formNavigation("Termination")}
                  >
                    <ListItemIcon>{<BsTerminalX />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Termination
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </ListItem>

            <ListItem
              disablePadding
              sx={{ display: !moduleRefs.searchMgmnt ? "none" : "block" }}
            >
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",
                }}
                onClick={() => handleDropdownClick("dropdown5")}
              >
                <Tooltip title="Global Search" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      // color: text.name === contentName.name ? "blue" : "",
                    }}
                  >
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                      id="searchImage"
                      src={search}
                      className="img-fluid"
                      alt="..."
                    />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  secondary={
                    <Typography {...typoGraphyStyles}>Global Search</Typography>
                  }
                  sx={{
                    opacity: openDrawer ? 1 : 0,
                  }}
                />
                {openDropdown.dropdown5 ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </ListItemButton>
              <Collapse
                in={openDropdown.dropdown5}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => setPage("globalSearch")}
                  >
                    <ListItemIcon>{<TbFileReport />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>Provider</Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => setPage("contractingSearch")}
                  >
                    <ListItemIcon>{<BiSolidReport />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Contracting
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </ListItem>
            <ListItem
              disablePadding
              sx={{ display: !moduleRefs.mdmMgmnt ? "none" : "block" }}
            ></ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",

                  // color: text.name === contentName.name ? "blue" : "",
                }}
                onClick={() => handleDropdownClick("dropdown3")}
              >
                <Tooltip title="Reports" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      // color: text.name === contentName.name ? "blue" : "",
                    }}
                  >
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                      id="ReportsLogo"
                      src={viewReportLogo}
                      className="img-fluid"
                      alt="..."
                    />
                  </ListItemIcon>
                </Tooltip>

                <ListItemText
                  secondary={
                    <Typography {...typoGraphyStyles}>Reports</Typography>
                  }
                  sx={{
                    opacity: openDrawer ? 1 : 0,
                  }}
                />
                {openDropdown.dropdown3 ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </ListItemButton>
              <Collapse
                in={openDropdown.dropdown3}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => setPage("viewOfflineReport")}
                  >
                    <ListItemIcon>{<TbFileReport />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Offline Reports
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => setPage("viewReport")}
                  >
                    <ListItemIcon>{<BiSolidReport />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Online Reports
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </ListItem>
            <ListItem
              disablePadding
              sx={{
                mt: "auto",
                display: "block",
              }}
            >
              <ListItemButton
                variant="contained"
                sx={{
                  minHeight: 38,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 1,
                  mr: 1,
                  borderRadius: "0 15px 15px 0px",

                  // color: text.name === contentName.name ? "blue" : "",
                }}
                onClick={() => handleDropdownClick("dropdown4")}
              >
                <Tooltip
                  title="Sign Out / Change Password"
                  placement="right-end"
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openDrawer ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "18px",
                      // color: text.name === contentName.name ? "blue" : "",
                    }}
                  >
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                      id="databaseLogoImage"
                      src={loginUserLogo}
                      className="rounded-circle"
                      alt="..."
                    />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  secondary={
                    <Typography {...typoGraphyStyles}>
                      SignOut / {LoggedInUser}
                    </Typography>
                  }
                  sx={{ opacity: openDrawer ? 1 : 0, fontSize: "18px" }}
                />
                {openDropdown.dropdown4 ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </ListItemButton>
              <Collapse
                in={openDropdown.dropdown4}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ ml: 4, fontSize: "25px" }}
                    onClick={() => {
                      confirmDeleteHandler();
                    }}
                  >
                    <ListItemIcon>{<CgPassword />}</ListItemIcon>
                    <ListItemText
                      secondary={
                        <Typography {...innerTypoStyles}>
                          Change Password
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <Link onClick={signout} to="/DashboardLogin">
                    <ListItemButton sx={{ ml: 4, fontSize: "25px" }}>
                      <ListItemIcon>{<GoSignOut />}</ListItemIcon>
                      <ListItemText
                        secondary={
                          <Typography {...innerTypoStyles}>SignOut</Typography>
                        }
                      />
                    </ListItemButton>
                  </Link>
                </List>
              </Collapse>
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: "rgb(245, 247, 250)",
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          {page === "cards" && (
            <Grid container spacing={2} padding={1.5}>
              {advancedSearchState && (
                <AdvancedSearchModal
                  showModal={advancedSearchState}
                  setShowModal={setAdvancedSearchState}
                  setTableValues={setTableData}
                  setTableRows={getAllCases}
                />
              )}

              <Grid item md={6}>
                <div
                  className="card"
                  style={{
                    height: "auto",
                    borderTop: "5px solid var(--text)",
                  }}
                >
                  <div className="card-body">
                    <div className="card-title" style={{ textAlign: "left" }}>
                      Appeal Cases
                    </div>
                    <div className="card-text my-2">
                      {provChartData.Appealing.length > 0 && (
                        <DashboardBarChart
                          gridData={provChartData.Appealing}
                          gridName={"Appealing"}
                          dashboardTableData={getDashboardTableData}
                          isRender={donutRender}
                        ></DashboardBarChart>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          )}
          <div style={{ marginBottom: "30px" }}>
            {page === "listUsers" ? (
              <ListUsers page={page} setPage={setPage} />
            ) : null}

            {page === "viewData" ? (
              <ViewDatamanagement page={page} setPage={setPage} />
            ) : null}
            {page === "moduleRights" ? (
              <ModuleRights page={page} setPage={setPage} />
            ) : null}
            {page === "stageRights" ? (
              <StageRights page={page} setPage={setPage} />
            ) : null}
            {page === "globalSearch" ? (
              <GroupTermination
                openDrawer={openDrawer}
                page={page}
                setPage={setPage}
              />
            ) : null}

            {page === "contractingSearch" ? (
              <ContractingSearch openDrawer={openDrawer} setPage={setPage} />
            ) : null}
            {page === "viewReport" ? (
              <ViewReport page={page} setPage={setPage} />
            ) : null}
            {page === "viewOfflineReport" ? (
              <OfflineReports page={page} setPage={setPage} />
            ) : null}

            {page === "cards" ? (
              <div className="cardsContainer">
                <div className="cardsContainerChild" style={{ width: "98%" }}>
                  <div
                    className="card"
                    style={{
                      borderTop: "5px solid lightblue",
                      minHeight: 250,
                    }}
                  >
                    <div className="card-body">
                      <div
                        className="card-title"
                        style={{ textAlign: "right" }}
                      >
                        <div>
                          <p
                            style={{
                              float: "left",
                              fontSize: "var(--font-size-large-1)",
                              fontWeight: "bold",
                            }}
                          >
                            All Cases
                          </p>
                          {/* <button
                            className="btn"
                            type="submit"
                            id="refreshIconButton"
                            onClick={() => {}}
                          >
                            <img
                              className="img-fluid"
                              id="refreshIconImage"
                              src={refreshIcon}
                              alt="..."
                            />
                          </button> */}
                          {mastersSelector.hasOwnProperty("auth") &&
                            mastersSelector.auth.hasOwnProperty("userType") &&
                            mastersSelector.auth.userType === "A" && (
                              <button
                                className="btn"
                                type="submit"
                                id="lockIconButton"
                                onClick={() => {
                                  adminUpdateLockStatus();
                                }}
                              >
                                <img
                                  className="img-fluid"
                                  id="lockIconImage"
                                  src={lockIcon}
                                  alt="..."
                                />
                              </button>
                            )}
                          <button
                            className="btn"
                            type="submit"
                            id="advancedSearchButton"
                            onClick={() => {
                              {
                                openAdvancedSearch();
                              }
                            }}
                          >
                            <img
                              className="img-fluid"
                              id="advancedSearchImage"
                              src={advancedSearchIcon}
                              alt="..."
                            />
                          </button>
                        </div>
                      </div>

                      <div
                        className="card-text my-2"
                        style={{ maxHeight: "500px", overflow: "auto" }}
                      >
                        <div className="col-xs-6" id="caseTable">
                          <TableComponent
                            columnName={columnNames}
                            rowValues={tableData}
                            showCheckBox={showGridCheckbox}
                            handleCheckBoxChange={handleCheckBoxChange}
                            makeLink={true}
                            navigateToForm={navigateToForm}
                            isNavigated={isNavigated}
                            fromComponent={"DashBoard"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <FooterComponent />
        </Box>
      </Grid>
      <ChangePasModal
        deleteModal={deleteModal}
        onDelete={deleteTableDataHandler}
        onCancel={cancelDeleteHandler}
      />
    </Grid>
  );
}
