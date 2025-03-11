"use client";
import * as arctic from "arctic";

const Page = () => {
  return (
    <>
      <h1
        onClick={() => {
          const clientId = process.env.NEXT_PUBLIC_KAKAO_LOGIN_CLIENT_ID ?? "";
          const redirectURI =
            process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URL || "";

          const searchParams = new URLSearchParams();
          searchParams.append("response_type", "code");
          searchParams.append("client_id", clientId);
          searchParams.append("state", arctic.generateState());
          searchParams.append("scope", ["account_email", "profile"].join("+"));
          searchParams.append("redirect_uri", redirectURI);
          const authUrl =
            "https://kauth.kakao.com/oauth/authorize?" +
            searchParams.toString();
          window.location.href = authUrl;
        }}
      >
        Sign in
      </h1>
      {/* <a href="/login/github">Sign in with GitHub</a> */}
    </>
  );
};

export default Page;
