import React, { useEffect, useState } from "react";

const Appearance = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Appearance</h2>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition duration-300"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default Appearance;
