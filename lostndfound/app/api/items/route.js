import { NextResponse } from "next/server";
import createItemSchema from "../../"
import { authmiddleware } from "@/app/middleware/authmiddleware";
import { prisma } from "@/app/db/db";
export async function POST(req) {
const authResult = await authMiddleware(req);
const body = await req.json();
// check schema using zod, create, return response
const result=createItemSchema.safeParse(body);
if(!result.success){
return NextResponse.json({
    message:"validation error"
}, {status:400})
}
const {}=body
const item= await prisma.item.create({
    data:{
         type,
  title,
  description,
  category,
  imageUrl,
  location
    }
})
return NextResponse.json({
    message:"item created successfully"
}, {status:201})
}

export async function GET(req) {
// get from db, based on type then check
const {searchParam}= new url(req.url);
const type=searchParam.type
  const items=await prisma.item.findMany({
    where:  type?{type}:{}
  })
  return NextResponse.json({
     message:items
  }, {status:200})
}