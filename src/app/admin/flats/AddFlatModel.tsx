"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function AddFlatButton(){

  const [open,setOpen] = useState(false);
  const [flatType,setFlatType] = useState("");
  const [allFlats,setAllFlats] = useState<any[]>([]);
  const [filteredFlats,setFilteredFlats] = useState<any[]>([]);

  // fetch available flats
  useEffect(()=>{
    fetch("/api/flats/available")
      .then(res=>res.json())
      .then(data=>{
        setAllFlats(data);
      });
  },[]);

  // filter when type changes
  useEffect(()=>{
    if(flatType){
      const filtered = allFlats.filter(
        (f:any)=>f.flat_type === flatType
      );
      setFilteredFlats(filtered);
    }
  },[flatType,allFlats]);

  return(
    <>
      <button
        onClick={()=>setOpen(true)}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md cursor-pointer"
      >
        <Plus size={18}/>
        Add Flat
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white p-6 rounded-xl w-96 space-y-4">

            <h2 className="text-xl font-bold">
              Add Flat
            </h2>

            <form
              onSubmit={async (e:any)=>{
                e.preventDefault();

                const form = new FormData(e.target);

                await fetch("/api/flats",{
                  method:"POST",
                  headers:{ "Content-Type":"application/json" },
                  body:JSON.stringify({
                    flat_number:form.get("flat_number"),
                    owner_name:form.get("owner_name"),
                    email:form.get("email"),
                    phone:form.get("phone"),
                    flat_type:form.get("flat_type")
                  })
                });

                window.location.reload();
              }}
              className="space-y-3"
            >

              {/* FLAT TYPE */}
              <select
                name="flat_type"
                onChange={(e)=>setFlatType(e.target.value)}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Select Flat Type</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
              </select>

              {/* FLAT NUMBER */}
              <select
                name="flat_number"
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Select Flat</option>

                {filteredFlats.length === 0 ? (
                  <option disabled>No available flats</option>
                ) : (
                  filteredFlats.map((f:any)=>(
                    <option key={f.flat_number} value={f.flat_number}>
                      {f.flat_number}
                    </option>
                  ))
                )}

              </select>

              <input name="owner_name" placeholder="Owner Name" className="border p-2 w-full rounded" required/>

              <input name="email" placeholder="Email" className="border p-2 w-full rounded" required/>

              <input name="phone" placeholder="Phone" className="border p-2 w-full rounded" required/>

              <div className="flex gap-3 pt-2">

                <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                  Save
                </button>

                <button
                  type="button"
                  onClick={()=>setOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </>
  )
}