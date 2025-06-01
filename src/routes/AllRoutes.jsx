import { Routes, Route } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import Dashboard from "../pages/Dashboard";
import Sidebar from "../components/Sidebar";
import AllProducts from "../pages/AllProducts";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Setting from "../pages/Setting";
import HelpCenter from "../pages/HelpCenter";
import InquiryDetails from "../pages/InquiryDetails";
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
import OrderDetails from "../pages/OrderDetails";
import Banners from "../pages/Banners";
import AddBanner from "../pages/AddBanner";
import EditBanner from "../pages/EditBanner";
import PromotionalBanners from "../pages/PromotionalBanners";
import AddPromotionalBanner from "../pages/AddPromotionalBanner";
import EditPromotionalBanner from "../pages/EditPromotionalBanner";
import TransactionDetails from "../pages/TransactionDetails";
import SellerTransactions from "../pages/SellerTransactions";
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
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/help-center/:id" element={<InquiryDetails />} />
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
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/hero-banners" element={<Banners />} />
        <Route path="/add-banner" element={<AddBanner />} />
        <Route path="/edit-banner/:id" element={<EditBanner />} />
        <Route path="/promotional-banners" element={<PromotionalBanners />} />
        <Route
          path="/add-promotional-banner"
          element={<AddPromotionalBanner />}
        />
        <Route
          path="/edit-promotional-banner/:id"
          element={<EditPromotionalBanner />}
        />
        <Route path="/transactions/:id" element={<TransactionDetails />} />{" "}
        <Route
          path="/transactions/seller/:sellerId"
          element={<SellerTransactions />}
        />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
