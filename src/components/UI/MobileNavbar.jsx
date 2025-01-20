import Image from "next/image";
import React from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./../../utils/firebase";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";

const MobileNavbar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user"); // Clear user data from session storage
      router.push("/"); // Redirect to home page
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Sign Out Error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <nav className="bg-red-600 p-4 text-white flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <div className="flex items-center">
        <a href="/">
          <Image src="/Logo2.svg" alt="Logo" width={100} height={100} />
        </a>
      </div>
      {user && (
        <button onClick={handleSignOut} className="hover:text-gray-300">
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
      )}
    </nav>
  );
};

export default MobileNavbar;
