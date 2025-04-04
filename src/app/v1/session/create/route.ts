import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { Lucia } from "lucia";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import mysql from "mysql2/promise";

// const connection = await mysql.createConnection({
//   host: "152.67.202.155",
//   port: 3306,
//   user: "root",
//   password: "!wlakscjs87",
// });

const pool = mysql.createPool(
  "mysql://root:!Wlakscjs87@152.67.202.155:3306/auth"
);

const adapter = new Mysql2Adapter(pool, {
  user: "user",
  session: "user_session",
});

export async function POST(request: Request): Promise<Response> {
  const lucia = new Lucia(adapter);

  const session = lucia.getUserSessions("");
  console.log(session);
  return NextResponse.json({ data: "ok" }, { status: 200 });
}
