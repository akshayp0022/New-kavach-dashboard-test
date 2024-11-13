import RoutesHandler from "./components/router/routes";
import { BrowserRouter } from "react-router-dom";
import "./css/App.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"; 

function App() {
  return (
    <>
      <RoutesHandler />
      <ToastContainer />
    </>
  );
}

export default App;
