"use client";

import { useState } from "react";

export default function EditSubscription({
  id,
  amount
}:{
  id:number;
  amount:number;
}){

  const [value,setValue] = useState(amount);
  const [loading,setLoading] = useState(false);

  const updateSubscription = async () => {

    setLoading(true);

    try{

      await fetch("/api/subscriptions",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          id,
          amount:value
        })
      });

      window.location.reload();

    }catch(error){
      console.error(error);
    }

    setLoading(false);
  };

  return(

    <div className="flex items-center gap-2">

      <input
        type="number"
        value={value}
        onChange={(e)=>setValue(Number(e.target.value))}
        className="border p-1 rounded w-24"
      />

      <button
        onClick={updateSubscription}
        className="bg-indigo-600 text-white px-3 py-1 rounded hover:cursor-pointer"
      >
        {loading ? "Saving..." : "Update"}
      </button>

    </div>

  );
}