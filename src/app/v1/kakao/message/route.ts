// https://kapi.kakao.com/v1/api/talk/friends/message/send
// curl -X POST "https://kapi.kakao.com/v1/api/talk/friends/message/send" \
// 	-H "Content-Type: application/x-www-form-urlencoded" \
// 	-H "Authorization: Bearer H0S0aE3uhMh5bkfp1e53apHFRy9MR6iJAAAAAQoXC2sAAAGWjDjq4cwhKCpFsUJR" \
// 	-d "receiver_uuids=%5B%5D&template_id=70402"

import { AppDataSource } from "@/lib";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  if (AppDataSource.isInitialized === false) {
    await AppDataSource.initialize();
  }

  //TODO: request kakao template message

  return NextResponse.json({ success: true });
}
