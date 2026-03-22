import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req:Request){

  const data = await req.formData();

  const title = data.get("title");
  const message = data.get("message");
  const flat_id = data.get("flat_id");

  try{

    if(flat_id){

      await pool.query(
        `INSERT INTO notifications(title,message,flat_id,is_global)
         VALUES($1,$2,$3,false)`,
        [title,message,flat_id]
      );

    }else{

      await pool.query(
        `INSERT INTO notifications(title,message,is_global)
         VALUES($1,$2,true)`,
        [title,message]
      );

    }

    return NextResponse.redirect(
      new URL("/admin/notifications", req.url)
    );

  }catch(error){

    console.error(error);

    return NextResponse.json(
      {message:"Error sending notification"},
      {status:500}
    );

  }

}