import pool from "@/lib/db";
import { cookies } from "next/headers";

export default async function SubscriptionDetails(
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const recordId = parseInt(id);

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return <div className="p-10 text-red-500">Please login first</div>;
  }

  const user = JSON.parse(userCookie.value);
  const flatId = user.flat_id;

  const record = await pool.query(
    `SELECT month, year, amount, status
     FROM monthly_records
     WHERE id=$1 AND flat_id=$2`,
    [recordId, flatId]
  );

  if (record.rows.length === 0) {
    return <div className="p-10 text-red-500">Subscription record not found</div>;
  }

  const r = record.rows[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthName = monthNames[parseInt(r.month) - 1];

  const payment = await pool.query(
    `SELECT id, amount, payment_date, payment_mode
     FROM payments
     WHERE monthly_record_id=$1 AND flat_id=$2
     LIMIT 1`,
    [recordId, flatId]
  );

  const p = payment.rows[0];

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // ✅ Transaction ID instead of receipt number
  const transactionId = p ? `TXN-${p.id}` : "N/A";

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          <span className="text-purple-600">Subscription</span> Details
        </h1>
        <p className="text-gray-500 mt-1">
          View detailed information about your subscription and payments.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6 text-white text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Payment Receipt</h2>
          <p className="text-purple-100 text-sm mt-1">Official Payment Confirmation</p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          
          {/* Info Row */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Transaction ID</p>
              <p className="text-lg font-mono font-bold text-gray-800">{transactionId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Generated On</p>
              <p className="text-sm font-medium text-gray-700">{currentDate}</p>
              <p className="text-xs text-gray-500">{currentTime}</p>
            </div>
          </div>

          {/* Subscription Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-purple-600 pl-3 mb-4">
              Subscription Details
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Flat ID</p>
                <p className="text-lg font-semibold text-gray-800">{flatId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Month</p>
                <p className="text-base text-gray-700">{monthName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Year</p>
                <p className="text-base text-gray-700">{r.year}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {r.status === "paid" && p && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-purple-600 pl-3 mb-4">
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Amount Paid</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹ {p.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Mode</p>
                  <p className="text-base font-medium text-gray-800">{p.payment_mode}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Date</p>
                  <p className="text-base text-gray-700">
                    {new Date(p.payment_date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Payment Status</span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                r.status === "paid" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {r.status === "paid" ? "✓ PAID" : "✗ PENDING"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-xs text-gray-400">
              This is a computer-generated receipt and does not require a signature.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Thank you for your payment!
            </p>
          </div>

        </div>
      </div>

      {/* Download Button */}
      {r.status === "paid" && (
        <div className="flex justify-center">
          <a
            href={`/subscriptions/${recordId}/download`}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition shadow-md font-medium text-lg"
          >
            Download Receipt (CSV)
          </a>
        </div>
      )}

    </div>
  );
}