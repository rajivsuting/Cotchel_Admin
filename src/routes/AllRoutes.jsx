import { Routes, Route } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import Dashboard from "../pages/Dashboard";
import Sidebar from "../components/Sidebar";
import AllProducts from "../pages/AllProducts";
import AddProduct from "../pages/AddProduct";
import Setting from "../pages/Setting";
import HelpCenter from "../pages/HelpCenter";
import Analytics from "../pages/Analytics";
import Categories from "../pages/Categories";
import AllOrders from "../pages/AllOrders";
import AddCategory from "../pages/AddCategory";
import Subcategories from "../pages/Subcategories";
import CategoryDetails from "../pages/CategoryDetails";
import SubcategoryDetails from "../pages/SubcategoryDetails";
import ProductDetails from "../pages/ProductDetails";
import AllUsers from "../pages/AllUsers";
import UserDetails from "../pages/UserDetails";
import AdminDashboard from "../components/AdminDashboard";
import PendingApprovals from "../pages/PendingApprovals";
import Notifications from "../pages/Notifications";
import Payments from "../pages/Payments";
import ProtectedRoute from "../components/ProtectedRoute";
import Signin from "../pages/Signin";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SidebarLayout sidebar={<Sidebar />} />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/all-orders" element={<AllOrders />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/subcategories" element={<Subcategories />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />
        <Route path="/subcategories/:id" element={<SubcategoryDetails />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/approvals" element={<PendingApprovals />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payments" element={<Payments />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
