

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
    adminStatus: "APPROVED"
  }
  })
  await prisma.notification.create({
  data: {
    userId: authResult.id,
    type: "CLAIM_APPROVED",
    title: "Claim Approved",
    message: "Your claim has been approved."
  }
});
await prisma.notification.create({
  data: {
    userId: authResult.id,
    type: "CLAIM_APPROVED",
    title: "Item Claim Approved",
    message: "A claim on your found item has been approved."
  }
});
  return NextResponse.json({
    claim
  },  {status:200})
}