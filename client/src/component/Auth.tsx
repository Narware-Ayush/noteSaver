import React, { useState } from "react";
import axios from "axios";
import notesimg from '../assets/notesimg.webp'

export default function Auth() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSignup, setIsSignup] = useState(true); // Toggle signup/login
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/sendotp", {
        name,
        dob,
        email,
      });
      console.log(response.data.message)
      if (response.data.message) {
        alert(response.data.message);
        setOtpSent(true);
      }
    } catch (err: any) {
      console.error(err);
     // alert(err.response?.data?.message || "Error sending OTP");
     alert("otp not found at fronhtend")
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isSignup
        ? "http://localhost:5000/verifyotp"
        : "http://localhost:5000/verifyotp";

      const response = await axios.post(url, { email, otp });
      if (response.data.user) {
         localStorage.setItem("usernote", JSON.stringify(response.data.user));
        alert(`${isSignup ? "Signup" : "Login"} successful!`);

        // You can redirect to dashboard here
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error verifying OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-gray-50">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isSignup ? "Sign up" : "Login"}
          </h1>
          <p className="text-gray-500">
            {isSignup
              ? "Sign up to enjoy the features of HD"
              : "Login to continue your journey"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4"
        >
          {/* Show Name + DOB only on Signup */}
          {isSignup && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Enter Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Select DOB
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* OTP Section */}
          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter Valid OTP
              </label>
              <input
                id="otp"
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              {/* Extra options only for Login */}
              {!isSignup && (
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm text-indigo-600 hover:underline w-fit"
                  >
                    Resend OTP
                  </button>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="keepLoggedIn"
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    Keep me logged in
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Send OTP
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                {isSignup ? "Sign Up" : "Login"}
              </button>
            )}
          </div>

          {/* Toggle Signup/Login */}
          <div className="text-center pt-4">
            {isSignup ? (
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setOtpSent(false);
                  }}
                  className="text-indigo-600 hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setOtpSent(false);
                  }}
                  className="text-indigo-600 hover:underline"
                >
                  Create one
                </button>
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Right side: Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-indigo-100   mt-2 mb-2 mr-2">
        <img
          src={notesimg}
          alt="Illustration"
          className="object-cover h-full w-full rounded-lg "
        />
      </div>
    </div>
  );
}
