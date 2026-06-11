

import { NextResponse } from "next/server";
import { authmiddleware } from "../../../../../middleware/authmiddleware";
import { prisma } from "../../../../../db/db";
//middleware
export async function PATCH(req, {params}) {
    const {id}=await params
const authResult=await authmiddleware(req)
  const claim= await prisma.claim.update({
    where:{
         id:Number(id),
    },
      data: {
    adminStatus: "REJECTED"
  }
  })

  await prisma.notification.create({
  data: {
    userId: authResult.id,
    type: "CLAIM_REJECTED",
    title: "Claim Rejected",
    message: "Your claim was rejected."
  }
});

  return NextResponse.json({
    claim
  },  {status:200})
}