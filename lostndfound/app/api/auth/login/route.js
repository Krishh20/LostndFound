import Jwt  from "jsonwebtoken";
import {loginSchema} from "../../../validators/authvalidator.js"
import {prisma} from "../../../db/db.js"
import { NextResponse } from "next/server";
const SECRET = process.env.JWT_SECRET;
export async function POST(req) {
    const body= await req.json()
    const {name,email,password}=body;
    const result=loginSchema.safeParse(body);
    if(!result.success){
        return NextResponse.json(  { message:"User not found"},
        {status:404})
    }
   const user= await prisma.user.findUnique({
   where: { email: result.data.email }
   })
   if(!user){
    return NextResponse.json({
        message:"Validation error"
    }, {status:400})
   }
   //json check, return response
   const ismatch=await bcrypt.compare(password,user.password)
   if(!ismatch){
    return NextResponse.json({
       message:"Invalid password"
    },{status:401})
   }
   const token=Jwt.sign({id:user.id}, SECRET)
    return NextResponse.json({
        message:"Login successful"
    }, {status:200})
}