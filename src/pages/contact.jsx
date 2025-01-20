"use client";

import React from "react";
import Navbar from "../components/UI/Navbar";
import BottomMenu from "../components/UI/BottomMenu";
import MobileNavbar from "../components/UI/MobileNavbar";
import Footer from "../components/UI/Footer";
import { Toaster } from "react-hot-toast";
import "../app/globals.css";

const ContactUs = () => {
  return (
    <>
      <Toaster />
      {/* Navbar for larger screens */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Navbar for mobile devices */}
      <div className="block md:hidden">
        <MobileNavbar />
      </div>

      {/* Main content */}
      <div className="p-1 mt-16 md:mt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Contact Us</h1>
            <div className="text-lg text-justify space-y-4">
              <p>
                If you have any queries, feedback, or concerns, feel free to reach out to us. We are here to help and address your questions.
              </p>
              <div>
                <h2 className="text-2xl font-semibold mt-4 mb-2">Phone</h2>
                <p className="text-gray-700">+91-XXXXXXXXXX</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mt-4 mb-2">Hours of Operation</h2>
                <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mt-4 mb-2">Email</h2>
                <p className="text-gray-700">support@9bets.pages.dev</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mt-4 mb-2">Office Address</h2>
                <p className="text-gray-700">
                  123 Business Street, <br />
                  City Name, State, <br />
                  Country - ZIP Code
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer for larger screens */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Bottom menu for mobile devices */}
      <div className="block md:hidden fixed bottom-0 w-full z-20">
        <BottomMenu />
      </div>

      {/* Padding for content to avoid overlap */}
      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            padding-bottom: 5rem; /* Space for the bottom navigation */
          }
        }
      `}</style>
    </>
  );
};

export default ContactUs;
