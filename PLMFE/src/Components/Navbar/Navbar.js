import React, { useState } from "react";
import "./Navbar.css";
import Tiles from "../SelfServiceTiles/Tiles";
import Dashboard from "../Home/Dashboard/Dashboard";
import Document from "../Home/Document/Document";
import { Link } from "react-router-dom";
import dashboardHeaderLogo from "../../Images/DashboardHeaderLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_SIGN_IN } from "../../actions/types";
import loginUserLogo from "../../Images/loginUser.png";
import ChangePasModal from "../../WorkItemDashboard/DashboardHome/ChangePassword/ChangePasModal";
import FooterComponent from "./../FooterComponent";
import { styled, useTheme } from "@mui/material/styles";
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
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";
import { FcSelfServiceKiosk } from "react-icons/fc";
import { IoDocumentSharp } from "react-icons/io5";

const drawerWidth = 240;

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

export default function Navbar() {
  let navContent = {};
  const dispatch = useDispatch();
  const [changePasswordModal, setChangePasswordModal] = useState({
    show: false,
    id: null,
  });
  const userName = useSelector((store) => store.auth.userName);
  const [contentName, setContentName] = useState({ name: "Dashboard" });

  const showHideComponent = (component) => {
    switch (component) {
      case "SelfService":
        navContent = { name: "SelfService" };
        break;

      case "Dashboard":
        navContent = { name: "Dashboard" };
        break;

      case "Document":
        navContent = { name: "Document" };
        break;

      default:
        navContent = { name: "Dashboard" };
        break;
    }
    setContentName((contentName) => ({
      ...contentName,
      ...navContent,
    }));
  };

  const signout = () => {
    dispatch({ type: CLEAR_SIGN_IN, payload: null });
  };

  const cancelDeleteHandler = () => {
    setChangePasswordModal({ show: false, id: null });
  };

  const changePasswordHandler = () => {
    setChangePasswordModal({ show: true });
  };
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };
  function handleOpenDrawer() {
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <>
      <div id="headerLogo">
        <div className="container-fluid">
          <div className="row">
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
              <Typography
                sx={{
                  lineBreak: "normal",
                  whiteSpace: "nowrap",
                  marginRight: "10px",
                }}
              >
                Hi {userName}
              </Typography>
              <span
                className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer", color: "black" }}
              >
                <img
                  src={loginUserLogo}
                  alt="hugenerd"
                  width="30"
                  height="30"
                  className="rounded-circle"
                  style={{ cursor: "pointer" }}
                />
              </span>
              <ul
                className="dropdown-menu text-small shadow"
                aria-labelledby="dropdownOption"
              >
                <li style={{ padding: 0, width: "100%" }}>
                  <Link
                    className="dropdown-item"
                    onClick={() => {
                      changePasswordHandler();
                    }}
                  >
                    Change Password
                  </Link>
                </li>
                <li style={{ padding: 0, width: "100%" }}>
                  <Link className="dropdown-item" onClick={signout} to="/">
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          <Drawer
            variant="permanent"
            open={open}
            onMouseEnter={handleOpenDrawer}
            onMouseLeave={closeDrawer}
            PaperProps={{
              sx: {
                backgroundColor: "rgb(245, 247, 250)",
              },
            }}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerOpen}>
                {open ? <IoIosArrowBack /> : <IoIosArrowForward />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {[
                { name: "Dashboard", icon: <MdSpaceDashboard /> },
                { name: "SelfService", icon: <FcSelfServiceKiosk /> },
                { name: "Document", icon: <IoDocumentSharp /> },
              ].map((text, index) => (
                <ListItem key={index} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    variant="contained"
                    sx={{
                      minHeight: 38,
                      justifyContent: open ? "initial" : "center",
                      px: 2,
                      mr: 1,
                      borderRadius: "0 15px 15px 0px",

                      color: text.name === contentName.name ? "blue" : "",
                    }}
                    onClick={() => showHideComponent(text.name)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        fontSize: "18px",
                        color: text.name === contentName.name ? "blue" : "",
                      }}
                    >
                      {text.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text.name}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: "rgb(245, 247, 250)",
              p: 3,
              position: "relative",
              overflowY: "scroll",
              height: "90vh",
            }}
          >
            {contentName.name === "SelfService" && <Tiles />}
            {contentName.name === "Dashboard" && <Dashboard />}
            {contentName.name === "Document" && <Document />}
          </Box>
        </Box>
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
  );
}
