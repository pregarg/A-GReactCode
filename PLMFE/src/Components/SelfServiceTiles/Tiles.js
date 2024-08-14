import React from "react";
import { Link } from "react-router-dom";
import "./Tiles.css";
import AddProvider from "../../Images/AddProvider.png";
import AddFacility from "../../Images/AddFacility.png";
import AddAncillary from "../../Images/AddAncillary.png";
import BulkUpload from "../../Images/BulkUpload.png";
import ProviderDemo from "../../Images/ProviderDemo.png";
import AncFacDemo from "../../Images/AncFacDemo.png";
import CaseHeader from "../../Images/CaseHeader.png";
import GroupAddress from "../../Images/GroupAddress.png";
import GroupPayTo from "../../Images/GroupPayTo.png";
import GroupTermination from "../../Images/GroupTermination.png";
import SessionTimeoutModal from "../Navbar/SessionTimeoutModal";

export default function Tiles() {
  let bulkHealthRandomNumber =
    new Date().getTime() + "" + Math.floor(Math.random() * 100);
  return (
    <>
      <div
        className="SelfServiceComponent"
        style={{ overflow: "auto", height: "90vh" }}
      >
        <label className="labelStyle"> New Load</label>
        <br />
        <br />
        <div className="Container">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              {/* <Tile styleName="small clear">
              <Image
                styleName="medium-square"
                source={{ uri: {AddProvider} }}
              />
              <View styleName="content">
                <Subtitle numberOfLines={2}>When The Morning Dawns - DJ Silver Sample Album</Subtitle>
                <Caption>20 hours ago</Caption>
              </View>
            </Tile> */}
              <div className="card tilestyle" style={{ width: "15rem" }}>
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/AddProvider"
                  state={{
                    formView: "HomeView",
                  }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${AddProvider})` }}
                  ></div>
                  <div className="card-block">
                    <h5 className="card-title tile-header">Add a Provider</h5>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{ width: "15rem" }}>
                {/* <Link className="stretched-link text-decoration-none" to={{
                pathname: "/Home/SelfService/AddFacility",
                state: {
                  formNames: "AddFacility"
                }
              }}> */}
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/AddFacility"
                  state={{
                    formNames: "AddFacility",
                    formView: "HomeView",
                  }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${AddFacility})` }}
                  ></div>
                  <div className="card-block">
                    <h5 className="card-title tile-header">Add a Facility</h5>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{ width: "15rem" }}>
                {/* <Link className="stretched-link text-decoration-none" to={{
                pathname: "/Home/SelfService/AddAncillary",
                //replace:true,
                state: {
                  formNames: "AddAncillary"
                }
              }}> */}
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/AddAncillary"
                  state={{
                    formNames: "AddAncillary",
                    formView: "HomeView",
                  }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${AddAncillary})` }}
                  ></div>
                  <div className="card-block">
                    <h5 className="card-title tile-header">Add an Ancillary</h5>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{ width: "15rem" }}>
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/BulkHealthSystem"
                  state={{ randomNumber: bulkHealthRandomNumber }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${BulkUpload})` }}
                  ></div>
                  <div className="card-block">
                    <h5 className="card-title tile-header">
                      Bulk Health System Load
                    </h5>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <label className="labelStyle"> Modification</label>
        <br />
        <br />
        <div className="Container">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{ width: "15rem" }}>
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/ProviderModification"
                  state={{
                    formView: "HomeView",
                  }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${ProviderDemo})` }}
                  ></div>
                  <div className="card-block">
                    <h5 className="card-title tile-header">
                      Provider Modification
                    </h5>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{ width: "15rem" }}>
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/AncillaryFacilityModification"
                  state={{
                    formNames: "AncFacDemo",
                    formView: "HomeView",
                  }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${AncFacDemo})` }}
                  ></div>
                  <div className="card-block">
                    {/* <a className="stretched-link text-decoration-none" href> */}
                    <h5 className="card-title tile-header">
                      Ancillary/Facility Modification
                    </h5>
                    {/* </a> */}
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{ width: "15rem" }}>
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/Appeals"
                  state={{
                    formNames: "Appeals",
                    formView: "HomeView",
                  }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${CaseHeader})` }}
                  ></div>
                  <div className="card-block">
                    {/* <a className="stretched-link text-decoration-none" href> */}
                    <h5 className="card-title tile-header">Appeals</h5>
                    {/* </a> */}
                  </div>
                </Link>
              </div>
            </div>

            {/* <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{width: "15rem"}}>
              <Link className="stretched-link text-decoration-none cardBorder" to="/Home/SelfService/GroupPayToModification">
              <div className="cardBackground" style={{backgroundImage:`url(${GroupPayTo})`}}></div>
              <div className="card-block">
                <h5 className="card-title tile-header">Group Pay to Modification</h5>
              </div>
              </Link>
              </div>
            </div>


            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{width: "15rem"}}>
              <Link className="stretched-link text-decoration-none cardBorder" to="/Home/SelfService/GroupAddressModification">
              <div className="cardBackground" style={{backgroundImage:`url(${GroupAddress})`}}></div>
              <div className="card-block">
                <h5 className="card-title tile-header">Group Address Modification</h5>
              </div>
              </Link>
              </div>
            </div> */}
          </div>
        </div>
        <br />
        <br />
        <label className="labelStyle">Self Service Termination</label>
        <br />
        <br />
        <div className="Container">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{ width: "15rem" }}>
                <Link
                  className="stretched-link text-decoration-none cardBorder"
                  to="/Home/SelfService/GroupTermination"
                  state={{ formView: "HomeView" }}
                >
                  <div
                    className="cardBackground"
                    style={{ backgroundImage: `url(${GroupTermination})` }}
                  ></div>
                  <div className="card-block">
                    <h5 className="card-title tile-header">
                      Individual Termination
                    </h5>
                  </div>
                </Link>
              </div>
            </div>

            {/* <div className="col-xs-6 col-md-3">
              <div className="card tilestyle" style={{width: "15rem"}}>
              <Link className="stretched-link text-decoration-none cardBorder" to="/Home/SelfService/AllCases">
              <div className="cardBackground" style={{backgroundImage:`url(${GroupTermination})`}}></div>
              <div className="card-block">
                <h5 className="card-title tile-header">All Cases</h5>
              </div>
              </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <SessionTimeoutModal navTo={"/"}></SessionTimeoutModal>
    </>
  );
}
