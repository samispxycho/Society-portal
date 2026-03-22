import pool from "@/lib/db";
import { cookies } from "next/headers";
import NotificationPopup from "@/components/NotificationPopup";

export default async function UserDashboard() {

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return (
      <div className="p-10 text-red-500 font-semibold">
        Please login first.
      </div>
    );
  }

  const user = JSON.parse(userCookie.value);
  const flatId = user.flat_id;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const flatDetails = await pool.query(
    `SELECT f.flat_number, f.flat_type, f.owner_name
     FROM flats f
     WHERE f.id=$1`,
    [flatId]
  );

  const flat = flatDetails.rows[0];

  const status = await pool.query(
    `SELECT status
     FROM monthly_records
     WHERE flat_id=$1 AND month=$2 AND year=$3
     LIMIT 1`,
    [flatId, currentMonth, currentYear]
  );

  const planRes = await pool.query(
    `SELECT amount FROM subscription_plans WHERE flat_type=$1`,
    [flat.flat_type]
  );

  const amount = planRes.rows[0].amount;

  const payments = await pool.query(
    `SELECT amount, payment_date, payment_mode
     FROM payments
     WHERE flat_id=$1
     ORDER BY payment_date DESC
     LIMIT 5`,
    [flatId]
  );

  const notifications = await pool.query(
    `SELECT title, message, created_at
     FROM notifications
     WHERE is_global = true OR flat_id = $1
     ORDER BY created_at DESC
     LIMIT 5`,
    [flatId]
  );

  const latestNotification = await pool.query(
    `SELECT title,message,created_at
     FROM notifications
     WHERE is_global = true OR flat_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [flatId]
  );

  const firstPayment = await pool.query(
    `SELECT payment_date
     FROM payments
     WHERE flat_id=$1
     ORDER BY payment_date ASC
     LIMIT 1`,
    [flatId]
  );

  let residentSince = "N/A";

  if (firstPayment.rows.length > 0) {
    const date = new Date(firstPayment.rows[0].payment_date);
    residentSince = date.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
  }

  const record = status.rows[0];

  return (
    <div className="max-w-8xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <NotificationPopup notification={latestNotification.rows[0]} />

      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800">
          <span className="text-purple-600">Resident</span> Dashboard
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Overview of your payments & updates
        </p>
      </div>

      {/* USER DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          My Details
        </h2>

        <div className="grid grid-cols-4 divide-x divide-gray-200 text-center">

          <div className="flex flex-col items-center px-4">
            <p className="text-gray-500 text-sm">Owner</p>
            <p className="font-semibold text-gray-800 mt-1">
              {flat.owner_name}
            </p>
          </div>

          <div className="flex flex-col items-center px-4">
            <p className="text-gray-500 text-sm">Flat Number</p>
            <p className="font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded mt-1">
              {flat.flat_number}
            </p>
          </div>

          <div className="flex flex-col items-center px-4">
            <p className="text-gray-500 text-sm">Flat Type</p>
            <p className="font-semibold text-gray-800 mt-1">
              {flat.flat_type}
            </p>
          </div>

          <div className="flex flex-col items-center px-4">
            <p className="text-gray-500 text-sm">Resident Since</p>
            <p className="font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded mt-1">
              {residentSince}
            </p>
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Current Amount</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ₹ {amount}
            </p>
          </div>
          <span className="text-3xl">💸</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Status</p>
            <p className={`text-3xl font-bold mt-2 ${
              record?.status === "paid"
                ? "text-green-600"
                : "text-red-500"
            }`}>
              {record?.status ?? "Pending"}
            </p>
          </div>
          <span className="text-3xl">📊</span>
        </div>

      </div>

      {/* MAIN */}
      <div className="grid grid-cols-3 gap-6">

        {/* PAYMENTS */}
        <div className="col-span-2 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Payments
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-gray-600">Amount</th>
                  <th className="px-6 py-4 text-gray-600">Mode</th>
                  <th className="px-6 py-4 text-gray-600">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {payments.rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.rows.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-purple-50 transition">
                      <td className="px-6 py-4 text-purple-600 font-semibold">
                        ₹ {p.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 border">
                          {p.payment_mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(p.payment_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notifications 🔔
          </h2>

          <ul className="space-y-3">
            {notifications.rows.length === 0 ? (
              <li className="text-gray-500">No notifications</li>
            ) : (
              notifications.rows.map((n:any,i:number)=>(
                <li key={i} className="border-b border-gray-100 pb-2">
                  <p className="font-semibold text-gray-800">
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))
            )}
          </ul>

        </div>

      </div>

    </div>
  );
}