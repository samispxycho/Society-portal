import pool from "@/lib/db";
import MonthlyChart from "@/components/MonthlyChart";

export default async function AdminDashboard() {

  const flatsResult = await pool.query("SELECT COUNT(*) FROM flats");
  const residentsResult = await pool.query("SELECT COUNT(*) FROM users WHERE role='resident'");
  const collectionResult = await pool.query("SELECT COALESCE(SUM(amount),0) FROM payments");
  const pendingResult = await pool.query("SELECT COUNT(*) FROM monthly_records WHERE status='pending'");

  const monthlyGraph = await pool.query(
    `SELECT 
      TO_CHAR(payment_date, 'Mon') as month,
      SUM(amount) as total
     FROM payments
     GROUP BY month, DATE_TRUNC('month', payment_date)
     ORDER BY DATE_TRUNC('month', payment_date)`
  );

  const recentPayments = await pool.query(
    `SELECT 
      f.flat_number,
      f.owner_name,
      p.amount,
      p.payment_mode,
      p.payment_date
     FROM payments p
     JOIN flats f ON p.flat_id = f.id
     ORDER BY p.payment_date DESC
     LIMIT 5`
  );

  const pendingFlats = await pool.query(
    `SELECT f.flat_number, f.owner_name, m.amount
     FROM monthly_records m
     JOIN flats f ON m.flat_id = f.id
     WHERE m.status='pending'
     LIMIT 5`
  );

  const notifications = await pool.query(
    `SELECT title,message,created_at
     FROM notifications
     ORDER BY created_at DESC
     LIMIT 5`
  );

  const chartData = monthlyGraph.rows.map((row: any) => ({
    month: row.month,
    total: Number(row.total)
  }));

  const totalFlats = Number(flatsResult.rows[0].count);
  const totalResidents = Number(residentsResult.rows[0].count);
  const totalCollection = Number(collectionResult.rows[0].coalesce);
  const pendingPayments = Number(pendingResult.rows[0].count);

  return (
    <div className="max-w-8xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800">
          <span className="text-green-600">Admin</span> Dashboard
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Overview of your society’s financial health
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-base text-gray-500">Flats</p>
            <p className="text-3xl font-bold mt-2">{totalFlats}</p>
          </div>
          <span className="text-3xl">🏢</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-base text-gray-500">Collection</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹ {totalCollection}
            </p>
          </div>
          <span className="text-3xl">💰</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-base text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {pendingPayments}
            </p>
          </div>
          <span className="text-3xl">⚠️</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-base text-gray-500">Residents</p>
            <p className="text-3xl font-bold mt-2">{totalResidents}</p>
          </div>
          <span className="text-3xl">👥</span>
        </div>

      </div>

      {/* MAIN */}
      <div className="grid grid-cols-3 gap-6">

        {/* RECENT PAYMENTS */}
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
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Flat</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Owner</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mode</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentPayments.rows.map((p: any, i: number) => (
                  <tr key={i} className="hover:bg-green-50 transition">

                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                        {p.flat_number}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {p.owner_name}
                    </td>

                    <td className="px-6 py-4 text-green-600 font-semibold">
                      ₹{p.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        {p.payment_mode}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(p.payment_date).toLocaleDateString()}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

        {/* GRAPH */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Graph
          </h2>

          <div className="h-[300px]">
            <MonthlyChart data={chartData} />
          </div>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* PENDING */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pending Payments
          </h2>

          <ul className="space-y-3">
            {pendingFlats.rows.map((f: any, i: number) => (
              <li key={i} className="flex justify-between border-b border-gray-100 pb-2">

                <div>
                  <p className="font-medium">{f.flat_number}</p>
                  <p className="text-sm text-gray-500">
                    {f.owner_name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-red-500 text-sm font-medium">
                    ₹ {f.amount || 0}
                  </p>
                  <span className="text-xs text-red-500">
                    Pending
                  </span>
                </div>

              </li>
            ))}
          </ul>

        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="space-y-4">

            <a href="/admin/flats" className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              <p className="font-medium text-gray-800">Add Flat 🏠</p>
              <p className="text-xs text-gray-500">Register new flat</p>
            </a>

            <a href="/admin/payment-entry" className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              <p className="font-medium text-gray-800">Record Payment 💳</p>
              <p className="text-xs text-gray-500">Add payment entry</p>
            </a>

            <a href="/admin/reports" className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              <p className="font-medium text-gray-800">View Reports 📊</p>
              <p className="text-xs text-gray-500">Check analytics</p>
            </a>

          </div>

        </div>

      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Notifications
        </h2>

        <ul className="space-y-3">
          {notifications.rows.map((n: any, i: number) => (
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
          ))}
        </ul>

      </div>

    </div>
  );
}