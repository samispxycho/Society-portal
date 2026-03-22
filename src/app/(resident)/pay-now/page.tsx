import pool from "@/lib/db";
import { cookies } from "next/headers";

export default async function PayNow(){

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if(!userCookie){
    return <div className="p-10">Please login</div>;
  }

  const user = JSON.parse(userCookie.value);
  const flatId = user.flat_id;

  const pending = await pool.query(
    `SELECT id,month,year
     FROM monthly_records
     WHERE flat_id=$1 AND status='pending'
     ORDER BY year DESC, month DESC`,
     [flatId]
  );

  const getMonthName = (m:number) => {
    return new Date(2026, m - 1).toLocaleString("default", {
      month: "long",
    });
  };

  if(pending.rows.length === 0){
    return(
      <div className="max-w-xl mx-auto p-8 bg-gray-50 min-h-screen">

        <h1 className="text-4xl font-extrabold text-gray-800">
          <span className="text-purple-600">Pay</span> Subscription
        </h1>

        <div className="mt-8 bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
          <p className="text-green-600 font-semibold text-lg">
            🎉 No pending payments
          </p>

          <p className="text-gray-500 text-sm mt-3">
            You're all caught up. You can download your receipts anytime from the
            <a href="/subscriptions" className="font-medium text-purple-600 hover:underline"> Subscriptions </a>
            tab.
          </p>

        </div>

      </div>
    );
  }

  return(

    <div className="max-w-2xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-4xl font-extrabold text-gray-800">
          <span className="text-purple-600">Pay</span> Subscription
        </h1>
        <p className="text-gray-500 mt-1">
          Complete your pending monthly payments.
        </p>
      </div>

      <form
        action="/processing"
        method="GET"
        className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-6"
      >

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select Month
          </label>

          <select
            name="record_id"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
          >
            {pending.rows.map((r:any)=>(
              <option key={r.id} value={r.id}>
                {getMonthName(r.month)} {r.year}
              </option>
            ))}
          </select>
        </div>

        <input type="hidden" name="flat_id" value={flatId} />

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium">
          Pay Now (UPI)
        </button>

      </form>

    </div>

  )
}