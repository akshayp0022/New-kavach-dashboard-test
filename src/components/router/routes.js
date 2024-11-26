import React from "react";
import AllNavigationBar from "../SideBar";
import { Routes, Route, Navigate } from "react-router-dom";
import C1 from "../Component1";
import Login from "../Login";
import ProtectedRoutes from "./ProtectedRoutes";
import EmpTable from "../EmpTable";
import AllUserLocations from "../AllUserLocations";
import CommonSettings from "../CommonSettings";

function RoutesHandler() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<AllNavigationBar />}>
            <Route path="/" element={<Navigate to="/teams" />} />
            <Route path="/dashboard" element={<C1 pageName={"Dashboard"} />} />
            <Route
              path="/screenshot"
              element={<C1 pageName={"ScreenShot"} />}
            />
            <Route path="/apps" element={<C1 pageName={"Apps"} />} />
            <Route
              path="/attendence"
              element={<C1 pageName={"Attendence"} />}
            />
            <Route path="/mail" element={<C1 pageName={"Mail"} />} />
            <Route path="/inbox" element={<C1 pageName={"Inbox"} />} />
            <Route path="/members" element={<C1 pageName={"Members"} />} />
            <Route path="/teams" element={<EmpTable />} />
            <Route path="/user-location" element={<AllUserLocations />}/>
            <Route path="/common-settings" element={<CommonSettings/>}/>
          </Route>

        </Route>
      </Routes>
    </div>
  );
}

export default RoutesHandler;
