// import Image from "next/image";

import { signIn } from "@/app/api/auth/[...nextauth]/auth";

export default function Home() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
}
