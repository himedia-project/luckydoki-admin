import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { forecastPost, forecastPostByDate } from '../api/salesApi';
import axiosInstance from '../api/axiosInstance';

const TestPage = () => {
  // 기본 전체 데이터 그래프 상태
  const [defaultData, setDefaultData] = useState(null);
  const [loadingDefault, setLoadingDefault] = useState(true);
  const [errorDefault, setErrorDefault] = useState('');

  // 특정 날짜에 대한 그래프 상태
  const [selectedDate, setSelectedDate] = useState('');
  const [dateData, setDateData] = useState(null);
  const [loadingDate, setLoadingDate] = useState(false);
  const [errorDate, setErrorDate] = useState('');

  // 기본 예측 그래프 (전체 데이터 기반) 호출
  useEffect(() => {
    forecastPost()
      .then((response) => {
        setDefaultData(response);
        setLoadingDefault(false);
      })
      .catch((err) => {
        setErrorDefault(err.message);
        setLoadingDefault(false);
      });
  }, []);

  // 특정 날짜 예측 그래프 호출 (폼 제출 시)
  const handleDateSubmit = async (e) => {
    e.preventDefault();
    setLoadingDate(true);
    setErrorDate('');
    setDateData(null);
    try {
      const response = await axiosInstance.post('/sales/forecast/date', {
        selectedDate: selectedDate,
      });
      setDateData(response.data);
    } catch (err) {
      setErrorDate(err.message);
    } finally {
      setLoadingDate(false);
    }
  };

  return (
    <div>
      <h2>Default Sales Forecast Graph (전체 데이터 기반)</h2>
      {loadingDefault ? (
        <div>Loading default forecast...</div>
      ) : errorDefault ? (
        <div style={{ color: 'red' }}>Error: {errorDefault}</div>
      ) : (
        <div>
          <p>{defaultData.forecast_message}</p>
          <p>Total Sales Unit: {defaultData.sales_unit}</p>
          <div>
            <h3>Daily Total Sales Trend</h3>
            {defaultData.daily_image_base64 ? (
              <img
                src={`data:image/png;base64,${defaultData.daily_image_base64}`}
                alt="Daily Sales Trend"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <p>No image available.</p>
            )}
          </div>
          <div>
            <h3>Hourly Total Sales Trend</h3>
            {defaultData.hourly_image_base64 ? (
              <img
                src={`data:image/png;base64,${defaultData.hourly_image_base64}`}
                alt="Hourly Sales Trend"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <p>No image available.</p>
            )}
          </div>
        </div>
      )}

      <hr />

      <h2>Sales Forecast by Date</h2>
      <form onSubmit={handleDateSubmit}>
        <label htmlFor="selectedDate">Select Date: </label>
        <input
          type="date"
          id="selectedDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button type="submit">Get Forecast</button>
      </form>
      {loadingDate && <p>Loading forecast for selected date...</p>}
      {errorDate && <p style={{ color: 'red' }}>Error: {errorDate}</p>}
      {dateData && (
        <div>
          <p>{dateData.forecast_message}</p>
          <p>Total Sales Unit: {dateData.sales_unit}</p>
          <div>
            <h3>Hourly Sales Trend for {selectedDate}</h3>
            {dateData.hourly_image_base64 ? (
              <img
                src={`data:image/png;base64,${dateData.hourly_image_base64}`}
                alt={`Hourly Sales Trend for ${selectedDate}`}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <p>No image available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
