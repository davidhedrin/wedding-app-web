import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../prisma/db-init';
import crypto from "crypto";
import { EventStatusEnum, Prisma } from '@/generated/prisma';

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

    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      if (reqData.transaction_status == 'capture'){
        if (reqData.fraud_status == 'accept'){
          // TODO set transaction status on your database to 'success'
          // and response with 200 OK
          // PAID
  
          tx.tr.update({
            where: { tr_id },
            data: {
              pay_status: true,
              pay_at: payAt,
            }
          });
          
          tx.events.update({
            where: { id: getTrData.event_id },
            data: {
              tmp_status: EventStatusEnum.ACTIVE
            }
          });
  
          // EmailOrderTransaction(tr_id);
        }
      } else if (reqData.transaction_status == 'settlement'){
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        // PAID
        
        tx.tr.update({
          where: { tr_id },
          data: {
            pay_status: true,
            pay_at: payAt,
          }
        });
          
        tx.events.update({
          where: { id: getTrData.event_id },
          data: {
            tmp_status: EventStatusEnum.ACTIVE
          }
        });
  
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