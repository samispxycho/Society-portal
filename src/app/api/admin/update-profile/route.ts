import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request){

  try{

    const { name, email, phone } = await req.json();

    if(!name || !email || !phone){
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if(!userCookie){
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);

    // ✅ CRITICAL FIX
    if(user.role !== "admin"){
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    await pool.query(
      `UPDATE users
       SET name=$1, email=$2, phone=$3
       WHERE id=$4`,
      [name, email, phone, user.id]
    );

    return NextResponse.json({
      message: "Profile updated successfully"
    });

  }catch(error){

    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}