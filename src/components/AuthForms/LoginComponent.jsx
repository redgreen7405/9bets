import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, firestore } from "./../../utils/firebase";
import toast, { Toaster } from "react-hot-toast";
import { RecaptchaVerifier, signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import GoogleSignIn from "./GoogleSignIn";

const LoginComponent = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // useEffect(() => {
  //   if (typeof window !== "undefined" && !window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       auth,
  //       "recaptcha-container",
  //       {
  //         size: "invisible",
  //         callback: () => {},
  //         "expired-callback": () => {},
  //       }
  //     );
  //   }
  // }, []);

  const validateInputs = useCallback(() => {
    const { identifier, password } = credentials;
    const errors = {};

    if (!identifier) {
      errors.identifier = "Email or Phone number is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) &&
      !/^\+?[1-9]\d{1,14}$/.test(identifier)
    ) {
      errors.identifier = "Please enter a valid email address or phone number.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [credentials]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSignIn = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateInputs()) return;

      try {
        const { identifier, password } = credentials;

        // Query for the identifier (email or phone saved as "id")
        const userQuery = query(
          collection(firestore, "users"),
          where("id", "==", identifier)
        );
        
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          toast.error("No account found with this identifier.");
          return;
        }

        // Check if password matches
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password !== password) {
          toast.error("Incorrect password. Please try again.");
          return;
        }
        try {
          const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
          const user = userCredential.user;
      
          if (!user.emailVerified && credentials.identifier !== "adminpanel7676@gmail.com") {
            toast.error("Please verify your email before logging in.");
            await auth.signOut(); 
            return;
          }
        } catch (error) {
          console.error("Login Error:", error);
          toast.error("Failed to log in. Please check your credentials.");
        }
        // Login successful, store user data
        localStorage.setItem("user", JSON.stringify(userData.id));
        toast.success("Logged in successfully!");
        if(credentials.identifier === "adminpanel7676@gmail.com" && credentials.password === "RahilAdmin7676"){
          router.push("/admin-panel"); 
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Sign In Error:", error);
        toast.error("Failed to sign in. Please try again.");
      }
    },
    [credentials, validateInputs, router]
  );

  return (
    <>
      <div id="recaptcha-container"></div>
      <form className="space-y-6" onSubmit={handleSignIn}>
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="email"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              errors.identifier ? "border-red-600 focus:ring-red-600 focus:border-red-600" : "border-gray-300"
            }`}
            value={credentials.identifier}
            onChange={handleInputChange}
          />
          {errors.identifier && (
            <p className="mt-2 text-sm text-red-600">{errors.identifier}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              errors.password ? "border-red-600 focus:ring-red-600 focus:border-red-600" : "border-gray-300"
            }`}
            value={credentials.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign in
        </button>
      </form>
      <GoogleSignIn />
      <Toaster />
    </>
  );
};

export default LoginComponent;
