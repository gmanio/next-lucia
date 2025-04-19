import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { Lucia } from "lucia";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import mysql from "mysql2/promise";
import { generateId } from "lucia";

const pool = mysql.createPool(
  "mysql://root:!Wlakscjs87@152.67.202.155:3306/auth"
);

const adapter = new Mysql2Adapter(pool, {
  user: "user",
  session: "user_session",
});

// curl --request POST http://localhost:3000/v1/user/create

export async function POST(request: Request): Promise<Response> {
  return NextResponse.json({ data: id }, { status: 200 });
}
