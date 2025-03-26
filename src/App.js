import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './layouts/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/product/ProductPage';
import ShopPage from './pages/shop/ShopPage';
import MemberPage from './pages/member/MemberPage';
import OrderPage from './pages/order/OrderPage';
import CouponPage from './pages/coupon/CouponPage';
import EventPage from './pages/event/EventPage';
import ImageTestPage from './pages/ImageTestPage';
import LoginPage from './pages/login/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ChatbotPage from './pages/chatbot/ChatbotPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Header />}>
        <Route index element={<HomePage />} />
        <Route path="product/*" element={<ProductPage />} />
        <Route path="shop/*" element={<ShopPage />} />
        <Route path="member/*" element={<MemberPage />} />
        <Route path="order/*" element={<OrderPage />} />
        <Route path="coupon/*" element={<CouponPage />} />
        <Route path="event/*" element={<EventPage />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="image-test" element={<ImageTestPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
