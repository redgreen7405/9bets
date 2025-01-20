"use client";

import React from "react";
import Button from "../components/UI/Button";
import { useEffect } from "react";
import Input from "../components/UI/Input";
import Navbar from "../components/UI/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../utils/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import BottomMenu from "../components/UI/BottomMenu";
import MobileNavbar from "../components/UI/MobileNavbar";
import Cards from "../components/UI/Cards";
import Footer from "../components/UI/Footer";
import { Toaster } from "react-hot-toast";

const cardData = [
  {
    name: "John Doe",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "Jane Smith",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "Alice Johnson",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "Bob Brown",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "Emily Davis",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "Michael Wilson",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "Sarah Taylor",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "David Martinez",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
  {
    name: "Lisa Anderson",
    price: "$0.00",
    imgSrc: "/card_bg.png",
  },
];

const HomePage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // Client-side only code
    const userSession = localStorage.getItem("user");

    // Sign out function
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        localStorage.removeItem("user");
        router.push("/login");
      } catch (error) {
        console.error("Sign Out Error", error);
      }
    };

    // Example usage: You can trigger handleSignOut based on user actions
    // handleSignOut();
  }, [router]);
  return (
    <>
      <Toaster />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      <div className="p-4 mt-24">
        {" "}
        {/* Adjusted mt-10 to mt-16 or higher as needed */}
        <h2 className="text-2xl font-bold mb-6">Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cardData.map((card, index) => (
            <Cards key={index} {...card} />
          ))}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Winning Info.</h2>
        {/* <List /> */}
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="block md:hidden">
        <BottomMenu />
      </div>
    </>
  );
};

export default HomePage;
