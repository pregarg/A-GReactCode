import React, { useState, useEffect } from 'react'
import './Navbar.css'
import Tiles from '../SelfServiceTiles/Tiles'
import Dashboard from '../Home/Dashboard/Dashboard'
import Document from '../Home/Document/Document'
import { Link } from 'react-router-dom';
import dashboardHeaderLogo from '../../Images/DashboardHeaderLogo.png';
import { useDispatch, useSelector } from 'react-redux'
import { CLEAR_SIGN_IN } from '../../actions/types'
import loginUserLogo from '../../Images/loginUser.png';
import ChangePasModal from '../../WorkItemDashboard/DashboardHome/ChangePassword/ChangePasModal';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FooterComponent from './../FooterComponent';
import { Typography } from '@mui/material'

let timer;

export default function Navtop() {
    let navContent = {};
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [changePasswordModal, setChangePasswordModal] = useState({show: false, id: null});
    const userName = useSelector((store) => store.auth.userName);
    const [contentName,setContentName] = useState({name:'Dashboard'});
  
    const showHideComponent = (event,component) => {
        switch(component){
            case "SelfService":
                navContent = {name:'SelfService'};
            break;

            case "Dashboard":
                navContent = {name:'Dashboard'};
            break;

            case "Document":
                navContent = {name:'Document'};
            break;

            default:
                navContent = {name:'Dashboard'};
                break;
         }
         setContentName(contentName => ({
            ...contentName,
            ...navContent
         }));
    };

    const signout = ()=>{
      dispatch({type: CLEAR_SIGN_IN, payload: null});
    }

    const cancelDeleteHandler = ()=>{
      setChangePasswordModal({show: false, id: null});
    }

    const changePasswordHandler = () =>{
      setChangePasswordModal({show: true});
    }

  return (
    <>
      <div id="headerLogoOther">
        <div className="row">
          {/* <div className="col-xs-6 col-md-4"></div> */}
          <div
            className="col-xs-6 col-md-6"
            style={{
              backgroundSize: "120px",
              background: `url(${dashboardHeaderLogo}) no-repeat !important`,
            }}
          ></div>
          <div
            className="col-xs-6 col-md-6"
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {/* <div className="col-xs-6 col-md-3"> */}
            <Typography
              sx={{
                lineBreak: "normal",
                whiteSpace: "nowrap",
                marginRight: "10px",
              }}
            >
              Hi {userName}
            </Typography>
            {/* </div> */}
            {/* <div className="col-xs-6 col-md-3"> */}
            <span
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                cursor: "pointer",
                color: "black",
                marginRight: "10px",
              }}
            >
              {/* <span alt="hugenerd" className="rounded-circle" style={{cursor:"pointer",color:"black"}}>V</span> */}
              <img
                src={loginUserLogo}
                alt="hugenerd"
                width="30"
                height="30"
                className="rounded-circle"
                style={{ cursor: "pointer" }}
              />
              {/* <span width="30" height="30" className="rounded-circle">V</span> */}
              {/* <span className="d-none d-sm-inline mx-1">loser</span> */}
            </span>
            {/* <ul className="dropdown-menu dropdown-menu-dark text-small shadow"> */}
            <ul
              className="dropdown-menu text-small shadow"
              aria-labelledby="dropdownOption"
            >
              {/* <li style={{ padding: 0, width: "100%" }}>
                <Link
                  className="dropdown-item"
                  onClick={() => {
                    changePasswordHandler();
                  }}
                >
                  Change Password
                </Link>
              </li> */}
              <li style={{ padding: 0, width: "100%" }}>
                <Link className="dropdown-item" onClick={signout} to="/">
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="container-fluid">
          <span className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false" style={{cursor:"pointer",color:"black"}}>
              <span alt="hugenerd" className="rounded-circle" style={{cursor:"pointer",float:"right",color:"black"}}>V</span>
                                  <span width="30" height="30" className="rounded-circle">V</span>
                                  <span className="d-none d-sm-inline mx-1">loser</span>
            </span>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
              <li><Link className="dropdown-item" to="/">Sign out</Link></li>
            </ul>
            <span style={{paddingRight:"50px",marginTop:"10px"}}>Hi Gaurav!</span>
          </div> */}
      </div>
      {/* <footer className='footerStyle'>
          <div className="content-wrapper">
              <div className='float-left'>
                  <h6></h6>
              </div>
          </div>
      </footer> */}
      <FooterComponent />
      <ChangePasModal
        deleteModal={changePasswordModal}
        onCancel={cancelDeleteHandler}
      />
    </>
  )
}
