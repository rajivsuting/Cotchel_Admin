import { Routes, Route } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import Dashboard from "../pages/Dashboard";
import Sidebar from "../components/Sidebar";
import AllProducts from "../pages/AllProducts";
import AddProduct from "../pages/AddProduct";
import Setting from "../pages/Setting";
import HelpCenter from "../pages/HelpCenter";
import Analytics from "../pages/Analytics";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SidebarLayout sidebar={<Sidebar />} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
