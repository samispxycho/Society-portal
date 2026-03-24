"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteFlatButton({ id }: { id: number }) {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    await fetch("/api/flats/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setLoading(false);
    setOpen(false);
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
        title="Delete Flat"
      >
        <Trash2 size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">

            <h2 className="text-lg font-semibold mb-2">
              Delete Flat
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this flat? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}