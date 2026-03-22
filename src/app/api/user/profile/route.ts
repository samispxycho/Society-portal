import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(){

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if(!userCookie){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(userCookie.value);

  const result = await pool.query(
    "SELECT name,email,phone FROM users WHERE id=$1",
    [user.id]
  );

  return NextResponse.json(result.rows[0]);
}