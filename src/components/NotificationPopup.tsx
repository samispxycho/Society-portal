"use client";

import { useState, useEffect } from "react";

export default function NotificationPopup({ notification }: any){

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(!notification) return;

    const key = `notification_seen_${notification.created_at}`;
    const seen = sessionStorage.getItem(key);

    if(!seen){
      setOpen(true);
      sessionStorage.setItem(key, "true");
    }
  }, [notification]);

  if(!open || !notification) return null;

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">

        <h2 className="text-xl font-bold mb-2">
          {notification.title}
        </h2>

        <p className="text-gray-600 mb-4">
          {notification.message}
        </p>

        <p className="text-xs text-gray-400 mb-4">
          {new Date(notification.created_at).toLocaleDateString()}
        </p>

        <button
          onClick={()=>setOpen(false)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

    </div>

  )
}