import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import healthCareLogo from "../../Images/healthCareLogo.png";
import dashboardPortalLogo from "../../Images/DashboardPortalLogo.png";
import refreshIcon from "../../Images/SynchronizeIcon.png";
import Multiselect from "multiselect-react-dropdown";
import "./DashboardHomePage.css";
import DashboardHomeChart from "./DashboardHomeChart";

import NewUser from "./NewUser/NewUser";
import ListUsers from "./ListUser/ListUser";

export default function DashboardHomepage() {
  let apiUrl = "http://localhost:8081/api/";

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [operationValue, setOperationValue] = useState("");

  useEffect(() => {
    getAllCases();
  }, []);

  const [page, setPage] = useState("cards");

  const [dropDownState, setDropDownState] = useState(false);

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
  const [dataIndex, setDataIndex] = useState();

  const onMouseOverMenu = () => {
    setDropDownState(true);
  };

  const onMouseLeaveMenu = () => {
    setDropDownState(false);
  };

  const getAllCases = () => {
    apiUrl = apiUrl + "allWorkitems";
    axios.get(apiUrl).then((res) => {
      if (res.status === 200) {
        setTableData(res.data);
      }
    });
  };

  const navigateToForm = (index) => {
    const obj = tableData[index];
    let navigateUrl = "";
    if (obj.caseNumber !== undefined) {
      if (obj.transactionType !== undefined && obj.transactionType !== "") {
        if (obj.transactionType === "Add a Provider") {
          navigateUrl = "/DashboardLogin/AddProvider";
        }
        if (obj.transactionType === "Add a Facility") {
          navigateUrl = "/DashboardLogin/AddFacility";
        }
        if (obj.transactionType === "Add an Ancillary") {
          navigateUrl = "/DashboardLogin/AddAncillary";
        }
        if (obj.transactionType === "graphic Modification") {
          navigateUrl = "/DashboardLogin/ProviderModification";
        }
        if (obj.transactionType === "Ancillary/Facility Modification") {
          navigateUrl = "/DashboardLogin/AncillaryFacilityModification";
        }
        if (obj.transactionType === "PayTo Modification") {
          navigateUrl = "/DashboardLogin/GroupPayToModification";
        }
        if (obj.transactionType === "Address Modification") {
          navigateUrl = "/DashboardLogin/GroupAddressModification";
        }
        if (obj.transactionType === "Provider Contracting") {
          navigateUrl = "/DashboardLogin/ProviderContracting";
        }
        if (
          obj.transactionType ===
          "Facility/Ancillary/Health Systems Contracting"
        ) {
          navigateUrl = "/DashboardLogin/FacAncHealthSystem";
        }
      }

      navigate(navigateUrl, {
        replace: true,
        state: {
          caseNumber: obj.caseNumber,
          formNames: obj.transactionType,
        },
      });
    }
  };

  const tdData = () => {
    if (tableData.length > 0) {
      return tableData.map((data, index) => {
        return (
          <tr key={index}>
            <td className="tableData">
              <a
                onClick={() => {
                  navigateToForm(index);
                }}
              >
                {"caseNumber" in data ? data.caseNumber : data.caseNumber}
              </a>
            </td>
            <td className="tableData">
              {"npiId" in data ? data.npiId : data.npiId}
            </td>
            <td className="tableData">
              {"firstName" in data ? data.firstName : data.firstName}
            </td>
            <td className="tableData">
              {"lastName" in data ? data.lastName : data.lastName}
            </td>
            <td className="tableData">
              {"legalEntityName" in data
                ? data.legalEntityName
                : data.legalEntityName}
            </td>
            <td className="tableData">
              {"transactionType" in data
                ? data.transactionType
                : data.transactionType}
            </td>
            <td className="tableData">
              {"caseStatus" in data ? data.caseStatus : data.caseStatus}
            </td>
          </tr>
        );
      });
    }
  };

  const deleteTableRows = (index, operationValue) => {};

  const decreaseDataIndex = () => {};

  const tdUserData = () => {
    if (usersTableRowsData.length > 0) {
      return usersTableRowsData.map((data, index) => {
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

  return (
    <>
      <div
        className="Dashboardhome backgroundColor"
        style={{ minHeight: "100vh" }}
      >
        <div id="NavbarHeader">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-6 col-md-4">
                <img
                  className="img-fluid"
                  id="portalLogoImage"
                  src={dashboardPortalLogo}
                  alt="..."
                />
              </div>
              <div
                className="col-xs-6 col-md-4"
                style={{ backgroundSize: "120px" }}
              >
                <img
                  className="img-fluid"
                  id="healthCareLogoImage"
                  src={healthCareLogo}
                  alt="..."
                />
              </div>
              <div className="col-xs-6 col-md-4" style={{ marginTop: "20px" }}>
                <div
                  className="col-xs-6 col-md-2 mx-2"
                  style={{ float: "right" }}
                >
                  <span
                    className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                    id="dropdownUser1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer", color: "black" }}
                  >
                    {/* <span alt="hugenerd" className="rounded-circle" style={{cursor:"pointer",color:"black"}}>V</span> */}
                    <img
                      src="https://github.com/mdo.png"
                      alt="hugenerd"
                      width="30"
                      height="30"
                      className="rounded-circle"
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                  <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li>
                      <Link className="dropdown-item" to="/DashboardLogin">
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-xs-6 col-md-2" style={{ float: "right" }}>
                  <span style={{ float: "right" }}>Hi Gaurav!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header">
          <ul className="desktop-menu">
            <li>
              <a
                onClick={() => {
                  setPage("cards");
                }}
              >
                Dashboard
              </a>
            </li>
            <li
              className="dropdown"
              onMouseEnter={onMouseOverMenu}
              onMouseLeave={onMouseLeaveMenu}
            >
              <button className="btn dropdown-toggle" id="usermgmt">
                UserManagement
              </button>
              {dropDownState && (
                <ul className="dropdown-menu" aria-labelledby="usermgmt">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setPage("listUsers");
                        setDropDownState(false);
                      }}
                    >
                      View / Modify User
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setPage("newUsers");
                        setDropDownState(false);
                      }}
                    >
                      New User
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        {page === "listUsers" && <ListUsers page={page} />}
        {page === "newUsers" && <NewUser />}
        {page === "cards" && (
          <div className="cardsContainer">
            <div className="cardsContainerChild">
              <div className="card" style={{ width: "135%", height: "98%" }}>
                <div className="card-body">
                  <div className="card-title" style={{ textAlign: "right" }}>
                    <div>
                      <p
                        style={{
                          float: "left",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        All Cases
                      </p>
                      <button
                        className="btn"
                        type="submit"
                        id="refreshIconButton"
                        onClick={() => {
                          getAllCases();
                        }}
                      >
                        <img
                          className="img-fluid"
                          id="refreshIconImage"
                          src={refreshIcon}
                          alt="..."
                        />
                      </button>
                    </div>
                  </div>
                  <div
                    className="card-text my-2"
                    style={{
                      paddingTop: "20px",
                      maxHeight: "500px",
                      overflow: "auto",
                    }}
                  >
                    <div className="col-xs-6" id="caseTable">
                      <table className="table table-striped table-bordered table-hover tableLayout dashboardTableBorder">
                        <thead>
                          <tr className="dashboardTableHeader">
                            <th scope="col">Case#</th>
                            <th scope="col">NPI</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Legal Entity Name</th>
                            <th scope="col">Transaction Type</th>
                            <th scope="col">State</th>
                          </tr>
                        </thead>
                        <tbody>{tdData()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="cardsContainerChild"
              style={{ width: "96%", paddingLeft: "30%" }}
            >
              <div className="Container">
                <div className="row">
                  <div className="col-xs-6 col-md-2" style={{ width: "50%" }}>
                    <div className="card" style={{}}>
                      <div className="card-body">
                        <div
                          className="card-title"
                          style={{ textAlign: "left" }}
                        >
                          Closed Cases
                        </div>
                        <div
                          className="card-text my-2 customCardTextStyling"
                          style={{}}
                        >
                          4
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-6 col-md-2" style={{ width: "50%" }}>
                    <div className="card" style={{}}>
                      <div className="card-body">
                        <div
                          className="card-title"
                          style={{ textAlign: "left" }}
                        >
                          Total Cases
                        </div>
                        <div
                          className="card-text my-2 customCardTextStyling"
                          style={{}}
                        >
                          5
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="Container my-2">
                <div className="row">
                  <div className="col-xs-6 col-md-4" style={{ width: "100%" }}>
                    <div className="card" style={{ height: "auto" }}>
                      <div className="card-body">
                        <div
                          className="card-title"
                          style={{ textAlign: "left" }}
                        >
                          Cases
                        </div>
                        <div
                          className="card-text my-2"
                          style={{ paddingLeft: "15%" }}
                        >
                          <DashboardHomeChart></DashboardHomeChart>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <footer className="footerStyle">
          <div className="content-wrapper">
            <div className="float-left">
              <h6></h6>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
