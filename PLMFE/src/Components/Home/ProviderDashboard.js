import React, { useEffect, useState } from "react";
// import LoginPage from '../LoginPage'
// import Tiles from '../SelfServiceTiles/Tiles'
import "./ProviderDashboard.css";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { type } from "@testing-library/user-event/dist/type";

export default function ProviderDashboard() {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <>
      <Navbar />
    </>
  );
}
