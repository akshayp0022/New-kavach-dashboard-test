import NavigationBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import C1 from "./components/Component1";
import StickyHeadTable from "./components/Table";
import SignUpPage from "./components/SignUp";
import "./css/App.css";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/dashboard" element={<SignUpPage pageName="Dashboard" />} />
        <Route path="/screenshot" element={<C1 pageName="Screenshot" />} />
        <Route path="/apps" element={<C1 pageName="Apps" />} />
        <Route path="/attendence" element={<C1 pageName="Attendance" />} />
        <Route path="/mail" element={<C1 pageName="Mail" />} />
        <Route path="/inbox" element={<C1 pageName="Inbox" />} />
        <Route path="/members" element={<StickyHeadTable pageName="Members" />} />
        <Route path="/teams" element={<C1 pageName="Teams" />} />
      </Routes>
    </>
  );
}

export default App;
