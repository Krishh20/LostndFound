import { NextResponse } from "next/server";
import { authmiddleware } from "../../middleware/authmiddleware.js";
import { prisma } from "../../db/db.js";



export async function GET(req, {params}) {
    const {id}=await params
const authResult=await authmiddleware(req)
  const match= await prisma.match.findFirst({
    where:{
         id:Number(id),
        lostItem:{
            uploadedById: authResult.id,
        }
    }
  })
  return NextResponse.json({
    match
  },  {status:200})
}