import React from "react";
import NavigationBar from "../SideBar";
import { Routes, Route } from "react-router-dom";
import C1 from "../Component1";
import StickyHeadTable from "../OldTable";
import Login from "../Login";
import { useAppContext } from "../AppContext";
import ProtectedRoutes from "./ProtectedRoutes";
import DataTable from "../DataTable";

function RoutesHandler() {
  const { isLoggedIn } = useAppContext();
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<NavigationBar />}>
            <Route path='/dashboard' element={<C1 pageName={'Dashboard'}/>}/>
            <Route path='/screenshot' element={<C1 pageName={'ScreenShot'}/>}/>
            <Route path='/apps' element={<C1 pageName={'Apps'}/>}/>
            <Route path='/attendence' element={<C1 pageName={'Attendence'}/>}/>
            <Route path='/mail' element={<C1 pageName={'Mail'}/>}/>
            <Route path='/inbox' element={<C1 pageName={'Inbox'}/>}/>
            <Route path='/members' element={<StickyHeadTable />}/>
            <Route path='/teams' element={<DataTable />}/>
          </Route>
        </Route>        
      </Routes>
    </div>
  );
}

export default RoutesHandler;
