import { createBrowserRouter } from "react-router-dom";
import AllRoutes from "./AllRoutes";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <AllRoutes />,
  },
]);

export default router;
