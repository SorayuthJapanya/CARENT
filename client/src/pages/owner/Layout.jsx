import React, { useEffect } from "react";
import NavBarOwner from "../../components/owner/NavBarOwner";
import SideBar from "../../components/owner/SideBar";
import { Outlet } from "react-router";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isOwner, loadingUser, navigate } = useAppContext();
  useEffect(() => {
    if (!loadingUser && !isOwner) {
      navigate("/");
    }
  }, [loadingUser, isOwner, navigate]);

  if (loadingUser) {
    return <div className="text-center mt-20">Loading user info...</div>;
  }
  return (
    <div className="flex flex-col">
      <NavBarOwner />
      <div className="flex">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
