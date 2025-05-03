import { AccountEntity, AppDataSource, UserEntity } from "@/lib";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
  // const data = request.json();
  const headersList = await headers();
  const token = headersList.get("Authorization") ?? "";

  console.log("request_token", token);
  if (!token) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  try {
    if (AppDataSource.isInitialized === false) {
      await AppDataSource.initialize();
    }

    const account = await AppDataSource.getRepository(AccountEntity).findOne({
      where: {
        access_token: token,
      },
    });

    if (account) {
      const user = await AppDataSource.getRepository(UserEntity).findOne({
        where: {
          id: account?.userId,
        },
      });

      return NextResponse.json({ data: user }, { status: 200 });
    }

    return NextResponse.json({ data: null }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ data: e }, { status: 500 });
  }
}
