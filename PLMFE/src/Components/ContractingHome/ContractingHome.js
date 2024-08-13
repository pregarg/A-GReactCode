import React from "react";
import { Link } from "react-router-dom";
import "../SelfServiceTiles/Tiles.css";
import Provider from "../../Images/Provider.png";
import FacAncHealthSystem from "../../Images/FacAncHealthSystem.png";
import ContractingBackGroundImage from "../../Images/ContractingBackGroundImage.jpg";
import dashboardHeaderLogo from "../../Images/DashboardHeaderLogo.png";
import FooterComponent from "../FooterComponent";
import { useSelector } from "react-redux";

export default function ContTiles() {
  const userName = useSelector((store) => store.auth.userName);
  return (
    <>
      <div id="headerLogo">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-xs-6 col-md-4"></div>
            <div
              className="col-xs-6 col-md-4"
              style={{
                backgroundSize: "120px",
                background: `url(${dashboardHeaderLogo}) no-repeat !important`,
              }}
            ></div>
            <div className="col-xs-6 col-md-4" style={{ marginTop: "10px" }}>
              <div
                className="col-xs-6 col-md-2 mx-2"
                style={{ float: "right" }}
              >
                {/* <span className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer",color:"black"}}>
                {<span alt="hugenerd" className="rounded-circle" style={{cursor:"pointer",color:"black"}}>V</span>}
                <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" className="rounded-circle" style={{cursor:"pointer"}}/>
                                    {/* <span width="30" height="30" className="rounded-circle">V</span> */}
                {/* <span className="d-none d-sm-inline mx-1">loser</span>}
              </span> */}
                {/* <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                <li><Link className="dropdown-item" to="/">Sign out</Link></li>
              </ul> */}
              </div>
              {/* <div className="col-xs-6 col-md-3" style={{float:"right"}}>
              <span style={{float:"right"}}>Hi</span>
            </div> */}
            </div>
          </div>
          <br />
        </div>

        <div
          className="SelfServiceComponent contractingBackground"
          style={{
            backgroundImage: `url(${ContractingBackGroundImage})`,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <br />
          <div className="Container centered">
            {/* <div className="row ">
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </div> */}
            <div className="row ">
              <div className="col-md-7 col-md-3">
                <div className="card tilestyle" style={{ width: "15rem" }}>
                  <Link
                    className="stretched-link text-decoration-none cardBorder"
                    to="/ContractingHome/ProviderContracting"
                    state={{
                      formNames: "Provider",
                      userName: userName,
                    }}
                  >
                    <div
                      className="cardBackground"
                      style={{ backgroundImage: `url(${Provider})` }}
                    ></div>
                    <div className="card-block">
                      <h5 className="card-title tile-header">Provider</h5>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-md-5 col-md-3">
                <div className="card tilestyle" style={{ width: "15rem" }}>
                  <Link
                    className="stretched-link text-decoration-none cardBorder"
                    to="/ContractingHome/FacAncHealthSystem"
                    state={{
                      formNames: "FacAncHealthSystem",
                      userName: userName,
                    }}
                  >
                    <div
                      className="cardBackground"
                      style={{ backgroundImage: `url(${FacAncHealthSystem})` }}
                    ></div>
                    <div className="card-block">
                      <h5 className="card-title tile-header">
                        Facility/Ancillary/Health System
                      </h5>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <footer className='footerStyle'>
            <div className="content-wrapper">
                <div className='float-left'>
                    <h6></h6>
                </div>
            </div>
        </footer> */}
          <FooterComponent />
        </div>
      </div>
    </>
  );
}
