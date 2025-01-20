import { useState } from "react";
import { useRouter } from "next/navigation";
import { firestore, auth } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import GoogleSignIn from "./GoogleSignIn";

const SignUpComponent = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateInputs = () => {
    const errors = {};
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    // const isPhone = /^\+?[1-9]\d{1,14}$/.test(identifier);
    const isPhone = true;

    if (!identifier) {
      errors.identifier = "Email or Phone number is required.";
    } else if (!isEmail && !isPhone) {
      errors.identifier = "Please enter a valid email address or phone number.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("id", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("User already exists!");
        return router.push("/login");
      }

      // Generate a unique 8-digit referral code
      let referralCode;
      let isUnique = false;
      while (!isUnique) {
        // Generate an 8-character alphanumeric code
        referralCode = Array.from({ length: 8 }, () => {
          const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          return chars.charAt(Math.floor(Math.random() * chars.length));
        }).join("");

        const codeQuery = query(
          usersRef,
          where("referralCode", "==", referralCode)
        );
        const codeSnapshot = await getDocs(codeQuery);

        if (codeSnapshot.empty) {
          isUnique = true; // Unique code found
        }
      }

      // Check if a referral code was provided and if it exists
      let initialMoney = 0;
      if (referralCodeInput) {
        const referralQuery = query(
          usersRef,
          where("referralCode", "==", referralCodeInput)
        );
        const referralSnapshot = await getDocs(referralQuery);

        if (!referralSnapshot.empty) {
          // Get the referrer user doc
          const referrerDoc = referralSnapshot.docs[0];
          const referrerRef = doc(firestore, "users", referrerDoc.id);

          // Update referrer's money and referralApplied count
          await updateDoc(referrerRef, {
            money: (referrerDoc.data().money || 0) + 100,
            referralApplied: (referrerDoc.data().referralApplied || 0) + 1,
          });

          // Update initial money and referralApplied for new user
          initialMoney = 100;
          toast.success("Referral code applied!");
        } else {
          toast.error("Invalid referral code.");
          return;
        }
      }

      if (isEmail) {
        // Email signup flow
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          identifier,
          password
        );
        const user = userCredential.user;
        await sendEmailVerification(user);
        toast.success("Verification email sent!");
      }
      // else {
      //   // Phone number signup flow
      //   console.log(auth)
      //   window.recaptchaVerifier = new RecaptchaVerifier(
      //     "recaptcha-container",
      //     { size: "invisible" },
      //     auth.settings
      //   );

      //   const confirmationResult = await signInWithPhoneNumber(
      //     auth,
      //     identifier,
      //     window.recaptchaVerifier
      //   );
      //   const verificationCode = window.prompt("Enter the verification code sent to your phone:");

      //   await confirmationResult.confirm(verificationCode);
      // }

      // Add new user to Firestore with referral code, initial money, and referralApplied set to 1 if referral code was applied
      const name = identifier.split("@")[0];

      await addDoc(usersRef, {
        id: identifier,
        password,
        name,
        money: initialMoney,
        referralCode,
        referralApplied: referralCodeInput ? 1 : 0,
      });
      setIdentifier("");
      setPassword("");
      setReferralCodeInput("");
      router.push("/login");
    } catch (error) {
      console.error("Sign Up Error:", error);
      toast.error("Failed to sign up. Please try again.");
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      <form className="space-y-6" onSubmit={handleSignUp}>
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${
              errors.identifier ? "border-red-600" : "border-gray-300"
            }`}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {errors.identifier && (
            <p className="mt-2 text-sm text-red-600">{errors.identifier}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${
                errors.password ? "border-red-600" : "border-gray-300"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="referralCodeInput"
            className="block text-sm font-medium text-gray-700"
          >
            Referral Code (optional)
          </label>
          <input
            id="referralCodeInput"
            name="referralCodeInput"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            value={referralCodeInput}
            onChange={(e) => setReferralCodeInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign up
        </button>
      </form>
      <GoogleSignIn />
      <Toaster />
    </div>
  );
};

export default SignUpComponent;
