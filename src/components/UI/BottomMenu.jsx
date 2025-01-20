"use client";

import React from "react";
import {
  HomeIcon,
  BellIcon,
  WalletIcon,
  UserIcon,
  PlusIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../../utils/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";

const BottomMenu = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  const handleAccountClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      router.push("/sign-up");
      // Uncomment this if you want to notify the user
      // toast("You need to sign up or log in.", { icon: "🚫" });
    }
  };

  const isActive = (route) =>
    pathname === route ? "text-red-600" : "text-gray-600";

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center py-2 space-x-4">
        {/* Home Link */}
        <Link href="/">
          <div className="flex flex-col items-center">
            <HomeIcon className={`h-6 w-6 ${isActive("/")}`} />
            <span className={`text-xs mt-1 ${isActive("/")}`}>Home</span>
          </div>
        </Link>

        {/* Activity Link */}
        <Link href="/activity">
          <div className="flex flex-col items-center">
            <BellIcon className={`h-6 w-6 ${isActive("/activity")}`} />
            <span className={`text-xs mt-1 ${isActive("/activity")}`}>
              Activity
            </span>
          </div>
        </Link>

        {/* Play Button or Plus Icon */}
        {user ? (
          <Link href="/play" className="flex flex-col items-center">
            <PuzzlePieceIcon className={`h-6 w-6 ${isActive("/play")}`} />
            <span className={`text-xs mt-1 ${isActive("/play")}`}>Play</span>
          </Link>
        ) : (
          <div className="flex justify-center items-center">
            <button
              className="bg-red-600 hover:bg-red-700 h-12 w-12 rounded-full text-white text-lg flex items-center justify-center shadow-md transition"
              aria-label="Sign up or Log in"
              onClick={() => router.push("/sign-up")}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Wallet Link */}
        <Link href="/wallet">
          <div className="flex flex-col items-center">
            <WalletIcon className={`h-6 w-6 ${isActive("/wallet")}`} />
            <span className={`text-xs mt-1 ${isActive("/wallet")}`}>
              Wallet
            </span>
          </div>
        </Link>

        {/* Account Button */}
        <button
          onClick={handleAccountClick}
          className="flex flex-col items-center"
          aria-label="Account"
        >
          <UserIcon className={`h-6 w-6 ${isActive("/account")}`} />
          <span className={`text-xs mt-1 ${isActive("/account")}`}>
            Account
          </span>
        </button>
      </div>
    </nav>
  );
};

export default BottomMenu;
