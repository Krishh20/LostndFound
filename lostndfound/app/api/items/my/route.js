//get user, in this route in a middleware for auth, after getting userid, get item of him
import { prisma } from "../../../db/db";
import { NextResponse } from "next/server";
import { authmiddleware } from "../../../middleware/authmiddleware";
import { file } from "zod";
export async function GET(req) {
const authResult = await authmiddleware(req);
 const {searchParams}=new URL(req.url)
 const type=searchParams.get("type")
 const filter = {
    uploadedById: authResult.id
  };
  if (type) {
    filter.type = type;
  }
 const items=await prisma.item.findMany({
    where: filter
 })
 return NextResponse.json({
    message:items
 },{status:200})
}