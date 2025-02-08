import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../User/AuthContext";

const ChangePassword = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async () => {
    if (!user) return;
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const userEmailKey = user.email.replace(".", ","); // Convert email to Firebase-safe key
      const response = await fetch(
        `https://virtualclassroom-project-default-rtdb.firebaseio.com/Users/${userEmailKey}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwords.newPassword }),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/settings"), 1500); // Redirect after success
      } else {
        setError("Failed to update password.");
      }
    } catch (error) {
      setError("An error occurred while updating password.");
      console.error("Password update failed:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Change Password</h2>

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-2"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={passwords.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-2"
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">Password updated successfully!</p>}

        <button
          onClick={handleUpdatePassword}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="bg-gray-700 text-white px-4 py-2 mt-2 rounded hover:bg-gray-800 transition duration-300 w-full"
        >
          ⬅ Back to Settings
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
