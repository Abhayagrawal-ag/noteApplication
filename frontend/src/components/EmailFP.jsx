import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EmailFP() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return toast.error("Error: Please enter your email address", {
        autoClose: 1500,
      });
    }

    if (!emailRegex.test(email)) {
      return toast.error("Error: Please enter a valid email address", {
        autoClose: 1500,
      });
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://noteapplication-backend.onrender.com/auth/send-otp",
        {
          email,
        }
      );

      // Store email in localStorage for next steps
      localStorage.setItem("resetEmail", email);

      toast.success("OTP sent successfully to your email", {
        autoClose: 1500,
      });

      // Navigate to OTP verification page
      navigate("/verifyotp");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error sending OTP";
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <p
        style={{ background: "#3366FF" }}
        className="w-full font-bold p-3 text-2xl sm:text-3xl md:text-4xl text-white text-center"
      >
        Reset Your Password
      </p>

      <div className="flex flex-col items-center justify-center mt-8">
        <div className="bg-gray-100 h-[330px] w-[260px] sm:h-[320px] sm:w-[400px] md:h-[450px] md:w-[500px] rounded-md shadow-md flex flex-col items-center justify-center">
          <form
            onSubmit={handleSendOTP}
            className="flex flex-col items-center gap-6 sm:gap-10"
          >
            <p className="mb-4 text-center font-bold sm:text-xl md:text-2xl">
              Enter your registered email
            </p>

            <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg px-4">
              We'll send you an OTP to reset your password
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 rounded-md w-50 sm:w-80 md:w-80 placeholder:text-xl placeholder:sm:text-2xl placeholder:md:text-2xl"
              disabled={isLoading}
            />

            <button
              type="submit"
              className={`text-white text-xl p-3 rounded-md w-50 sm:w-80 md:w-80 font-bold ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>

            <span
              onClick={goBackToLogin}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              Back to Login
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default EmailFP;
