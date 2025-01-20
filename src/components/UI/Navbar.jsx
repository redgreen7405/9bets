import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../../utils/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const currentPath = router.pathname; // Get the current path

  // Sign out function
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

  const handleAdminPanel = () => {
    router.push("/admin-panel");
  }

  // Handle Account click
  const handleAccountClick = () => {
    if (user) {
      // toast("You are already logged in.", {
      //   icon: "🚫",
      // });
      router.push("/profile")
    } else {
      router.push("/sign-up");
    }
  };

  // Function to determine if a link is active
  const isActive = (path) => (currentPath === path ? "font-bold" : "");

  return (
    <nav className="bg-red-600 p-4 text-white flex justify-between items-center fixed top-0 w-full z-50">
      <Link href="/">
        <div className="flex items-center">
          <Image src="/Logo2.svg" alt="Logo" width={100} height={100} />
        </div>
      </Link>
      <div className="flex space-x-6">
        <Link href="/" className={`hover:text-gray-300 ${isActive("/")}`}>
          Home
        </Link>
        <Link
          href="/activity"
          className={`hover:text-gray-300 ${isActive("/activity")}`}
        >
          Activity
        </Link>
        <Link
          href="/wallet"
          className={`hover:text-gray-300 ${isActive("/wallet")}`}
        >
          Wallet
        </Link>
        {user && (
          <Link
            href="/play"
            className={`hover:text-gray-300 ${isActive("/play")}`}
          >
            Play
          </Link>
        )}
        <button
          onClick={handleAccountClick}
          className={`hover:text-gray-300 ${isActive("/sign-up")}`}
        >
          Account
        </button>
        {user?.providerData[0].email === "adminpanel7676@gmail.com" && <button
          onClick={handleAdminPanel}
          className={`hover:text-gray-300 ${isActive("/sign-up")}`}
        >
          Admin Panel
        </button>
        }
        {user && (
          <button onClick={handleSignOut} className="hover:text-gray-300">
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
