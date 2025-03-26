import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';

import MainLayout from './layouts/MainLayout';
import MemberPage from './pages/member/MemberPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/product/ProductPage';

import { useEffect, useState } from 'react';
import AlertModal from './components/common/AlertModal';
import CouponPage from './pages/coupon/CouponPage';
import IssuedCouponPage from './pages/coupon/IssuedCouponPage';
import EventPage from './pages/event/EventPage';
import ImageTestPage from './pages/ImageTestPage';
import LoginPage from './pages/login/LoginPage';
import OrderPage from './pages/order/OrderPage';
import SellerPage from './pages/shop/SellerPage';
import ShopPage from './pages/shop/ShopPage';

function App() {
  console.log('APP 실행시, API URL:', process.env.REACT_APP_API_URL);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  useEffect(() => {
    const handleShowAlert = (event) => {
      setModalConfig(event.detail);
      setModalOpen(true);
    };

    window.addEventListener('showAlertModal', handleShowAlert);
    return () => window.removeEventListener('showAlertModal', handleShowAlert);
  }, []);

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/seller" element={<SellerPage />} />
          <Route path="/member" element={<MemberPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/coupon" element={<CouponPage />} />
          <Route path="/issued-coupon" element={<IssuedCouponPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/image-test" element={<ImageTestPage />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AlertModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        {...modalConfig}
      />
    </>
  );
}

export default App;
