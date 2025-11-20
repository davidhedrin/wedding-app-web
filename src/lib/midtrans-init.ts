import midtransClient from 'midtrans-client';

const options = {
  isProduction : process.env.NEXT_PUBLIC_IS_PRODUCTION === "true" || false,
  serverKey : process.env.NEXT_PUBLIC_MT_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MT_CLIENT_KEY || ""
};

const snapMidtrans = new midtransClient.Snap((options));
const coreMidtrans = new midtransClient.CoreApi((options));

export default {
  snap: snapMidtrans,
  core: coreMidtrans
};