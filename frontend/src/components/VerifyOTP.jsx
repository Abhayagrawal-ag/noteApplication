import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!code) {
      return toast.error("Error: Please enter OTP code", {
        autoClose: 1500,
      });
    }

    if (code.length !== 6) {
      return toast.error("Error: OTP must be 6 digits", {
        autoClose: 1500,
      });
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://noteapplication-backend.onrender.com/auth/verify-otp",
        {
          code,
        }
      );

      // Store OTP code for password reset
      localStorage.setItem("resetCode", code);

      toast.success("OTP verified successfully", {
        autoClose: 1500,
      });

      // Navigate to new password page
      navigate("/newpassword");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error verifying OTP";
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToEmail = () => {
    navigate("/emailfp");
  };

  return (
    <>
      <p
        style={{ background: "#3366FF" }}
        className="w-full font-bold p-3 text-2xl sm:text-3xl md:text-4xl text-white text-center"
      >
        Verify OTP
      </p>

      <div className="flex flex-col items-center justify-center mt-8">
        <div className="bg-gray-100 h-[320px] w-[260px] sm:h-[340px] sm:w-[400px] md:h-[470px] md:w-[500px] rounded-md shadow-md flex flex-col items-center justify-center">
          <form
            onSubmit={handleVerifyOTP}
            className="flex flex-col items-center gap-6 sm:gap-10"
          >
            <p className="mb-4 text-center font-bold sm:text-xl md:text-2xl">
              Enter OTP Code
            </p>

            <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg px-4">
              We've sent a 6-digit OTP to your email
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="border border-gray-300 p-3 rounded-md w-50 sm:w-80 md:w-80  placeholder:sm:text-2xl placeholder:md:text-2xl text-center tracking-widest"
              disabled={isLoading}
              maxLength={6}
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
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <span
              onClick={goBackToEmail}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              Back to Email
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default VerifyOTP;
