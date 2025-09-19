// src/components/common/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
        {/* Left side */}
        <p className="mb-3 md:mb-0">
          © {new Date().getFullYear()} <span className="font-semibold">AgroSmart</span>. 
          All rights reserved.
        </p>

        {/* Right side */}
        <div className="flex space-x-4">
          <span className="hover:text-green-600 transition cursor-default">
            Privacy Policy
          </span>
          <span className="hover:text-green-600 transition cursor-default">
            Terms
          </span>
          <span className="hover:text-green-600 transition cursor-default">
            Contact
          </span>
        </div>
      </div>
    </footer>
  );
}
