import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../prisma/db-init';
import crypto from "crypto";
import { EventStatusEnum } from '@/generated/prisma';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { status: 'success', message: "API Midtrans Ready" },
    { status: 200 }
  );
};

export async function POST(req: NextRequest) {
  try{
    const reqData = await req.json();
    
    const tr_id = reqData.order_id;
    const getTrData = await db.tr.findUnique({
      where: { tr_id }
    });

    if(getTrData === null) throw new Error("Transaction event data not found!");

    const serverKey = process.env.NEXT_PUBLIC_MT_SERVER_KEY || null;
    if(serverKey === null) throw new Error("Midtrans Server Key data not found!");

    const rawSignature = reqData.order_id + reqData.status_code + reqData.gross_amount + serverKey;
    const createHash = crypto.createHash('sha512').update(rawSignature).digest('hex');

    if(createHash !== reqData.signature_key) throw new Error("Signature key not match!");
    
    const payAt = new Date(reqData.transaction_time);
    const paymentType = reqData.payment_type;

    let trUpdateData: any = {
      pay_status: true,
      pay_at: payAt,
    };

    if (paymentType == "bank_transfer"){
      const vaNumber = reqData.va_numbers !== undefined && reqData.va_numbers !== null ? reqData.va_numbers[0] : null;
      const permataVa = reqData.permata_va_number ?? null;

      if(vaNumber !== null) {
        trUpdateData.pay_type = vaNumber.bank;
        trUpdateData.pay_va = vaNumber.va_number;
      } else {
        trUpdateData.pay_type = permataVa ? "Permata" : null;
        trUpdateData.pay_va = permataVa;
      }
    } else if (paymentType == "echannel") {
      trUpdateData.pay_type = "Mandiri";
      trUpdateData.pay_bill_key = reqData.bill_key ?? null;
      trUpdateData.pay_bill_code = reqData.biller_code ?? null;
    } else if (paymentType == "gopay") trUpdateData.pay_type = "Gopay";
    else if (paymentType == "qris") trUpdateData.pay_type = "Qris";

    await db.$transaction(async (tx) => {
      if (reqData.transaction_status == 'capture'){
        if (reqData.fraud_status == 'accept'){
          // TODO set transaction status on your database to 'success'
          // and response with 200 OK
          // PAID
  
          await Promise.all([
            tx.events.update({
              where: { id: getTrData.event_id },
              data: {
                tmp_status: EventStatusEnum.ACTIVE
              }
            }),

            tx.tr.update({
              where: { tr_id },
              data: trUpdateData
            }),
          ]);
          
          // EmailOrderTransaction(tr_id);
        }
      } else if (reqData.transaction_status == 'settlement'){
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        // PAID
        
          await Promise.all([
            tx.events.update({
              where: { id: getTrData.event_id },
              data: {
                tmp_status: EventStatusEnum.ACTIVE
              }
            }),

            tx.tr.update({
              where: { tr_id },
              data: trUpdateData
            }),
          ]);
  
        // EmailOrderTransaction(tr_id);
      }
      
      // else if (reqData.transaction_status == 'cancel' || reqData.transaction_status == 'deny' || reqData.transaction_status == 'expire'){
      //   // TODO set transaction status on your database to 'failure'
      //   // and response with 200 OK
      //   // CANCELED
      // } else if (reqData.transaction_status == 'pending'){
      //   // TODO set transaction status on your database to 'pending' / waiting payment
      //   // and response with 200 OK
      //   // NOT PAID or PANDING
      // }
    });

    return NextResponse.json(
      { status: 'success', message: "OK" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error Endpoint midtrans POST " + error.message);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 501 }
    );
  }
}