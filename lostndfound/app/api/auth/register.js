import { NextResponse } from "next/server";

export async function POST(req) {
    const {username, email, password}= await req.json()
    
}