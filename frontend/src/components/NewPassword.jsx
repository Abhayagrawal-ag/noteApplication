import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function NewPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return toast.error("Error: Please fill in all fields", {
        autoClose: 1500,
      });
    }

    if (newPassword.length < 8) {
      return toast.error("Error: Password must be at least 8 characters long", {
        autoClose: 1500,
      });
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Error: Passwords do not match", {
        autoClose: 1500,
      });
    }

    setIsLoading(true);

    try {
      // Get email and code from localStorage
      const resetEmail = localStorage.getItem("resetEmail");
      const resetCode = localStorage.getItem("resetCode");

      if (!resetEmail) {
        toast.error("Session expired. Please start again", {
          autoClose: 1500,
        });
        navigate("/emailfp");
        return;
      }

      const response = await axios.post(
        "https://noteapplication-backend.onrender.com/auth/reset-password",
        {
          email: resetEmail,
          newPassword,
          code: resetCode,
        }
      );

      // Clear stored data
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetCode");

      toast.success(
        "Password reset successfully! Please login with your new password",
        {
          autoClose: 2000,
        }
      );

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error resetting password";
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToOTP = () => {
    navigate("/verifyotp");
  };

  return (
    <>
      <p
        style={{ background: "#3366FF" }}
        className="w-full font-bold p-3 text-2xl sm:text-3xl md:text-4xl text-white text-center"
      >
        Create New Password
      </p>

      <div className="flex flex-col items-center justify-center mt-8">
        <div className="bg-gray-100 h-[420px] w-[260px] sm:h-[420px] sm:w-[400px] md:h-[550px] md:w-[500px] rounded-md shadow-md flex flex-col items-center justify-center">
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col items-center gap-6 sm:gap-10"
          >
            <p className="mb-4 text-center font-bold sm:text-xl md:text-2xl">
              Set Your New Password
            </p>

            <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg px-4">
              Choose a strong password for your account
            </p>

            {/* New Password Field */}
            <div className="relative w-50 sm:w-80 md:w-80">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 p-3 rounded-md w-full  placeholder:sm:text-2xl placeholder:md:text-2xl pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff size={20} className="cursor-pointer" />
                ) : (
                  <Eye size={20} className="cursor-pointer" />
                )}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative w-50 sm:w-80 md:w-80">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 p-3 rounded-md w-full placeholder:text-xl placeholder:sm:text-2xl placeholder:md:text-2xl pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} className="cursor-pointer" />
                ) : (
                  <Eye size={20} className="cursor-pointer" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className={`text-white text-xl p-3 rounded-md w-50 sm:w-80 md:w-80 font-bold ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>

            <span
              onClick={goBackToOTP}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              Back to OTP
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewPassword;
