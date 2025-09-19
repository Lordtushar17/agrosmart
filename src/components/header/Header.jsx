import React from "react";
import IconLogo from "../common/IconLogo";

export default function Header({ connection }) {
  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-50/40 backdrop-blur-sm border-b shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto p-4">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="AgroSmart"
            className="w-12 h-12 rounded-lg"
          />
          <div>
            {/* Make the title clickable */}
            <h1
              onClick={scrollToTop}
              className="text-2xl font-semibold cursor-pointer hover:text-green-600 transition"
            >
              AgroSmart Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Smart hillside irrigation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              connection.cloud
                ? "bg-blue-50 text-blue-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            Cloud: {connection.cloud ? "Connected" : "Offline"}
          </div>
          <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
            Location: Jorethang, Sikkim
          </div>
        </div>
      </div>
    </header>
  );
}

