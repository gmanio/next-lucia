// import { Kakao as KakaoProvider } from "arctic";

import { KakaoUser } from "@/@types";
import { connection } from "@/lib";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
import * as arctic from "arctic";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import JWT from "jsonwebtoken";

export const KakaoUserMeApi = "https://kapi.kakao.com/v2/user/me";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = (await url.searchParams.get("code")) ?? "";
  // const state = url.searchParams.get("state") ?? "";
  // const scopes = ["account_email", "profile"];

  const clientId = process.env.NEXT_PUBLIC_KAKAO_LOGIN_CLIENT_ID ?? "";
  const clientSecret = process.env.NEXT_PUBLIC_KAKAO_LOGIN_SECRET_KEY ?? "";
  const redirectURI = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URL || "";
  const kakaoProvider = new arctic.Kakao(clientId, clientSecret, redirectURI);
  try {
    const kakaoToken = await kakaoProvider.validateAuthorizationCode(code);
    const kakaoAccessToken = kakaoToken.accessToken();
    // const userProfile = kakaoToken.data;
    // const accessTokenExpiresAt = kakaoToken.accessTokenExpiresAt();
    // const refreshToken = kakaoToken.refreshToken();

    const userMeApiResponse = await fetch(KakaoUserMeApi, {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const loggedInUser: KakaoUser = await userMeApiResponse.json();
    // console.log(loggedInUser);
    // // TODO: implement session
    const redirect = NextResponse.redirect("http://localhost:3001/login", {
      status: 302,
    });

    const adapter = TypeORMAdapter(connection);

    if (adapter && adapter?.getUserByEmail) {
      const user = await adapter.getUserByEmail(
        loggedInUser.kakao_account.email
      );
      if (user) {
        if (adapter?.updateUser) {
          await adapter?.updateUser({
            id: user.id,
            image: loggedInUser.kakao_account.profile.thumbnail_image_url,
          });
        }

        if (adapter.unlinkAccount) {
          await adapter.unlinkAccount({
            provider: "kakao",
            providerAccountId: loggedInUser.id,
          });

          const access_token = JWT.sign({ email: user.email }, user.id, {
            expiresIn: "1d",
          });
          const refresh_token = JWT.sign({}, user.id, {
            expiresIn: "10d",
          });

          const account: AdapterAccount = {
            userId: user.id,
            type: "email",
            provider: "kakao",
            providerAccountId: loggedInUser.id,
            access_token: access_token,
            refresh_token: refresh_token,
          };

          if (adapter.linkAccount) {
            const resp = await adapter.linkAccount(account);
            console.log("linkedAccount", resp);
          }

          await redirect.cookies.set("atk", access_token, {
            httpOnly: false,
            path: "/",
            secure: false,
            sameSite: "lax",
          });

          return redirect;
        }
      }

      if (!user) {
        const resp: { account: AdapterAccount; user: AdapterUser } = await (
          await fetch("http://localhost:3001/v1/user/create", {
            method: "POST",
            body: JSON.stringify(loggedInUser),
          })
        ).json();
        console.log(resp);
        // if (AppDataSource.isInitialized === false) {
        //   await AppDataSource.initialize();
        // }

        // const createUser: AdapterUser & { phoneVerified: null | Date } = {
        //   email: loggedInUser.kakao_account.email,
        //   emailVerified: null,
        //   id: generateId(15),
        //   phoneVerified: new Date(),
        //   name: loggedInUser.kakao_account.profile.nickname,
        //   image: loggedInUser.kakao_account.profile.thumbnail_image_url,
        // };
        // const user = await AppDataSource.createQueryBuilder()
        //   .insert()
        //   .into(UserEntity)
        //   .values({
        //     id: createUser.id,
        //     name: createUser.name,
        //     email: createUser.email,
        //     emailVerified: new Date().toISOString(),
        //     phone: null,
        //     phoneVerified: new Date().toISOString(),
        //     image: createUser.image,
        //     role: null,
        //   })
        //   .execute();

        // console.log(user);

        // const account: AdapterAccount = {
        //   userId: user.id,
        //   type: "email",
        //   provider: "kakao",
        //   providerAccountId: loggedInUser.id,
        // };
        // const resp = await (adapter?.linkAccount &&
        //   adapter.linkAccount(account));
        // return NextuserMeApiResponse.json(resp, { status: 200 });
        // console.log(resp);
        await redirect.cookies.set("atk", resp?.account?.access_token ?? "", {
          httpOnly: false,
          path: "/",
          secure: false,
          sameSite: "lax",
        });

        return redirect;
      }
    }

    // const user = data[0];

    // if (!user) {
    //   return {
    //     message: "An error occurred while creating your account.",
    //   };
    // }

    // const res = await (adapter.createUser && adapter.createUser(user));
    // if (res?.id) {
    //   await (adapter.updateUser &&
    //     adapter.updateUser({
    //       id: res.id,
    //       emailVerified: new Date(),
    //       phoneVerified: new Date(),
    //     } as Partial<AdapterUser> & Pick<AdapterUser, "id">));
    // }

    return redirect;
  } catch (err) {
    console.error(err);
    const erroruserMeApiResponse = NextResponse.json(err, {
      // data: JSON.stringify(err),
      status: 500,
    });

    await erroruserMeApiResponse.cookies.set("rtk", "", {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      maxAge: 0,
    });

    await erroruserMeApiResponse.cookies.set("atk", "", {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      maxAge: 0,
    });

    return erroruserMeApiResponse;
  }

  // TODO: Replace this with your own DB query.
  // const existingUser = await getUserFromGitHubId(githubUserId);

  // if (existingUser !== null) {
  //   const sessionToken = generateSessionToken();
  //   const session = await createSession(sessionToken, existingUser.id);
  //   await setSessionTokenCookie(sessionToken, session.expiresAt);
  //   return new userMeApiResponse(null, {
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
  // (await cookies()).set("atk", kakaoAccessToken, {
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

export const deleteAccessTokenCookie = async (kakaoAccessToken: string) => {
  return (await cookies()).set("atk", kakaoAccessToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 0,
  });
};
