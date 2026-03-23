"use client";

import { useState, useEffect } from "react";

export default function Profile() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [popup, setPopup] = useState({ show: false, message: "" });

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include"
      });

      if (res.ok) {
        window.location.replace("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || "");
      });
  }, []);

  const updateProfile = async () => {
    const res = await fetch("/api/user/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, phone })
    });

    const data = await res.json();

    setPopup({
      show: true,
      message: res.ok ? "Profile updated successfully" : data.message
    });
  };

  const changePassword = async () => {
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await res.json();

    if (res.ok) {
      setOldPassword("");
      setNewPassword("");
    }

    setPopup({
      show: true,
      message: res.ok ? "Password updated successfully" : data.message
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          <span className="text-purple-600">My</span> Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your personal details and security settings.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-10">

        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Profile Information
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={updateProfile}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium hover:cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Change Password
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">

            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />

          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={changePassword}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium hover:cursor-pointer"
            >
              Update Password
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition shadow-sm font-medium hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Notification
            </h3>
            <p className="text-gray-600 text-sm">
              {popup.message}
            </p>
            <button
              onClick={() => setPopup({ show: false, message: "" })}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}