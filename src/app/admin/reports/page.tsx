import pool from "@/lib/db";
import PendingPopup from "./PendingPopup";
import MonthlyBreakdownPopup from "./MonthlyBreakdownPopup";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {

  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const limit = 5;
  const offset = (page - 1) * limit;

  const totalCollection = await pool.query(
    `SELECT COALESCE(SUM(amount),0) as total FROM payments`
  );

  const pendingPayments = await pool.query(
    `SELECT COUNT(*) as pending FROM monthly_records WHERE status='pending'`
  );

  const pendingResidents = await pool.query(
    `SELECT f.owner_name,f.flat_number
     FROM monthly_records m
     JOIN flats f ON m.flat_id=f.id
     WHERE m.status='pending'`
  );

  const paymentModes = await pool.query(
    `SELECT p.payment_mode, f.owner_name, f.flat_number, p.amount, p.payment_date
     FROM payments p
     JOIN flats f ON p.flat_id=f.id
     ORDER BY p.payment_date DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const paymentModesCount = await pool.query(
    `SELECT COUNT(*) as count FROM payments`
  );

  const totalRows = parseInt(paymentModesCount.rows[0].count);
  const totalPages = Math.ceil(totalRows / limit);

  const monthlyCollection = await pool.query(
    `SELECT EXTRACT(MONTH FROM payment_date) as month,
            EXTRACT(YEAR FROM payment_date) as year,
            SUM(amount) as total
     FROM payments
     GROUP BY year,month
     ORDER BY year DESC,month DESC`
  );

  const monthlyBreakdown = await pool.query(
    `SELECT EXTRACT(MONTH FROM p.payment_date) as month,
          EXTRACT(YEAR FROM p.payment_date) as year,
          f.owner_name,
          p.payment_mode,
          SUM(p.amount) as total
   FROM payments p
   JOIN flats f ON p.flat_id=f.id
   GROUP BY year,month,f.owner_name,p.payment_mode`
  );

  return (

    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          <span className="text-green-600">Financial</span> Reports
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of collections, pending payments, and financial insights.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-10">

        {/* SUMMARY */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Summary
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">

            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-500">
                Total Collection
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹ {parseFloat(totalCollection.rows[0].total)}
              </p>
            </div>

            <PendingPopup
              pendingCount={pendingPayments.rows[0].pending}
              pendingResidents={pendingResidents.rows}
            />

          </div>
        </div>

        {/* PAYMENT MODES */}
        <div className="pt-8 border-t border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Payment Mode Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-600">
                  <th className="py-3">Owner</th>
                  <th>Flat</th>
                  <th>Mode</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paymentModes.rows.map((mode: any, index: number) => (
                  <tr key={index} className="hover:bg-green-50 transition">
                    <td className="py-3 font-medium text-gray-800">
                      {mode.owner_name}
                    </td>
                    <td>{mode.flat_number}</td>
                    <td>
                      <span className="px-2 py-1 rounded bg-gray-100 text-sm">
                        {mode.payment_mode}
                      </span>
                    </td>
                    <td className="font-semibold text-green-600">
                      ₹ {parseFloat(mode.amount)}
                    </td>
                    <td className="text-gray-600 text-sm">
                      {new Date(mode.payment_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="flex justify-between items-center mt-6">

            <a
              href={`?page=${page - 1}`}
              className={`px-4 py-2 rounded-lg ${page === 1
                ? "bg-gray-200 text-gray-400 pointer-events-none"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              Prev
            </a>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <a
              href={`?page=${page + 1}`}
              className={`px-4 py-2 rounded-lg ${page === totalPages
                ? "bg-gray-200 text-gray-400 pointer-events-none"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              Next
            </a>

          </div>

        </div>

        {/* MONTHLY WITH BREAKDOWN */}
        <div className="pt-8 border-t border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Monthly Collection
          </h2>

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600">
                <th className="py-3">Month</th>
                <th>Year</th>
                <th>Total</th>
                <th>Breakdown</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {monthlyCollection.rows.map((row: any, index: number) => {

                const breakdown = monthlyBreakdown.rows.filter(
                  (b: any) => b.month == row.month && b.year == row.year
                );

                return (
                  <tr key={index} className="hover:bg-green-50 transition">
                    <td className="py-3">
                      {new Date(0, row.month - 1).toLocaleString("default", { month: "long" })}
                    </td>
                    <td>{row.year}</td>
                    <td className="font-semibold text-green-600">
                      ₹ {parseFloat(row.total)}
                    </td>
                    <td>
                        <MonthlyBreakdownPopup data={breakdown} />
                    </td>
                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>

        {/* DOWNLOAD */}
        <div className="pt-6 border-t border-gray-200">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium">
            <a href="/api/admin/reports/download">
              Download Report (CSV)
            </a>
          </button>
        </div>

      </div>

    </div>
  )
}