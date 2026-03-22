import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request){

  const { oldPassword, newPassword } = await req.json();

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if(!userCookie){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(userCookie.value);

  try{

    const result = await pool.query(
      "SELECT password FROM users WHERE id=$1",
      [user.id]
    );

    if(result.rows[0].password !== oldPassword){
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE users SET password=$1 WHERE id=$2",
      [newPassword, user.id]
    );

    return NextResponse.json({ message: "Password updated successfully" });

  }catch(error){

    return NextResponse.json(
      { message: "Error updating password" },
      { status: 500 }
    );

  }
}