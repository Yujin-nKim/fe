import React from 'react';
import BottomBar from '../components/BottomBar';
import TopBar from '../components/TopBar';
import rideHistoryMock from '../mocks/rideHistoryMock';

const formatDate = (dateStr: string) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  return `${dateObj.getFullYear()}.${(dateObj.getMonth()+1).toString().padStart(2,'0')}.${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
};

const MyRideHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fdfdfe] pb-16">
      {/* 상단바 */}
      <TopBar title="나의 탑승 내역" />
      {/* 탑승 내역 리스트 */}
      <div className="pt-20 flex-1 px-4">
        {rideHistoryMock.map((ride) => (
          <div
            key={ride.id}
            className="mb-3 bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500">{formatDate(ride.time)}</div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#5382E0] mr-2"></div>
                  <div className="text-sm font-medium">{ride.from}</div>
                </div>
                <div className="flex items-center mt-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B6B] mr-2"></div>
                  <div className="text-sm font-medium">{ride.to}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 하단바 */}
      <BottomBar />
    </div>
  );
};

export default MyRideHistoryPage; 