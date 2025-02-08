import React, { useEffect, useState } from "react";
import { Sun, Lock, Bell, User, LogOut, HelpCircle, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../User/AuthContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setDeleting(true);

    try {
      const userEmailKey = user.email.replace(".", ",");

      await fetch(
        `https://virtualclassroom-project-default-rtdb.firebaseio.com/Users/${userEmailKey}.json`,
        { method: "DELETE" }
      );

      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }

    setDeleting(false);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-lg font-bold dark:text-white">Settings</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600 dark:text-gray-200"
        >
          {isSidebarOpen ?<Menu size={24} /> :  <X size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 lg:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 border-r dark:border-gray-700`}
      >
        <h2 className="text-lg font-bold mb-4 dark:text-white hidden md:block">Settings</h2>
        <nav className="space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "account"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              setActiveTab("account");
              setIsSidebarOpen(false);
            }}
          >
            <User className="inline mr-2" size={18} /> Account Settings
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "appearance"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              setActiveTab("appearance");
              setIsSidebarOpen(false);
            }}
          >
            <Sun className="inline mr-2" size={18} /> Appearance
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "notifications"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              setActiveTab("notifications");
              setIsSidebarOpen(false);
            }}
          >
            <Bell className="inline mr-2" size={18} /> Notifications
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "security"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              setActiveTab("security");
              setIsSidebarOpen(false);
            }}
          >
            <Lock className="inline mr-2" size={18} /> Security & Privacy
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === "help"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              setActiveTab("help");
              setIsSidebarOpen(false);
            }}
          >
            <HelpCircle className="inline mr-2" size={18} /> Help & Support
          </button>

          <button
            onClick={() => navigate("/video-conference")}
            className="w-full mt-4 px-4 py-2 bg-teal-500 text-white rounded-md"
          >
            Go Back
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 dark:bg-gray-900 dark:text-white overflow-y-auto">
        {activeTab === "account" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <p className="break-words">Email: {user?.email}</p>
            <button
              className="w-full sm:w-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </div>
        )}

        {activeTab === "appearance" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full p-1 flex items-center transition-all">
                <div
                  className={`w-4 h-4 bg-white dark:bg-black rounded-full transform transition-transform ${
                    darkMode ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3">{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </label>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your email and push notifications.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Security & Privacy</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="inline mr-2" size={18} /> Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "help" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
            <div className="space-y-4">
              <details className="p-4 border rounded-lg bg-gray-200 dark:bg-gray-700">
                <summary className="cursor-pointer font-semibold">How do I reset my password?</summary>
                <p className="mt-2 text-gray-700 dark:text-gray-300">Go to Account Settings and click on "Change Password." Follow the instructions to reset your password.</p>
              </details>
              <details className="p-4 border rounded-lg bg-gray-200 dark:bg-gray-700">
                <summary className="cursor-pointer font-semibold">How do I contact support?</summary>
                <p className="mt-2 text-gray-700 dark:text-gray-300">You can contact our support team via email at support@example.com or use the live chat option on our website.</p>
              </details>
              <details className="p-4 border rounded-lg bg-gray-200 dark:bg-gray-700">
                <summary className="cursor-pointer font-semibold">
                  How do I delete my account?
                </summary>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  To delete your account, go to <strong>Security & Privacy</strong> settings and click on "Delete Account." 
                  This action is irreversible, and all your data will be permanently removed.
                </p>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}