// get user specific claims

import { NextResponse } from "next/server";
import { authmiddleware } from "../../../middleware/authmiddleware";
import { prisma } from "../../../db/db";
export async function GET(req) {
const authResult=await authmiddleware(req)
  const claims= await prisma.claim.findMany({
    where:{
        claimerId:authResult.id
    }
  })
  return NextResponse.json({
    claims
  },  {status:200})
}