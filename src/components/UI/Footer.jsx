import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Footer Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Logo or Title */}
          <div className="text-2xl font-bold mb-4 md:mb-0">
            <span className="text-red-500">9</span>Bets
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-red-500">Company</h3>
            <ul>
              <li>
                <Link
                  href="/"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-red-500">Support</h3>
            <ul>
              <li>
                <Link
                  href="/terms"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-red-500">Legal</h3>
            <ul>
              <li>
                <Link
                  href="/disclaimer"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="block text-gray-400 hover:text-red-500 mb-2"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="text-center text-gray-400 mt-8">
          <p>&copy; {new Date().getFullYear()} 9Bets - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
