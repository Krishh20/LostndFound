import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import {prisma} from "../../../db/db.js"
import {userSchemaValidator} from "../../../validators/authvalidator.js"


export async function POST(req) {
    const body= await req.json()
    const result=userSchemaValidator.safeParse(body)
    if(!result.success){
        return NextResponse.json({
          message:"Validation error"},
        {status:400})
    }
    const {name,email,password}=result.data
    const existingUser=await prisma.user.findUnique({
        where:{email},
    })
    if(existingUser){
        return NextResponse.json({
            message:"User already exists"
        }, {status:409})
    }
    const hashedPassword= await bcrypt.hash(password,10)

    const user= await prisma.user.create({
        data:{
            name,
        email,
        password:hashedPassword,
        }
    })
    return NextResponse.json({
        message:"user created"
    },{status:201})
}
