import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserData({ name: user.name, email: user.email });
    }
    console.log(userData.name)
  }, [user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      const userEmailKey = user.email.replace(".", ","); // Convert email to Firebase-safe key
      const response = await fetch(
        `https://virtualclassroom-project-default-rtdb.firebaseio.com/Users/${userEmailKey}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setEditing(false);
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Profile</h2>

        <div className="mb-4">
        <img src="https://i.pravatar.cc/100?img=4" alt="User Avatar" className="w-20 h-20 mx-auto rounded-full" />

        </div>

        {editing ? (
          <>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2"
            />
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2"
              disabled
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save"}
            </button>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-800">Welcome, {userData.name}!</p>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>

            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </button>

              <button
                onClick={() => navigate(`/video-conference`)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
              >
                ⬅ Back
              </button>
            </div>
          </>
        )}

        {success && <p className="text-green-600 mt-2">Profile updated successfully!</p>}
      </div>
    </div>
  );
};

export default Profile;
