
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import StoreView from "./pages/StoreView";
import SellerDashboard from "./pages/SellerDashboard";
import CreateStore from "./pages/CreateStore";
import ManageProducts from "./pages/ManageProducts";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import AuthCallback from "./pages/AuthCallback";
import TermsAndConditions from "./pages/TermsAndConditions";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/store/:storeId" element={<StoreView />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/create-store" element={<CreateStore />} />
                <Route path="/seller/products" element={<ManageProducts />} />
                <Route path="/seller/products/edit/:id" element={<EditProduct />} />
                <Route path="/seller/orders" element={<Orders />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
