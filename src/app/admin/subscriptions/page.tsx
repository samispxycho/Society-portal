import pool from "@/lib/db";
import EditSubscription from "./EditSubscription";

export default async function SubscriptionsPage() {
  const plans = await pool.query(
    `SELECT id, flat_type, amount
     FROM subscription_plans
     ORDER BY flat_type`
  );

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          <span className="text-green-600">Subscription</span> Plans
        </h1>
        <p className="text-gray-500 mt-1">
          Manage maintenance pricing for different flat types.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-6">

        {/* Plans List */}
        <div className="space-y-6">

          {plans.rows.map((plan: any, index: number) => (
            <div
              key={plan.id}
              className={`flex items-center justify-between pb-6 ${
                index !== plans.rows.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >

              {/* Left */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {plan.flat_type}
                </h3>
                <p className="text-sm text-gray-500">
                  Monthly Maintenance
                </p>
              </div>

              {/* Middle */}
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  ₹{plan.amount}
                </div>
                <div className="text-xs text-gray-400">
                  ₹{(Number(plan.amount) * 12).toLocaleString()} yearly
                </div>
              </div>

              {/* Right */}
              <EditSubscription id={plan.id} amount={plan.amount} />

            </div>
          ))}

        </div>

        {/* Summary */}
        <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-sm">

          <div className="flex items-center gap-4">
            <span className="text-gray-500">Total Plans:</span>
            <span className="font-semibold text-gray-800">
              {plans.rows.length}
            </span>

            <span className="w-px h-4 bg-gray-300"></span>

            <span className="text-gray-500">Range:</span>
            <span className="font-semibold text-gray-800">
              ₹{Math.min(...plans.rows.map((p) => Number(p.amount)))} - ₹
              {Math.max(...plans.rows.map((p) => Number(p.amount)))}
            </span>
          </div>

          {/* Date */}
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
            {currentDate}
          </div>

        </div>

      </div>

    </div>
  );
}