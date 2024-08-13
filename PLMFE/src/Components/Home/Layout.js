import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Navtop from "../Navbar/Navtop";

export default function Layout() {
  return (
    <>
      <Navtop />
      <Outlet />
    </>
  );
}
