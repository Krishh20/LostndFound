


import { NextResponse } from "next/server";
import { authmiddleware } from "../../../../middleware/authmiddleware";
import { prisma } from "../../../../db/db";

export async function GET(req, {params}) {
    const {id}=await params
const authResult=await authmiddleware(req)
const questions=prisma.claimAnswer .findMany({
    where:{
        claimId:id
    },
    select:{
        id:true, question:true
    }
})
  return NextResponse.json({
    questions
  },  {status:200})
}