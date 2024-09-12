import RoutesHandler from "./components/router/routes";
import { BrowserRouter } from "react-router-dom";
import "./css/App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <RoutesHandler />
      </BrowserRouter>
    </>
  );
}

export default App;
