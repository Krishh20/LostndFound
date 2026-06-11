import { NextResponse } from "next/server"
import Jwt  from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
// get token, verify, if verified then return auth failed, or get user id and return
export async function authmiddleware(req) {
const token=req.headers.get('authorization')
if(!token){
return NextResponse.json({
    message:"Unauthorised"
}, {status:401})
}
const decoded=Jwt.verify(token, SECRET)
if(!decoded.id){
  return NextResponse.json({
    message:"Invalid Token"
  }, {status:401})
}
return {
  id:decoded.id
}
}