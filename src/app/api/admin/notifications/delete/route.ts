import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request){

  const data = await req.formData();
  const id = data.get("id");

  try{

    await pool.query(
      `DELETE FROM notifications WHERE id=$1`,
      [id]
    );

    return NextResponse.redirect(
      new URL("/admin/notifications", req.url)
    );

  }catch(err){

    console.error(err);

    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );

  }
}