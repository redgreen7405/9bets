"use client";

import React from "react";
import Navbar from "../components/UI/Navbar";
import BottomMenu from "../components/UI/BottomMenu";
import MobileNavbar from "../components/UI/MobileNavbar";
import Footer from "../components/UI/Footer";
import { Toaster } from "react-hot-toast";
import "../app/globals.css";

const Refund = () => {
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
        <div className="container mx-auto px-4 py-6 pb-20 md:pb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Refund and Cancellation Policy
            </h1>
            <div className="text-sm md:text-base leading-relaxed space-y-4">
              <p>
                This refund and cancellation policy outlines how you can cancel
                or seek a refund for a product/service that you have purchased
                through the Platform. Under this policy:
              </p>
              <p>
                1. Cancellations will only be considered if the request is made
                within 7 days of placing the order. However, cancellation
                requests may not be entertained if the orders have been
                communicated to such sellers/merchant(s) listed on the Platform
                and they have initiated the process of shipping them, or the
                product is out for delivery. In such an event, you may choose to
                reject the product at the doorstep.
              </p>
              <p>
                2. General store does not accept cancellation requests for
                perishable items like flowers, eatables, etc. However, the
                refund/replacement can be made if the user establishes that the
                quality of the product delivered is not good.
              </p>
              <p>
                3. In case of receipt of damaged or defective items, please
                report to our customer service team. The request would be
                entertained once the seller/merchant listed on the Platform has
                checked and determined the same at its own end. This should be
                reported within 7 days of receipt of products. In case you feel
                that the product received is not as shown on the site or as per
                your expectations, you must bring it to the notice of our
                customer service within 7 days of receiving the product. The
                customer service team, after looking into your complaint, will
                take an appropriate decision.
              </p>
              <p>
                4. In case of complaints regarding the products that come with a
                warranty from the manufacturers, please refer the issue to them.
              </p>
              <p>
                5. In case of any refunds approved by General Store, it will
                take 7 days for the refund to be processed.
              </p>
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
    </>
  );
};

export default Refund;
