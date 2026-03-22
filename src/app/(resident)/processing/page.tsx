"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Processing(){

  const params = useSearchParams();

  useEffect(() => {

    const record_id = params.get("record_id");
    const flat_id = params.get("flat_id");

    const timer = setTimeout(() => {

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/payments/manual";

      const input1 = document.createElement("input");
      input1.type = "hidden";
      input1.name = "record_id";
      input1.value = record_id || "";

      const input2 = document.createElement("input");
      input2.type = "hidden";
      input2.name = "flat_id";
      input2.value = flat_id || "";

      form.appendChild(input1);
      form.appendChild(input2);

      document.body.appendChild(form);
      form.submit();

    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  return(

    <div className="bg-gray-50 min-h-screen">

      <div className="max-w-2xl mx-auto p-8 space-y-8">

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            <span className="text-purple-600">Pay</span> Subscription
          </h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center space-y-6">

          {/* Loader */}
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>

          <p className="text-purple-600 font-semibold text-lg">
            🔒 Payment Processing...
          </p>

          <p className="text-gray-500 text-sm">
            Paying securely via Razorpay. Please do not refresh or close this page.
          </p>

        </div>

      </div>

    </div>

  );
}