import "./App.css";
import LoginPage from "./Components/LoginPage";
import LoginPage1 from "./Components/LoginPage1";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useRoutes,
} from "react-router-dom";
import ProviderDashboard from "./Components/Home/ProviderDashboard";
import Tiles from "./Components/SelfServiceTiles/Tiles";
import AddProvider from "./Components/SelfServiceTiles/TileForms/AddProvider";
import AddAncillary from "./Components/SelfServiceTiles/TileForms/AddAncillary";
import BulkHealth from "./Components/SelfServiceTiles/TileForms/BulkHealth";
import ProviderDemo from "./Components/SelfServiceTiles/TileForms/ProviderDemo";
import AncFacDemo from "./Components/SelfServiceTiles/TileForms/AncFacDemo";
import CaseHeader from "./Components/SelfServiceTiles/TileForms/CaseHeader";
import ProviderDisputes from "./Components/SelfServiceTiles/TileForms/ProviderDisputes";
import GroupPayTo from "./Components/SelfServiceTiles/TileForms/GroupPayTo";
import GroupAddress from "./Components/SelfServiceTiles/TileForms/GroupAddress";
import GroupTermination from "./Components/SelfServiceTiles/TileForms/GroupTermination";
import AddFacilityAncillary from "./Components/SelfServiceTiles/TileForms/AddFacilityAncillary";
import DashboardLogin from "./WorkItemDashboard/DashboardLogin";
import DashboardHomepage from "./WorkItemDashboard/DashboardHome/DashboardHomepage";
import ContractingHome from "./Components/ContractingHome/ContractingHome";
import ProviderContracting from "./Components/ContractingHome/ContractingTileForms/ProvAnciFac";
import FacAncHealthSystem from "./Components/ContractingHome/ContractingTileForms/ProvAnciFac";
import NewWindow from "react-new-window";
import UserDocuments from "./Components/Home/Dashboard/UserDocuments";
import Layout from "./Components/Home/Layout";
import Home from "./Components/Home/Home";
import { useSelector } from "react-redux";
import DashboardHome from "./WorkItemDashboard/DashboardHome/DashboardHome";

