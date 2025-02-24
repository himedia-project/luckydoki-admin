import axios from 'axios';
import { AI_API_SERVER_URL } from '../config/apiConfig';
const axiosInstance = axios.create({
  baseURL: `${AI_API_SERVER_URL}/api/admin`,
  // 쿠키 허용
  withCredentials: true,
});

export const generateReport = async (dashboardData) => {
  console.log('generateReport dashboardData: ', dashboardData);
  const requestData = {
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // 이번달 1일
    endDate: new Date().toISOString().split('T')[0], // 오늘
    metrics: {
      totalOrderCount: dashboardData.totalOrderCount,
      monthlyRevenue: dashboardData.monthlyRevenue,
      todayRevenue: dashboardData.todayRevenue,
      newMemberCount: dashboardData.newMemberCount,
      newSellerCount: dashboardData.newSellerCount,
      totalCommunityCount: dashboardData.totalCommunityCount,
      top10Products: dashboardData.top10Products.map((product) => ({
        id: product.id,
        name: product.name,
        categoryAllName: product.categoryAllName,
        discountPrice: product.discountPrice,
        salesCount: product.salesCount,
        reviewAverage: product.reviewAverage,
        reviewCount: product.reviewCount,
        likesCount: product.likesCount,
        shopName: product.shopName,
      })),
      top5Sellers: dashboardData.top5Sellers.map((seller) => ({
        email: seller.email,
        nickName: seller.nickName,
        monthlySales: seller.monthlySales,
        shopImage: seller.shopImage,
        shopName: seller.shopName,
      })),
      top5GoodConsumers: dashboardData.top5GoodConsumers.map((consumer) => ({
        email: consumer.email,
        nickName: consumer.nickName,
        reviewCount: consumer.reviewCount,
        profileImage: consumer.profileImage,
        monthlyPurchase: consumer.monthlyPurchase,
      })),
    },
    dailySalesData: dashboardData.dailySalesData,
    hourlySalesData: dashboardData.hourlySalesData,
  };

  const response = await axiosInstance.post('/report/generate', requestData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('generateReport response: ', response);

  return response;
};
