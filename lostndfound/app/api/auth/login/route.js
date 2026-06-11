import Jwt  from "jsonwebtoken";
import {loginSchema} from "../../../validators/authvalidator.js"
import {prisma} from "../../../db/db.js"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
const SECRET = process.env.JWT_SECRET;
export async function POST(req) {
    const body= await req.json()

    const result=loginSchema.safeParse(body);
    if(!result.success){
        return NextResponse.json(  { message:"validation error"},
        {status:400})
    }
   const user= await prisma.user.findUnique({
   where: { email: result.data.email }
   })
   if(!user){
    return NextResponse.json({
        message:"user not found"
    }, {status:404})
   }
   //json check, return response
   const ismatch=await bcrypt.compare(result.data.password,user.password)
   if(!ismatch){
    return NextResponse.json({
       message:"Invalid password"
    },{status:401})
   }
   const token=Jwt.sign({id:user.id}, SECRET)
    return NextResponse.json({
        message:token
    }, {status:200})
}
