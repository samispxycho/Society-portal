"use client";

import { useState } from "react";

export default function MonthlyBreakdownPopup({ data }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger (same look as "View") */}
      <button
        onClick={() => setOpen(true)}
        className="text-green-600 font-medium"
      >
        View
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[400px] max-h-[500px] overflow-y-auto shadow-lg">

            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Payment Breakdown
            </h3>

            <div className="space-y-3 text-sm">
              {data.map((item: any, i: number) => (
                <div key={i} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.owner_name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {item.payment_mode}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600">
                    ₹ {item.total}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}