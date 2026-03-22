import pool from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Subscriptions(){

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if(!userCookie){
    return <div className="p-10 text-gray-600">Please login</div>;
  }

  const user = JSON.parse(userCookie.value);
  const flatId = user.flat_id;

  const records = await pool.query(
    `SELECT id,month,year,amount,status
     FROM monthly_records
     WHERE flat_id=$1`,
     [flatId]
  );

  return(

    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          <span className="text-purple-600">My</span> Subscriptions
        </h1>
        <p className="text-gray-500 mt-1">
          View and manage your monthly subscription records.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2 text-left font-semibold">Month</th>
              <th className="py-3 px-2 text-left font-semibold">Year</th>
              <th className="py-3 px-2 text-left font-semibold">Amount</th>
              <th className="py-3 px-2 text-left font-semibold">Status</th>
              <th className="py-3 px-2 text-left font-semibold">Details</th>
            </tr>
          </thead>

          <tbody>

            {records.rows.map((r:any)=>{

              const monthName = new Date(2000, r.month - 1).toLocaleString("en-IN", {
                month: "long"
              });

              return(
                <tr key={r.id} className="border-b hover:bg-gray-50 transition">

                  <td className="py-3 px-2 text-gray-800">{monthName}</td>
                  <td className="py-3 px-2 text-gray-700">{r.year}</td>
                  <td className="py-3 px-2 text-gray-800 font-medium">₹ {r.amount}</td>

                  <td className="py-3 px-2">
                    {r.status==="paid"
                      ? <span className="text-purple-600 font-medium">Paid</span>
                      : <span className="text-red-500 font-medium">Pending</span>}
                  </td>

                  <td className="py-3 px-2">
                    <Link
                      href={`/subscriptions/${r.id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium transition"
                    >
                      View
                    </Link>
                  </td>

                </tr>
              )
            })}

          </tbody>

        </table>

      </div>

    </div>

  )
}