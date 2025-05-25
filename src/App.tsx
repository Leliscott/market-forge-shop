
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import CookieConsent from '@/components/CookieConsent';
import GlobalChatButton from '@/components/GlobalWhatsAppContact';
import Index from '@/pages/Index';
import './App.css';

// Lazy load components
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const UserProfile = lazy(() => import('@/pages/UserProfile'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const SimplifiedCheckout = lazy(() => import('@/pages/SimplifiedCheckout'));
const Orders = lazy(() => import('@/pages/Orders'));
const Chats = lazy(() => import('@/pages/Chats'));
const SellerDashboard = lazy(() => import('@/pages/SellerDashboard'));
const ManageProducts = lazy(() => import('@/pages/ManageProducts'));
const EditProduct = lazy(() => import('@/pages/EditProduct'));
const CreateStore = lazy(() => import('@/pages/CreateStore'));
const StoreSettings = lazy(() => import('@/pages/StoreSettings'));
const StoreView = lazy(() => import('@/pages/StoreView'));
const TermsAndConditions = lazy(() => import('@/pages/TermsAndConditions'));
const AgentDashboard = lazy(() => import('@/pages/AgentDashboard'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <div className="App">
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/checkout/quick" element={<SimplifiedCheckout />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/chats" element={<Chats />} />
                      <Route path="/seller/dashboard" element={<SellerDashboard />} />
                      <Route path="/seller/products" element={<ManageProducts />} />
                      <Route path="/seller/products/edit/:id" element={<EditProduct />} />
                      <Route path="/seller/create-store" element={<CreateStore />} />
                      <Route path="/seller/store-settings" element={<StoreSettings />} />
                      <Route path="/store/:storeId" element={<StoreView />} />
                      <Route path="/terms" element={<TermsAndConditions />} />
                      <Route path="/agent" element={<AgentDashboard />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Toaster />
                  <CookieConsent />
                  <GlobalChatButton />
                </div>
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
