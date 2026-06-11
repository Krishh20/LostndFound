


import { NextResponse } from "next/server";
import { authmiddleware } from "../../../middleware/authmiddleware.js";
import { prisma } from "../../../db/db.js";

export async function GET(req,{params}) {
  const auth = await authmiddleware(req);
 const {id}=await params
  const notifications = await prisma.notification.findFirst({
    where: {
        id:Number(id),
        userId: auth.id
    }
  });

  return NextResponse.json({
    notifications,
  });
}

export async function PATCH(req,{params}) {
  const auth = await authmiddleware(req);
 const {id}=await params
  const notifications = await prisma.notification.update({
    where: {
        id:Number(id),
        userId: auth.id
    },
    data:{
        isRead:true
    }
  });

  return NextResponse.json({
    notifications,
  });
}