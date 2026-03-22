import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request){

  const { name, email, phone } = await req.json();

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if(!userCookie){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(userCookie.value);

  try{

    await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4`,
      [name,email,phone,user.id]
    );

    return NextResponse.json({ message: "Profile updated successfully" });

  }catch(error){

    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );

  }

}