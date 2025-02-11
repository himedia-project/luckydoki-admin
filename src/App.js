import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import ProductPage from './pages/product/ProductPage';
import MemberPage from './pages/member/MemberPage';
import SellerPage from './pages/member/SellerPage';
import OrderPage from './pages/order/OrderPage';
import CouponPage from './pages/coupon/CouponPage';
import EventPage from './pages/event/EventPage';
import LoginPage from './pages/login/LoginPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/member" element={<MemberPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/coupon" element={<CouponPage />} />
        <Route path="/event" element={<EventPage />} />
      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
