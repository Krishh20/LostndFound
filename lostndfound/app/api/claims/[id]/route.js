

import { NextResponse } from "next/server";
import { authmiddleware } from "../../../middleware/authmiddleware";
import { prisma } from "../../../db/db";

// edit,delete
export async function GET(req, {params}) {
    const {id}=await params
const authResult=await authmiddleware(req)
  const claims= await prisma.claim.findFirst({
    where:{
         id:Number(id),
        claimerId:authResult.id
    }
  })
  return NextResponse.json({
    claims
  },  {status:200})
}
