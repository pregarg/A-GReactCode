import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SIGN_OUT } from "../../actions/types";
import { useBeforeunload } from "react-beforeunload";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { CLEAR_SIGN_IN } from "../../actions/types";
import SessionTimeoutModal from "../Navbar/SessionTimeoutModal";

let timer;

export default function Home() {
  const dispatch = useDispatch();

  const signout = () => {
    dispatch({ type: SIGN_OUT, payload: null });
  };

  useBeforeunload(() => {
    signout();
  });

  return (
    <>
      <Outlet />
      <SessionTimeoutModal navTo={"/"}></SessionTimeoutModal>
    </>
  );
}
