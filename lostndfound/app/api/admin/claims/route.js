
import { NextResponse } from "next/server";
import { authmiddleware } from "../../../middleware/authmiddleware";
import { prisma } from "../../../db/db";


export async function GET(req) {
const authResult=await authmiddleware(req)
 const claims=prisma.claim.findMany({
    where:{
         adminStatus: "PENDING"
    },
    include:{
      match:{
        lostItem:true,
        foundItem:true
      },
      claimAnswers:true,
      claimer:{
       id:true, name:true, email:true
      }
    }
 })
 return NextResponse.json({
    claims
 })
}
