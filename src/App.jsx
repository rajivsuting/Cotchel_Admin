import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
}

export default App;
