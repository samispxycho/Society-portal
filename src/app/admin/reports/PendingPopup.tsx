"use client";

import { useState } from "react";

export default function PendingPopup({pendingCount,pendingResidents}:any){

  const [show,setShow] = useState(false);

  return(

    <>
      <div
        onClick={()=>setShow(true)}
        className="bg-white p-6 rounded-xl shadow cursor-pointer"
      >
        <h2 className="text-gray-500">
          Pending Payments
        </h2>

        <p className="text-2xl font-bold mt-2">
          {pendingCount}
        </p>
      </div>

      {show && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h2 className="text-xl font-semibold mb-4">
              Pending Residents
            </h2>

            <ul className="space-y-2">

              {pendingResidents.map((r:any,index:number)=>(
                <li key={index} className="flex justify-between border-b py-2">
                  <span>{r.owner_name}</span>
                  <span>{r.flat_number}</span>
                </li>
              ))}

            </ul>

            <button
              onClick={()=>setShow(false)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </>
  )
}