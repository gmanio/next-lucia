// import { Kakao as KakaoProvider } from "arctic";

import { connection } from "@/lib";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
import * as arctic from "arctic";
import { generateId } from "lucia";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const KakaoUserMeApi = "https://kapi.kakao.com/v2/user/me";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = (await url.searchParams.get("code")) ?? "";
  // const state = url.searchParams.get("state") ?? "";
  // const scopes = ["account_email", "profile"];

  const clientId = process.env.NEXT_PUBLIC_KAKAO_LOGIN_CLIENT_ID ?? "";
  const clientSecret = process.env.NEXT_PUBLIC_KAKAO_LOGIN_SECRET_KEY ?? "";
  const redirectURI = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URL || "";
  const kakaoProvider = new arctic.Kakao(clientId, clientSecret, redirectURI);
  try {
    const tokens = await kakaoProvider.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const userProfile = tokens.data;
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
    const refreshToken = tokens.refreshToken();
    const adapter = TypeORMAdapter(connection);

    const response = await fetch(KakaoUserMeApi, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const loggedInUser = await response.json();
    // // TODO: implement session
    const redirect = NextResponse.redirect("http://localhost:3001/login", {
      status: 302,
    });

    // const user = await adapter.getUserByEmail(loggedInUser.kakao_account.email);
    const user: AdapterUser & { phoneVerified: null | Date } = {
      email: loggedInUser.kakao_account.email,
      emailVerified: null,
      id: generateId(15),
      phoneVerified: new Date(),
      name: loggedInUser.kakao_account.profile.nickname,
      image: loggedInUser.kakao_account.profile.thumbnail_image_url,
    };

    const res = await (adapter.createUser && adapter.createUser(user));
    // const authenticator = adapter.createAuthenticator({ id: "123456" });
    const account: AdapterAccount = {
      userId: user.id,
      type: "email",
      provider: "kakao",
      providerAccountId: loggedInUser.id,
    };
    const resp = await (adapter?.linkAccount && adapter.linkAccount(account));
    console.log(resp);
    debugger;

    // await redirect.cookies.set("rtk", refreshToken, {
    //   httpOnly: true,
    //   path: "/",
    //   secure: true,
    //   sameSite: "lax",
    // });

    await redirect.cookies.set("atk", accessToken, {
      httpOnly: false,
      path: "/",
      secure: false,
      sameSite: "lax",
      maxAge: 60,
    });

    return redirect;
  } catch (err) {
    console.error(err);
    const errorResponse = NextResponse.json(err, {
      // data: JSON.stringify(err),
      status: 500,
    });

    await errorResponse.cookies.set("rtk", "", {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      maxAge: 0,
    });

    await errorResponse.cookies.set("atk", "", {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      maxAge: 0,
    });

    return errorResponse;
  }

  // TODO: Replace this with your own DB query.
  // const existingUser = await getUserFromGitHubId(githubUserId);

  // if (existingUser !== null) {
  //   const sessionToken = generateSessionToken();
  //   const session = await createSession(sessionToken, existingUser.id);
  //   await setSessionTokenCookie(sessionToken, session.expiresAt);
  //   return new Response(null, {
  //     status: 302,
  //     headers: {
  //       Location: "/",
  //     },
  //   });
  // }

  // TODO: Replace this with your own DB query.
  // const user = await createUser(githubUserId, githubUsername);

  // const sessionToken = generateSessionToken();
  // const session = await createSession(sessionToken, user.id);
  // await setSessionTokenCookie(sessionToken, session.expiresAt);

  //   cookies().set("github_oauth_state", state, {
  //     path: "/",
  //     secure: process.env.NODE_ENV === "production",
  //     httpOnly: true,
  //     maxAge: 60 * 10,
  //     sameSite: "lax",
  //   });
  // (await cookies()).set("atk", accessToken, {
  //   httpOnly: true,
  //   path: "/",
  //   secure: true,
  //   sameSite: "lax",
  //   expires: accessTokenExpiresAt,
  // });
}

// export function generateSessionToken(): string {
//   const tokenBytes = new Uint8Array(20);
//   crypto.getRandomValues(tokenBytes);
//   const token = encodeBase32(tokenBytes).toLowerCase();
//   return token;
// }

export const deleteAccessTokenCookie = async (accessToken: string) => {
  return (await cookies()).set("atk", accessToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 0,
  });
};
