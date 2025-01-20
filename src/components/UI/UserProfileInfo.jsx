"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ClockIcon, ShareIcon } from "@heroicons/react/24/outline";
import { app } from "../../utils/firebase";

const UserProfileInfo = ({ setUserData, userData }) => {
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const id = localStorage.getItem("user");
      const modifiedId = id?.slice(1, -1);

      if (modifiedId) {
        try {
          const userQuery = query(
            collection(db, "users"),
            where("id", "==", modifiedId)
          );
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              setUserData({
                name: data.name || "N/A",
                email: data.id || "N/A",
              });
            });
          } else {
            console.log("No user found with the given ID!");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleHistoryClick = () => {
    router.push("/history");
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${userData.name}'s Profile`,
          text: `Check out ${userData.name}'s profile`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Profile link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto bg-white shadow rounded-xl overflow-hidden 
                    transform transition-all duration-300 hover:scale-[1.02] 
                    mt-4 sm:mt-8 lg:mt-12"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-500 p-6 flex items-center space-x-4 sm:space-x-5">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {userData.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {userData.name}
          </h2>
          <p className="text-xs sm:text-sm text-red-100 truncate max-w-[200px]">
            {userData.email}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-6 flex space-x-4">
        <button
          onClick={handleHistoryClick}
          className="flex-1 flex items-center justify-center space-x-2 
                     bg-red-50 text-red-600 font-semibold 
                     py-3 rounded-xl hover:bg-red-100 
                     transition-colors duration-300 
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <ClockIcon className="h-5 w-5 mr-2" />
          <span className="text-sm sm:text-base">My History</span>
        </button>

        <button
          onClick={handleShareClick}
          className="flex-1 flex items-center justify-center space-x-2 
                     bg-red-500 text-white font-semibold 
                     py-3 rounded-xl hover:bg-red-600 
                     transition-colors duration-300 
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          <ShareIcon className="h-5 w-5 mr-2" />
          <span className="text-sm sm:text-base">Share Profile</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileInfo;
