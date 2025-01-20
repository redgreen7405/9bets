"use client";

import React, { useState } from "react";
import Navbar from "../components/UI/Navbar";
import BottomMenu from "../components/UI/BottomMenu";
import MobileNavbar from "../components/UI/MobileNavbar";
import Footer from "../components/UI/Footer";
import { Toaster } from "react-hot-toast";
import "../app/globals.css";
import Wallet from "../components/UI/Wallet";
import UserProfileInfo from "../components/UI/UserProfileInfo";
import TransactionHistory from "../components/UI/TransactionHistory";
import Loader from "../components/UI/Loader"

const Profile = () => {
  const [money, setMoney] = useState();
  const [userData, setUserData] = useState({ name: "", email: "" });
  // return userData.name.length === 0 ? <Loader /> : (
  return (
    <>
      <Toaster />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      <div className="p-4 md:p-6 lg:p-8 space-y-8 mt-16 md:mt-24">
        {/* Flex container for UserProfileInfo and Wallet */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <UserProfileInfo userData={userData} setUserData={setUserData} />
          </div>
          <div className="md:w-1/2">
            <Wallet money={money} setMoney={setMoney} />
          </div>
        </div>

        {/* Full-width Transaction History */}
        <TransactionHistory />
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="block md:hidden fixed bottom-0 w-full z-20">
        <BottomMenu />
      </div>
    </>
  );
};

export default Profile;
