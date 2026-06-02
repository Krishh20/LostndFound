//get user, in this route in a middleware for auth, after getting userid, get item of him
import { prisma } from "@/app/db/db";
import { NextResponse } from "next/server";
export async function get(req) {
const authResult = await authMiddleware(req);
 const {searchParam}=new url(req.url)
 const type=searchParam.type
 const items=prisma.item.findMany({
    where:{
       type: type?{type}:{}
    }
 })
 return NextResponse.json({
    message:items
 },{status:200})
}