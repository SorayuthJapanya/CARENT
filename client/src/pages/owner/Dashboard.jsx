import React, { useCallback, useEffect, useState } from "react";
import { assets } from "../../assets/assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Navigate } from "react-router";
import Title from "../../components/owner/Title";

const Dashboard = () => {
  const { axios, isOwner, currency, loadingUser } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const DashboardCard = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending Bookings",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Completed Bookings",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      if (data && data.dashboardData) {
        // Map backend keys to frontend keys
        setData({
          totalCars: data.dashboardData.totelCars || 0,
          totalBookings: data.dashboardData.totalBookings || 0,
          pendingBookings: data.dashboardData.pendingBookings || 0,
          completedBookings: data.dashboardData.confirmedBookings || 0,
          recentBookings: data.dashboardData.recentBookings || [],
          monthlyRevenue: data.dashboardData.monthlyRevenue || 0,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  }, [axios]);

  useEffect(() => {
    if (isOwner) {
      fetchDashboard();
    }
  }, [isOwner, fetchDashboard]);

  if (loadingUser) return <div>Loading...</div>;

  if (!isOwner) return <Navigate to="/" />;

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 max-w-4xl">
        {DashboardCard.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
              <img src={card.icon} className="size-4" alt="" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] items-start gap-6 mb-8 max-w-4xl">
        {/* Recent booking */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>

          {data.recentBookings.map((booking, index) => (
            <div key={index} className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <img src={assets.listIconColored} alt="" className="size-5" />
                </div>
                <div>
                  <p>
                    {booking.car.brand} {booking.car.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-gray-500">
                  {currency} {booking.price}
                </p>
                <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">
                  {booking.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly revenue*/}
        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency} {data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
