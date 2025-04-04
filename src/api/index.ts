const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtYW5hZ2VyIjpmYWxzZSwiaXNzIjoiZXBpc29kZSIsIm5hbWUiOiLrsJXsp4Drp4wiLCJjbGllbnQiOiJlcGlzb2RlMiIsImlkIjoiZ092SjBYMUtqZ1JNZzZnZE54OUozMzU0NSIsImV4cCI6MTc1MDU3NDAxNiwic2VydmljZU1hbmFnZXIiOmZhbHNlfQ.FH5WU9yE87LhsjM53NbH5ABjjldwPxaeDGgy2XJsRoE";

export const getEnc = async () => {
  return await fetch("https://sapi-dev.epsd.co.kr/eppay/api/v1/enc/", {
    headers: {
      "x-access-token": token,
    },
  });
};

export const getSMS = async () => {
  return await fetch(
    "https://eppay-dev.epsd.co.kr/identityVerification/verificationNumberPrompt",
    {
      headers: {
        "x-access-token": token,
      },
    }
  );
};
