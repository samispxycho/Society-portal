import pool from "@/lib/db";
import { Trash2 } from "lucide-react";

export default async function NotificationsPage(){

  const flats = await pool.query(
    `SELECT id,flat_number FROM flats ORDER BY flat_number`
  );

  const notifications = await pool.query(
    `SELECT id,title,message,created_at
     FROM notifications
     ORDER BY created_at DESC`
  );

  return(

    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          <span className="text-green-600">Send</span> Notification
        </h1>
        <p className="text-gray-500 mt-1">
          Create and manage notifications for residents.
        </p>
      </div>

      {/* Send Notification */}

      <form
        action="/api/admin/notifications"
        method="POST"
        className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-6"
      >

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Title
          </label>
          <input
            name="title"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Message
          </label>
          <textarea
            name="message"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Send To
          </label>

          <select
            name="flat_id"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition"
          >
            <option value="">All Residents</option>

            {flats.rows.map((f:any)=>(
              <option key={f.id} value={f.id}>
                {f.flat_number}
              </option>
            ))}
          </select>

        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium">
          Send Notification
        </button>

      </form>

      {/* Notifications List */}

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Sent Notifications
        </h2>

        <ul className="space-y-4">

          {notifications.rows.map((n:any)=>(
            <li
              key={n.id}
              className="flex justify-between items-start border border-gray-100 rounded-lg p-4 hover:bg-green-50 transition"
            >

              <div>
                <p className="font-semibold text-gray-800">
                  {n.title}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {n.message}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>

              <form
                action="/api/admin/notifications/delete"
                method="POST"
              >
                <input type="hidden" name="id" value={n.id} />

                <button
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </form>

            </li>
          ))}

        </ul>

      </div>

    </div>

  )
}