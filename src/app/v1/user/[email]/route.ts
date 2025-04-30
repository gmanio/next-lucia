import { AppDataSource, UserEntity } from "@/lib";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
): Promise<Response> {
  const data = request.json();
  const headersList = await headers();
  const referer = headersList.get("referer");
  console.log(referer);
  const { email } = await params; // 'a', 'b', or 'c'

  let user = null;
  try {
    if (AppDataSource.isInitialized === false) {
      await AppDataSource.initialize();
    }

    user = await AppDataSource.getRepository(UserEntity).findOne({
      where: {
        email: email,
      },
    });

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ data: e }, { status: 500 });
  }
}
