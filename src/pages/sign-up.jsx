import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./../app/globals.css"; // Ensure the path is correct for your project setup
import SignUpComponent from "./../components/AuthForms/SignUpComponent";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-full max-w-md m-auto p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-4">
          <Image src="/Logo1.svg" alt="Your Company" width={150} height={150} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Sign Up to your account
        </h2>
        <p className="text-sm text-center mb-6">
          Already have an account?{" "}
          <Link href="/login" className="text-red-600 hover:text-red-500">
            Sign in
          </Link>
        </p>
        <SignUpComponent />
      </div>
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/8018766.jpg')",
        }}
      />
    </div>
  );
};

export default SignUpPage;
