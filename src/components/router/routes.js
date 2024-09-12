import React from "react";
import NavigationBar from "../SideBar";
import { Routes, Route } from "react-router-dom";
import C1 from "../Component1";
import StickyHeadTable from "../Table";
import Login from "../Login";
import { useAppContext } from "../AppContext";
import ProtectedRoutes from "./ProtectedRoutes";
import { useNavigate } from "react-router-dom";

function RoutesHandler() {
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  return (
    <div>
      {isLoggedIn ? (
        <>
          <NavigationBar />
        </>
      ) : (
        navigate("login")
      )}

      <Routes>
        <Route
          path="/dashboard"
          element={<ProtectedRoutes Component={<C1 />} />}
        />
        <Route
          path="/screenshot"
          element={<ProtectedRoutes Component={C1} />}
        />
        <Route path="/apps" element={<ProtectedRoutes Component={C1} />} />
        <Route
          path="/attendence"
          element={<ProtectedRoutes Component={C1} />}
        />
        <Route path="/mail" element={<ProtectedRoutes Component={C1} />} />
        <Route path="/inbox" element={<ProtectedRoutes Component={C1} />} />
        <Route
          path="/members"
          element={<StickyHeadTable pageName="Members" />}
        />
        <Route path="/teams" element={<ProtectedRoutes Component={C1} />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default RoutesHandler;
