import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <Router>
      <AllRoutes />
    </Router>
  );
}

export default App;