function App() {
  let prop = useLocation();
  /* Need to get the path from URL.*/
  console.log("Inside main app props location: ", prop.state);

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  return (
    <>
      {/* <LoginPage/> */}
      <Routes>
        <Route exact path="*" element={<LoginPage />} />
        {isSignedIn && (
          <Route
            path="/Home"
            element={<Home />}
            children={[
              <Route exact path="/Home" element={<ProviderDashboard />} />,
              <Route
                path="SelfService"
                element={<Layout />}
                children={[
                  <Route
                    exact
                    path="AddProvider"
                    element={<AddProvider />}
                    key={"addProvider"}
                  ></Route>,
                  <Route
                    exact
                    path="AddFacility"
                    element={<AddFacilityAncillary />}
                    key={"addFacility"}
                  ></Route>,
                  <Route
                    exact
                    path="AddAncillary"
                    element={<AddFacilityAncillary />}
                    key={"addAncil"}
                  ></Route>,
                  <Route
                    exact
                    path="BulkHealthSystem"
                    element={<BulkHealth />}
                    key={"bulkHealth"}
                  ></Route>,
                  <Route
                    exact
                    path="ProviderModification"
                    element={<ProviderDemo />}
                    key={"providerDemo"}
                  ></Route>,
                  <Route
                    exact
                    path="AncillaryFacilityModification"
                    element={<AncFacDemo />}
                    key={"ancFacDemo"}
                  ></Route>,
                  <Route
                    exact
                    path="Appeals"
                    element={<CaseHeader />}
                    key={"caseHeader"}
                  ></Route>,
                  // <Route exact path="GroupPayToModification" element = {<GroupPayTo />} key={'groupPay'}></Route>,
                  // <Route exact path="GroupAddressModification" element = {<GroupAddress />} key={'groupAddress'}></Route>,
                  <Route
                    exact
                    path="ProviderDisputes"
                    element={<ProviderDisputes />}
                    key={"providerDisputes"}
                  ></Route>,
                  <Route
                    exact
                    path="GroupTermination"
                    element={<GroupTermination />}
                    key={"groupTermination"}
                  ></Route>,
                ]}
              ></Route>,
            ]}
          ></Route>
        )}
        {isSignedIn && (
          <Route exact path="/Home/UserDocuments" element={<UserDocuments />} />
        )}
        {isSignedIn && (
          <Route exact path="/Home/SelfService" element={<Tiles />}></Route>
        )}
        <Route path="/Home/*" element={<Navigate to={"/"} />} />
        {/* <Route exact path="/Home/SelfService/AddProvider" element = {<AddProvider />}></Route> */}
        {/* <Route exact path="/Home/SelfService/AddProvider" element =
           {(prop.state !== null && prop.state.formNames === 'Add a Provider')?<NewWindow><AddProvider /></NewWindow>:<AddProvider />}></Route> */}
        {/* <Route exact path="/Home/SelfService/AddFacility" element = {<AddFacilityAncillary />}></Route>
           <Route exact path="/Home/SelfService/AddAncillary" element = {<AddFacilityAncillary />}></Route>
           <Route exact path="/Home/SelfService/BulkHealthSystem" element = {<BulkHealth />}></Route>
           <Route exact path="/Home/SelfService/ProviderModification" element = {<ProviderDemo />}></Route>
           <Route exact path="/Home/SelfService/AncillaryFacilityModification" element = {<AncFacDemo />}></Route>
           <Route exact path="/Home/SelfService/CaseHeader" element = {<CaseHeader />}></Route>
           <Route exact path="/Home/SelfService/GroupPayToModification" element = {<GroupPayTo />}></Route>
           <Route exact path="/Home/SelfService/GroupAddressModification" element = {<GroupAddress />}></Route>
           <Route exact path="/Home/SelfService/GroupTermination" element = {<GroupTermination />}></Route> */}
        <Route exact path="/Dashboard" element={<DashboardLogin />}></Route>
        {isSignedIn && (
          <Route
            path="/DashboardLogin"
            element={<DashboardHome />}
            children={[
              <Route path="Home" element={<DashboardHomepage />}></Route>,
              <Route
                path="AddProvider"
                element={<Layout />}
                children={[
                  <Route
                    path=""
                    element={<AddProvider />}
                    key={"dash"}
                  ></Route>,
                ]}
              ></Route>,
              <Route
                path="AddFacility"
                element={<Layout />}
                children={[
                  <Route
                    path=""
                    element={<AddFacilityAncillary />}
                    key={"dash"}
                  ></Route>,
                ]}
              ></Route>,
              <Route
                path="AddAncillary"
                element={<Layout />}
                children={[
                  <Route
                    path=""
                    element={<AddFacilityAncillary />}
                    key={"dash"}
                  ></Route>,
                ]}
              ></Route>,
              <Route
                path="ProviderModification"
                element={<Layout />}
                children={[
                  <Route
                    path=""
                    element={<ProviderDemo />}
                    key={"dash"}
                  ></Route>,
                ]}
              ></Route>,
              <Route
                path="AncillaryFacilityModification"
                element={<Layout />}
                children={[
                  <Route path="" element={<AncFacDemo />} key={"dash"}></Route>,
                ]}
              ></Route>,
              <Route
                path="Appeals"
                element={<Layout />}
                children={[
                  <Route path="" element={<CaseHeader />} key={"dash"}></Route>,
                ]}
              ></Route>,
              <Route
              path="ProviderDisputes"
              element={<Layout />}
              children={[
                <Route path="" element={<ProviderDisputes />} key={"dash"}></Route>,
              ]}
            ></Route>,
              // <Route
              //  path='GroupPayToModification'
              //  element = {<Layout/>}
              //  children={[<Route path="" element = {<GroupPayTo />} key={'dash'}></Route>,]}
              // ></Route>,
              // <Route
              //  path='GroupAddressModification'
              //  element = {<Layout/>}
              //  children={[<Route path="" element = {<GroupAddress />} key={'dash'}></Route>,]}
              // ></Route>,
              <Route
                path="ProviderContracting"
                element={<Layout />}
                children={[
                  <Route path="" element={<ProviderContracting />}>
                    {" "}
                    key={"dash"}
                  </Route>,
                ]}
              ></Route>,
              <Route
                path="FacAncHealthSystem"
                element={<Layout />}
                children={[
                  <Route
                    path=""
                    element={<FacAncHealthSystem />}
                    key={"dash"}
                  ></Route>,
                ]}
              ></Route>,
              <Route
                path="Termination"
                element={<Layout />}
                children={[
                  <Route
                    path=""
                    element={<GroupTermination />}
                    key={"dash"}
                  ></Route>,
                ]}
              ></Route>,
            ]}
          ></Route>
        )}

        <Route
          path="/DashboardLogin/*"
          element={<Navigate to={"/Dashboard"} />}
        />
        {/* <Route exact path="/DashboardLogin/AddProvider" element =
           {(prop.state !== null && prop.state.formNames === 'Add a Provider')?<NewWindow><AddProvider /></NewWindow>:<AddProvider />}></Route> */}

        <Route exact path="/ContractingHome" element={<ContractingHome />} />
        <Route
          exact
          path="/ContractingHome/ProviderContracting"
          element={<ProviderContracting />}
        ></Route>
        <Route
          exact
          path="/ContractingHome/FacAncHealthSystem"
          element={<FacAncHealthSystem />}
        ></Route>
        {/* <Route exact path="/DashboardLogin/AddProvider" element = {(props) => {<AddProvider {...props}/>}}></Route> */}
      </Routes>
    </>
  );
}

export default App;
