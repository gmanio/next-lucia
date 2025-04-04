import { getEnc } from "@/api";
import JSEncrypt from "jsencrypt";
// import { useEffect } from "react";

// const queryParams = new URLSearchParams({
//   userSocNo: socialNum,
//   userNm: name,
//   sex: gender,
//   commId: getCarrier(currentCarrierIndex),
//   phoneNo: mobile,
//   foreigner: isForeigner,
//   mobilId: mobilId,
// }).toString();
// router.replace(`/identityVerification/verificationNumberPrompt?${queryParams}`);

// const getEnc = {
//   id: "202503172692222100655225142",
//   exponent: "10001",
//   modulus:
//     "cd9d594b709a8bef4e2983420b38834a8adc2adf2f7436d3b1c84ef135c430ffa2ade9ad4f8fb4d3479ac87df9d9883a4a2ccb203fd45f58456ce52e3a58408ada235b89c671454d7dcd8fd0a07726ba3c86ee409efacd4ee716183d8598a9ecc0b343cc5044986f73948f1efc91869692416b7c23e21f76e4a59ebf8eeed1b1",
// };

// const postAuthMutationHandler = async (msgType: string, mobilId: string) => {
//   const fetchedEncData = await getEnc();
//   if (fetchedEncData && fetchedEncData.body) {
//     const encryptedUserSocNo =
//       (await encrypt(
//         socialNum,
//         fetchedEncData.body.exponent,
//         fetchedEncData.body.modulus
//       )) || "";
//     const encryptedUserNm =
//       (await encrypt(
//         name,
//         fetchedEncData.body.exponent,
//         fetchedEncData.body.modulus
//       )) || "";
//     const encryptedSex =
//       (await encrypt(
//         gender,
//         fetchedEncData.body.exponent,
//         fetchedEncData.body.modulus
//       )) || "";
//     const encryptedCommId =
//       (await encrypt(
//         getCarrier(currentCarrierIndex),
//         fetchedEncData.body.exponent,
//         fetchedEncData.body.modulus
//       )) || "";
//     const encryptedPhoneNo =
//       (await encrypt(
//         mobile,
//         fetchedEncData.body.exponent,
//         fetchedEncData.body.modulus
//       )) || "";
//     const encryptedForeigner =
//       (await encrypt(
//         isForeigner,
//         fetchedEncData.body.exponent,
//         fetchedEncData.body.modulus
//       )) || "";

//     const encryptedMobilId =
//       (await encrypt(
//         mobilId,
//         fetchedEncData.body.exponent,
//         fetchedEncData.body.modulus
//       )) || "";

//     postAuthMutation.mutate({
//       xEncId: fetchedEncData.body.id,
//       msgType: msgType,
//       userSocNo: encryptedUserSocNo,
//       userNm: encryptedUserNm,
//       sex: encryptedSex,
//       commId: encryptedCommId,
//       phoneNo: encryptedPhoneNo,
//       foreigner: encryptedForeigner,
//       mobilId: encryptedMobilId,
//       smsVal: "",
//     });
//   }
// };

// export const encrypt = async (
//   data: string,
//   exponent: string,
//   modulus: string
// ) => {
//   if (typeof window !== "undefined") {
//     const JSEncrypt = (await import("jsencrypt")).default;
//     const jsEncrypt = new JSEncrypt();
//     const publicKey = jsEncrypt.getKey();
//     publicKey.setPublic(modulus, exponent);

//     const encryptedData = publicKey.encrypt(data);
//     return encryptedData;
//   }
//   return null;
// };

// {
//     "id": "202503178009398149373911026",
//     "exponent": "10001",
//     "modulus": "87de93d579ceb1c9e70e3b22f69db73849a5855c0c53fcc3601f2ed0f3f92a44da6db07e8171807eac9316547956297d92d5fbeaf44b1754b28a4138fe849a4483069e44619291507cf32ad8bfea203c549653d32f8b20f5b7a6f01743fdecff92b627653560d92ee17fc0b7cc35466dbd8030962276e18b57a6a7671f1bd353"
// }
// 19870720
// 59429ec8d68ab801e21df7ea14e24a4c6370388ec1e6e50c73bd675093e1dbd66ba48586f3051fe80b43b0c8ef60ec9d9749ca8e2283d67953be2e5d1f47a9eac6561e1e180685706540016d924ca1f2e73b86ef6d55124ebd48f6f6c3a82eef33bbb98a6c0a7c46dcd65deb032166fcf65457f7976e0c9b585d67de0fd3cb51
export const Page = async () => {
  const { id, exponent, modulus } = await (await getEnc()).json();
  //   const handleSendAuthCode = () => {};
  //   console.log(data);
  const data = await encrypt("19870720", exponent, modulus);
  console.log(data);
  return (
    <div>
      <button>encrpyt</button>
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default Page;

export const encrypt = async (
  data: string,
  exponent: string,
  modulus: string
) => {
  //   const Pubkey = modulus + exponent;
  const jsEncrypt = new JSEncrypt();
  const publicKey = jsEncrypt.getKey();
  publicKey.setPublic(modulus.toString(), exponent.toString());

  //   publicKey.setPublic(modulus, exponent);
  //   console.log(publicKey);
  //   const encmsg = crypto
  //     .publicEncrypt(Pubkey, Buffer.from(data, "utf8"))
  //     .toString("base64");
  const encryptedData = await publicKey.encrypt(data);
  return encryptedData;
};
